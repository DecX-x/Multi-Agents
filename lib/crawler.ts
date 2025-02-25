import FireCrawlApp from '@mendable/firecrawl-js';
import dotenv from "dotenv";
dotenv.config();

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

async function scrapeMendableDocs(url: string): Promise<any> {
    const app = new FireCrawlApp({apiKey: FIRECRAWL_API_KEY});
    
    try {
        const scrapeResult = await app.scrapeUrl(url, {
            formats: ["markdown"],
        });
        return scrapeResult;
    } catch (error) {
        console.error("Scraping failed:", error);
        throw error;
    }
}

// // use the function with parameters https://langchain-ai.github.io/langgraphjs/tutorials/rag/langgraph_agentic_rag/
// const result = await scrapeMendableDocs("https://langchain-ai.github.io/langgraphjs/tutorials/rag/langgraph_agentic_rag/");
// console.log(result);
async function crawlWebsite(url: string): Promise<void> {
    try {
        const result = await scrapeMendableDocs(url);
        console.log('Crawling results for:', url);
        console.log(result);
    } catch (err) {
        console.error(`Failed to crawl ${url}:`, err);
    }
}

// Example usage:
const results = await crawlWebsite('https://python.langchain.com/docs/introduction/ ');
console.log(results);