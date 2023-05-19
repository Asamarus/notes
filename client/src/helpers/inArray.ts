/**
 * Check if array contains value

 *  console.log(inArray(1,[0,1]));//true

 * @param {mixed} needle - needle
 * @param {Array} array - haystack
 */
function inArray(needle, array) {
  let index = -1;

  for (let i = 0; i < array.length; i++) {
    if (array[i] == needle) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    return true;
  } else {
    return false;
  }
}

export default inArray;
