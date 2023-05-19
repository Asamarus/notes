import { test } from '@japa/runner';
import Tags from 'App/Logic/Core/Tags';

test('Tags compress', ({ assert }) => {
  assert.equal(Tags.compress(['tag1', 'tag2', 'tag3']), '[tag1],[tag2],[tag3]');
});

test('Tags extract', ({ assert }) => {
  assert.deepEqual(Tags.extract('[tag1],[tag2],[tag3]'), ['tag1', 'tag2', 'tag3']);
});
