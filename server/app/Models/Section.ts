import { DateTime } from 'luxon';
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm';

import CommonModelHooks from 'App/Logic/Core/CommonModelHooks';

export default class Section extends BaseModel {
  public static connection = 'main';
  public static table = 'sections';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public syncId: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public name: string;

  @column()
  public displayName: string;

  @column()
  public color: string;

  @column()
  public position: number;

  @beforeCreate()
  public static async beforeCreateHook(model) {
    CommonModelHooks.addSyncId(model);
  }
}
