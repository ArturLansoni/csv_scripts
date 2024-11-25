const fs = require("fs");

function removeAccents(str) {
  const accentMap = {
    à: "a",
    á: "a",
    â: "a",
    ã: "a",
    ä: "a",
    å: "a",
    ç: "c",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ì: "i",
    í: "i",
    î: "i",
    ï: "i",
    ñ: "n",
    ò: "o",
    ó: "o",
    ô: "o",
    õ: "o",
    ö: "o",
    ù: "u",
    ú: "u",
    û: "u",
    ü: "u",
    ý: "y",
    ÿ: "y",
  };

  return str
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => accentMap[char] || char)
    .join("");
}

function normalize(content) {
  const withoutAccent = removeAccents(content);
  return withoutAccent.replace(/[^\x20-\x7E\t]/g, "");
}

function parseMinutes(time) {
  const h = _hours(time);
  const m = _minutes(time);
  const s = _seconds(time);

  const sum = parseInt(h) * 60 + parseInt(m) + parseFloat(s) / 60;
  return Math.round(sum);
}

function _hours(time) {
  const index = time.indexOf("h");
  if (index === -1) return 0;
  const hours = time.substring(0, index).trim();
  return hours;
}

function _minutes(time) {
  const index = time.indexOf("m");
  if (index === -1) return 0;
  const start = time.lastIndexOf(" ", index) + 1;
  const minutes = time.substring(start, index).trim();
  return minutes;
}

function _seconds(time) {
  const index = time.indexOf("s");
  if (index === -1) return 0;
  const start = time.lastIndexOf(" ", index) + 1;
  const seconds = time.substring(start, index).trim();
  return seconds;
}

module.exports = { normalize, parseMinutes };
