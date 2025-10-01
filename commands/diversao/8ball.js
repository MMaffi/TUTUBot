module.exports = {
    name: '8ball',
    execute(message, args, client) {
        if (args.length === 0) {
            return message.reply('❌ Faça uma pergunta! Ex: `!8ball Vou ganhar na loteria?`');
        }

        const respostas = [
            '🎱 Sim, definitivamente!',
            '🎱 Sem dúvida!',
            '🎱 Com certeza!',
            '🎱 Você pode contar com isso!',
            '🎱 A meu ver, sim!',
            '🎱 Muito provavelmente!',
            '🎱 Sim!',
            '🎱 Os sinais apontam que sim!',
            '🎱 Resposta nebulosa, tente novamente!',
            '🎱 Pergunte mais tarde!',
            '🎱 Melhor não te dizer agora!',
            '🎱 Não posso prever agora!',
            '🎱 Concentre-se e pergunte novamente!',
            '🎱 Não conte com isso!',
            '🎱 Minha resposta é não!',
            '🎱 Minhas fontes dizem não!',
            '🎱 A perspectiva não é boa!',
            '🎱 Muito duvidoso!'
        ];

        const resposta = respostas[Math.floor(Math.random() * respostas.length)];
        const pergunta = args.join(' ');

        const ballEmbed = {
            color: 0x5865F2,
            title: '🎱 Bola Mágica 8',
            fields: [
                {
                    name: '❓ Sua Pergunta',
                    value: pergunta,
                    inline: false
                },
                {
                    name: '📜 Resposta',
                    value: resposta,
                    inline: false
                }
            ],
            footer: {
                text: `Perguntado por: ${message.author.tag}`
            },
            timestamp: new Date().toISOString()
        };

        return message.channel.send({ embeds: [ballEmbed] });
    }
};