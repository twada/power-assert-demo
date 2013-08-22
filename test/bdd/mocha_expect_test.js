var expect = require('expect.js');

describe('Array#indexOf()', function () {
    beforeEach(function () {
        this.ary = [1,2,3];
    });
    it('should return index when the value is present', function () {
        var who = 'ariya', two = 2;
        expect(this.ary.indexOf(who)).to.be(two);
    });
    it('more spec-ish notation', function () {
        var who = 'ariya', two = 2;
        expect(this.ary).to.contain(who);
    });
});
