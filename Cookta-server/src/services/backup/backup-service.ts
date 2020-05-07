export class BackupService {
    public static readonly blobContainerName = 'database-backup';

    constructor(private token: string) {
    };

    async start(cron: any, mongoConnect: string): Promise<void> {
        //cron.schedule('00 02 * * *');

        console.log('Creating \\ backup!')
        let shell = require('shelljs');
        let path = require('path');
        let appDir = path.resolve('exe');
        console.log(appDir);
        //
        //let appDir = path.r(require.main.filename);
        console.log(appDir)
        shell.exec(`exe\\mongodump.exe --uri=${mongoConnect} --archive=D:\\home\\data\\2020-05-07.dump`);
    }
}
