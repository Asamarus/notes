import { test } from '@japa/runner';
import inArray from 'App/Helpers/inArray';

test('inArray: truth test', ({ assert }) => {
  const result = inArray(1, [0, 1]);
  assert.isTrue(result);
});

test('inArray: false test', ({ assert }) => {
  const result = inArray(1, [0, 2]);
  assert.isFalse(result);
});
