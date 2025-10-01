module.exports = {
    name: 'forca',
    execute(message, args, client) {
        const palavras = ['javascript', 'discord', 'bot', 'programacao', 'computador', 'teclado', 'internet'];
        const palavra = palavras[Math.floor(Math.random() * palavras.length)];
        let letrasDescobertas = Array(palavra.length).fill('_');
        let tentativas = 6;
        let letrasUsadas = [];

        const boneco = [
            '  ╔═════╗\n  ║     ☻\n  ║    /|\\\n  ║    / \\\n  ║\n══╩══',
            '  ╔═════╗\n  ║     ☻\n  ║    /|\\\n  ║    /\n  ║\n══╩══',
            '  ╔═════╗\n  ║     ☻\n  ║    /|\\\n  ║\n  ║\n══╩══',
            '  ╔═════╗\n  ║     ☻\n  ║    /|\n  ║\n  ║\n══╩══',
            '  ╔═════╗\n  ║     ☻\n  ║     |\n  ║\n  ║\n══╩══',
            '  ╔═════╗\n  ║     ☻\n  ║\n  ║\n  ║\n══╩══',
            '  ╔═════╗\n  ║\n  ║\n  ║\n  ║\n══╩══'
        ];

        const jogoEmbed = {
            color: 0x3498DB,
            title: '🎯 Jogo da Forca',
            description: `\`\`\`${boneco[tentativas]}\`\`\``,
            fields: [
                {
                    name: '📝 Palavra',
                    value: `\`${letrasDescobertas.join(' ')}\``,
                    inline: false
                },
                {
                    name: '💀 Tentativas Restantes',
                    value: tentativas.toString(),
                    inline: true
                },
                {
                    name: '🔤 Letras Usadas',
                    value: letrasUsadas.join(', ') || 'Nenhuma',
                    inline: true
                }
            ],
            footer: {
                text: `Jogador: ${message.author.tag} | Digite uma letra!`
            }
        };

        message.channel.send({ embeds: [jogoEmbed] }).then(gameMessage => {
            const filter = m => m.author.id === message.author.id && 
                               m.content.length === 1 && 
                               /[a-z]/.test(m.content.toLowerCase());

            const collector = message.channel.createMessageCollector({ 
                filter, 
                time: 120000 // 2 minutos
            });

            collector.on('collect', async m => {
                const letra = m.content.toLowerCase();

                if (letrasUsadas.includes(letra)) {
                    await message.channel.send('❌ Você já tentou esta letra!');
                    return;
                }

                letrasUsadas.push(letra);

                if (palavra.includes(letra)) {
                    // Revela a letra na palavra
                    for (let i = 0; i < palavra.length; i++) {
                        if (palavra[i] === letra) {
                            letrasDescobertas[i] = letra;
                        }
                    }
                } else {
                    tentativas--;
                }

                // Atualiza embed
                const updatedEmbed = {
                    color: tentativas > 2 ? 0x3498DB : 0xE74C3C,
                    title: '🎯 Jogo da Forca',
                    description: `\`\`\`${boneco[tentativas]}\`\`\``,
                    fields: [
                        {
                            name: '📝 Palavra',
                            value: `\`${letrasDescobertas.join(' ')}\``,
                            inline: false
                        },
                        {
                            name: '💀 Tentativas Restantes',
                            value: tentativas.toString(),
                            inline: true
                        },
                        {
                            name: '🔤 Letras Usadas',
                            value: letrasUsadas.join(', ') || 'Nenhuma',
                            inline: true
                        }
                    ],
                    footer: {
                        text: `Jogador: ${message.author.tag} | Digite uma letra!`
                    }
                };

                await gameMessage.edit({ embeds: [updatedEmbed] });

                // Verifica vitória
                if (!letrasDescobertas.includes('_')) {
                    collector.stop();
                    const winEmbed = {
                        color: 0x2ECC71,
                        title: '🎉 Parabéns! Você venceu!',
                        description: `A palavra era: **${palavra}**`,
                        footer: {
                            text: `Jogador: ${message.author.tag}`
                        }
                    };
                    return gameMessage.edit({ embeds: [winEmbed] });
                }

                // Verifica derrota
                if (tentativas <= 0) {
                    collector.stop();
                    const loseEmbed = {
                        color: 0xE74C3C,
                        title: '💀 Fim de Jogo!',
                        description: `A palavra era: **${palavra}**`,
                        footer: {
                            text: `Jogador: ${message.author.tag}`
                        }
                    };
                    return gameMessage.edit({ embeds: [loseEmbed] });
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    const timeoutEmbed = {
                        color: 0xE74C3C,
                        title: '⏰ Tempo Esgotado!',
                        description: `A palavra era: **${palavra}**`,
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