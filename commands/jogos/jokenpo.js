const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'jokenpo',
    execute(message, args, client) {
        startJokenpoGame(message, client);
    },

    // Handler para botões do jokenpo
    buttonHandler: async (interaction, client) => {
        if (!interaction.isButton()) return false;

        const customId = interaction.customId;
        
        if (customId.startsWith('jokenpo_choice_')) {
            await handleJokenpoChoice(interaction, client);
            return true;
        }

        if (customId === 'jokenpo_new_game') {
            await startJokenpoGame(interaction, client);
            return true;
        }

        return false;
    }
};

async function startJokenpoGame(context, client) {
    const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setTitle('✂️ Pedra, Papel e Tesoura')
        .setDescription('Escolha uma opção abaixo:')
        .addFields(
            {
                name: '📝 Como jogar',
                value: 'Clique em um dos botões para fazer sua escolha!',
                inline: false
            },
            {
                name: '🎮 Regras',
                value: '🗿 Pedra quebra tesoura\n📄 Papel embrulha pedra\n✂️ Tesoura corta papel',
                inline: true
            }
        )
        .setFooter({
            text: 'Clique em uma opção para jogar!'
        });

    const components = createJokenpoButtons();

    try {
        // Verificar se é uma interação (tem deferUpdate) ou mensagem normal
        const isInteraction = typeof context.deferUpdate === 'function';
        
        if (isInteraction) {
            // É uma interação (botão "Jogar Novamente")
            await context.deferUpdate();
            await context.editReply({ 
                embeds: [embed], 
                components 
            });
        } else {
            // É uma mensagem normal (!jokenpo)
            await context.channel.send({ 
                embeds: [embed], 
                components 
            });
        }
    } catch (error) {
        console.error('Erro ao iniciar jokenpo:', error);
    }
}

async function handleJokenpoChoice(interaction, client) {
    try {
        await interaction.deferUpdate();

        const userChoice = interaction.customId.replace('jokenpo_choice_', '');
        const options = ['pedra', 'papel', 'tesoura'];
        const botChoice = options[Math.floor(Math.random() * options.length)];

        // Verificar se a escolha do usuário é válida
        if (!options.includes(userChoice)) {
            await interaction.followUp({ 
                content: '❌ Escolha inválida!', 
                flags: 64 
            });
            return;
        }

        let result;
        let resultColor;

        if (userChoice === botChoice) {
            result = '**Empate!** 🤝';
            resultColor = 0xF1C40F; // Amarelo
        } else if (
            (userChoice === 'pedra' && botChoice === 'tesoura') ||
            (userChoice === 'papel' && botChoice === 'pedra') ||
            (userChoice === 'tesoura' && botChoice === 'papel')
        ) {
            result = '**Você ganhou!** 🎉';
            resultColor = 0x2ECC71; // Verde
        } else {
            result = '**Eu ganhei!** 🤖';
            resultColor = 0xE74C3C; // Vermelho
        }

        const emojis = {
            pedra: '🗿',
            papel: '📄',
            tesoura: '✂️'
        };

        const resultEmbed = new EmbedBuilder()
            .setColor(resultColor)
            .setTitle('✂️ Pedra, Papel e Tesoura - Resultado')
            .addFields(
                {
                    name: '👤 Sua escolha',
                    value: `${emojis[userChoice]} ${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}`,
                    inline: true
                },
                {
                    name: '🤖 Minha escolha',
                    value: `${emojis[botChoice]} ${botChoice.charAt(0).toUpperCase() + botChoice.slice(1)}`,
                    inline: true
                },
                {
                    name: '🏆 Resultado',
                    value: result,
                    inline: false
                }
            )
            .setFooter({
                text: `Jogador: ${interaction.user.tag} | Clique em "Jogar Novamente" para recomeçar`
            });

        const newGameButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('jokenpo_new_game')
                    .setLabel('🔄 Jogar Novamente')
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.editReply({ 
            embeds: [resultEmbed], 
            components: [newGameButton] 
        });

    } catch (error) {
        // Ignora erros de interação desconhecida (já processada)
        if (error.code === 10062 || error.code === 40060) {
            return;
        }
        console.error('Erro no jokenpo:', error);
        
        if (!interaction.deferred && !interaction.replied) {
            await interaction.reply({ 
                content: '❌ Erro ao processar sua jogada!', 
                flags: 64 
            });
        }
    }
}

function createJokenpoButtons() {
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('jokenpo_choice_pedra')
                .setLabel('🗿 Pedra')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('jokenpo_choice_papel')
                .setLabel('📄 Papel')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('jokenpo_choice_tesoura')
                .setLabel('✂️ Tesoura')
                .setStyle(ButtonStyle.Danger)
        );

    return [row1];
}