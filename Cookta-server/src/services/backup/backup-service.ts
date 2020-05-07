export class BackupService {
    public static readonly blobContainerName = 'database-backup';

    constructor(private token: string) {
    };

    async start(cron: any): Promise<void> {
        //cron.schedule('00 02 * * *');

        console.log('Creating \\ backup!')
        let shell = require('shelljs');
        shell.exec('exe\\mongodump.exe');
    }
}
