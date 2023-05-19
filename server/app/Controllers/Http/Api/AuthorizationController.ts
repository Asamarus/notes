import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Response from 'App/Logic/Core/Response';
import has from 'lodash/has';
import toInteger from 'lodash/toInteger';
import isEmpty from 'App/Helpers/isEmpty';

export default class AuthorizationController {
  public async loginWithEmail(ctx: HttpContextContract) {
    //validation
    const validationScheme = schema.create({
      email: schema.string([rules.email()]),
      password: schema.string([rules.minLength(6)]),
    });
    const validate = await Response.validate(ctx.request.all(), validationScheme);
    if (validate) return Response.error(validate);

    const input = ctx.request.all();
    const { auth, session } = ctx;
    const { email, password } = input;
    const rememberMe = has(input, 'remember_me') && toInteger(input.remember_me) ? true : false;

    try {
      await auth.use('web').attempt(email, password, rememberMe);
    } catch (error) {
      return Response.error('Incorrect login/password!');
    }

    const intendedUrl = session.pull('intended_url');

    const redirect = !isEmpty(intendedUrl) ? intendedUrl : '/';

    return Response.success({
      redirect: redirect,
      msg: 'Logged in! Redirecting...',
    });
  }
}
