module.exports = {
    name: 'jokenpo',
    execute(message, args, client) {
        const options = ['pedra', 'papel', 'tesoura'];
        const botChoice = options[Math.floor(Math.random() * options.length)];

        if (!args[0]) {
            const helpEmbed = {
                color: 0xF1C40F,
                title: '✂️ Pedra, Papel e Tesoura',
                description: 'Escolha: `pedra`, `papel` ou `tesoura`\n\n**Exemplo:** `!jokenpo pedra`',
                fields: [
                    {
                        name: 'Regras',
                        value: '🗿 Pedra quebra tesoura\n📄 Papel embrulha pedra\n✂️ Tesoura corta papel',
                        inline: true
                    }
                ]
            };
            return message.channel.send({ embeds: [helpEmbed] });
        }

        const userChoice = args[0].toLowerCase();
        
        if (!options.includes(userChoice)) {
            return message.reply('❌ Escolha inválida! Use: `pedra`, `papel` ou `tesoura`');
        }

        let result;
        if (userChoice === botChoice) {
            result = '**Empate!** 🤝';
        } else if (
            (userChoice === 'pedra' && botChoice === 'tesoura') ||
            (userChoice === 'papel' && botChoice === 'pedra') ||
            (userChoice === 'tesoura' && botChoice === 'papel')
        ) {
            result = '**Você ganhou!** 🎉';
        } else {
            result = '**Eu ganhei!** 🤖';
        }

        const emojis = {
            pedra: '🗿',
            papel: '📄',
            tesoura: '✂️'
        };

        const jokenpoEmbed = {
            color: result.includes('ganhou') ? 0x2ECC71 : result.includes('Empate') ? 0xF1C40F : 0xE74C3C,
            title: '✂️ Pedra, Papel e Tesoura',
            fields: [
                {
                    name: '👤 Sua escolha',
                    value: `${emojis[userChoice]} ${userChoice}`,
                    inline: true
                },
                {
                    name: '🤖 Minha escolha',
                    value: `${emojis[botChoice]} ${botChoice}`,
                    inline: true
                },
                {
                    name: '🏆 Resultado',
                    value: result,
                    inline: false
                }
            ],
            footer: {
                text: `Jogador: ${message.author.tag}`
            }
        };

        return message.channel.send({ embeds: [jokenpoEmbed] });
    }
};