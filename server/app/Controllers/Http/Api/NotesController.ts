import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Response from 'App/Logic/Core/Response';
import DataSource from 'App/Logic/Core/DataSource';
import DB from '@ioc:Adonis/Lucid/Database';
import Notes from 'App/Logic/Main/Notes';
import Tags from 'App/Logic/Core/Tags';
import Common from 'App/Logic/Core/Common';
import Note from 'App/Models/Note';
import SearchHelper from 'App/Logic/Core/SearchHelper';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import get from 'lodash/get';
import toInteger from 'lodash/toInteger';
import isEmpty from 'App/Helpers/isEmpty';
import { DateTime } from 'luxon';

export default class NotesController {
  public async search(ctx: HttpContextContract) {
    const validSections = await Notes.getValidSections();

    //validation
    const validationScheme = schema.create({
      section: schema.enum.optional(validSections),
      search: schema.string.optional([rules.minLength(2)]),
    });
    const validate = await Response.validate(ctx.request.all(), validationScheme);
    if (validate) return Response.error(validate);

    const input = ctx.request.all();

    let query = DB.connection('main').from('notes as r');

    const columns = {
      'r.id': 'id',
      'r.created_at': 'created_at',
      'r.updated_at': 'updated_at',
      'r.sync_id': 'sync_id',
      'r.section': 'section',
      'r.title': 'title',
      'r.book': 'book',
      'r.tags': 'tags',
      'r.extra': 'extra',
      'r.preview': 'preview',
      'r.content': 'content',
      'r.search_index': 'search_index',
      'r.sources': 'sources',
    };

    if (!isEmpty(input.section)) {
      query.where('r.section', input.section);
    }

    /* ========================================================================*
     *
     *                     Formatters
     *
     * ========================================================================*/

    const formatters = {};

    formatters['tags'] = (value) => {
      return Tags.extract(value);
    };

    formatters['extra'] = (value) => {
      return Common.parseJSON(value);
    };

    formatters['sources'] = (value) => {
      return Common.parseJSON(value);
    };

    /* ========================================================================*
     *
     *                     Filters
     *
     * ========================================================================*/

    const filters = {};

    filters['book'] = (query, value) => {
      query.where('r.book', '=', value);
    };

    filters['tags'] = (query, tags) => {
      query.where((query) => {
        forEach(tags, (tag) => {
          query.where('r.tags', 'like', `%[${tag}]%`);
        });
      });
    };

    filters['date_from'] = (query, value) => {
      query.where('r.created_at', '>=', value + ' 00:00:00');
    };

    filters['date_to'] = (query, value) => {
      query.where('r.created_at', '<=', value + ' 23:59:59');
    };

    filters['without_book'] = (query) => {
      query.where((query) => {
        query.where('r.book', '=', '');
        query.orWhereNull('r.book');
      });
    };

    filters['without_tags'] = (query) => {
      query.where((query) => {
        query.where('r.tags', '=', '');
        query.orWhereNull('r.tags');
      });
    };

    filters['with_tags'] = (query) => {
      query.where('r.tags', '!=', '');
    };

    const params = DataSource.parseRequest(ctx.request);
    DataSource.filters(params, query, columns, filters, {});

    const options = {
      results_per_page: 30,
      search: {
        disabled: true,
      },
      filters: {
        disabled: true,
      },
    };

    const resultsPerPage = DataSource.getResultsPerPage(params, options);
    const page = DataSource.getPage(params);
    const limit = DataSource.getLimit(page, resultsPerPage);

    const searchResults = {};
    const searchTerm = ctx.request.input('search');

    const queryHolder = {
      query: query,
    };

    if (!isEmpty(searchTerm)) {
      const tmp = await SearchHelper.generateSearchQuery(
        query,
        ['r.title_search_index', 'r.search_index'],
        searchTerm,
        limit,
        resultsPerPage,
        {
          table: 'fts_search_index',
          ftsIdKey: 'note_id',
          tableIdKey: 'r.id',
        }
      );

      queryHolder['query'] = tmp['query'];
      searchResults['searchTerm'] = searchTerm;
      searchResults['keywords'] = tmp['keywords'];
      searchResults['foundWholePhrase'] = tmp['foundWholePhrase'];
    }

    formatters['preview'] = (value, row) => {
      if (!isEmpty(searchTerm)) {
        const content = SearchHelper.getSearchIndex(row.content);

        const tmp = SearchHelper.getSearchSnippet(
          searchResults['keywords'],
          content,
          10,
          searchResults['foundWholePhrase'],
          searchTerm
        );

        if (!isEmpty(tmp)) {
          value = tmp;
        }

        return value;
      } else {
        return value;
      }
    };

    query = queryHolder['query'];

    const result = await DataSource.get(params, query, columns, filters, formatters, options);

    return Response.success({ ...result, ...searchResults });
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

          const result: {
            notes: any[];
            books: any[];
            tags: any[];
          } = {
            notes: [],
            books: [],
            tags: [],
          };

          const notesQuery = DB.connection('main').from('notes as n');
          const booksQuery = DB.connection('main').from('books as b');
          const tagsQuery = DB.connection('main').from('tags as t');

          if (!isEmpty(section)) {
            notesQuery.where('n.section', '=', section);
          }

          notesQuery.select('n.id as id', 'n.title as label');
          notesQuery.where('n.title_search_index', 'like', term);

          const notesResult = await notesQuery.limit(10);

          result['notes'] = map(notesResult, (n) => {
            return {
              id: n.id,
              label: n.label,
              type: 'notes',
            };
          });

          if (!isEmpty(section)) {
            booksQuery.where('b.section', '=', section);
          }

          booksQuery.select('b.id as id', 'b.name as label');
          booksQuery.where('b.name', 'like', term);

          const booksResult = await booksQuery.limit(10);

          result['books'] = map(booksResult, (b) => {
            return {
              id: b.id,
              label: b.label,
              type: 'books',
            };
          });

          if (!isEmpty(section)) {
            tagsQuery.where('t.section', '=', section);
          }

          tagsQuery.select('t.id as id', 't.name as label');
          tagsQuery.where('t.name', 'like', term);

          const tagsResult = await tagsQuery.limit(10);

          result['tags'] = map(tagsResult, (t) => {
            return {
              id: t.id,
              label: t.label,
              type: 'tags',
            };
          });

          return Response.success(result);
        },
      },
      get: {
        rules: schema.create({
          id: schema.number(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          return Response.success({
            note: note,
          });
        },
      },
      create: {
        rules: schema.create({
          book: schema.string.optional(),
        }),
        action: async (request) => {
          const validSections = await Notes.getValidSections();

          //validation
          const validationScheme = schema.create({
            section: schema.enum(validSections),
          });
          const validate = await Response.validate(request.all(), validationScheme);
          if (validate) return Response.error(validate);

          const section = request.input('section');
          const book = request.input('book');

          const note = new Note();

          note.section = section;

          await note.save();

          if (!isEmpty(book)) {
            await Notes.updateBook(book, note);
          }

          return Response.success({
            msg: 'Note is created!',
            note: await Note.find(note.id),
          });
        },
      },
      update: {
        rules: schema.create({
          id: schema.number(),
          title: schema.string.optional(),
          content: schema.string.optional(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          note.title = request.input('title');
          note.content = Buffer.from(request.input('content'), 'base64').toString('utf8');

          await note.save();

          return Response.success({
            msg: 'Note is updated!',
            note: await Note.find(note.id),
          });
        },
      },
      update_book: {
        rules: schema.create({
          id: schema.number(),
          book: schema.string.optional(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          await Notes.updateBook(request.input('book'), note);

          return Response.success({
            msg: 'Book is updated!',
            note: await Note.find(note.id),
          });
        },
      },
      update_tags: {
        rules: schema.create({
          id: schema.number(),
          tags: schema.string.optional(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          await Notes.updateTags(request.input('tags'), note);

          return Response.success({
            msg: 'Tags are updated!',
            note: await Note.find(note.id),
          });
        },
      },
      change_section: {
        rules: schema.create({
          id: schema.number(),
        }),
        action: async (request) => {
          const validSections = await Notes.getValidSections();

          //validation
          const validationScheme = schema.create({
            section: schema.enum(validSections),
          });
          const validate = await Response.validate(request.all(), validationScheme);
          if (validate) return Response.error(validate);

          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          const section = request.input('section');

          if (note.section === section) {
            return Response.error('Note is already in given section!');
          }

          const book = note.book;
          const tags = note.tags;

          await Notes.updateBook('', note);
          await Notes.updateTags('', note);

          note.section = section;
          await note.save();

          await Notes.updateBook(book, note);
          await Notes.updateTags(tags, note);

          return Response.success({
            msg: 'Note is moved to another section!',
          });
        },
      },
      delete: {
        rules: schema.create({
          id: schema.number(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          await Notes.updateBook('', note);
          await Notes.updateTags('', note);

          await note.delete();

          return Response.success({
            msg: 'Note is deleted!',
          });
        },
      },
      get_calendar_days: {
        rules: schema.create({
          month: schema.number([rules.unsigned(), rules.range(1, 12)]),
          year: schema.number(),
        }),
        action: async (request) => {
          const validSections = await Notes.getValidSections();

          //validation
          const validationScheme = schema.create({
            section: schema.enum.optional(validSections),
            search: schema.string.optional([rules.minLength(2)]),
          });
          const validate = await Response.validate(request.all(), validationScheme);
          if (validate) return Response.error(validate);

          const input = request.all();
          const section = input.section;

          const query = DB.connection('main').from('notes as n');

          let month = input.month;

          if (toInteger(get(input, 'month')) < 10) {
            month = '0' + month;
          }

          const year = toInteger(get(input, 'year'));

          //permanent filters
          if (!isEmpty(section)) {
            query.where('n.section', section);
          }

          const daysInMonth = DateTime.fromObject({ year, month }).daysInMonth;

          const starDate = `${year}-${month}-01 00:00:00`;
          const endDate = `${year}-${month}-${daysInMonth} 23:59:59`;

          query.where('n.created_at', '>=', starDate);
          query.where('n.created_at', '<=', endDate);

          query.groupBy('date');

          const result = await query.select(
            DB.raw('count(n.id) as number, date(n.created_at) as date')
          );

          return Response.success({
            dates: map(result, (r) => ({
              number: r.number,
              date: r.date,
              day: Number(DateTime.fromSQL(r.date).toFormat('d')),
            })),
          });
        },
      },
    };

    return await Response.parse(ctx.request, actions);
  }
}
