import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

//import Note from 'App/Models/Note';

//import { schema, rules } from '@ioc:Adonis/Core/Validator';

//import Response from 'App/Logic/Core/Response';

//import DB from '@ioc:Adonis/Lucid/Database';

export default class DevController {
  public async test(ctx: HttpContextContract) {
    const payload = { some: 'data' };

    payload['result'] = '';

    return ctx.view.render('dev', { payload });
  }
}
