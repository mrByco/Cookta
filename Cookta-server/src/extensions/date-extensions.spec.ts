import './date-extensions';
import {expect} from 'chai';

describe('Date to string', function () {
    it('Date to yyyy-mm-dd string', function () {
        let date = new Date(2001, 4, 2);
        const result = date.ToYYYYMMDDString();
        expect(result).to.eql('2001-05-02');
    });
});
