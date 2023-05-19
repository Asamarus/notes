import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

import CommonModelHooks from 'App/Logic/Core/CommonModelHooks';

export default class Book extends BaseModel {
  public static connection = 'main';
  public static table = 'books';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public syncId: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public section: string;

  @column()
  public name: string;

  @beforeCreate()
  public static async beforeCreateHook(model) {
    CommonModelHooks.addSyncId(model);
  }
}
