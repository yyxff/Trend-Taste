import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides help information for commands');

export async function execute(interaction: CommandInteraction) {
    const helpEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Trend-Taste Bot Usage Help')
        .setDescription('A list of all available commands.\nPlease ensure basic configuration is completed before running tasks.')
        .setThumbnail(interaction.client.user?.displayAvatarURL() || '')
        .setFooter({ text: 'Trend Taste', iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' })
        .setTimestamp();

    helpEmbed.addFields(
            // --- Section 1: Core Configuration ---
            {
                name: '1. Core Configuration (All required!)',
                value: [
                    '`/set-language [lang]`',
                    '   > Set the bot\'s reply language (e.g., zh-CN, en-US).',
                    
                    '`/set-type [type]`',
                    '> Set the task type for the current channel (e.g., GitHub Trending).',
                    
                    '`/set-schedule [timezone] [hour] [minute]`',
                    '> Set the task schedule time.'
                ].join('\n')
            })

    helpEmbed.addFields(
            // --- Section 2: Service Control ---
            {
                name: '2. Service Control',
                value: [
                    '`/enable`',
                    '> 🟢 **Activate** the automatic push service for the current channel.',
                    
                    '`/disable`',
                    '> 🔴 **Deactivate** the automatic push service for the current channel.',
                    
                    '`/run`',
                    '> ⚡ **Run** a fetch and push task immediately (for testing).'
                ].join('\n')
            })

    helpEmbed.addFields(
            // --- Section 3: Information & Help ---
            {
                name: '3. Information & Help',
                value: [
                    '`/info`',
                    '> View all configuration parameters and running status for the current channel.',
                    
                    '`/help`',
                    '> Display this help menu.'
                ].join('\n')
            }
        )

    const REPO_URL = 'https://github.com/yyxff/trend-taste';
    const ISSUE_URL = 'https://github.com/yyxff/trend-taste/issues';

    const linkRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Star on GitHub')
                .setEmoji('⭐')
                .setStyle(ButtonStyle.Link)
                .setURL(REPO_URL),
            
            new ButtonBuilder()
                .setLabel('Issue / Bug Report')
                .setEmoji('🐛')
                .setStyle(ButtonStyle.Link)
                .setURL(ISSUE_URL)
        );

    return interaction.reply({ 
        embeds: [helpEmbed],
        components: [linkRow],
    });
}