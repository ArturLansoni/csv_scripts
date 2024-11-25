const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { getCSVFiles } = require("../utils/file-utils");
const { parseMinutes } = require("../utils/csv-utils");

function processFile(filePath) {
  return new Promise((resolve) => {
    let minutesSum = 0;
    let skip = true;

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      if (skip) {
        if (line.includes("2. ")) {
          skip = false;
        }
        return;
      } else if (line.includes("3. ")) {
        skip = true;
        return;
      }

      const columns = line.split("\t");
      if (columns.length > 4) {
        const duration = columns[3];
        if (duration) {
          minutesSum += parseMinutes(duration);
        }
      }
    });

    rl.on("close", () => resolve({ file: filePath, minutesSum }));
  });
}

async function sumMinutesAndSort(folderPath, outputFile) {
  const csvFiles = getCSVFiles(folderPath);
  const results = [];

  for (const file of csvFiles) {
    const result = await processFile(file);
    results.push(result);
  }

  const sortedResults = results.sort((a, b) => b.minutesSum - a.minutesSum);

  const outputContent = sortedResults
    .map(
      ({ file, minutesSum }) => `${path.basename(file)}: ${minutesSum} minutes`
    )
    .join("\n");

  fs.writeFileSync(outputFile, outputContent, "utf8");
  console.log(`Results written to ${outputFile}`);
}

// Main execution
const folderPath = process.argv[2];
if (!folderPath) {
  console.error("Please provide a folder path.");
  process.exit(1);
}

const outputFile = path.join(folderPath, "minutes_sum.txt");
sumMinutesAndSort(folderPath, outputFile);
