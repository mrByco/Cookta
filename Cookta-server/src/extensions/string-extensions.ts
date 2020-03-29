interface String {
    YYYYMMDDToDate(): Date;
}

String.prototype.YYYYMMDDToDate = function () {
    let Year = +this.split('-')[0];
    let Month = +this.split('-')[1];
    let Day = +this.split('-')[2];
    return new Date(Year, Month - 1, Day);
}

