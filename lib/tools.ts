import Exa from "exa-js";
import dotenv from "dotenv";
import { DynamicStructuredTool } from "langchain/tools";
import FireCrawlApp from '@mendable/firecrawl-js';

import { z } from "zod";
dotenv.config();

const EXA_API_KEY = process.env.EXA_API_KEY;

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

export async function searchContent(query: string) {
    const exa = new Exa(EXA_API_KEY);
    
    try {
        const result = await exa.searchAndContents(query, {
            text: true,
            type: "neural",
            useAutoprompt: true,
            numResults: 5
        });
        
        return result;
    } catch (error) {
        console.error("Error performing search:", error);
        throw error;
    }
}

export const searchTool = new DynamicStructuredTool({
    name: "searchContent",
    description: "Search for content in the internet, but use this tool only whe user wants to search for something",
    schema: z.object({
        query: z.string().describe("Search query")
    }),
    async func(inputs) {
        const results = await searchContent(inputs.query);
        return { results };
    }
})

export async function scrapeMendableDocs(url: string): Promise<any> {
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

export const scrapeTool = new DynamicStructuredTool({
    name: "webScraper",
    description: "Scrape a webpage for content",
    schema: z.object({
        url: z.string().describe("URL of the webpage to scrape")
    }),
    async func(inputs) {
        const result = await scrapeMendableDocs(inputs.url);
        return { result };
    }
})

export async function crawlWebsite(url: string): Promise<void> {
    try {
        const result = await scrapeMendableDocs(url);
        console.log('Crawling results for:', url);
        console.log(result);
    } catch (err) {
        console.error(`Failed to crawl ${url}:`, err);
    }
}
export const crawlTool = new DynamicStructuredTool({
    name: "crawlWebsite",
    description: "Crawl a website for content",
    schema: z.object({
        url: z.string().describe("URL of the website to crawl")
    }),
    async func(inputs) {
        const result = await crawlWebsite(inputs.url);
        return { result };
    }
})
