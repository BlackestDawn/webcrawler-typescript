export function printReport(baseURL: string, pages: Record<string, number>) {
  console.log(`=============================
  Report for ${baseURL}
=============================`);
  const sortedPages = Object.entries(pages).sort((a, b) => b[1] - a[1]);
  sortedPages.forEach(([page, count]) => {
    console.log(`Found ${count} internal link${count === 1 ? '' : 's'} to ${page}`);
  });
}
