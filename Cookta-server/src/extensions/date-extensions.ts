interface Date {
    ToYYYYMMDDString(): string;
    ToYYYYMMDDhhmmString(): string;
    Today(): Date;
}

Date.prototype.ToYYYYMMDDString = function (){
    return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(this.getDate())}`;
};
Date.prototype.ToYYYYMMDDhhmmString = function (){
    return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(this.getDate())}_${pad(this.getHours())}-${pad(this.getMinutes())}`;
};

Date.prototype.Today = function (){
    let today = new Date(Date.now());
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
