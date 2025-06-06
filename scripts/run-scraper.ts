import { TraitsScraper } from '../src/backend/scraping/traits-scraper';

async function main() {
  try {
    console.log('Starting traits scraper...');
    const scraper = new TraitsScraper();
    await scraper.scrapeAllTraits();
    console.log('Traits scraping completed successfully!');
  } catch (error) {
    console.error('Error running scraper:', error);
    process.exit(1);
  }
}

main(); 