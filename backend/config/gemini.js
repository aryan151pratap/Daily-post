import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.GEMINI_API_KEY);

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default client;
