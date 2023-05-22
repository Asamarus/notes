import DB from '@ioc:Adonis/Lucid/Database';

import forEach from 'lodash/forEach';
import startsWith from 'lodash/startsWith';
import get from 'lodash/get';
import toInteger from 'lodash/toInteger';
import has from 'lodash/has';
import ceil from 'lodash/ceil';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import values from 'lodash/values';
import findKey from 'lodash/findKey';
import size from 'lodash/size';
import isEmpty from 'App/Helpers/isEmpty';
import inArray from 'App/Helpers/inArray';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DataSource {
  /**
   * Parse request
   *
   * @param {object} request - request
   * @return object
   */
  public static parseRequest(request: HttpContextContract['request']) {
    const result = {};

    result['page'] = request.input('page', 1);
    result['results_per_page'] = request.input('results_per_page', null);
    result['search'] = request.input('search', null);
    result['filters'] = request.input('filters', null);
    result['order'] = request.input('order', null);

    return result;
  }

  /**
   * Get result
   *
   * @param {object} params - {page, results_per_page, search, filters, order}
   * @param {object} query - query
   * @param {object} columns - columns
   * @param {object} filters - available filters
   * @param {object} formatters - custom response column formatters
   * @param {object} options - extra options
   * @return object
   */
  public static async get(params, query, columns, filters = {}, formatters = {}, options = {}) {
    const result = {};

    this.addSelect(query, columns);

    this.search(params, query, columns, options);
    this.filters(params, query, columns, filters, options);

    const total = await this.getTotal(query, options);

    const resultsPerPage = this.getResultsPerPage(params, options);
    const page = this.getPage(params);
    const limit = this.getLimit(page, resultsPerPage);

    const queryPaginate = query.clone();

    if (resultsPerPage !== 'all') {
      this.paginate(queryPaginate, resultsPerPage, limit);
    }

    this.order(params, queryPaginate, columns, options);

    const rows = await queryPaginate;
    const count = size(rows);

    this.addEmptyColumns(rows, columns);

    result['rows'] = this.formatRows(rows, formatters);

    result['total'] = total;
    result['count'] = count;
    result['lastPage'] = this.getLastPage(total, resultsPerPage);
    result['loadMore'] = this.getLoadMore(count, result['lastPage'], resultsPerPage, page);
    result['page'] = page;

    return result;
  }

  /**
   * Add select
   *
   * @param {object} query - query
   * @param {object} columns - query
   * @return void
   */
  public static addSelect(query, columns) {
    forEach(columns, (alias, column) => {
      if (!startsWith(column, '__empty__')) {
        //@ts-ignore
        query.knexQuery.column(DB.raw(`${column} as ${alias}`).sql);
      }
    });
  }

  /**
   * Add empty columns
   *
   * @param {object} rows - rows
   * @param {object} columns - columns
   * @return void
   */
  public static addEmptyColumns(rows, columns) {
    const columnsToAdd: any[] = [];

    forEach(columns, (alias, column) => {
      if (startsWith(column, '__empty__')) {
        columnsToAdd.push(alias);
      }
    });

    if (!isEmpty(columnsToAdd)) {
      forEach(rows, (row) => {
        forEach(columnsToAdd, (column) => {
          row[column] = '';
        });
      });
    }
  }

  /**
   * Get results per page
   *
   * @param {object} params - params
   * @param {object} options - options
   * @return mixed
   */
  public static getResultsPerPage(params, options) {
    let resultsPerPage = get(options, 'results_per_page', 10);

    const resultsPerPageFromParams = get(params, 'results_per_page');

    if (!isEmpty(resultsPerPageFromParams)) {
      if (resultsPerPageFromParams === 'all') {
        resultsPerPage = 'all';
      } else {
        resultsPerPage = toInteger(resultsPerPageFromParams);
      }
    }

    return resultsPerPage;
  }

  /**
   * Get total
   *
   * @param {object} query - query
   * @param {object} options - options
   * @return integer
   */
  public static async getTotal(query, options) {
    let total = 0;

    if (has(options, 'total')) {
      total = options.total;
    } else {
      const queryCount = query.clone();
      total = await queryCount.count('*', 'total');
      if (!isEmpty(total)) {
        total = total[0]['total'];
      } else {
        total = 0;
      }
    }

    return total;
  }

  /**
   * Get page
   *
   * @param {object} params - params
   * @return integer
   */
  public static getPage(params) {
    let page = 1;

    const pageFromParams = get(params, 'page');

    if (!isEmpty(pageFromParams)) {
      page = toInteger(pageFromParams);
    }

    if (page <= 0) {
      page = 1;
    }

    return page;
  }

  /**
   * Get last page
   *
   * @param {integer} total - total records
   * @param {mixed} resultsPerPage - results per page
   * @return integer
   */
  public static getLastPage(total, resultsPerPage) {
    if (resultsPerPage === 'all') {
      return 1;
    } else {
      return toInteger(ceil(total / resultsPerPage));
    }
  }

  /**
   * Get load more
   *
   * @param {integer} count - rows count
   * @param {integer} lastPage - last page
   * @param {mixed} resultsPerPage - results per page
   * @param {integer} page - current page
   * @return boolean
   */
  public static getLoadMore(count, lastPage, resultsPerPage, page) {
    if (resultsPerPage === 'all') {
      return false;
    } else {
      if (count < resultsPerPage) {
        return false;
      } else if (lastPage !== page) {
        return true;
      }

      return false;
    }
  }

  /**
   * Get limit
   *
   * @param {integer} page - page
   * @param {mixed} resultsPerPage - results per page
   * @return integer
   */
  public static getLimit(page, resultsPerPage) {
    let limit = 0;

    if (resultsPerPage !== 'all') {
      limit = resultsPerPage * page - resultsPerPage;

      if (page === 1) {
        limit = 0;
      }

      limit = toInteger(limit);
    }

    return limit;
  }

  /**
   * Paginate
   *
   * @param {object} query - request
   * @param {integer} resultsPerPage - results per page
   * @param {integer} limit - limit
   * @return void
   */
  public static paginate(query, resultsPerPage, limit) {
    query.limit(resultsPerPage);
    query.offset(limit);
  }

  /**
   * Format rows
   *
   * @param {object} rows - rows
   * @param {object} formatters - formatters
   * @return array
   */
  public static formatRows(rows, formatters) {
    const result: any[] = [];

    forEach(rows, (row) => {
      let tmp = {};

      forEach(row, (value, key) => {
        if (has(formatters, key)) {
          tmp[key] = formatters[key](value, row);
        } else {
          tmp[key] = value;
        }
      });

      result.push(tmp);
    });

    return result;
  }

  /**
   * Search
   *
   * @param {object} params - params
   * @param {object} query - query
   * @param {object} columns - columns
   * @param {object} options - options
   * @return void
   */
  public static search(params, query, columns, options) {
    const disabled = get(options, 'search.disabled', false);

    if (disabled) {
      return;
    }

    const search = get(params, 'search', null);

    if (!isEmpty(search)) {
      const term = `%${search}%`;

      const ignoredColumns = get(options, 'search.ignored', []);

      query.where((query) => {
        forEach(columns, (alias, column) => {
          if (!startsWith(column, '__empty__') && !inArray(alias, ignoredColumns)) {
            query.orWhere(column, 'like', term);
          }
        });
      });
    }
  }

  /**
   * Filters
   *
   * @param {object} params - params
   * @param {object} query - query
   * @param {object} columns - columns
   * @param {object} filters - filters
   * @param {object} options - options
   * @return void
   */
  public static filters(params, query, columns, filters, options) {
    const disabled = get(options, 'filters.disabled', false);

    if (disabled) {
      return;
    }

    const paramsFilters = get(params, 'filters', {});

    if (!isEmpty(paramsFilters)) {
      if (isObject(paramsFilters)) {
        forEach(paramsFilters, (value: string, key) => {
          if (isString(value) && value.length === 0) {
            return;
          }

          if (has(filters, key)) {
            filters[key](query, value);
          } else if (inArray(key, values(columns))) {
            const column = columns[findKey(columns, (alias) => alias === key) as any];

            if (!startsWith(column, '__empty__')) {
              query.where(column, 'like', `%${value}%`);
            }
          }
        });
      }
    }
  }

  /**
   * Order
   *
   * @param {object} params - params
   * @param {object} query - query
   * @param {object} columns - columns
   * @param {object} options - options
   * @return void
   */
  public static order(params, query, columns, options) {
    const paramsOrder = get(params, 'order', null);

    if (!isEmpty(paramsOrder)) {
      if (isObject(paramsOrder)) {
        forEach(paramsOrder, (direction, key) => {
          const currentDirection = inArray(direction, ['asc', 'desc']) ? direction : 'asc';

          if (inArray(key, values(columns))) {
            const column = columns[findKey(columns, (alias) => alias === key) as any];
            if (!startsWith(column, '__empty__')) {
              query.orderBy(DB.raw(column), currentDirection);
            }
          }
        });
      } else if (paramsOrder === 'random') {
        query.orderByRaw('RANDOM()');
      }
    } else {
      const defaultOrder = get(options, 'order', null);

      if (defaultOrder !== null) {
        forEach(defaultOrder, (direction, key) => {
          query.orderBy(DB.raw(key), direction);
        });
      }
    }
  }
}
