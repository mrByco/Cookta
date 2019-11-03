import {ICommand} from "./commands/command.interface";
import {Help} from "./commands/help.command";
import {Backup} from "./commands/backup.command";

export class CommandExecutor {
    public static readonly Commands: ICommand[] = [
        new Help(),
        new Backup(),
    ];

    public static async ExecuteCommand(CommandString: string, args: string[] = []): Promise<boolean> {
        for (let command of this.Commands) {
            if (command.GetCommandName().toLowerCase() === CommandString.toLowerCase())
                return await command.Execute(args);
        }
        return false;
    }
}
