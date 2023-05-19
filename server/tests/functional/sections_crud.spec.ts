import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { test } from '@japa/runner';
import size from 'lodash/size';
import get from 'lodash/get';

test.group('Sections CRUD', (group) => {
  group.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('Creating a new section', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/sections/actions').withCsrfToken().loginAs(user).json({
      action: 'create',
      name: 'section_1',
      display_name: 'Section 1',
      color: '#000000',
    });

    //console.log(response.body());
    assert.equal(get(response.body(), 'response.msg'), 'Section is created!');
    assert.equal(get(response.body(), 'response.item.name'), 'section_1');
  });

  test('Updating section', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/sections/actions').withCsrfToken().loginAs(user).json({
      action: 'update',
      id: 1,
      name: 'section_1',
      display_name: 'Section 2',
      color: '#000000',
    });

    //console.log(response.body());
    assert.equal(get(response.body(), 'response.msg'), 'Section is updated!');
    assert.equal(get(response.body(), 'response.item.display_name'), 'Section 2');
  });

  test('Get sections', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/sections/actions').withCsrfToken().loginAs(user).json({
      action: 'get',
    });

    //console.log(response.body());
    assert.equal(size(get(response.body(), 'response.items')), 1);
  });

  test('Deleting section', async ({ client, assert }) => {
    const user = await User.find(1);
    if (!user) throw new Error('User not found');

    const response = await client.post('/api/sections/actions').withCsrfToken().loginAs(user).json({
      action: 'delete',
      id: 1,
    });

    //console.log(response.body());
    assert.equal(get(response.body(), 'response.msg'), 'Section is deleted!');
  });
});
