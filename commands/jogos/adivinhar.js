module.exports = {
    name: 'adivinhar',
    execute(message, args, client) {
        const number = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;
        const maxAttempts = 7;

        const gameEmbed = {
            color: 0xE67E22,
            title: '🎯 Adivinhe o Número',
            description: `Estou pensando em um número entre **1 e 100**!\nVocê tem **${maxAttempts}** tentativas.\n\nDigite seu palpite:`,
            footer: {
                text: `Jogador: ${message.author.tag}`
            }
        };

        message.channel.send({ embeds: [gameEmbed] }).then(gameMessage => {
            const filter = m => m.author.id === message.author.id && !isNaN(m.content);
            const collector = message.channel.createMessageCollector({ 
                filter, 
                time: 60000,
                max: maxAttempts
            });

            collector.on('collect', async m => {
                attempts++;
                const guess = parseInt(m.content);
                
                if (guess === number) {
                    const winEmbed = {
                        color: 0x2ECC71,
                        title: '🎉 Parabéns! Você acertou!',
                        description: `O número era **${number}**!\nVocê acertou em **${attempts}** tentativa(s)!`,
                        footer: {
                            text: `Jogador: ${message.author.tag}`
                        }
                    };
                    collector.stop();
                    return gameMessage.edit({ embeds: [winEmbed] });
                }

                let hint = guess < number ? '📈 MAIOR' : '📉 MENOR';
                let attemptsLeft = maxAttempts - attempts;

                const updateEmbed = {
                    color: 0xE67E22,
                    title: '🎯 Adivinhe o Número',
                    description: `Seu palpite: **${guess}**\nDica: O número é **${hint}** que ${guess}\n\nTentativas usadas: **${attempts}**\nTentativas restantes: **${attemptsLeft}**\n\nContinue digitando números:`,
                    footer: {
                        text: `Jogador: ${message.author.tag}`
                    }
                };

                await gameMessage.edit({ embeds: [updateEmbed] });

                if (attempts >= maxAttempts) {
                    collector.stop();
                    const loseEmbed = {
                        color: 0xE74C3C,
                        title: '💀 Fim de Jogo!',
                        description: `Suas tentativas acabaram!\nO número era: **${number}**\n\nTente novamente com !adivinhar`,
                        footer: {
                            text: `Jogador: ${message.author.tag}`
                        }
                    };
                    await gameMessage.edit({ embeds: [loseEmbed] });
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    const timeoutEmbed = {
                        color: 0xE74C3C,
                        title: '⏰ Tempo Esgotado!',
                        description: `O tempo acabou!\nO número era: **${number}**\n\nTente novamente com !adivinhar`,
                        footer: {
                            text: `Jogador: ${message.author.tag}`
                        }
                    };
                    gameMessage.edit({ embeds: [timeoutEmbed] });
                }
            });
        });
    }
};