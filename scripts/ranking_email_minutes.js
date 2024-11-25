const fs = require("fs");
const path = require("path");

async function summarizeEmailMinutes(inputFile, outputFile) {
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const emailMinutes = {};

  const fileContent = fs.readFileSync(inputFile, "utf8");
  const lines = fileContent.split("\n").filter((line) => line.trim());

  lines.forEach((line) => {
    const [_, email, minutes] = line.split("\t");
    if (email && minutes) {
      const minuteValue = parseInt(minutes.replace(" minutes", ""), 10);
      emailMinutes[email] = (emailMinutes[email] || 0) + minuteValue;
    }
  });

  const sortedResults = Object.entries(emailMinutes).sort(
    ([, minutesA], [, minutesB]) => minutesB - minutesA
  );

  const outputContent = sortedResults
    .map(([email, totalMinutes]) => `${email}\t${totalMinutes} minutes`)
    .join("\n");

  fs.writeFileSync(outputFile, outputContent, "utf8");
  console.log(`Summary written to ${outputFile}`);
}

const folderPath = process.argv[2];
if (!folderPath) {
  console.error("Please provide a folder path.");
  process.exit(1);
}

const inputFile = path.join(folderPath, "email_minutes.txt");
const outputFile = path.join(folderPath, "email_minutes_summary.txt");
summarizeEmailMinutes(inputFile, outputFile);
