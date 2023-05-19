import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { test } from '@japa/runner';
import get from 'lodash/get';

test.group('Notes CRUD', (group) => {
  group.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('Creating a new note', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    await client.post('/api/sections/actions').withCsrfToken().loginAs(user).json({
      action: 'create',
      name: 'section_1',
      display_name: 'Section 1',
      color: '#000000',
    });

    await client.post('/api/sections/actions').withCsrfToken().loginAs(user).json({
      action: 'create',
      name: 'section_2',
      display_name: 'Section 2',
      color: '#000000',
    });

    const response = await client.post('/api/notes/actions').withCsrfToken().loginAs(user).json({
      action: 'create',
      section: 'section_1',
    });

    assert.equal(get(response.body(), 'response.msg'), 'Note is created!');
    assert.equal(get(response.body(), 'response.note.section'), 'section_1');
  });

  test('Updating note', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/notes/actions').withCsrfToken().loginAs(user).json({
      action: 'update',
      id: 1,
      title: 'New note title',
      content: 'New note content',
    });

    assert.equal(get(response.body(), 'response.msg'), 'Note is updated!');
    assert.equal(get(response.body(), 'response.note.title'), 'New note title');
  });

  test('Get note', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/notes/actions').withCsrfToken().loginAs(user).json({
      action: 'get',
      id: 1,
    });

    assert.equal(get(response.body(), 'response.note.title'), 'New note title');
  });

  test("Change note's section", async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    let response = await client.post('/api/notes/actions').withCsrfToken().loginAs(user).json({
      action: 'change_section',
      id: 1,
      section: 'section_2',
    });

    assert.equal(get(response.body(), 'response.msg'), 'Note is moved to another section!');

    response = await client.post('/api/notes/actions').withCsrfToken().loginAs(user).json({
      action: 'get',
      id: 1,
    });

    assert.equal(get(response.body(), 'response.note.section'), 'section_2');
  });

  test("Update note's book", async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/notes/actions').withCsrfToken().loginAs(user).json({
      action: 'update_book',
      id: 1,
      book: 'New book',
    });

    assert.equal(get(response.body(), 'response.msg'), 'Book is updated!');
    assert.equal(get(response.body(), 'response.note.book'), 'New book');
  });

  test("Update note's tags", async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/notes/actions').withCsrfToken().loginAs(user).json({
      action: 'update_tags',
      id: 1,
      tags: 'tag 1, tag 2',
    });

    assert.equal(get(response.body(), 'response.msg'), 'Tags are updated!');
    assert.equal(get(response.body(), 'response.note.tags.0'), 'tag 1');
    assert.equal(get(response.body(), 'response.note.tags.1'), 'tag 2');
  });

  test('Adding source to a note', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/sources/actions').withCsrfToken().loginAs(user).json({
      action: 'create',
      id: 1,
      link: 'https://www.apple.com/',
    });

    assert.equal(get(response.body(), 'response.msg'), 'Source is added!');
    assert.equal(get(response.body(), 'response.item.title'), 'Apple');
  });

  test('Deleting note', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/notes/actions').withCsrfToken().loginAs(user).json({
      action: 'delete',
      id: 1,
    });

    assert.equal(get(response.body(), 'response.msg'), 'Note is deleted!');
  });
});
