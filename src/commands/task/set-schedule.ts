import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { IANAZone, DateTime } from "luxon";
import { COMMON_TIMEZONES } from "../../constants/timezones";
import { setTaskSchedule, setTaskTimezone } from "@services/task.service";
import { logger } from "@utils/logger";

export const data = new SlashCommandBuilder()
    .setName("set-schedule")
    .setDescription("Set the schedule for this channel's task")
    .addStringOption(option =>
        option
            .setName("timezone")
            .setDescription("Common timezones (e.g., Asia/Shanghai, Europe/London)")
            .setRequired(true)
            .addChoices(...COMMON_TIMEZONES.map(tz => ({ name: tz, value: tz })))
    )
    .addIntegerOption(option =>
        option
            .setName("hour")
            .setDescription("24-hour format: 10 means 10 AM, 15 means 3 PM")
            .setMinValue(0)
            .setMaxValue(23)
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName("minute")
            .setDescription("0-59")
            .setMinValue(0)
            .setMaxValue(59)
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const cmdLogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdLogger.info("Command invoked");
    try {
        const hour = interaction.options.getInteger("hour", true);
        const minute = interaction.options.getInteger("minute", true);
        const timezone = interaction.options.getString("timezone", true);
        if (!IANAZone.isValidZone(timezone)) {
            cmdLogger.warn({ timezone }, "Invalid timezone provided");
            return interaction.reply(`Invalid timezone: ${timezone}`);
        }
        const now = DateTime.now().setZone(timezone);
        const taskTime = now.set({ hour: hour, minute: minute, second: 0, millisecond: 0 });
        await setTaskTimezone(interaction.channelId, timezone);
        await setTaskSchedule(interaction.channelId, taskTime.toUTC().toJSDate());

        const response = `Your task is scheduled to `
        +`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} `
        +`for ${timezone} UTC${now.toFormat("ZZ")}, `
        +`(Next run: ${taskTime.toISO()})`;
        cmdLogger.info({ hour, minute, timezone }, "Command executed successfully");
        return interaction.reply(response);
    } catch (error) {
        cmdLogger.error({err: error}, "Command execution failed");
        return interaction.reply(`Failed to set schedule. Please try again or check the logs.`);
    }
}
