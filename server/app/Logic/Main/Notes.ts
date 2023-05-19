import isEmpty from 'App/Helpers/isEmpty';
import Section from 'App/Models/Section';
import Common from '../Core/Common';
import map from 'lodash/map';
import Book from 'App/Models/Book';
import Note from 'App/Models/Note';
import Tags from '../Core/Tags';
import Tag from 'App/Models/Tag';
import NoteTag from 'App/Models/NoteTag';

export default class Notes {
  /**
   * Get valid sections
   *
   * @return array
   */
  public static async getValidSections() {
    const sections = await Section.query().orderBy('position', 'asc');
    if (isEmpty(sections)) {
      return [];
    }

    return map(sections, (s) => s.name);
  }

  /**
   * Update note's book
   *
   * @param {string} book - book to update
   * @param {object} note - note to update
   * @return void
   */
  public static async updateBook(book, note) {
    await Common.updateBook({
      book: book,
      note,
      Book,
      Note,
      c: {
        'notes.book': 'book',
        'books.name': 'name',
      },
      section: note.section,
    });
  }

  /**
   * Update note's tags
   *
   * @param {string} tags - tags to update
   * @param {object} note - note to update
   * @return void
   */
  public static async updateTags(tags, note) {
    await Tags.update({
      tags: tags,
      note,
      Tag,
      NoteTag,
      c: {
        'notes_tags.tag_id': 'tagId',
        'notes_tags.note_id': 'noteId',
        'tags.name': 'name',
        'notes.tags': 'tags',
      },
      section: note.section,
    });
  }
}
