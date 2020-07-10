import { Controller } from 'waxen/dist/deorators/controller';
import { Contracts } from 'cookta-shared/src/contracts/contracts';

@Controller(Contracts.Ping)
export class PingController {
    public async Ping(reqBody: void): Promise<void> {
    }
}
