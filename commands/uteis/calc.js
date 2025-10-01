const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'calc',
    execute(message, args, client) {
        if (args.length === 0) {
            // Mostrar calculadora com botões
            return showCalculator(message, client);
        }

        // Se forneceu expressão, calcular normalmente
        const expressao = args.join(' ');
        return calculateExpression(message, expressao);
    },

    // Handler para botões da calculadora
    buttonHandler: async (interaction, client) => {
        if (!interaction.isButton()) return;

        const currentEmbed = interaction.message.embeds[0];
        let currentExpression = '';
        
        // Extrair expressão atual do embed
        if (currentEmbed && currentEmbed.fields) {
            const expressionField = currentEmbed.fields.find(field => field.name === '📝 Expressão');
            if (expressionField) {
                currentExpression = expressionField.value.replace(/```/g, '').trim();
            }
        }

        let newExpression = currentExpression;
        let shouldCalculate = false;

        switch (interaction.customId) {
            case 'clear':
                newExpression = '';
                break;
            case 'backspace':
                newExpression = newExpression.slice(0, -1);
                break;
            case 'equals':
                shouldCalculate = true;
                break;
            case 'add':
                newExpression += '+';
                break;
            case 'subtract':
                newExpression += '-';
                break;
            case 'multiply':
                newExpression += '*';
                break;
            case 'divide':
                newExpression += '/';
                break;
            case 'decimal':
                newExpression += '.';
                break;
            case 'parentheses':
                newExpression += '()';
                break;
            default:
                // Números e outros botões
                if (interaction.customId.startsWith('num_')) {
                    newExpression += interaction.customId.replace('num_', '');
                }
                break;
        }

        if (shouldCalculate) {
            // Calcular resultado
            try {
                const resultado = eval(newExpression);
                
                if (isNaN(resultado) || !isFinite(resultado)) {
                    throw new Error('Resultado inválido');
                }

                const calcEmbed = {
                    color: 0x2ECC71,
                    title: '🧮 Calculadora - Resultado',
                    fields: [
                        {
                            name: '📝 Expressão',
                            value: `\`\`\`${newExpression}\`\`\``,
                            inline: false
                        },
                        {
                            name: '🎯 Resultado',
                            value: `\`\`\`${resultado}\`\`\``,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `Calculado por: ${interaction.user.tag}`
                    },
                    timestamp: new Date().toISOString()
                };

                await interaction.update({ 
                    embeds: [calcEmbed], 
                    components: createCalculatorButtons() 
                });
                return;

            } catch (error) {
                const errorEmbed = {
                    color: 0xE74C3C,
                    title: '❌ Erro na Calculadora',
                    description: `**Expressão:** \`${newExpression}\`\n\nErro: Expressão inválida!`,
                    footer: {
                        text: `Tentativa de: ${interaction.user.tag}`
                    }
                };

                await interaction.update({ 
                    embeds: [errorEmbed], 
                    components: createCalculatorButtons() 
                });
                return;
            }
        }

        // Atualizar display
        const calcEmbed = {
            color: 0x3498DB,
            title: '🧮 Calculadora Interativa',
            fields: [
                {
                    name: '📝 Expressão',
                    value: newExpression ? `\`\`\`${newExpression}\`\`\`` : '``` ```',
                    inline: false
                },
                {
                    name: '🎯 Display',
                    value: newExpression || '0',
                    inline: false
                }
            ],
            footer: {
                text: `Usando: ${interaction.user.tag} | Clique nos botões para calcular!`
            },
            timestamp: new Date().toISOString()
        };

        await interaction.update({ 
            embeds: [calcEmbed], 
            components: createCalculatorButtons() 
        });
    }
};

function showCalculator(message, client) {
    const calcEmbed = {
        color: 0x3498DB,
        title: '🧮 Calculadora Interativa',
        fields: [
            {
                name: '📝 Expressão',
                value: '``` ```',
                inline: false
            },
            {
                name: '🎯 Display',
                value: '0',
                inline: false
            }
        ],
        footer: {
            text: `Iniciado por: ${message.author.tag} | Clique nos botões para calcular!`
        },
        timestamp: new Date().toISOString()
    };

    return message.channel.send({ 
        embeds: [calcEmbed], 
        components: createCalculatorButtons() 
    });
}

function calculateExpression(message, expressao) {
    // Substituir operadores para eval seguro
    const expressaoSegura = expressao
        .replace(/[^0-9+\-*/().]/g, '')
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

    try {
        const resultado = eval(expressaoSegura);

        if (isNaN(resultado) || !isFinite(resultado)) {
            return message.reply('❌ Expressão matemática inválida!');
        }

        const calcEmbed = {
            color: 0x2ECC71,
            title: '🧮 Calculadora - Resultado',
            fields: [
                {
                    name: '📝 Expressão',
                    value: `\`\`\`${expressao}\`\`\``,
                    inline: false
                },
                {
                    name: '🎯 Resultado',
                    value: `\`\`\`${resultado}\`\`\``,
                    inline: false
                }
            ],
            footer: {
                text: `Calculado por: ${message.author.tag}`
            }
        };

        return message.channel.send({ 
            embeds: [calcEmbed], 
            components: createCalculatorButtons() 
        });
    } catch (error) {
        return message.reply('❌ Expressão matemática inválida! Use apenas números e operadores básicos (+, -, *, /, ()).');
    }
}

function createCalculatorButtons() {
    return [
        // Primeira linha: Números 7, 8, 9 e operações
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('num_7').setLabel('7').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('num_8').setLabel('8').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('num_9').setLabel('9').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('divide').setLabel('÷').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('clear').setLabel('C').setStyle(ButtonStyle.Danger)
            ),
        
        // Segunda linha: Números 4, 5, 6 e operações
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('num_4').setLabel('4').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('num_5').setLabel('5').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('num_6').setLabel('6').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('multiply').setLabel('×').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('backspace').setLabel('⌫').setStyle(ButtonStyle.Secondary)
            ),
        
        // Terceira linha: Números 1, 2, 3 e operações
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('num_1').setLabel('1').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('num_2').setLabel('2').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('num_3').setLabel('3').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('subtract').setLabel('-').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('parentheses').setLabel('( )').setStyle(ButtonStyle.Secondary)
            ),
        
        // Quarta linha: Número 0, decimal, igual e adição
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('num_0').setLabel('0').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('decimal').setLabel('.').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('equals').setLabel('=').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('add').setLabel('+').setStyle(ButtonStyle.Secondary)
            )
    ];
}