import assert from 'node:assert/strict';
import test from 'node:test';
import {shifted,correlation} from '../web/model.mjs';
test('positive shifts delay Livingston with fractional interpolation',()=>{
  assert.equal(shifted([1,3,5,7],2,.5,-1),-4);
  assert.equal(shifted([1,3,5],0,1,1),null);
  assert.equal(correlation([1,3,2],[2,6,4]),1);assert.equal(correlation([1,1],[2,3]),null);
});
