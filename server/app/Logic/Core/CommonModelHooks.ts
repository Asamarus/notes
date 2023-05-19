import uniqid from 'uniqid';
import has from 'lodash/has';
import toInteger from 'lodash/toInteger';
import Tags from './Tags';
import SearchHelper from './SearchHelper';

export default class CommonModelHooks {
  /**
   * Add unique sync_id
   *
   * @param {object} instance - model instance
   * @return void
   */
  public static addSyncId(modelInstance: any) {
    modelInstance.syncId = uniqid();
  }

  /**
   * Save specific model fields as JSON
   *
   * @param {array} fields - fields
   * @param {object} instance - model instance
   * @return void
   */
  public static saveFieldsAsJSON(fields: string[], modelInstance: any) {
    for (const field of fields) {
      if (has(modelInstance.$dirty, field)) {
        try {
          modelInstance[field] = JSON.stringify(modelInstance[field]);
        } catch (e) {
          //ignore incorrect JSON
        }
      }
    }
  }

  /**
   * Get specific model fields as JSON
   *
   * @param {array} fields - fields
   * @param {object} instance - model instance
   * @return void
   */
  public static getFieldsAsJSON(fields: string[], modelInstance: any) {
    for (const field of fields) {
      let parsed = modelInstance[field];
      try {
        parsed = JSON.parse(modelInstance[field]);
      } catch (e) {
        //ignore incorrect JSON
      }

      modelInstance[field] = parsed;
      modelInstance.$original[field] = parsed;
    }
  }

  /**
   * Save specific model fields as boolean
   *
   * @param {array} fields - fields
   * @param {object} instance - model instance
   * @return void
   */
  public static saveFieldsAsBoolean(fields: string[], modelInstance: any) {
    for (const field of fields) {
      if (has(modelInstance.$dirty, field)) {
        modelInstance[field] = toInteger(modelInstance[field]);
      }
    }
  }

  /**
   * Get specific model fields as boolean
   *
   * @param {array} fields - fields
   * @param {object} instance - model instance
   * @return void
   */
  public static getFieldsAsBoolean(fields: string[], modelInstance: any) {
    for (const field of fields) {
      modelInstance[field] = !!toInteger(modelInstance[field]);
      modelInstance.$original[field] = !!toInteger(modelInstance[field]);
    }
  }

  /**
   * Save specific model fields as tags
   *
   * @param {array} fields - fields
   * @param {object} instance - model instance
   * @return void
   */
  public static saveFieldsAsTags(fields, instance) {
    for (const field of fields) {
      if (has(instance.$dirty, field)) {
        instance[field] = Tags.compress(instance[field]);
      }
    }
  }

  /**
   * Get specific model fields as boolean
   *
   * @param {string} param - param name
   * @return void
   */
  public static getFieldsAsTags(fields, instance) {
    for (const field of fields) {
      instance[field] = Tags.extract(instance[field]);
      instance.$original[field] = instance[field];
    }
  }

  /**
   * Update title search index
   *
   * @param {object} instance - model instance
   * @param {object} c - column names
   * @return void
   */
  public static updateTitleSearchIndex(instance, c) {
    if (has(instance.$dirty, c['title'])) {
      instance[c['title_search_index']] = SearchHelper.getSearchIndex(instance[c['title']], true);
    }
  }

  /**
   * Update search index
   *
   * @param {object} instance - model instance
   * @param {object} c - column names
   * @return void
   */
  public static updateSearchIndex(instance, c) {
    if (has(instance.$dirty, c['content'])) {
      instance[c['search_index']] = SearchHelper.getSearchIndex(instance[c['content']], true);
    }
  }

  /**
   * Update preview
   *
   * @param {object} instance - model instance
   * @param {object} c - column names
   * @return void
   */
  public static updatePreview(instance, c) {
    if (has(instance.$dirty, c['content'])) {
      instance[c['preview']] = SearchHelper.getSearchIndex(instance[c['content']], false, 100);
    }
  }
}
