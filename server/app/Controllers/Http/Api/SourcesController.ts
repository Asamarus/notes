import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Response from 'App/Logic/Core/Response';
import Note from 'App/Models/Note';
import uniqid from 'uniqid';
import isEmpty from 'App/Helpers/isEmpty';
import toArray from 'lodash/toArray';
import { klona } from 'klona';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import toInteger from 'lodash/toInteger';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import Common from 'App/Logic/Core/Common';

export default class SourcesController {
  public async actions(ctx: HttpContextContract) {
    const actions = {
      get: {
        rules: schema.create({
          id: schema.number(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          const sources = note.sources;

          return Response.success({
            items: !isEmpty(sources) ? sources : [],
          });
        },
      },
      create: {
        rules: schema.create({
          id: schema.number(),
          link: schema.string.optional([rules.url()]),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          const sources = toArray(klona(note.sources)) as any[];

          const link = request.input('link');

          const item = {
            id: uniqid(),
            link: link,
            title: '',
            description: '',
            image: null,
            showImage: false,
          };

          const urlInfo = await Common.getUrlInfo(link);
          item.title = get(urlInfo, 'title', '');
          item.description = get(urlInfo, 'description', '');
          item.image = get(urlInfo, 'image', null);

          if (!isEmpty(item.image)) {
            item.showImage = true;
          }

          sources.push(item);
          note.sources = sources;
          await note.save();

          return Response.success({
            msg: 'Source is added!',
            item: item,
            sources: sources,
          });
        },
      },
      update: {
        rules: schema.create({
          id: schema.number(),
          source_id: schema.string(),
          link: schema.string.optional([rules.url()]),
          title: schema.string.optional(),
          description: schema.string.optional(),
          showImage: schema.boolean(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          const sources = toArray(klona(note.sources)) as any[];

          const index = findIndex(sources, (s) => s.id === request.input('source_id'));

          if (index < 0) {
            return Response.error(
              `Source item with id ${request.input('source_id')} doesn't exist!`
            );
          }

          const item = sources[index];

          const input = request.all();

          item.link = input.link;
          item.title = input.title;
          item.description = input.description;
          item.showImage = !!toInteger(input.showImage);

          sources[index] = item;
          note.sources = sources;
          await note.save();

          return Response.success({
            msg: 'Source is updated!',
            item: item,
            sources: sources,
          });
        },
      },
      delete: {
        rules: schema.create({
          id: schema.number(),
          source_id: schema.string(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          const sources = toArray(klona(note.sources)) as any[];

          const index = findIndex(sources, (s) => s.id === request.input('source_id'));

          if (index < 0) {
            return Response.error(
              `Source item with id ${request.input('source_id')} doesn't exist!`
            );
          }

          sources.splice(index, 1);
          note.sources = sources;
          await note.save();

          return Response.success({
            msg: 'Source is deleted!',
            sources: sources,
          });
        },
      },
      reorder: {
        rules: schema.create({
          id: schema.number(),
          ids: schema.string(),
        }),
        action: async (request) => {
          const note = await Note.find(request.input('id'));
          if (!note) {
            return Response.error(`Note with id ${request.input('id')} doesn't exist!`);
          }

          const sources = [] as any[];

          forEach(request.input('ids').split(','), (id) => {
            const item = find(note.sources, (s) => s.id === id);

            if (!isEmpty(item)) {
              sources.push(item);
            }
          });

          note.sources = sources;
          await note.save();

          return Response.success({
            msg: 'New order is saved!',
            sources: sources,
          });
        },
      },
    };

    return await Response.parse(ctx.request, actions);
  }
}
