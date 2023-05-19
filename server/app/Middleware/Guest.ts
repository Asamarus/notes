import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class Guest {
  /**
   * Handle request
   */
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user) {
      return response.status(404).send('Only for guests!');
    }

    // call next to advance the request
    await next();
  }
}
