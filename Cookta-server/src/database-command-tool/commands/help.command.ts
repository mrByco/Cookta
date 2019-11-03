import {ICommand} from "./command.interface";
import {CommandExecutor} from "../command-executor";

export class Help implements ICommand {
    public static readonly CommandName = "help";

    public async Execute(args: string[]): Promise<boolean> {
        console.info('Cookta backup creator commands:');
        CommandExecutor.Commands.forEach((c) => {
            for (let line of c.GetUsage()) {
                console.info(line);
            }
        });
        return true;
    }

    GetCommandName(): string {
        return Help.CommandName;
    }

    GetUsage(): string[] {
        return [
            "- help",
        ];
    }

}
