import {expect} from 'chai';
import './string-extensions';

describe('String to date', function () {
    it('Parse yyyy-mm-dd to Date', function () {
       let dateString = '2001-04-2';
       const result = dateString.YYYYMMDDToDate();
       expect(result).to.eql(new Date(2001, 3, 2));
    });

    it('string to title case', function () {
        let string = "with chicken";
        const result = string.ToBeginUpperCase();
        expect(result).to.eql("With chicken");
    });
});
