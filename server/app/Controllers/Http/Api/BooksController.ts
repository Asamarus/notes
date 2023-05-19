import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Response from 'App/Logic/Core/Response';
import DataSource from 'App/Logic/Core/DataSource';
import DB from '@ioc:Adonis/Lucid/Database';
import Notes from 'App/Logic/Main/Notes';
import isEmpty from 'App/Helpers/isEmpty';

export default class BooksController {
  public async search(ctx: HttpContextContract) {
    const validSections = await Notes.getValidSections();

    //validation
    const validationScheme = schema.create({
      section: schema.enum.optional(validSections),
    });
    const validate = await Response.validate(ctx.request.all(), validationScheme);
    if (validate) return Response.error(validate);

    const input = ctx.request.all();

    const query = DB.connection('main').from('books as b');
    const section = input.section;

    //columns
    const columns = {
      'b.id': 'id',
      'b.name': 'name',
    };

    query.count('n.id as number');

    query.leftJoin('notes as n', function () {
      this.on('n.book', '=', 'b.name');
    });

    query.groupByRaw('b.name, b.id');

    if (!isEmpty(section)) {
      query.where('n.section', section);
      query.where('b.section', section);
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
      query.where('b.id', '=', value);
    };

    filters['date_from'] = (query, value) => {
      query.where('n.created_at', '>=', value + ' 00:00:00');
    };

    filters['date_to'] = (query, value) => {
      query.where('n.created_at', '<=', value + ' 23:59:59');
    };

    const options = {
      results_per_page: 'all',
      order: {
        'b.name': 'asc',
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

          //validation
          const validationScheme = schema.create({
            section: schema.enum.optional(validSections),
          });
          const validate = await Response.validate(request.all(), validationScheme);
          if (validate) return Response.error(validate);

          const term = `%${request.input('term')}%`;
          const section = request.input('section');

          const query = DB.connection('main').from('books as b');

          if (!isEmpty(section)) {
            query.where('b.section', section);
          }

          query.select('b.id as id', 'b.name as value', 'b.name as label');

          query.where('b.name', 'like', term);

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
