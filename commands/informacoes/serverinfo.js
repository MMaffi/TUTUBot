module.exports = {
    name: 'serverinfo',
    execute(message, args, client) {
        const guild = message.guild;

        const serverEmbed = {
            color: 0x9B59B6,
            title: `📊 Informações do Servidor - ${guild.name}`,
            thumbnail: {
                url: guild.iconURL({ dynamic: true, size: 1024 })
            },
            fields: [
                {
                    name: '👑 Dono',
                    value: `<@${guild.ownerId}>`,
                    inline: true
                },
                {
                    name: '🆔 ID do Servidor',
                    value: guild.id,
                    inline: true
                },
                {
                    name: '📅 Criado em',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: '👥 Membros',
                    value: `**Total:** ${guild.memberCount}\n**Humanos:** ${guild.members.cache.filter(m => !m.user.bot).size}\n**Bots:** ${guild.members.cache.filter(m => m.user.bot).size}`,
                    inline: true
                },
                {
                    name: '📁 Canais',
                    value: `**Total:** ${guild.channels.cache.size}\n**Texto:** ${guild.channels.cache.filter(c => c.type === 0).size}\n**Voz:** ${guild.channels.cache.filter(c => c.type === 2).size}`,
                    inline: true
                },
                {
                    name: '🎭 Cargos',
                    value: guild.roles.cache.size.toString(),
                    inline: true
                },
                {
                    name: '✨ Emojis',
                    value: guild.emojis.cache.size.toString(),
                    inline: true
                },
                {
                    name: '🚀 Boost Level',
                    value: `Nível ${guild.premiumTier}`,
                    inline: true
                },
                {
                    name: '💎 Boosts',
                    value: guild.premiumSubscriptionCount.toString(),
                    inline: true
                }
            ],
            footer: {
                text: `Solicitado por: ${message.author.tag}`,
                icon_url: message.author.displayAvatarURL({ dynamic: true })
            },
            timestamp: new Date().toISOString()
        };

        return message.channel.send({ embeds: [serverEmbed] });
    }
};