import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Response from 'App/Logic/Core/Response';
import DataSource from 'App/Logic/Core/DataSource';
import DB from '@ioc:Adonis/Lucid/Database';
import Notes from 'App/Logic/Main/Notes';
import isEmpty from 'App/Helpers/isEmpty';

export default class TagsController {
  public async search(ctx: HttpContextContract) {
    const validSections = await Notes.getValidSections();

    //validation
    const validationScheme = schema.create({
      section: schema.enum.optional(validSections),
    });
    const validate = await Response.validate(ctx.request.all(), validationScheme);
    if (validate) return Response.error(validate);

    const input = ctx.request.all();

    const query = DB.connection('main').from('tags as t');
    const section = input.section;

    //columns
    const columns = {
      't.id': 'id',
      't.name': 'name',
    };

    query.count('n_t.id as number');

    query.leftJoin('notes_tags as n_t', 'n_t.tag_id', 't.sync_id');

    query.groupByRaw('t.name, t.id');

    if (!isEmpty(section)) {
      query.where('t.section', section);
    }

    /* ========================================================================*
     *
     *                     Formatters
     *
     * ========================================================================*/

    const formatters = {};

    /* ========================================================================*
     *
     *                     Filters
     *
     * ========================================================================*/

    const filters = {};

    filters['id'] = (query, value) => {
      query.where('t.id', '=', value);
    };

    const options = {
      results_per_page: 'all',
      order: {
        't.name': 'asc',
      },
    };

    const params = DataSource.parseRequest(ctx.request);
    const result = await DataSource.get(params, query, columns, filters, formatters, options);

    return Response.success(result);
  }

  public async actions(ctx: HttpContextContract) {
    const actions = {
      autocomplete: {
        rules: schema.create({
          term: schema.string([rules.minLength(2)]),
        }),
        action: async (request) => {
          const validSections = await Notes.getValidSections();

          const validationScheme = schema.create({
            section: schema.enum.optional(validSections),
          });
          const validate = await Response.validate(request.all(), validationScheme);
          if (validate) return Response.error(validate);

          const term = `%${request.input('term')}%`;
          const section = request.input('section');

          const query = DB.connection('main').from('tags as t');

          if (!isEmpty(section)) {
            query.where('t.section', section);
          }

          query.select('t.id as id', 't.name as value', 't.name as label');

          query.where('t.name', 'like', term);

          const data = await query.limit(10);

          const result = {
            options: data,
          };

          return Response.success(result);
        },
      },
    };

    return await Response.parse(ctx.request, actions);
  }
}
