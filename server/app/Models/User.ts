import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import { column, beforeSave, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import CommonModelHooks from 'App/Logic/Core/CommonModelHooks';

export default class User extends BaseModel {
  public static connection = 'main';
  public static table = 'users';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public syncId: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async addSyncId(user: User) {
    CommonModelHooks.addSyncId(user);
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
