import {Express} from 'express';
import {Services} from '../Services';
import {Guid} from 'guid-typescript';
import {Collection} from 'mongodb';
import {getBlobToStirng, setStringBlob} from '../helpers/blobs';


import {SitemapStream, streamToPromise} from "sitemap";

const express = require('express');

const {createGzip} = require('zlib');

const fetch = require('node-fetch');


const SiteUrl = 'https://cookta.me';
const RenderUrl = 'https://rendertron-285418.nw.r.appspot.com/render';
const RenderedContainerName = 'rendered';

interface CachedUrl {
    blobFileName: string;
    renderTime: number;
    url: string;
}

const AllowedUrls: { pattern: RegExp, time: number }[] = [
    {pattern: new RegExp(/^\/foods\//, 'i'), time: 1000 * 60 * 60 * 24 * 5},
    {pattern: new RegExp(/^\/$/, 'i'), time: 1000 * 60 * 60 * 24 * 5}
];

export class BotService {
    public static Instance: BotService;
    private sitemap: any;
    private urls: CachedUrl[] = [];

    constructor(expressApp: Express, private mongoCollection: Collection) {
        this.Startup().then(() => {
            BotService.Instance = this;
            expressApp.get('/sitemap.xml', (req, res) => {
                res.header('Content-Type', 'application/xml');
                res.header('Content-Encoding', 'gzip');
                // if we have a cached entry send it
                if (this.sitemap) {
                    res.send(this.sitemap);
                    return;
                }

                try {
                    const smStream = new SitemapStream({hostname: SiteUrl});
                    const pipeline = smStream.pipe(createGzip());

                    // pipe your entries or directly write them.
                    let urls: string[] = this.GetSitemapLocalUrls();
                    for (let id of urls) {
                        smStream.write({url: id});
                    }

                    // cache the response
                    streamToPromise(pipeline).then(sm => this.sitemap = sm);
                    // make sure to attach a write stream such as streamToPromise before ending
                    smStream.end();
                    // stream write the response
                    pipeline.pipe(res).on('error', (e) => {
                        throw e;
                    });
                } catch (e) {
                    console.error(e);
                    res.status(500).end();
                }
            });
            expressApp.get('/prerendered', (req, res) => {
                let reqPath = '/';
                this.GetRenderedPage(reqPath).then(r => {
                    res.send(r);
                });
            });
            expressApp.get('/prerendered/*', (req, res) => {
                let reqPath = req.path.replace('/prerendered', '');

                if (!reqPath.endsWith('/')) {
                    reqPath = reqPath + '/';
                }

                let isAllowed = AllowedUrls.find(o => o.pattern.test(reqPath)) != undefined;
                if (!isAllowed) {
                    res.status(404).send();
                    return;
                }
                this.GetRenderedPage(reqPath).then(r => {
                    res.send(r);
                });
            });
        });
    }

    public async Startup() {
        this.urls = await this.mongoCollection.find().toArray();
    }

    public async RunCacheRefresh() {
        let rerenderUrls = this.GetSitemapLocalUrls().filter(u => this.UrlNeedRerender(u));

        let i = 1;
        for (let url of rerenderUrls) {
            await this.RerenderPage(url);
            console.log(`Rendering ${i} of ${rerenderUrls.length}`);
            i++;
        }
    }

    public UrlNeedRerender(url: string): boolean {
        let cached = this.urls.find(u => u.url == url);
        if (!cached) {
            return true;
        }
        let cacheTime = AllowedUrls.find(o => o.pattern.test(url))?.time;
        if (!cacheTime) {
            return false;
        }
        return cacheTime < Date.now() - cached.renderTime;
    }

    public async GetRenderedPage(url: string) {
        let cached = this.urls.find(u => u.url == url);


        let MaxCacheTime = AllowedUrls.find(o => o.pattern.test(url))?.time;
        if (cached) {
            if (MaxCacheTime < Date.now() - cached.renderTime) {
                setTimeout(() => this.RerenderPage(url), 500);
            }
            return getBlobToStirng(RenderedContainerName, cached.blobFileName);
        } else {
            return await this.RerenderPage(url);
        }

        return cached ?
            await getBlobToStirng(RenderedContainerName, cached.blobFileName) :
            await this.RerenderPage(url);
    }

    public async RerenderPage(url: string) {


        let cached: CachedUrl = this.urls.find(u => u.url == url);


        if (!cached) {
            cached = {
                blobFileName: Guid.create().toString(),
                renderTime: Date.now(),
                url: url,
            } as CachedUrl;
            this.urls.push(cached);
        }

        let res = await fetch(`${RenderUrl}/${SiteUrl}/${url}`);
        let data = await res.text();
        await setStringBlob(RenderedContainerName, cached.blobFileName, data);
        cached.renderTime = Date.now();
        await this.SaveCached(cached);
        return data;
    }

    private async SaveCached(docs: CachedUrl) {
        await this.mongoCollection.replaceOne({url: docs.url}, docs, {upsert: true});
    }

    private GetSitemapLocalUrls() {
        let foodIds = Services.FoodService.GetAllPublicFoods().map(f => f.foodId);
        return foodIds.map((id) => `/foods/${id}/`);
    }

}
