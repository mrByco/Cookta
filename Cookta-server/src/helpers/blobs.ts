import * as azurestorage from 'azure-storage';
import {BlobService, createBlobService} from 'azure-storage';
import ListContainerResult = azurestorage.services.blob.blobservice.BlobService.ListContainerResult;
import ListBlobsResult = azurestorage.services.blob.blobservice.BlobService.ListBlobsResult;

const path = require('path');

let blobService: BlobService = null;

function StartBlobService() {
    const blobConnectionString = process.env.IMAGES_CONNECT;
    blobService = createBlobService(blobConnectionString);

    return blobService;
}

export function GetBlobService(): BlobService {
    if (blobService == null) {
        StartBlobService();
    }
    return blobService;
}

const createContainer = async (containerName) => {
    return new Promise((resolve, reject) => {
        GetBlobService().createContainerIfNotExists(containerName, {publicAccessLevel: 'blob'}, err => {
            if (err) {
                reject(err);
            } else {
                resolve({message: `Container '${containerName}' created`});
            }
        });
    });
};

const deleteBlob = async (containerName, blobName) => {
    return new Promise((resolve, reject) => {
        GetBlobService().deleteBlobIfExists(containerName, blobName, err => {
            if (err) {
                reject(err);
            } else {
                resolve({message: `Block blob '${blobName}' deleted`});
            }
        });
    });
};

export const listContainers = async () => {
    return new Promise<ListContainerResult>((resolve, reject) => {
        GetBlobService().listContainersSegmented(null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

export async function uploadLocalFile(containerName, filePath, BlobName) {
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(filePath);
        const blobName = BlobName;
        var options = {};
        GetBlobService().createBlockBlobFromLocalFile(containerName, blobName, fullPath, options, err => {
            if (err) {
                reject(err);
            } else {
                resolve({message: `Local file "${filePath}" is uploaded`});
            }
        });
    });
};

export async function getBlobsInContainer(containerName: string): Promise<ListBlobsResult> {
    return new Promise<ListBlobsResult>((resolve) => {
        GetBlobService().listBlobsSegmented(containerName, null, (error, data) => {
            if (data) {
                resolve(data);
            } else {
                throw error;
            }
        });
    });
}

//Returns the uploaded blob name
export async function setStringBlob(containerName: string, blobName: string, content: string): Promise<string> {
    return new Promise<string>(resolve => {
        GetBlobService().createBlockBlobFromText(containerName, blobName, content, (err, res) => {
            if (err) {
                console.error(err);
                resolve(null);
            } else {
                resolve(res?.name);
            }
        });
    });
}

export async function getBlobToStirng(containerName: string, blob: string): Promise<string> {
    return new Promise<string>((resolve => {
        GetBlobService().getBlobToText(containerName, blob, (e, r) => {
            resolve(r);
        });
    }));
}


export const uploadLocalJPEGImage = async (containerName, filePath, BlobName) => {
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(filePath);
        const blobName = BlobName + '.jpg';
        var options = {contentSettings: {contentType: 'image/jpeg'}};
        GetBlobService().createBlockBlobFromLocalFile(containerName, blobName, fullPath, options, err => {
            if (err) {
                reject(err);
            } else {
                resolve({message: `Local file "${filePath}" is uploaded`});
            }
        });
    });
};
