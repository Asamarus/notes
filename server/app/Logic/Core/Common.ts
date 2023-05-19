import trim from 'lodash/trim';
import isEmpty from 'App/Helpers/isEmpty';
import map from 'lodash/map';
import toInteger from 'lodash/toInteger';
import get from 'lodash/get';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default class Common {
  /**
   * Reorder rows
   *
   * @param {string} ids - ids to reorder
   * @param {object} model - table model
   * @param {string} field - field name
   * @return void
   */
  public static async reorder(ids, Model, field = 'position') {
    ids = ids.split(',');
    ids = map(ids, (id) => toInteger(id));

    let item = await Model.query().whereIn('id', ids).min(field).first();

    const startPosition = get(item, 'position', 0);

    for (let i = 0; i < ids.length; i++) {
      const newPosition = startPosition + i;
      const id = ids[i];

      const item = await Model.query().where('id', id).first();

      if (!isEmpty(item)) {
        item[field] = newPosition;
        await item.save();
      }
    }
  }

  /**
   * Update book for given entry
   *
   * Sampe usage
   * book = 'History'
   * note - current note
   * Book - books table model
   * Note - notes table model
   * c - column names
   * c = {
      'notes.book': 'book',
      'books.name': 'name',
     }
   * section - optional section name
   * Tags.updateTags({tags, note, Tag, NotTag, c, section})
   *
   * @param {object} params - params
   * @return void
   */
  public static async updateBook({ book, note, Book, Note, c, section }) {
    book = trim(book);
    const oldBook = note[c['notes.book']];

    if (note[c['notes.book']] === book) {
      return; //no chages
    }

    if (isEmpty(book)) {
      note[c['notes.book']] = '';
      await note.save();
    } else {
      //check if new category exists
      let newBook;

      if (!isEmpty(section)) {
        newBook = await Book.query()
          .where(c['books.name'], 'like', book)
          .where('section', section)
          .first();
      } else {
        newBook = await Book.query().where(c['books.name'], 'like', book).first();
      }

      if (isEmpty(newBook)) {
        newBook = new Book();
        newBook[c['books.name']] = book;

        if (!isEmpty(section)) {
          newBook.section = section;
        }

        await newBook.save();
        note[c['notes.book']] = book;
        await note.save();
      } else {
        //this simple trick prevents from adding books with different cases : Math,math,mAth
        note[c['notes.book']] = newBook[c['books.name']];
        await note.save();
      }
    }

    if (!isEmpty(oldBook)) {
      //check if oldBook is used and delete if it is not used
      let check;

      if (!isEmpty(section)) {
        check = await Note.query()
          .where({ [c['notes.book']]: oldBook, section: section })
          .count('*', 'total');
      } else {
        check = await Note.query()
          .where({ [c['notes.book']]: oldBook })
          .count('*', 'total');
      }

      if (get(check, '0.$extras.total') === 0) {
        let item;

        if (!isEmpty(section)) {
          item = await Book.query()
            .where({ [c['books.name']]: oldBook, section: section })
            .first();
        } else {
          item = await Book.query()
            .where({ [c['books.name']]: oldBook })
            .first();
        }

        if (!isEmpty(item)) {
          await item.delete();
        }
      }
    }
  }

  /**
   * Parse JSON
   *
   * @param {string} data - JSON encoded data
   * @return object
   */
  public static parseJSON(data) {
    let parsed = {};

    try {
      parsed = JSON.parse(data);
    } catch (e) {
      //ignore incorrect JSON
    }

    return parsed;
  }

  /**
   * Get url info: title, description, image;
   *
   * @param {string} url - url
   * @return object or null
   */
  public static async getUrlInfo(url) {
    try {
      const response = await axios.get(url);
      let title;
      let description;
      let image;

      try {
        const $ = cheerio.load(response.data);
        title = $('title').text();

        if (isEmpty(title)) {
          title = $('meta[property="og:title"]').attr('content');
        }

        description = $('meta[name="description"]').attr('content');

        if (isEmpty(description)) {
          description = $('meta[property="og:description"]').attr('content');
        }

        if (isEmpty(title)) {
          title = '';
        }

        if (isEmpty(description)) {
          description = '';
        }

        image = $('meta[property="og:image"]').attr('content');

        if (isEmpty(image)) {
          image = null;
        }
      } catch (e) {
        //
        title = '';
        description = '';
        image = null;
      }

      return {
        title: title,
        description: description,
        image: image,
      };
    } catch (e) {
      return null;
    }
  }
}
