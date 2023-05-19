/**
 * Get correct unit name

const days = {
  nom: 'день',
  gen: 'дня',
  plu: 'дней',
};


 *   units(1.2, days);//дня
 *   units(1,days);//день
 *   units(2,days);//дня
 *   units(25,days);//дней
 *
 * @param {Number}  num - number
 * @param {Object}  cases - cases
 * @param {String} word - word
 */
function units(num, cases) {
  num = Math.abs(num);

  let word = '';

  if (num.toString().indexOf('.') > -1) {
    word = cases.gen;
  } else {
    word =
      num % 10 == 1 && num % 100 != 11
        ? cases.nom
        : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
        ? cases.gen
        : cases.plu;
  }

  return word;
}

export default units;
