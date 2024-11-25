const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { getCSVFiles } = require("../utils/file-utils");
const { parseMinutes } = require("../utils/csv-utils");

function processFile(filePath) {
  return new Promise((resolve) => {
    let skip = true;
    const participants = [];

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
        const email = columns[4];
        const duration = columns[3];
        if (email && duration) {
          const minutes = parseMinutes(duration);
          participants.push({ email, minutes, duration });
        }
      }
    });

    rl.on("close", () => resolve({ file: filePath, participants }));
  });
}

async function registerEmailMinutes(folderPath, outputFile) {
  const csvFiles = getCSVFiles(folderPath);
  const results = [];

  for (const file of csvFiles) {
    const { file: fileName, participants } = await processFile(file);
    participants.forEach((participant) => {
      results.push({ file: fileName, ...participant });
    });
  }

  // Write the results to the output file
  const outputContent = results
    .map(
      ({ file, email, minutes }) =>
        `${path.basename(file)}\t${email}\t${minutes} minutes`
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

const outputFile = path.join(folderPath, "email_minutes.txt");
registerEmailMinutes(folderPath, outputFile);
