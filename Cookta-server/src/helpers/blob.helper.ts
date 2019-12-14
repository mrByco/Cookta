import {BlobClient, BlobServiceClient, BlockBlobParallelUploadOptions} from "@azure/storage-blob";

const path = require('path');

const blobConnectionString = "DefaultEndpointsProtocol=https;AccountName=kuktaimages;AccountKey=rSH0ihAd90+qMKyeg0FXb1wNzWNtdzjv2Ly3HeA8TViLMhYfLBJuh3ixkvdl+zDkfP9CrvZC8r73oCUgu7rJOQ==;EndpointSuffix=core.windows.net";

export class BlobHelper {

    public static BlobClient: BlobServiceClient = null;



    public static async GetBlobService(){
        if (this.BlobClient == null){
            BlobHelper.BlobClient = await this.StartBlobService();
        }
        return this.BlobClient;
    }

    private static async StartBlobService(){
        return new BlobServiceClient(blobConnectionString);
    }

    public static async DeleteBlob(containerName: string, blobName: string){
        let service = await BlobHelper.GetBlobService();
        let container = await service.getContainerClient(containerName);
        return container.deleteBlob(blobName);
    }

    public static async GetContainers(){
        let service = await BlobHelper.GetBlobService();
        return  service.listContainers();
    }

    public static async UploadJPEGImage(containerName: string, filePath: string, BlobName: string) {
        let service = await BlobHelper.GetBlobService();
        let fullPath = path.resolve(filePath);
        let blobName = BlobName + '.jpg';


        let i = 0;
        for await (let container of service.listContainers()){
            console.log(`Container ${i++}: ${container.name}`);
        }

        let container = service.getContainerClient(containerName);

        let blockBlobClient = container.getBlockBlobClient(blobName);

        return;
    }
}

