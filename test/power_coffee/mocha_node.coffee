assert = require 'power-assert'

describe 'Array#indexOf()', ->  
    beforeEach ->
        this.ary = [1,2,3]

    it 'should return -1 when the value is not present', ->  
        minusOne = -1
        two = 2
        assert.ok this.ary.indexOf(two) is minusOne, 'THIS IS AN ASSERTION MESSAGE'

    it 'should return index when the value is present', ->  
        minusOne = -1
        zero = 0
        assert this.ary.indexOf(zero) isnt minusOne
