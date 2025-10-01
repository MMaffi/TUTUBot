const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'quiz',
    execute(message, args, client) {
        startNewQuiz(message, client);
    },

    // Handler para botões do quiz
    buttonHandler: async (interaction, client) => {
        if (!interaction.isButton()) return;

        const customId = interaction.customId;

        if (customId === 'quiz_new') {
            return startNewQuiz(interaction, client);
        }

        if (customId.startsWith('quiz_')) {
            return handleQuizAnswer(interaction, client);
        }
    }
};

// Armazenar quizzes ativos
const activeQuizzes = new Map();

// Banco de perguntas MUITO maior
const quizzes = [
    {
        pergunta: "Qual é a capital do Brasil?",
        opcoes: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
        resposta: 2,
        categoria: "Geografia"
    },
    {
        pergunta: "Quantos lados tem um hexágono?",
        opcoes: ["4", "5", "6", "7"],
        resposta: 2,
        categoria: "Matemática"
    },
    {
        pergunta: "Qual planeta é conhecido como Planeta Vermelho?",
        opcoes: ["Vênus", "Marte", "Júpiter", "Saturno"],
        resposta: 1,
        categoria: "Astronomia"
    },
    {
        pergunta: "Quem pintou a Mona Lisa?",
        opcoes: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Monet"],
        resposta: 2,
        categoria: "Arte"
    },
    {
        pergunta: "Qual é o maior oceano do mundo?",
        opcoes: ["Atlântico", "Índico", "Ártico", "Pacífico"],
        resposta: 3,
        categoria: "Geografia"
    },
    {
        pergunta: "Em que ano o homem pisou na Lua pela primeira vez?",
        opcoes: ["1965", "1969", "1972", "1975"],
        resposta: 1,
        categoria: "História"
    },
    {
        pergunta: "Qual é o elemento químico representado por 'O'?",
        opcoes: ["Ouro", "Oxigênio", "Ósmio", "Oganésson"],
        resposta: 1,
        categoria: "Ciência"
    },
    {
        pergunta: "Quantos ossos tem o corpo humano adulto?",
        opcoes: ["186", "206", "226", "246"],
        resposta: 1,
        categoria: "Biologia"
    },
    {
        pergunta: "Qual é o país mais populoso do mundo?",
        opcoes: ["Índia", "Estados Unidos", "China", "Indonésia"],
        resposta: 2,
        categoria: "Geografia"
    },
    {
        pergunta: "Quem escreveu 'Dom Quixote'?",
        opcoes: ["Miguel de Cervantes", "William Shakespeare", "Friedrich Nietzsche", "Machado de Assis"],
        resposta: 0,
        categoria: "Literatura"
    },
    {
        pergunta: "Qual é a velocidade da luz no vácuo?",
        opcoes: ["300.000 km/s", "150.000 km/s", "450.000 km/s", "600.000 km/s"],
        resposta: 0,
        categoria: "Física"
    },
    {
        pergunta: "Em que continente fica o Egito?",
        opcoes: ["Ásia", "Europa", "África", "América do Sul"],
        resposta: 2,
        categoria: "Geografia"
    },
    {
        pergunta: "Qual é a linguagem de programação mais usada para web?",
        opcoes: ["Python", "Java", "JavaScript", "C++"],
        resposta: 2,
        categoria: "Tecnologia"
    },
    {
        pergunta: "Quantas cordas tem um violão tradicional?",
        opcoes: ["4", "5", "6", "7"],
        resposta: 2,
        categoria: "Música"
    },
    {
        pergunta: "Qual é o animal mais rápido do mundo?",
        opcoes: ["Guepardo", "Falcão-peregrino", "Antílope", "Leopardo"],
        resposta: 1,
        categoria: "Biologia"
    },
    {
        pergunta: "Em que ano começou a Segunda Guerra Mundial?",
        opcoes: ["1937", "1939", "1941", "1943"],
        resposta: 1,
        categoria: "História"
    },
    {
        pergunta: "Qual é a montanha mais alta do mundo?",
        opcoes: ["K2", "Monte Everest", "Monte Kilimanjaro", "Monte McKinley"],
        resposta: 1,
        categoria: "Geografia"
    },
    {
        pergunta: "Quantos elementos tem a tabela periódica?",
        opcoes: ["108", "118", "128", "138"],
        resposta: 1,
        categoria: "Química"
    },
    {
        pergunta: "Qual é o maior mamífero do mundo?",
        opcoes: ["Elefante africano", "Girafa", "Baleia-azul", "Urso-polar"],
        resposta: 2,
        categoria: "Biologia"
    },
    {
        pergunta: "Quem descobriu o Brasil?",
        opcoes: ["Cristóvão Colombo", "Pedro Álvares Cabral", "Vasco da Gama", "Fernão de Magalhães"],
        resposta: 1,
        categoria: "História"
    }
];

function startNewQuiz(context, client) {
    const quizId = context.channel?.id || context.guild?.id;
    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    
    const quizState = {
        quiz: quiz,
        timeLeft: 30,
        answered: false,
        message: null,
        player: context.author?.id || context.user?.id,
        playerName: context.author?.tag || context.user?.tag
    };

    activeQuizzes.set(quizId, quizState);

    const embed = createQuizEmbed(quizState);
    const components = createQuizButtons(quizState);

    const sendPromise = context.reply ? 
        context.reply({ embeds: [embed], components }) :
        context.channel.send({ embeds: [embed], components });

    sendPromise.then(message => {
        quizState.message = message;
        activeQuizzes.set(quizId, quizState);
        
        // Iniciar timer
        startQuizTimer(quizId, client);
    });
}

function handleQuizAnswer(interaction, client) {
    const quizId = interaction.channel.id;
    const quizState = activeQuizzes.get(quizId);

    if (!quizState || quizState.answered) {
        return interaction.reply({ 
            content: '❌ Quiz não encontrado ou já respondido!', 
            ephemeral: true 
        });
    }

    const answerIndex = parseInt(interaction.customId.split('_')[1]);
    const isCorrect = answerIndex === quizState.quiz.resposta;
    
    quizState.answered = true;
    quizState.userAnswer = answerIndex;
    quizState.correct = isCorrect;

    const embed = createResultEmbed(quizState);
    const components = createResultButtons();

    interaction.update({ 
        embeds: [embed], 
        components 
    });

    // Remover quiz da memória após um tempo
    setTimeout(() => {
        activeQuizzes.delete(quizId);
    }, 30000);
}

function startQuizTimer(quizId, client) {
    const timer = setInterval(() => {
        const quizState = activeQuizzes.get(quizId);
        
        if (!quizState || quizState.answered) {
            clearInterval(timer);
            return;
        }

        quizState.timeLeft--;

        if (quizState.timeLeft <= 0) {
            clearInterval(timer);
            quizState.answered = true;
            
            const embed = createTimeoutEmbed(quizState);
            const components = createResultButtons();
            
            if (quizState.message) {
                quizState.message.edit({ 
                    embeds: [embed], 
                    components 
                });
            }
            
            setTimeout(() => {
                activeQuizzes.delete(quizId);
            }, 30000);
            return;
        }

        // Atualizar embed com tempo
        const embed = createQuizEmbed(quizState);
        if (quizState.message) {
            quizState.message.edit({ 
                embeds: [embed], 
                components: createQuizButtons(quizState) 
            });
        }
    }, 1000);
}

function createQuizEmbed(quizState) {
    const letters = ['A', 'B', 'C', 'D'];
    const optionsText = quizState.quiz.opcoes.map((opcao, index) => 
        `${letters[index]}) ${opcao}`
    ).join('\n');

    return {
        color: 0x3498DB,
        title: '🧠 Quiz do TUTU Bot',
        description: `**${quizState.quiz.pergunta}**\n\n${optionsText}`,
        fields: [
            {
                name: '⏰ Tempo Restante',
                value: `**${quizState.timeLeft}s**`,
                inline: true
            },
            {
                name: '📚 Categoria',
                value: quizState.quiz.categoria,
                inline: true
            },
            {
                name: '👤 Jogador',
                value: quizState.playerName,
                inline: true
            }
        ],
        footer: {
            text: 'Clique nos botões para responder!'
        },
        timestamp: new Date().toISOString()
    };
}

function createQuizButtons(quizState) {
    const letters = ['A', 'B', 'C', 'D'];
    const rows = [];

    // Primeira linha: A e B
    const row1 = new ActionRowBuilder();
    for (let i = 0; i < 2; i++) {
        row1.addComponents(
            new ButtonBuilder()
                .setCustomId(`quiz_${i}`)
                .setLabel(letters[i])
                .setStyle(ButtonStyle.Primary)
                .setDisabled(quizState.answered)
        );
    }
    rows.push(row1);

    // Segunda linha: C e D
    const row2 = new ActionRowBuilder();
    for (let i = 2; i < 4; i++) {
        row2.addComponents(
            new ButtonBuilder()
                .setCustomId(`quiz_${i}`)
                .setLabel(letters[i])
                .setStyle(ButtonStyle.Primary)
                .setDisabled(quizState.answered)
        );
    }
    rows.push(row2);

    return rows;
}

function createResultEmbed(quizState) {
    const letters = ['A', 'B', 'C', 'D'];
    const userAnswer = letters[quizState.userAnswer];
    const correctAnswer = letters[quizState.quiz.resposta];
    
    const optionsText = quizState.quiz.opcoes.map((opcao, index) => {
        let prefix = `${letters[index]}) `;
        if (index === quizState.quiz.resposta) {
            prefix = `✅ ${letters[index]}) `;
        } else if (index === quizState.userAnswer) {
            prefix = `❌ ${letters[index]}) `;
        }
        return prefix + opcao;
    }).join('\n');

    return {
        color: quizState.correct ? 0x2ECC71 : 0xE74C3C,
        title: quizState.correct ? '🎉 Resposta Correta!' : '❌ Resposta Incorreta',
        description: `**${quizState.quiz.pergunta}**\n\n${optionsText}`,
        fields: [
            {
                name: '📊 Resultado',
                value: quizState.correct ? 
                    `✅ **Correto!** Você acertou!` : 
                    `❌ **Incorreto!** Você escolheu: ${userAnswer}`,
                inline: false
            },
            {
                name: '📚 Categoria',
                value: quizState.quiz.categoria,
                inline: true
            },
            {
                name: '👤 Jogador',
                value: quizState.playerName,
                inline: true
            },
            {
                name: '🏆 Pontuação',
                value: quizState.correct ? '+10 pontos!' : '+0 pontos',
                inline: true
            }
        ],
        footer: {
            text: quizState.correct ? 'Parabéns! 🎊' : 'Tente novamente!'
        },
        timestamp: new Date().toISOString()
    };
}

function createTimeoutEmbed(quizState) {
    const letters = ['A', 'B', 'C', 'D'];
    const correctAnswer = letters[quizState.quiz.resposta];
    
    const optionsText = quizState.quiz.opcoes.map((opcao, index) => {
        let prefix = `${letters[index]}) `;
        if (index === quizState.quiz.resposta) {
            prefix = `✅ ${letters[index]}) `;
        }
        return prefix + opcao;
    }).join('\n');

    return {
        color: 0xF39C12,
        title: '⏰ Tempo Esgotado!',
        description: `**${quizState.quiz.pergunta}**\n\n${optionsText}`,
        fields: [
            {
                name: '📊 Resultado',
                value: `⏰ **Tempo esgotado!** A resposta correta era: **${correctAnswer}**`,
                inline: false
            },
            {
                name: '📚 Categoria',
                value: quizState.quiz.categoria,
                inline: true
            },
            {
                name: '👤 Jogador',
                value: quizState.playerName,
                inline: true
            }
        ],
        footer: {
            text: 'Mais rápido na próxima!'
        },
        timestamp: new Date().toISOString()
    };
}

function createResultButtons() {
    return [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('quiz_new')
                    .setLabel('🔄 Novo Quiz')
                    .setStyle(ButtonStyle.Success)
            )
    ];
}