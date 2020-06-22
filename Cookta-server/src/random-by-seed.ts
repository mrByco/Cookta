export class RNG {

    // LCG using GCC's constants
    public readonly m = 0x80000000; // 2**31;
    public readonly a = 1103515245;
    public readonly c = 12345;

    public state: number;


    constructor(seed: number) {
        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }

    NextInt() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    NextFloat() {
        // returns in range [0,1]
        return this.NextInt() / (this.m - 1);
    }

    NextRange(start: number, end: number) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        var rangeSize = end - start;
        var randomUnder1 = this.NextInt() / this.m;
        return start + Math.floor(randomUnder1 * rangeSize);
    }

    Choice(array: any[]) {
        return array[this.NextRange(0, array.length)];
    }

}
