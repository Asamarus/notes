import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Response from 'App/Logic/Core/Response';
import Note from 'App/Models/Note';
import Section from 'App/Models/Section';
import Common from 'App/Logic/Core/Common';
import DB from '@ioc:Adonis/Lucid/Database';

const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export default class SectionsController {
  public async actions(ctx: HttpContextContract) {
    const actions = {
      get: {
        rules: schema.create({}),
        action: async () => {
          const items = await DB.connection('main').from('sections').orderBy('position', 'asc');

          return Response.success({
            items: items,
          });
        },
      },
      create: {
        rules: schema.create({
          name: schema.string(),
          display_name: schema.string(),
          color: schema.string({}, [rules.regex(colorRegex)]),
        }),
        action: async (request) => {
          const check = await Section.query()
            .where({ name: request.input('name') })
            .first();

          if (check) {
            return Response.error('Section with this name already exists!');
          }

          const input = request.all();

          const section = new Section();
          section.name = input.name;
          section.displayName = input.display_name;
          section.color = input.color;

          let position = 0;
          const tmp = await Section.query().orderBy('position', 'desc').first();

          if (tmp) {
            position = tmp.position;
            position++;
          }

          section.position = position;

          await section.save();

          const sections = await Section.query().orderBy('position', 'asc');
          return Response.success({
            msg: 'Section is created!',
            item: await Section.find(section.id),
            sections: sections,
          });
        },
      },
      update: {
        rules: schema.create({
          id: schema.number(),
          name: schema.string(),
          display_name: schema.string(),
          color: schema.string({}, [rules.regex(colorRegex)]),
        }),
        action: async (request) => {
          const section = await Section.find(request.input('id'));

          if (!section) {
            return Response.error(`Section with id ${request.input('id')} doesn't exist!`);
          }

          const check = await Section.query()
            .where({ name: request.input('name') })
            .whereNot({ sync_id: section.syncId })
            .first();

          if (check) {
            return Response.error('Section with this name already exists!');
          }

          const input = request.all();

          section.name = input.name;
          section.displayName = input.display_name;
          section.color = input.color;
          await section.save();

          const sections = await Section.query().orderBy('position', 'asc');
          return Response.success({
            msg: 'Section is updated!',
            item: await Section.find(section.id),
            sections: sections,
          });
        },
      },
      delete: {
        rules: schema.create({
          id: schema.number(),
        }),
        action: async (request) => {
          const section = await Section.find(request.input('id'));

          if (!section) {
            return Response.error(`Section with id ${request.input('id')} doesn't exist!`);
          }

          const check = await Note.query().where({ section: section.name }).first();

          if (check) {
            return Response.error({
              msg: 'Section has notes!',
            });
          }

          const items = await Section.query().where('position', '>', section.position);

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.position = item.position - 1;
            await item.save();
          }

          await section.delete();

          const sections = await Section.query().orderBy('position', 'asc');

          return Response.success({
            msg: 'Section is deleted!',
            sections: sections,
          });
        },
      },
      reorder: {
        rules: schema.create({
          ids: schema.string(),
        }),
        action: async (request) => {
          await Common.reorder(request.input('ids'), Section);

          const sections = await Section.query().orderBy('position', 'asc');

          return Response.success({
            msg: 'New order is saved!',
            sections: sections,
          });
        },
      },
    };

    return await Response.parse(ctx.request, actions);
  }
}
