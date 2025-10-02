const { Events } = require('discord.js');

// Configuração de logging
const LOG_LEVEL = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4
};

const CURRENT_LOG_LEVEL = LOG_LEVEL.INFO;

function log(level, message) {
    if (level <= CURRENT_LOG_LEVEL) {
        const prefixes = {
            [LOG_LEVEL.ERROR]: '❌',
            [LOG_LEVEL.WARN]: '⚠️',
            [LOG_LEVEL.INFO]: '🔘',
            [LOG_LEVEL.DEBUG]: '🐛'
        };
        console.log(`${prefixes[level] || ''} ${message}`);
    }
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

        log(LOG_LEVEL.INFO, `Interação: ${interaction.customId} por ${interaction.user.tag}`);

        try {
            let handlerFound = false;
            let handlerName = '';
            
            for (const [name, command] of client.commands) {
                if (command.buttonHandler) {
                    try {
                        const found = await command.buttonHandler(interaction, client);
                        if (found) {
                            handlerFound = true;
                            handlerName = name;
                            break;
                        }
                    } catch (error) {
                        if (error.code === 10062 || error.code === 40060) {
                            handlerFound = true;
                            handlerName = name;
                            break;
                        }
                        throw error;
                    }
                }
            }

            if (!handlerFound) {
                if (!interaction.deferred && !interaction.replied) {
                    await interaction.reply({ 
                        content: '❌ Esta interação não está funcionando.', 
                        flags: 64 
                    });
                    log(LOG_LEVEL.WARN, `Handler não encontrado para: ${interaction.customId}`);
                }
            } else {
                log(LOG_LEVEL.DEBUG, `Handler executado: ${handlerName}`);
            }

        } catch (error) {
            if ([10062, 40060].includes(error.code)) {
                return;
            }

            log(LOG_LEVEL.ERROR, `Erro na interação ${interaction.customId}: ${error.message}`);
            
            if (!interaction.deferred && !interaction.replied) {
                try {
                    await interaction.reply({ 
                        content: '❌ Erro ao processar interação!', 
                        flags: 64 
                    });
                } catch (replyError) {
                    // Silencia erro de reply falho
                }
            }
        }
    }
};