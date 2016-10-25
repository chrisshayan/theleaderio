

export const encodeKeyword = (rawKeyword) => {
  var blackList = [{'regex': /C#/gi, 'replace': 'C_sharp'}, {
    'regex': /C\+\+/gi,
    'replace': 'C_plus_plus'
  }, {'regex': /[\[\]\\\/:~\^\?!()&><"'@%|{}`*#$]/gi, 'replace': ' '}], regex, tempkeyword;
  for (var i in blackList) {
    rawKeyword = rawKeyword.replace(blackList[i].regex, blackList[i].replace);
  }
  do {
    tempkeyword = rawKeyword;
    rawKeyword = tempkeyword.replace("  ", " ")
  } while (tempkeyword != rawKeyword);
  rawKeyword = jQuery.trim(rawKeyword);
  return rawKeyword.replace(/ /g, '-');
};

export const createKeyword = (e) => {
  e = $.trim(e);
  e = e.replace(/[\[\]\/\:\~\^?!()+#&><"'%]/gi, "");
  do {
    tempkeyword = e;
    e = tempkeyword.replace("  ", " ")
  } while (tempkeyword != e);
  e = e.replace(/ /g, "-");
  return e
};

export const locdau = (e) => {
  e = e.toLowerCase();
  e = e.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  e = e.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  e = e.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  e = e.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  e = e.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  e = e.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  e = e.replace(/đ/g, "d");
  e = e.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
  e = e.replace(/-+-/g, "-");
  e = e.replace(/^\-+|\-+$/g, "");
  return e
};