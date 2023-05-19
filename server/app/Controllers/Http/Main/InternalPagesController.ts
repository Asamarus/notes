import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Section from 'App/Models/Section';

export default class InternalPagesController {
  public async main(ctx: HttpContextContract) {
    const colorScheme = ctx.request.cookie('color_scheme', 'light');

    const sections = await Section.query().orderBy('position', 'asc');

    const state = {
      Sections: sections,
    };

    return ctx.view.render('main', { store: state, colorScheme });
  }
}
