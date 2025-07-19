import { crawlPage } from "./crawl";
import { argv } from "node:process";

async function main() {
  if (argv.length < 3) {
    console.error('Need to provide a URL to crawl');
    process.exit(1);
  }
  if (argv.length > 3) {
    console.error('Too many arguments');
    process.exit(1);
  }
  const url = argv[2];
  console.log(`Crawling ${url}`);
  const result = await crawlPage(url, url);
  console.log(result);
  process.exit(0);
}

main();
