import { generateMCQsFromSummary, loadPdf, summarizeText } from "./agent";

async function main() {
  const pdfPath = "./test.pdf"; // change to your file
  console.log("Loading PDF...");
  //   const text = await loadPdf(pdfPath);
  const topic = "Angular Fundamentals";

  console.log("Summarizing text...");
  const summary = await summarizeText(topic);

  console.log("Generating MCQs from summary...");
  const questions = await generateMCQsFromSummary(summary, topic, 5);
  console.log(questions);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
