import trim from 'lodash/trim';
import filter from 'lodash/filter';
import striptags from 'striptags';
import { decode } from 'html-entities';
import escapeRegExp from 'lodash/escapeRegExp';
import isEmpty from 'App/Helpers/isEmpty';

export default class SearchHelper {
  /**
   * Generate search index
   *
   * @param {string} text - text for index
   * @param {boolean} lower - if true than lower index
   * @param {integer} limit - number of chars
   * @param {boolean} showDots - show dots is string was truncated
   * @return string
   */
  public static getSearchIndex(
    text: string,
    lower: boolean = false,
    limit: number = 0,
    showDots: boolean = true
  ) {
    text = trim(text);
    //trick to save spaces for words in separate html tags
    //example: <p>Hello</p><p>teacher</p> will be 'Hello teacher' and not 'Helloteacher' in search index

    text = text.replace(/</g, ' <');
    text = striptags(text);
    text = text.replace(/  +/g, ' ');

    text = decode(text);

    if (lower) {
      text = text.toLowerCase();
    }

    if (limit > 0) {
      const previous = text;
      text = text.substring(0, limit);

      if (text !== previous && showDots) {
        text = trim(text) + '...';
      }
    }

    return trim(text);
  }

  /**
   * Generate search snippet
   *
   * @param {array} keywords - search terms
   * @param {string} text - text where to search
   * @param {string} limit - number of sentences in search snippet
   * @param {boolean} foundWholePhrase - if true do not split keywords
   * @param {string} term - search term
   * @param {boolean} highlight - if true wrap keywords with <em></em>
   * @return string
   */
  public static getSearchSnippet(
    keywords: string[],
    text: string,
    limit: number,
    foundWholePhrase: boolean,
    term: string = '',
    highlight: boolean = false
  ) {
    let snippetCurrent = 0;
    const radius = 15;

    if (isEmpty(keywords) || isEmpty(text)) {
      return '';
    }

    if (!foundWholePhrase) {
      const newKeywords: string[] = [];
      for (let i = 0; i < keywords.length; i++) {
        const words = keywords[i].split(' ');
        for (let j = 0; j < words.length; j++) {
          const word = words[j];

          if (word.length > 2) {
            newKeywords.push(word);
          }
        }
      }
      keywords = newKeywords;
    } else {
      keywords = [term];
    }

    const result: string[] = [];

    for (let i = 0; i < keywords.length; i++) {
      let keyword = keywords[i];

      //escape / slash
      keyword = keyword.replace(/\//g, '/');

      const regex = new RegExp(`(.{0,${radius}})(${escapeRegExp(keyword)})(.{0,${radius}})`, 'gui');

      const matches = text.match(regex);

      if (!isEmpty(matches)) {
        for (let j = 0; j < matches!.length; j++) {
          let match = trim(matches![j]);

          if (isEmpty(match)) {
            continue;
          }

          if (snippetCurrent >= limit) {
            return result.join(' ');
          }

          if (highlight) {
            const regex = new RegExp(`(${keyword})`, 'gui');
            match = match.replace(regex, '<em>$1</em>');
          }

          result.push(`${match}...`);

          snippetCurrent++;
        }
      }
    }

    return result.join(' ');
  }

  /**
   * Generates search query
   * Check if search query returns any results and modifies it to get any results possible
   *
   *  Usage

   const result = await SearchHelper.generateSearchQuery(
     query,
     ['n.title', 'n.search_index'],
     'term',
     0,
     10,
     {
       table: 'fts_search_index',
       ftsIdKey: 'note_id',
       tableIdKey: 'n.id',
     },
   );

   const data = await result['query'];
   * @param {object} query - search query
   * @param {array} searchColumns - search columns
   * @param {string} term - search term
   * @param {int} limit - search limit
   * @param {int} resultsPerPage - results per page
   * @param {object} fts - fts search config
   * @return object - updated query and params
   */
  public static async generateSearchQuery(query, searchColumns, term, limit, resultsPerPage, fts) {
    const originalQuery = query.clone();
    const result = {};
    result['keywords'] = [term];
    let passed = false;

    //helper functions
    const checkSearch = async (query, limit, resultsPerPage) => {
      query = query.clone();
      query.limit(resultsPerPage);
      query.offset(limit);

      const result = await query;

      if (!isEmpty(result)) {
        return true;
      } else {
        return false;
      }
    };

    const fullTextSearch = (query, searchTerms, fts) => {
      query.innerJoin(`${fts.table} as fts`, `fts.${fts.ftsIdKey}`, fts.tableIdKey);

      query.whereRaw(`${fts.table} match ?`, searchTerms.join(' OR '));
    };

    const likeSearch = (query, searchColumns, searchTerms) => {
      query.where((builder) => {
        for (let i = 0; i < searchTerms.length; i++) {
          const searchTerm = searchTerms[i];

          for (let j = 0; j < searchColumns.length; j++) {
            const searchColumn = searchColumns[j];
            builder.orWhere(searchColumn, 'like', `%${searchTerm}%`);
          }
        }
      });
    };

    const wordShrink = async (query, searchColumns, searchTerms, limit, resultsPerPage, fts) => {
      const startQuery = query.clone();
      const newKeywords: any[] = [];
      let passed = false;

      const result = {};

      for (let i = 0; i < searchTerms.length; i++) {
        let searchTerm = searchTerms[i];
        searchTerm += ' '; //empty space to check if the whole word exists in search index
        const start = searchTerm.length;

        for (let j = start; j > 3; j--) {
          searchTerm = searchTerm.substring(0, searchTerm.length - 1);

          const tmpSearchKeywords: any[] = [];
          tmpSearchKeywords.push(searchTerm);
          passed = false;

          //try full text search
          if (!isEmpty(fts)) {
            query = startQuery.clone();
            fullTextSearch(query, tmpSearchKeywords, fts);

            passed = await checkSearch(query, limit, resultsPerPage);
          }

          //try like search
          if (!passed) {
            query = startQuery.clone();
            likeSearch(query, searchColumns, tmpSearchKeywords);

            passed = await checkSearch(query, limit, resultsPerPage);
          }

          if (passed) {
            newKeywords.push(searchTerm);
            break;
          }
        }
      }

      if (isEmpty(newKeywords)) {
        return {};
      }

      passed = false;

      if (!isEmpty(fts)) {
        query = startQuery.clone();
        fullTextSearch(query, newKeywords, fts);

        passed = await checkSearch(query, limit, resultsPerPage);
      }

      if (!passed) {
        query = startQuery.clone();
        likeSearch(query, searchColumns, newKeywords);

        passed = await checkSearch(query, limit, resultsPerPage);
      }

      result['query'] = query;
      result['keywords'] = newKeywords;

      return result;
    };

    //check if whole phrase was found
    query = originalQuery.clone();
    likeSearch(query, searchColumns, [term]);

    const wholePhraseCheck = await checkSearch(query, limit, resultsPerPage);
    result['foundWholePhrase'] = wholePhraseCheck;

    passed = false;

    if (!isEmpty(fts)) {
      query = originalQuery.clone();
      //try full text search
      fullTextSearch(query, [term], fts);

      passed = await checkSearch(query, limit, resultsPerPage);
    }

    //try like search
    if (!passed) {
      query = originalQuery.clone();
      likeSearch(query, searchColumns, [term]);

      passed = await checkSearch(query, limit, resultsPerPage);
    }

    result['query'] = query;

    if (!passed) {
      let words = term.split(' ');

      //try words split
      if (words.length > 1) {
        //if there are more then one word
        //remove 2 symbol words
        words = filter(words, (word) => trim(word).length > 2);

        if (isEmpty(words)) {
          return result;
        }

        //try words shrink
        query = originalQuery.clone();
        const tmp = await wordShrink(query, searchColumns, words, limit, resultsPerPage, fts);

        if (!isEmpty(tmp)) {
          result['query'] = tmp['query'];
          result['keywords'] = tmp['keywords'];
        }
      }
      //try word shrink
      else {
        query = originalQuery.clone();
        const tmp = await wordShrink(query, searchColumns, [term], limit, resultsPerPage, fts);

        if (!isEmpty(tmp)) {
          result['query'] = tmp['query'];
          result['keywords'] = tmp['keywords'];
        }
      }
    }

    return result;
  }
}
