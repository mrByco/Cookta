export interface ICommand {
    GetUsage(): string[];

    GetCommandName(): string;

    Execute(args: string[]): Promise<boolean>;
}
