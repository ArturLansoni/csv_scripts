const fs = require("fs");
const path = require("path");

function isValidFolder(folderPath) {
  return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory();
}

function getCSVFiles(folderPath) {
  return fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".csv"))
    .map((file) => path.join(folderPath, file));
}

module.exports = { getCSVFiles, isValidFolder };
