import Exa from "exa-js";
import dotenv from "dotenv";
dotenv.config();

const EXA_API_KEY = process.env.EXA_API_KEY;


export async function searchContent(query: string) {
    const exa = new Exa(EXA_API_KEY);
    
    try {
        const result = await exa.searchAndContents(query, {
            text: true,
            type: "neural",
            useAutoprompt: true,
            numResults: 10
        });
        
        return result;
    } catch (error) {
        console.error("Error performing search:", error);
        throw error;
    }
}

const results = await searchContent("Blog about ai agents");
console.log(results);