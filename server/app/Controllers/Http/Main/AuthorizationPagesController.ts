import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AuthorizationPagesController {
  public async login(ctx: HttpContextContract) {
    const colorScheme = ctx.request.cookie('color_scheme', 'light');
    return ctx.view.render('login', { colorScheme });
  }

  public async logout(ctx: HttpContextContract) {
    const { auth, response } = ctx;
    await auth.logout();

    return response.redirect('/');
  }
}
