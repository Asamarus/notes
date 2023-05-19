import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import Response from 'App/Logic/Core/Response';

export default class MiscActionsController {
  public async actions(ctx: HttpContextContract) {
    const actions = {
      set_color_scheme: {
        rules: schema.create({
          color_scheme: schema.enum(['light', 'dark']),
        }),
        action: async (request) => {
          ctx.response.cookie(
            'color_scheme',
            request.input('color_scheme', {
              maxAge: 10 * 365 * 24 * 60 * 60,
            })
          );

          return Response.success({
            msg: 'Color scheme saved!',
          });
        },
      },
      ping: {
        rules: schema.create({}),
        action: async () => {
          return Response.success({
            msg: 'Pong!',
          });
        },
      },
    };

    return await Response.parse(ctx.request, actions);
  }
}
