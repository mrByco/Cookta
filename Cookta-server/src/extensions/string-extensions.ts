interface String {
    YYYYMMDDToDate(): Date;

    hashCode(): number;
    ToBeginUpperCase(): string;
}

String.prototype.YYYYMMDDToDate = function() {
    let Year = +this.split('-')[0];
    let Month = +this.split('-')[1];
    let Day = +this.split('-')[2];
    return new Date(Year, Month - 1, Day);
};

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


String.prototype.ToBeginUpperCase = function() {
    let string = this as string;
    if (string.length == 0) return;
    return string.slice(0, 1).toLocaleUpperCase() + string.slice(1).toLocaleLowerCase();
};

