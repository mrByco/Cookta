import {BlobClient, BlobServiceClient, BlockBlobParallelUploadOptions} from "@azure/storage-blob";

const path = require('path');


export class BlobHelper {

    public static BlobClient: BlobServiceClient = null;



    public static async GetBlobService(){
        console.log('Starting bloob');
        if (this.BlobClient == null){
            BlobHelper.BlobClient = await this.StartBlobService();
        }
        return this.BlobClient;
    }

    private static async StartBlobService(){
        console.log(process.env.IMAGES_CONNECT);
        return new BlobServiceClient(process.env.IMAGES_CONNECT);
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

