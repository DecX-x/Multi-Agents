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

// use the function with parameters https://langchain-ai.github.io/langgraphjs/tutorials/rag/langgraph_agentic_rag/
const result = await scrapeMendableDocs("https://langchain-ai.github.io/langgraphjs/tutorials/rag/langgraph_agentic_rag/");
console.log(result);
