const PDFParser = require('pdf-parse');
const _ = require('lodash');
const fs = require('fs');

class GenericHelper {
  randomString (length) {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async relevacyScore (path, skills) {
    const pdf = await PDFParser(fs.readFileSync(path));
    const matches = _.intersection(_.words(_.toLower(pdf.text), /[\w'-]+/g), skills);
    return (matches.length == 0 || skills.length == 0) ? 0 : parseInt((matches.length / skills.length) * 100);
  }
} 

module.exports = new GenericHelper();