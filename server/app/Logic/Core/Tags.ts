import sortBy from 'lodash/sortBy';
import trim from 'lodash/trim';
import replace from 'lodash/replace';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import find from 'lodash/find';
import lowerCase from 'lodash/lowerCase';
import difference from 'lodash/difference';
import get from 'lodash/get';

import isEmpty from 'App/Helpers/isEmpty';

export default class Tags {
  /**
   * Structurize tags
   *
   * [tag1],[tag2],[tag3]
   * @param array tags
   * @return string with tags
   */
  public static compress(tags: string[]): string {
    const result: string[] = [];
    tags = sortBy(tags, (t) => t);

    for (const tag of tags) {
      result.push(`[${trim(tag)}]`);
    }

    return result.join(',');
  }

  /**
   * Extracts tags from string
   *
   * [tag1],[tag2],[tag3]
   * @param string tags
   * @return array of tags
   */
  public static extract(tags: string): string[] {
    let result: string[] = [];

    if (isEmpty(tags)) {
      return result;
    }

    for (let tag of tags.split(',')) {
      tag = replace(tag, /\[|\]/g, '');
      if (!isEmpty(tag)) {
        result.push(tag);
      }
    }

    return result;
  }

  /**
   * Update tags for given entry
   *
   * Sample usage
   * tags = 'cat,party,pov'
   * note - current note
   * Tag - tags table model
   * NoteTags - notes_tags table model
   * c - column names
   * c = {
      'notes_tags.tag_id': 'tag_id',
      'notes_tags.note_id': 'note_id',
      'tags.name': 'name',
      'notes.tags': 'tags',
     }
   * section - optional section name
   * Tags.updateTags({tags, note, Tag, NotTag, c, section})
   *
   * @param object params
   * @return void
   */
  public static async update({ tags, note, Tag, NoteTag, c, section, deleteUnused = true }) {
    if (isArray(tags)) {
      tags = tags.join(',');
    }

    tags = trim(tags);

    if (isEmpty(tags)) {
      //check if entry has tags
      const noteTags = await NoteTag.query().where(c['notes_tags.note_id'], note['syncId']);
      for (let i = 0; i < noteTags.length; i++) {
        const noteTag = noteTags[i];
        await noteTag.delete();

        //Check if this tag is used for other entries and delete it's name if it's not used
        if (deleteUnused) {
          const check = await NoteTag.query()
            .where(c['notes_tags.tag_id'], noteTag[c['notes_tags.tag_id']])
            .count('*', 'total');
          if (get(check, '0.$extras.total') === 0) {
            const tag = await Tag.query().where('syncId', noteTag[c['notes_tags.tag_id']]).first();
            if (!isEmpty(tag)) {
              await tag.delete();
            }
          }
        }
      }

      note[c['notes.tags']] = [];
      await note.save();
    } else {
      const tagsString = tags;
      tags = tagsString.split(',');

      if (tags[0] === '') {
        return;
      }

      tags = map(tags, (t) => trim(t));
      tags = uniq(tags);
      tags = filter(tags, (t) => !isEmpty(t));

      //Getting an array of existing tags names
      let existingTagsNames = [];

      if (!isEmpty(section)) {
        existingTagsNames = await Tag.query().where('section', section);
      } else {
        existingTagsNames = await Tag.query();
      }
      existingTagsNames = map(existingTagsNames, c['tags.name']);

      //Replace case sensitive tags
      //if input is pov but db has tag Pov, pov from input will be replaced with Pov from db
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const match = find(existingTagsNames, (e) => lowerCase(e) === lowerCase(tag));

        if (!isEmpty(match)) {
          tags[i] = match;
        }
      }

      if (!isEmpty(existingTagsNames)) {
        //Finding names that do not exist in db
        const newTags = difference(tags, existingTagsNames);
        //Adding them to db
        for (let i = 0; i < newTags.length; i++) {
          const newTag = newTags[i];

          if (!isEmpty(section)) {
            await Tag.create({ [c['tags.name']]: newTag, section: section });
          } else {
            await Tag.create({ [c['tags.name']]: newTag });
          }
        }
      }
      //if there are no existing tags simply add new tags
      else {
        for (let i = 0; i < tags.length; i++) {
          const tag = tags[i];

          if (!isEmpty(section)) {
            await Tag.create({ [c['tags.name']]: tag, section: section });
          } else {
            await Tag.create({ [c['tags.name']]: tag });
          }
        }
      }

      //Getting an array of tag's ids that user has entered into form
      let updatedTagsIds = [];
      if (!isEmpty(section)) {
        updatedTagsIds = await Tag.query().whereIn(c['tags.name'], tags).where('section', section);
      } else {
        updatedTagsIds = await Tag.query().whereIn(c['tags.name'], tags);
      }

      updatedTagsIds = map(updatedTagsIds, 'syncId');

      let currentNoteTagsIds = await NoteTag.query().where(c['notes_tags.note_id'], note['syncId']);
      currentNoteTagsIds = map(currentNoteTagsIds, c['notes_tags.tag_id']);

      //If entry hasn't any tag ids simply adding new ones
      if (isEmpty(currentNoteTagsIds)) {
        //Adding these tags
        for (let i = 0; i < updatedTagsIds.length; i++) {
          const updatedTagId = updatedTagsIds[i];
          await NoteTag.create({
            [c['notes_tags.note_id']]: note['syncId'],
            [c['notes_tags.tag_id']]: updatedTagId,
          });
        }
      }
      //Going further
      else {
        //Getting tag's ids that has to be deleted
        const tagsForDeletion = difference(currentNoteTagsIds, updatedTagsIds);

        //Deleting these tag_ids from content_tags
        for (let i = 0; i < tagsForDeletion.length; i++) {
          const tagForDeletion = tagsForDeletion[i];
          const item = await NoteTag.query()
            .where({
              [c['notes_tags.tag_id']]: tagForDeletion,
              [c['notes_tags.note_id']]: note['syncId'],
            })
            .first();
          if (!isEmpty(item)) {
            await item.delete();
          }

          //Check if this tag is used for other entries and delete it's name if it's not used
          if (deleteUnused) {
            const check = await NoteTag.query()
              .where(c['notes_tags.tag_id'], tagForDeletion)
              .count('*', 'total');
            if (get(check, '0.$extras.total') === 0) {
              const tag = await Tag.query().where('syncId', tagForDeletion).first();

              if (!isEmpty(tag)) {
                await tag.delete();
              }
            }
          }
        }

        //Getting an array of tag's ids of current entry
        currentNoteTagsIds = await NoteTag.query().where(c['notes_tags.note_id'], note['syncId']);
        currentNoteTagsIds = map(currentNoteTagsIds, c['notes_tags.tag_id']);

        //Getting tag's ids that has to be added
        const tagsForAddition = difference(updatedTagsIds, currentNoteTagsIds);
        for (let i = 0; i < tagsForAddition.length; i++) {
          const tagForAddition = tagsForAddition[i];
          await NoteTag.create({
            [c['notes_tags.note_id']]: note['syncId'],
            [c['notes_tags.tag_id']]: tagForAddition,
          });
        }
      }

      //Updating tags in content table
      note[c['notes.tags']] = tags;
      await note.save();
    }
  }
}
