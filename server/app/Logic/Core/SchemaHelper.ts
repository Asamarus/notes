import keys from 'lodash/keys';
import values from 'lodash/values';
import map from 'lodash/map';
import filter from 'lodash/filter';
import replace from 'lodash/replace';

export default class SchemaHelper {
  /**
   * Create fts table sql
   * 
   * example 
   * {
      ftsTable: 'fts_search_index',
      tableName: 'notes',
      ftsIdkey: 'note_id',
      tableIdKey: 'id',
      columns: {
        note_id: 'id',
        title: 'title_search_index',
        search_index: 'search_index',
      },
    },
   *
   * @param {string} ftsTableName - fts table name
   * @param {string} tableName - main table name   
   * @param {string} ftsIdkey - fts table id key
   * @param {string} tableIdKey - table id key
   * @param {object} columns - fts_columns:main_table_column
   * @param {object} db - database connection
   * @return object
   */
  public static async createFTSTableSql(
    ftsTableName,
    tableName,
    ftsIdkey,
    tableIdKey,
    columns,
    db
  ) {
    const ftsColumns = keys(columns);
    const tableColumns = values(columns);

    await db.rawQuery(`CREATE VIRTUAL TABLE ${ftsTableName} USING fts4 ( ${ftsColumns} )`);

    const insertFTSColumns = ftsColumns.join(', ');
    const insertTableColumns = map(tableColumns, (c) => `NEW.${c}`).join(', ');

    //insert trigger
    await db.rawQuery(`DROP TRIGGER IF EXISTS ${ftsTableName}_after_insert;`);
    await db.rawQuery(
      `CREATE TRIGGER ${ftsTableName}_after_insert AFTER INSERT on ${tableName}
        BEGIN
        INSERT INTO ${ftsTableName} (${insertFTSColumns}) VALUES (${insertTableColumns});
        END;
      `
    );

    let updateWhen: any = map(
      filter(tableColumns, (c) => c !== tableIdKey),
      (c) => `OLD.${c}<>NEW.${c}`
    );
    updateWhen = updateWhen.join(' OR ');

    let updateColumns: any = map(
      columns,
      (tableColumn, ftsColumn) => `${ftsColumn} = NEW.${tableColumn}`
    );
    updateColumns = updateColumns.join(', ');
    updateColumns = replace(updateColumns, `${ftsIdkey} = NEW.${tableIdKey}, `, '');

    //update trigger
    await db.rawQuery(`DROP TRIGGER IF EXISTS ${ftsTableName}_after_update;`);
    await db.rawQuery(
      `CREATE TRIGGER ${ftsTableName}_after_update AFTER UPDATE on ${tableName}
        WHEN ${updateWhen}
        BEGIN
        UPDATE ${ftsTableName} SET ${updateColumns} where ${ftsIdkey} = NEW.${tableIdKey};
        END;
      `
    );

    //delete trigger
    await db.rawQuery(`DROP TRIGGER IF EXISTS ${ftsTableName}_after_delete;`);
    await db.rawQuery(
      `CREATE TRIGGER IF NOT EXISTS ${ftsTableName}_after_delete AFTER DELETE on ${tableName}
        BEGIN
        DELETE FROM ${ftsTableName} WHERE ${ftsIdkey}=OLD.${tableIdKey};
        END;
      `
    );
  }
}
