interface String {
    YYYYMMDDToDate(): Date;

    hashCode(): number;
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

