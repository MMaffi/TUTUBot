module.exports = {
    name: 'quiz',
    execute(message, args, client) {
        const quizzes = [
            {
                pergunta: "Qual é a capital do Brasil?",
                opcoes: ["A) Rio de Janeiro", "B) São Paulo", "C) Brasília", "D) Salvador"],
                resposta: "C"
            },
            {
                pergunta: "Quantos lados tem um hexágono?",
                opcoes: ["A) 4", "B) 5", "C) 6", "D) 7"],
                resposta: "C"
            }
            // Adicione mais perguntas aqui...
        ];

        const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        let timeLeft = 30;

        const quizEmbed = {
            color: 0x3498DB,
            title: '❓ Quiz do TUTU Bot',
            description: `**${quiz.pergunta}**\n\n${quiz.opcoes.join('\n')}\n\n⏰ Tempo: **${timeLeft}s**`,
            footer: {
                text: `Responda com A, B, C ou D | Jogador: ${message.author.tag}`
            }
        };

        message.channel.send({ embeds: [quizEmbed] }).then(quizMessage => {
            const timer = setInterval(async () => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    const timeoutEmbed = {
                        color: 0xE74C3C,
                        title: '⏰ Tempo Esgotado!',
                        description: `A resposta correta era: **${quiz.resposta}**\n\nUse !quiz para jogar novamente!`,
                        footer: {
                            text: `Jogador: ${message.author.tag}`
                        }
                    };
                    return quizMessage.edit({ embeds: [timeoutEmbed] });
                }

                const updatedEmbed = {
                    color: 0x3498DB,
                    title: '❓ Quiz do TUTU Bot',
                    description: `**${quiz.pergunta}**\n\n${quiz.opcoes.join('\n')}\n\n⏰ Tempo: **${timeLeft}s**`,
                    footer: {
                        text: `Responda com A, B, C ou D | Jogador: ${message.author.tag}`
                    }
                };
                await quizMessage.edit({ embeds: [updatedEmbed] });
            }, 1000);

            const filter = m => m.author.id === message.author.id && 
                               ['a', 'b', 'c', 'd'].includes(m.content.toLowerCase());
            const collector = message.channel.createMessageCollector({ 
                filter, 
                time: 30000,
                max: 1
            });

            collector.on('collect', async m => {
                clearInterval(timer);
                const userAnswer = m.content.toUpperCase();
                
                if (userAnswer === quiz.resposta) {
                    const winEmbed = {
                        color: 0x2ECC71,
                        title: '🎉 Resposta Correta!',
                        description: `Parabéns ${message.author}! 🎊\n\n**Pergunta:** ${quiz.pergunta}\n**Sua resposta:** ${userAnswer} ✅`,
                        footer: {
                            text: `Jogador: ${message.author.tag}`
                        }
                    };
                    await quizMessage.edit({ embeds: [winEmbed] });
                } else {
                    const loseEmbed = {
                        color: 0xE74C3C,
                        title: '❌ Resposta Incorreta',
                        description: `**Sua resposta:** ${userAnswer} ❌\n**Resposta correta:** ${quiz.resposta}`,
                        footer: {
                            text: `Jogador: ${message.author.tag}`
                        }
                    };
                    await quizMessage.edit({ embeds: [loseEmbed] });
                }
            });
        });
    }
};