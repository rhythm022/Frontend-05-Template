var assert = require('assert');

// var add = require('../main').add
// var mul = require('../main').mul
import {add,mul} from '../main';

describe('add function testing',function(){
  it('1 + 2 should be 3', function() {
    assert.equal(add(1,2), 3);
  });

  it('- 1 + 2 should be 3', function() {
    assert.equal(add(-1,2), 1);
  });

  // it('- 1 * 2 should be -2', function() {
  //   assert.equal(mul(-1,2), -2);
  // });
})

