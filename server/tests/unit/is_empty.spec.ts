import { test } from '@japa/runner';
import isEmpty from 'App/Helpers/isEmpty';

test('isEmpty: truth test', ({ assert }) => {
  const result = isEmpty('');
  assert.isTrue(result);
});

test('isEmpty: false test', ({ assert }) => {
  const result = isEmpty('not empty');
  assert.isFalse(result);
});
