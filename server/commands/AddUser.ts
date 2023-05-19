import { BaseCommand } from '@adonisjs/core/build/standalone';

export default class AddUser extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:user';

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Add new user';

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
    const { default: User } = await import('App/Models/User');
    const email = await this.prompt.ask('Enter email');
    const password = await this.prompt.secure('Enter password');

    const user = new User();
    user.email = email;
    user.password = password;
    await user.save();

    this.logger.info('User added!');
  }
}
