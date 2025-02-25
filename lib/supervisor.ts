import { z } from "zod";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { END, Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
      default: () => [],
    }),
    // The agent node that last performed work
    next: Annotation<string>({
      reducer: (x, y) => y ?? x ?? END,
      default: () => END,
    }),
  });

const members = ["scraper", "searcher"] as const;

const systemPrompt =
  "You are a supervisor tasked with managing a conversation between the" +
  " following workers: {members}. Given the following user request," +
  " respond with the worker to act next. Each worker will perform a" +
  " task and respond with their results and status. When finished," +
  " respond with FINISH.";

const options = [END, ...members];

const routingTool = {
    name: "route",
    description: "Select the next role.",
    schema: z.object({
      next: z.enum([END, ...members]),
    }),
  }
  
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("messages"),
    [
      "human",
      "Given the conversation above, who should act next?" +
      " Or should we FINISH? Select one of: {options}",
    ],
  ]);

  const formattedPrompt = await prompt.partial({
    options: options.join(", "),
    members: members.join(", "),
  });
  
  const llm = new ChatMistralAI({
    model: "mistral-small-latest",
    temperature: 0,
  });
  
  const supervisorChain = formattedPrompt
    .pipe(llm.bindTools(
      [routingTool],
      {
      },
    ))
    // select the first one
    .pipe((x) => (x.tool_calls[0].args));