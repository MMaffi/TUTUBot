module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🚀 Bot ${client.user.tag} está online!`);
        console.log(`📊 Conectado em ${client.guilds.cache.size} servidores`);
        console.log(`👥 Servindo ${client.users.cache.size} usuários`);

        // Definir status do bot
        client.user.setPresence({
            activities: [{
                name: 'Use !ajuda para comandos!',
                type: 0 // PLAYING
            }],
            status: 'online'
        });

        console.log(`🎯 Bot configurado com comandos de prefixo '!'`);
    }
};