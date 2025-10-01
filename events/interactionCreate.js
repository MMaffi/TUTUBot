const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        console.log(`🔘 Botão clicado: ${interaction.customId} por ${interaction.user.tag}`);

        try {
            // Procurar o handler do botão em todos os comandos
            for (const [name, command] of client.commands) {
                if (command.buttonHandler) {
                    await command.buttonHandler(interaction, client);
                    return;
                }
            }

            // Se não encontrou handler
            await interaction.reply({ 
                content: '❌ Este botão não está funcionando.', 
                ephemeral: true 
            });

        } catch (error) {
            console.error('❌ Erro no botão:', error);
            
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ 
                    content: '❌ Erro ao processar botão!', 
                    ephemeral: true 
                });
            } else {
                await interaction.reply({ 
                    content: '❌ Erro ao processar botão!', 
                    ephemeral: true 
                });
            }
        }
    }
};