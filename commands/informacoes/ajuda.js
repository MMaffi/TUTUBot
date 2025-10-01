require('dotenv').config();

module.exports = {
    name: 'ajuda',
    execute(message, args, client) {

        const prefix = process.env.PREFIX || '!';
        
        const helpEmbed = {
            color: 39423,
            title: '📋 Comandos do TUTU Bot',
            description: `Prefixo: **${prefix}**`,
            fields: [
                {
                    name: '🎮 Comandos de Jogos',
                    value: `${prefix}jogos - Mostra todos os jogos\n${prefix}adivinhar - Adivinhe o número\n${prefix}jokenpo - Pedra, papel e tesoura\n${prefix}quiz - Quiz de perguntas\n${prefix}forca - Jogo da forca\n${prefix}dado - Rola um dado`,
                    inline: false
                },
                {
                    name: '🔧 Comandos de Moderação',
                    value: `${prefix}limpar - Limpa mensagens (apenas mods)`,
                    inline: false
                },
                {
                    name: 'ℹ️ Comandos de Informação',
                    value: `${prefix}ajuda - Mostra esta mensagem\n${prefix}userinfo - Informações do usuário\n${prefix}serverinfo - Informações do servidor`,
                    inline: false
                },
                {
                    name: '🛠️ Comandos Úteis',
                    value: `${prefix}calc - Calculadora\n${prefix}timer - Temporizador\n${prefix}clima - Consulte o clima`,
                    inline: false
                },
                {
                    name: '😄 Comandos Divertidos',
                    value: `${prefix}piada - Conta uma piada\n${prefix}8ball - Bola mágica 8\n${prefix}meme - Conta um meme`,
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