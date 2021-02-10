import dotenv from "dotenv";
dotenv.config();

console.log("token", process.env.SLACK_OAUTH_TOKEN);

export const SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN;
export const BOT_SPAM_CHANNEL = "#general";
