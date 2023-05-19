import { BaseCommand } from '@adonisjs/core/build/standalone';

const config = {
  ftsTable: 'fts_search_index',
  tableName: 'notes',
  ftsIdkey: 'note_id',
  tableIdKey: 'id',
  columns: {
    note_id: 'id',
    title: 'title_search_index',
    search_index: 'search_index',
  },
};

export default class AddFts extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:fts';

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Adds SQLite FTS4 support';

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  };

  public async run() {
    const { default: DB } = await import('@ioc:Adonis/Lucid/Database');
    const { default: SchemaHelper } = await import('App/Logic/Core/SchemaHelper');

    const { ftsTable, tableName, ftsIdkey, tableIdKey, columns } = config;
    const db = DB.connection('main');
    await SchemaHelper.createFTSTableSql(ftsTable, tableName, ftsIdkey, tableIdKey, columns, db);
    this.logger.info('FTS4 added!');
  }
}
