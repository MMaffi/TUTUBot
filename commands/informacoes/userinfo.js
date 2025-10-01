const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    execute(message, args, client) {
        // Verificar se foi mencionado um usuário ou usar o autor da mensagem
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        if (!member) {
            return message.reply('❌ Não foi possível encontrar informações deste usuário no servidor.');
        }

        // Formatar datas
        const contaCriada = `<t:${Math.floor(user.createdTimestamp / 1000)}:F> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`;
        const entrouServidor = member.joinedTimestamp ? 
            `<t:${Math.floor(member.joinedTimestamp / 1000)}:F> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)` : 
            'Não disponível';

        // Formatar cargos (limitar para não exceder limite de caracteres)
        const cargos = member.roles.cache
            .filter(role => role.id !== message.guild.id) // Remove o cargo @everyone
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, 15); // Limita a 15 cargos

        // Status do usuário
        const status = {
            online: '🟢 Online',
            idle: '🟡 Ausente',
            dnd: '🔴 Ocupado',
            offline: '⚫ Offline'
        }[member.presence?.status] || '⚫ Offline';

        // Atividades do usuário
        const atividades = member.presence?.activities || [];
        let atividadeTexto = 'Nenhuma';
        
        if (atividades.length > 0) {
            const atividade = atividades[0];
            switch (atividade.type) {
                case 0: // Playing
                    atividadeTexto = `🎮 Jogando **${atividade.name}**`;
                    break;
                case 1: // Streaming
                    atividadeTexto = `📺 Streamando **${atividade.name}**`;
                    break;
                case 2: // Listening
                    atividadeTexto = `🎵 Ouvindo **${atividade.name}**`;
                    break;
                case 3: // Watching
                    atividadeTexto = `👀 Assistindo **${atividade.name}**`;
                    break;
                case 4: // Custom
                    atividadeTexto = `💭 ${atividade.state || 'Status personalizado'}`;
                    break;
                case 5: // Competing
                    atividadeTexto = `🏆 Competindo em **${atividade.name}**`;
                    break;
                default:
                    atividadeTexto = `📝 ${atividade.name}`;
            }
        }

        // Informações de boost
        const boostInfo = member.premiumSince ? 
            `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>` : 
            'Não está impulsionando';

        // Criar embed
        const userEmbed = new EmbedBuilder()
            .setColor(member.displayColor || 0x0099FF)
            .setTitle(`👤 Informações de ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                {
                    name: '📛 Tag',
                    value: user.tag,
                    inline: true
                },
                {
                    name: '🆔 ID',
                    value: user.id,
                    inline: true
                },
                {
                    name: '📅 Conta criada',
                    value: contaCriada,
                    inline: true
                },
                {
                    name: '🚪 Entrou no servidor',
                    value: entrouServidor,
                    inline: true
                },
                {
                    name: '📊 Status',
                    value: status,
                    inline: true
                },
                {
                    name: '🎯 Atividade',
                    value: atividadeTexto,
                    inline: true
                },
                {
                    name: '💎 Boost',
                    value: boostInfo,
                    inline: true
                },
                {
                    name: `🎭 Cargos [${cargos.length}]`,
                    value: cargos.length > 0 ? cargos.join(', ') : 'Nenhum cargo',
                    inline: false
                }
            )
            .setFooter({
                text: `Solicitado por ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        // Adicionar badge de bot se for um bot
        if (user.bot) {
            userEmbed.addFields({
                name: '🤖 Tipo',
                value: 'Bot',
                inline: true
            });
        }

        // Adicionar informações de moderação se o comando for usado por um moderador
        if (message.member.permissions.has('ManageMessages')) {
            const warns = '0';
            userEmbed.addFields({
                name: '⚖️ Moderação',
                value: `Warns: ${warns}`,
                inline: true
            });
        }

        return message.channel.send({ embeds: [userEmbed] });
    }
};