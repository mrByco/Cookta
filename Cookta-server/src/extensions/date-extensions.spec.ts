import './date-extensions';
import {expect} from 'chai';

describe('Date to string', function () {
    it('Date to yyyy-mm-dd string', function () {
        let date = new Date(2001, 4, 2);
        const result = date.ToYYYYMMDDString();
        expect(result).to.eql('2001-05-02');
    });
    it('Date to yyyy-mm-dd_hh-mm string', function () {
        let date = new Date(2001, 4, 2, 12, 53);
        const result = date.ToYYYYMMDDhhmmString();
        expect(result).to.eql('2001-05-02_12-53');
    });
    it('Date to yyyy-mm-dd_hh-mm string', function () {
        let date = new Date(2001, 4, 2, 12, 62);
        const result = date.ToYYYYMMDDhhmmString();
        expect(result).to.eql('2001-05-02_13-02');
    });
});
