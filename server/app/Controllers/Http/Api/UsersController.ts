import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Response from 'App/Logic/Core/Response';

export default class UsersController {
  public async actions(ctx: HttpContextContract) {
    const actions = {
      update_password: {
        rules: schema.create({
          current_password: schema.string([rules.minLength(6)]),
          new_password: schema.string([rules.minLength(6)]),
          new_password_confirmation: schema.string([rules.minLength(6)]),
        }),
        action: async () => {
          const { auth } = ctx;
          const { user } = auth;
          const input = ctx.request.all();

          if (!user) {
            return Response.error({
              msg: 'User not found!',
            });
          }

          try {
            await auth.use('web').verifyCredentials(user.email, input.current_password);
          } catch (error) {
            return Response.error({
              msg: 'Current password is incorrect!',
            });
          }

          if (input.new_password !== input.new_password_confirmation) {
            return Response.error({
              msg: 'Passwords must be equal!',
            });
          }

          user.password = input.new_password;
          await user.save();

          return Response.success({
            msg: 'Password is updated!',
          });
        },
      },
    };

    return await Response.parse(ctx.request, actions);
  }
}
