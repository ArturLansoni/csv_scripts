const fs = require("fs");
const readline = require("readline");
const { getCSVFiles, isValidFolder } = require("../utils/file-utils");
const { normalize } = require("../utils/csv-utils");

const folderPath = process.argv[2];
if (!isValidFolder(folderPath)) {
  console.error("Please provide a valid folder path");
  process.exit(1);
}

const csvFiles = getCSVFiles(folderPath);

csvFiles.forEach((filePath) => {
  console.log(`Processing file ${filePath}...`);

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  let normalizedContent = "";

  rl.on("line", (line) => {
    normalizedContent += normalize(line) + "\n";
  });

  rl.on("close", () => {
    fs.writeFileSync(filePath, normalizedContent);
    console.log(`File ${filePath} normalized successfully!`);
  });

  rl.on("error", (error) => {
    console.error(`Error while reading file ${filePath}: ${error.message}`);
  });
});
