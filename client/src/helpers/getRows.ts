import forEach from 'lodash/forEach';
import find from 'lodash/find';

function getRows(rows, ids) {
  const _rows = [];

  forEach(ids, (id) => {
    const item = find(rows, (r) => r.id == id);
    if (item !== undefined) {
      _rows.push(item);
    }
  });

  return _rows;
}

export default getRows;
