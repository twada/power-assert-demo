var assert = require('power-assert');

suite('Array#indexOf', function() {
    test('値がある場合はその index を返す', function() {
        var ary = [1,2,3], two = 2;
        assert(ary.indexOf('hoge') === two);
    });
});
