var expect = require('expect.js');

describe('Array#indexOf', function(){
    it('値がある場合はその index を返す', function() {
        var ary = [1,2,3];
        expect(ary.indexOf('hoge')).to.be(2);
    });
});
