const azure = require('azure-storage');
const path = require('path');

let blobService = null;
const blobConnectionString = "DefaultEndpointsProtocol=https;AccountName=kuktaimages;AccountKey=rSH0ihAd90+qMKyeg0FXb1wNzWNtdzjv2Ly3HeA8TViLMhYfLBJuh3ixkvdl+zDkfP9CrvZC8r73oCUgu7rJOQ==;EndpointSuffix=core.windows.net";

function StartBlobService(){
    blobService = azure.createBlobService(blobConnectionString);
    return blobService;
}
function GetBlobService(){
    if (blobService == null){
        StartBlobService();
    }
    return blobService;
}

const listContainers = async () => {
    return new Promise((resolve, reject) => {
        GetBlobService().listContainersSegmented(null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `${data.entries.length} containers`, containers: data.entries });
            }
        });
    });
};
const createContainer = async (containerName) => {
    return new Promise((resolve, reject) => {
        GetBlobService().createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' created` });
            }
        });
    });
};
const uploadLocalJPEGImage = async (containerName, filePath, BlobName) => {
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(filePath);
        const blobName = BlobName + '.jpg';
        var options = {contentSettings:{contentType:'image/jpeg'}}
        GetBlobService().createBlockBlobFromLocalFile(containerName, blobName, fullPath, options, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Local file "${filePath}" is uploaded` });
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
                resolve({ message: `Block blob '${blobName}' deleted` });
            }
        });
    });
};


module.exports ={
    GetBlobService,
    listContainers,
    createContainer,
    uploadLocalJPEGImage,
    deleteBlob,
}
