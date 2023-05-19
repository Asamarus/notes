import { DateTime } from 'luxon';
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm';

import CommonModelHooks from 'App/Logic/Core/CommonModelHooks';

export default class NoteTag extends BaseModel {
  public static connection = 'main';
  public static table = 'notes_tags';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public syncId: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public noteId: string;

  @column()
  public tagId: string;

  @beforeCreate()
  public static async beforeCreateHook(model) {
    CommonModelHooks.addSyncId(model);
  }
}
