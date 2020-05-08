export class ReadlineHelper {


    public static async Question(question: string, password?: boolean): Promise<string> {

        let readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log(readline.stdoutMuted)
        readline.stdoutMuted = password;
        readline.writeToOutput = function _writeToOutput(stringToWrite) {
            if (password) {
                readline.output.write("*");
            } else {
                readline.output.write(stringToWrite);
            }
        };

        return await new Promise((resolve) => {
            readline.question(question, (answer) => {
                resolve(answer);
                readline.close();
            })
        })
    }
}
