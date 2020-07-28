import {EventEmitter} from "@angular/core";

export interface IStateChanger {
    target: string;
    useDelay: boolean;
}

export class PoolItemAnimationService {
    OnStateChange: EventEmitter<IStateChanger> = new EventEmitter<IStateChanger>();
    ChangeOnInit: IStateChanger = {target: 'void', useDelay: true};

    private readonly MaxUpdatePerS = 2;
    private inProgress: any;
    private nextUpdate: any;

    constructor() {
        this.OnStateChange.subscribe(s => {
            this.ChangeOnInit = s;
        });
        this.Open();
    }


    Hide() {
        this.DoUpdate(() => {
            this.OnStateChange.emit({target: 'void', useDelay: true});
        });
    }

    Open() {
        this.DoUpdate(() => {
            this.OnStateChange.emit({target: 'in', useDelay: true});
        });
    }

    async DoUpdate(operation: any) {
        this.nextUpdate = operation;
        this.Execute();
    }

    async Execute() {
        if (this.inProgress) return;
        this.inProgress = this.nextUpdate;
        this.nextUpdate = undefined;
        if (this.inProgress) {
            this.inProgress();
            this.inProgress = undefined;
        } else return;
        await new Promise(r => setTimeout(r, 1000 / this.MaxUpdatePerS));
        this.Execute();
        return;
    }

}
