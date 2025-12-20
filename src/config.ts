import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_APPLICATION_ID, DISCORD_PUBLIC_KEY, DISCORD_CHANNEL_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_APPLICATION_ID || !DISCORD_PUBLIC_KEY || !DISCORD_CHANNEL_ID) {
    throw new Error("Missing environment variables");
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_APPLICATION_ID,
    DISCORD_PUBLIC_KEY,
    DISCORD_CHANNEL_ID,
};
