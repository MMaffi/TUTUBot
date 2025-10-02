const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member, client) {
        console.log(`👋 Membro saiu: ${member.user.tag}`);
        
        // Procurar pelo handler de membros nos comandos
        for (const [name, command] of client.commands) {
            if (command.memberEventHandler) {
                await command.memberEventHandler(member, 'leave', client);
                break;
            }
        }
    }
};