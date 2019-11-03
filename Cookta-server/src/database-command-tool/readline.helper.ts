export class ReadlineHelper {

    public static readonly readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    public static async Question(question: string): Promise<string> {
        return await new Promise((resolve, reject) => {
            this.readline.question(question, (answer) => {
                resolve(answer);
            })
        })
    }
}
