var expect = require('chai').expect;

describe('Chai example', function () {
    it('item has an id', function () {
        var item = {
            id: 20
        };
        expect(item).to.have.property('id').that.is.a('string');
    });
});
