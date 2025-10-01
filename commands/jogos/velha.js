const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'velha',
    execute(message, args, client) {
        // Iniciar novo jogo
        startNewGame(message, client);
    },

    // Handler para botões do jogo da velha
    buttonHandler: async (interaction, client) => {
        if (!interaction.isButton()) return;

        const customId = interaction.customId;
        
        if (customId === 'new_game') {
            // Iniciar novo jogo
            return startNewGame(interaction, client);
        }

        if (customId.startsWith('cell_')) {
            // Jogada em uma célula
            return handleMove(interaction, client);
        }
    }
};

// Armazenar jogos ativos
const activeGames = new Map();

function startNewGame(context, client) {
    const gameId = context.channel?.id || context.guild?.id;
    
    const gameState = {
        board: [
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜']
        ],
        currentPlayer: '❌',
        gameActive: true,
        players: [context.author?.id || context.user?.id],
        message: null
    };

    activeGames.set(gameId, gameState);

    const embed = createGameEmbed(gameState);
    const components = createGameButtons(gameState);

    const sendPromise = context.reply ? 
        context.reply({ embeds: [embed], components }) :
        context.channel.send({ embeds: [embed], components });

    sendPromise.then(message => {
        gameState.message = message;
        activeGames.set(gameId, gameState);
    });
}

function handleMove(interaction, client) {
    const gameId = interaction.channel.id;
    const gameState = activeGames.get(gameId);

    if (!gameState || !gameState.gameActive) {
        return interaction.reply({ 
            content: '❌ Jogo não encontrado ou já terminou!', 
            ephemeral: true 
        });
    }

    // Verificar se é a vez do jogador
    if (!gameState.players.includes(interaction.user.id)) {
        return interaction.reply({ 
            content: '❌ Não é sua vez! Aguarde o outro jogador.', 
            ephemeral: true 
        });
    }

    const [_, row, col] = interaction.customId.split('_').map(Number);
    
    // Verificar se a célula está vazia
    if (gameState.board[row][col] !== '⬜') {
        return interaction.reply({ 
            content: '❌ Posição já ocupada!', 
            ephemeral: true 
        });
    }

    // Fazer jogada
    gameState.board[row][col] = gameState.currentPlayer;

    // Verificar vitória
    const winner = checkWinner(gameState.board);
    if (winner) {
        gameState.gameActive = false;
        const embed = createGameEmbed(gameState, `🎉 **${winner} VENCEU!**`);
        embed.color = 0xFFD700;
        
        return interaction.update({ 
            embeds: [embed], 
            components: createGameButtons(gameState, true) 
        });
    }

    // Verificar empate
    if (isBoardFull(gameState.board)) {
        gameState.gameActive = false;
        const embed = createGameEmbed(gameState, '🤝 **EMPATE!**');
        embed.color = 0x808080;
        
        return interaction.update({ 
            embeds: [embed], 
            components: createGameButtons(gameState, true) 
        });
    }

    // Trocar jogador
    gameState.currentPlayer = gameState.currentPlayer === '❌' ? '⭕' : '❌';

    // Adicionar segundo jogador se necessário
    if (gameState.players.length === 1) {
        gameState.players.push(interaction.user.id);
    }

    const embed = createGameEmbed(gameState);
    
    interaction.update({ 
        embeds: [embed], 
        components: createGameButtons(gameState) 
    });
}

function createGameEmbed(gameState, resultText = '') {
    const boardDisplay = gameState.board.map(row => row.join('')).join('\n');
    
    const embed = {
        color: 0x00FF00,
        title: '🎮 Jogo da Velha' + (resultText ? ' - FIM' : ''),
        description: resultText ? 
            `${resultText}\n\n${boardDisplay}` :
            `**Jogador atual:** ${gameState.currentPlayer}\n\n${boardDisplay}`,
        fields: []
    };

    if (!resultText) {
        embed.fields.push({
            name: '📝 Como jogar',
            value: 'Clique nos botões para jogar! ❌ = Primeiro jogador, ⭕ = Segundo jogador',
            inline: false
        });
        
        if (gameState.players.length === 1) {
            embed.fields.push({
                name: '👥 Jogadores',
                value: `❌ <@${gameState.players[0]}>\n⭕ *Aguardando segundo jogador...*`,
                inline: true
            });
        } else {
            embed.fields.push({
                name: '👥 Jogadores',
                value: `❌ <@${gameState.players[0]}>\n⭕ <@${gameState.players[1]}>`,
                inline: true
            });
        }
    } else {
        embed.fields.push({
            name: '🏆 Resultado Final',
            value: resultText,
            inline: false
        });
    }

    embed.fields.push({
        name: '🔄 Controles',
        value: 'Use `!velha` para novo jogo',
        inline: true
    });

    return embed;
}

function createGameButtons(gameState, gameEnded = false) {
    const rows = [];

    // Botões do tabuleiro
    for (let row = 0; row < 3; row++) {
        const actionRow = new ActionRowBuilder();
        
        for (let col = 0; col < 3; col++) {
            const cellValue = gameState.board[row][col];
            const button = new ButtonBuilder()
                .setCustomId(`cell_${row}_${col}`)
                .setLabel(cellValue === '⬜' ? '‎' : cellValue) // Espaço invisível para células vazias
                .setStyle(getButtonStyle(cellValue))
                .setDisabled(gameEnded || cellValue !== '⬜');

            actionRow.addComponents(button);
        }
        
        rows.push(actionRow);
    }

    // Botão para novo jogo
    if (gameEnded) {
        const newGameRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('new_game')
                    .setLabel('🔄 Novo Jogo')
                    .setStyle(ButtonStyle.Success)
            );
        rows.push(newGameRow);
    }

    return rows;
}

function getButtonStyle(cellValue) {
    switch (cellValue) {
        case '❌':
            return ButtonStyle.Danger;
        case '⭕':
            return ButtonStyle.Primary;
        default:
            return ButtonStyle.Secondary;
    }
}

function checkWinner(board) {
    // Linhas
    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== '⬜' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0];
        }
    }

    // Colunas
    for (let i = 0; i < 3; i++) {
        if (board[0][i] !== '⬜' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            return board[0][i];
        }
    }

    // Diagonais
    if (board[0][0] !== '⬜' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] !== '⬜' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }

    return null;
}

function isBoardFull(board) {
    return board.flat().every(cell => cell !== '⬜');
}