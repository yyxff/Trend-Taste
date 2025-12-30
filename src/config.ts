import dotenv from "dotenv";

dotenv.config();

const {
    DISCORD_TOKEN,
    DISCORD_APPLICATION_ID,
    DISCORD_PUBLIC_KEY,
    GITHUB_API_TOKEN
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_APPLICATION_ID || !DISCORD_PUBLIC_KEY || !GITHUB_API_TOKEN) {
    throw new Error("Missing environment variables");
}

export const discordConfig = {
    DISCORD_TOKEN,
    DISCORD_APPLICATION_ID,
    DISCORD_PUBLIC_KEY,
};

export const githubConfig = {
    GITHUB_API_TOKEN,
};
