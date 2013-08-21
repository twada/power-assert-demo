var assert = require('assert');

suite('Array#indexOf', function(){
    test('値がある場合はその index を返す', function() {
        var ary = [1,2,3],
            zero = 0,
            two = 2;
        assert(ary.indexOf(zero) === two);
    });
});
