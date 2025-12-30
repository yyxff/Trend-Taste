import { REST, Routes } from "discord.js";
import { discordConfig } from "./config";
import { commands } from "./commands/index";
import { logger } from "./utils/logger";

const commandsData = Object.values(commands).map((command: any) => command.data);

const rest = new REST({ version: "10" }).setToken(discordConfig.DISCORD_TOKEN);

type DeployCommandsProps = {
    guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
        logger.info("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(discordConfig.DISCORD_APPLICATION_ID, guildId),
            {
                body: commandsData,
            }
        );

        logger.info("Successfully reloaded application (/) commands.");
    } catch (error) {
        logger.error({error}, "Error deploying commands");
    }
}