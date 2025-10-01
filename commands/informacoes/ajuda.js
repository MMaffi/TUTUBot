const config = require('../../config.json');

module.exports = {
    name: 'ajuda',
    execute(message, args, client) {
        const helpEmbed = {
            color: 39423,
            title: '📋 Comandos do TUTU Bot',
            description: `Prefixo: **${config.prefix}**`,
            fields: [
                {
                    name: '🎮 Comandos de Jogos',
                    value: '`!jogos` - Mostra todos os jogos\n`!adivinhar` - Adivinhe o número\n`!jokenpo` - Pedra, papel e tesoura\n`!quiz` - Quiz de perguntas\n`!forca` - Jogo da forca\n`!dado` - Rola um dado',
                    inline: false
                },
                {
                    name: '🔧 Comandos de Moderação',
                    value: '`!limpar` - Limpa mensagens (apenas mods)',
                    inline: false
                },
                {
                    name: 'ℹ️ Comandos de Informação',
                    value: '`!ajuda` - Mostra esta mensagem\n`!userinfo` - Informações do usuário\n`!serverinfo` - Informações do servidor',
                    inline: false
                },
                {
                    name: '🛠️ Comandos Úteis',
                    value: '`!calc` - Calculadora\n`!timer` - Temporizador\n`!clima` - Consulte o clima',
                    inline: false
                },
                {
                    name: '😄 Comandos Divertidos',
                    value: '`!piada` - Conta uma piada\n`!8ball` - Bola mágica 8\n`!meme` - Conta um meme',
                    inline: false
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: `Solicitado por ${message.author.tag}`,
                icon_url: message.author.displayAvatarURL({ dynamic: true })
            }
        };

        return message.channel.send({ embeds: [helpEmbed] });
    }
};