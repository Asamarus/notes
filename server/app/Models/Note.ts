import { DateTime } from 'luxon';
import { BaseModel, column, beforeCreate, beforeSave, afterFind } from '@ioc:Adonis/Lucid/Orm';

import CommonModelHooks from 'App/Logic/Core/CommonModelHooks';

export default class Note extends BaseModel {
  public static connection = 'main';
  public static table = 'notes';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public syncId: string;

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.toFormat('yyyy-LL-dd HH:mm:ss') : value;
    },
  })
  public createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.toFormat('yyyy-LL-dd HH:mm:ss') : value;
    },
  })
  public updatedAt: DateTime;

  @column()
  public title: string;

  @column()
  public titleSearchIndex: string;

  @column()
  public section: string;

  @column()
  public content: string;

  @column()
  public preview: string;

  @column()
  public searchIndex: string;

  @column()
  public book: string;

  @column()
  public tags: any;

  @column()
  public extra: string;

  @column()
  public sources: any;

  @beforeCreate()
  public static async beforeCreateHook(model) {
    CommonModelHooks.addSyncId(model);
  }

  @beforeSave()
  public static async beforeSaveHook(model) {
    CommonModelHooks.updateTitleSearchIndex(model, {
      title: 'title',
      title_search_index: 'titleSearchIndex',
    });

    CommonModelHooks.updateSearchIndex(model, {
      content: 'content',
      search_index: 'searchIndex',
    });

    CommonModelHooks.updatePreview(model, {
      content: 'content',
      preview: 'preview',
    });

    CommonModelHooks.saveFieldsAsJSON(['extra', 'sources'], model);
    CommonModelHooks.saveFieldsAsTags(['tags'], model);
  }

  @afterFind()
  public static async afterFindHook(model) {
    CommonModelHooks.getFieldsAsJSON(['extra', 'sources'], model);
    CommonModelHooks.getFieldsAsTags(['tags'], model);
  }
}
