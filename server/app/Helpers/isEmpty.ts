/**
 * Check if value is empty
 *
 * @param {mixed} mixed_var
 */
function isEmpty(mixed_var) {
  let key;
  if (
    mixed_var === '' ||
    mixed_var === 0 ||
    mixed_var === null ||
    mixed_var === false ||
    mixed_var === undefined
  ) {
    return true;
  }
  if (typeof mixed_var === 'object') {
    for (key in mixed_var) {
      return false;
    }
    return true;
  }
  return false;
}

export default isEmpty;
