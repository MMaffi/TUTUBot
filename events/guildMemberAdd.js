const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client) {
        console.log(`👋 Novo membro: ${member.user.tag}`);
        
        // Procurar pelo handler de membros nos comandos
        for (const [name, command] of client.commands) {
            if (command.memberEventHandler) {
                await command.memberEventHandler(member, 'join', client);
                break;
            }
        }
    }
};