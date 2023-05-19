function getKeywords(keywords) {
  let _keywords = [...keywords];
  if (_keywords.length === 1) {
    _keywords = _keywords[0].split(' ');
  }

  return _keywords;
}

export default getKeywords;
