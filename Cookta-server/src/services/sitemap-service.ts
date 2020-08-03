import {Express} from "express";
import {Services} from "../Services";

const express = require('express')
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')

export class SitemapService {
    private sitemap: any;
    constructor(expressApp: Express) {
        expressApp.get('/sitemap.xml', (req, res) => {
            res.header('Content-Type', 'application/xml');
            res.header('Content-Encoding', 'gzip');
            // if we have a cached entry send it
            if (this.sitemap) {
                res.send(this.sitemap)
                return
            }

            try {
                const smStream = new SitemapStream({ hostname: 'https://cookta.me' })
                const pipeline = smStream.pipe(createGzip())

                // pipe your entries or directly write them.
                let foodIds = Services.FoodService.GetAllPublicFoods().map(f => f.foodId);
                for (let id of foodIds){
                    smStream.write({ url: `/foods/${id}/`})
                }

                // cache the response
                streamToPromise(pipeline).then(sm => this.sitemap = sm)
                // make sure to attach a write stream such as streamToPromise before ending
                smStream.end()
                // stream write the response
                pipeline.pipe(res).on('error', (e) => {throw e})
            } catch (e) {
                console.error(e)
                res.status(500).end()
            }
        })
    }
}
