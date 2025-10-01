const { MessageCollector } = require('discord.js');

module.exports = {
    name: 'jogos',
    execute(message, args, client) {
        const gamesEmbed = {
            color: 0x9B59B6,
            title: '🎮 Central de Jogos do TUTU Bot',
            description: 'Escolha um jogo para se divertir!',
            fields: [
                {
                    name: '🎯 Jogos Disponíveis',
                    value: '`!adivinhar` - Adivinhe o número\n`!jokenpo` - Pedra, Papel e Tesoura\n`!quiz` - Quiz de perguntas\n`!forca` - Jogo da Forca\n`!dado` - Rola um dado',
                    inline: false
                }
            ],
            thumbnail: {
                url: client.user.displayAvatarURL()
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Divirta-se! 🎉',
                icon_url: message.author.displayAvatarURL({ dynamic: true })
            }
        };

        return message.channel.send({ embeds: [gamesEmbed] });
    }
};