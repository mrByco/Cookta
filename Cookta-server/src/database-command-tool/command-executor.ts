import {ICommand} from "./commands/command.interface";
import {Help} from "./commands/help.command";
import {Backup} from "./commands/backup.command";
import {CleanSubs} from "./commands/cleanSubs.command";
import {RestoreByFile} from "./commands/restore-by-file.command";

export class CommandExecutor {
    public static readonly Commands: ICommand[] = [
        new Help(),
        new Backup(),
        new CleanSubs(),
        new RestoreByFile()
    ];

    public static async ExecuteCommand(CommandString: string, args: string[] = []): Promise<boolean> {
        for (let command of this.Commands) {
            if (command.GetCommandName().toLowerCase() === CommandString.toLowerCase())
                return await command.Execute(args);
        }
        return false;
    }
}
