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
        const timeAsDate = new Date(`1970-01-01T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
        
        await setTaskTimezone(interaction.channelId, timezone);
        const task = await setTaskSchedule(interaction.channelId, timeAsDate);
        
        const scheduledTime = task.schedule!;
        let scheduledLuxonTime = DateTime.now()
            .setZone(task.timezone!)
            .set({
                hour: scheduledTime.getUTCHours(), 
                minute: scheduledTime.getUTCMinutes(), 
                second: 0, 
                millisecond: 0 
            });
        
        // If the scheduled time has already passed today, show tomorrow's time
        if (scheduledLuxonTime < DateTime.now().setZone(task.timezone!)) {
            scheduledLuxonTime = scheduledLuxonTime.plus({ days: 1 });
        }
        
        const response = `✅\n`
        +`Your task is scheduled to `
        +`${scheduledTime.getUTCHours().toString().padStart(2, '0')}:${scheduledTime.getUTCMinutes().toString().padStart(2, '0')} `
        +`everyday for ${task.timezone} (UTC${scheduledLuxonTime.toFormat("ZZ")})\n`
        +`Next run: ${scheduledLuxonTime.toISO()}`;
        cmdLogger.info({ hour, minute, timezone }, "Command executed successfully");
        return interaction.reply(response);
    } catch (error) {
        cmdLogger.error({err: error}, "Command execution failed");
        return interaction.reply(`Failed to set schedule. Please try again or check the logs.`);
    }
}
