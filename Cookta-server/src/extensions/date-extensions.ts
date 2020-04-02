interface Date {
    ToYYYYMMDDString(): string;
    Today(): Date;
}

Date.prototype.ToYYYYMMDDString = function (){
    return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(this.getDate())}`;
};

Date.prototype.Today = function (){
    let today = new Date(Date.now());
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
