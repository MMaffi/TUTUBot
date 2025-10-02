const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const counters = new Map();

module.exports = {
    name: 'contador',
    execute(message, args, client) {
        const guildId = message.guild.id;

        if (args[0] === 'iniciar') {
            if (counters.has(guildId)) {
                return message.reply('❌ Já há um contador ativo! Use `!contador ver`');
            }
            counters.set(guildId, 0);
            return sendCounterMessage(message, client, 0);
        }

        if (args[0] === 'reset') {
            counters.delete(guildId);
            return message.reply('🔄 Contador resetado!');
        }

        // Se não há contador ativo, iniciar um
        if (!counters.has(guildId)) {
            counters.set(guildId, 0);
        }

        const current = counters.get(guildId);
        return sendCounterMessage(message, client, current);
    },

    // Handler para botões
    buttonHandler: async (interaction, client) => {
        if (!interaction.isButton()) return false;

        // Verifica se é um botão do contador
        if (!['somar', 'subtrair', 'reset'].includes(interaction.customId)) {
            return false;
        }

        try {
            const guildId = interaction.guild.id;
            
            if (!counters.has(guildId)) {
                counters.set(guildId, 0);
            }

            let current = counters.get(guildId);
            let newCount = current;

            switch (interaction.customId) {
                case 'somar':
                    newCount = current + 1;
                    counters.set(guildId, newCount);
                    break;
                case 'subtrair':
                    newCount = current - 1;
                    counters.set(guildId, newCount);
                    break;
                case 'reset':
                    newCount = 0;
                    counters.set(guildId, newCount);
                    break;
                default:
                    return true;
            }

            // Atualizar a mensagem
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('somar')
                        .setLabel('➕ Somar')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('subtrair')
                        .setLabel('➖ Subtrair')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('reset')
                        .setLabel('🔄 Resetar')
                        .setStyle(ButtonStyle.Secondary)
                );

            const embed = new EmbedBuilder()
                .setColor(getColorByCount(newCount))
                .setTitle('🔢 Contador Interativo')
                .setDescription(`**Contagem atual:**\n# ${newCount}`)
                .addFields(
                    {
                        name: '📊 Estatísticas',
                        value: `**Positivo:** ${newCount > 0 ? '✅' : '❌'}\n**Negativo:** ${newCount < 0 ? '✅' : '❌'}\n**Zero:** ${newCount === 0 ? '✅' : '❌'}`,
                        inline: true
                    },
                    {
                        name: '👤 Última ação',
                        value: `${interaction.user.tag}`,
                        inline: true
                    }
                )
                .setFooter({
                    text: `Servidor: ${interaction.guild.name}`
                })
                .setTimestamp();

            // Verifica se a interação já foi respondida
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ 
                    embeds: [embed], 
                    components: [row] 
                });
            } else {
                await interaction.update({ 
                    embeds: [embed], 
                    components: [row] 
                });
            }

            return true;

        } catch (error) {
            // Ignora erros de interação já processada
            if (error.code === 10062 || error.code === 40060 || error.code === 'InteractionAlreadyReplied') {
                return true;
            }
            console.error('❌ Erro no contador:', error.message);
            return true;
        }
    }
};

function sendCounterMessage(message, client, count) {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('somar')
                .setLabel('➕ Somar')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('subtrair')
                .setLabel('➖ Subtrair')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('reset')
                .setLabel('🔄 Resetar')
                .setStyle(ButtonStyle.Secondary)
        );

    const embed = new EmbedBuilder()
        .setColor(getColorByCount(count))
        .setTitle('🔢 Contador Interativo')
        .setDescription(`**Contagem atual:**\n# ${count}`)
        .addFields(
            {
                name: '📊 Estatísticas',
                value: `**Positivo:** ${count > 0 ? '✅' : '❌'}\n**Negativo:** ${count < 0 ? '✅' : '❌'}\n**Zero:** ${count === 0 ? '✅' : '❌'}`,
                inline: true
            },
            {
                name: '🎯 Como usar',
                value: 'Clique nos botões abaixo!',
                inline: true
            }
        )
        .setFooter({
            text: `Servidor: ${message.guild.name}`
        })
        .setTimestamp();

    return message.channel.send({ 
        embeds: [embed], 
        components: [row] 
    });
}

function getColorByCount(count) {
    if (count > 0) return 0x00FF00;
    if (count < 0) return 0xFF0000;
    return 0x0099FF;
}