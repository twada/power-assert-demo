var assert = require('assert');

suite('Array#indexOf()', function () {
    setup(function () {
        this.ary = [1,2,3];
    });
    test('should return index when the value is present', function () {
        var who = 'ariya', two = 2;
        assert(this.ary.indexOf(who) === two);
    });
    test('should return -1 when the value is not present', function () {
        var minusOne = -1, two = 2;
        assert.ok(this.ary.indexOf(two) === minusOne, 'THIS IS AN ASSERTION MESSAGE');
    });
});
