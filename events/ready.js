module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🚀 Bot ${client.user.tag} está online!`);
        console.log(`📊 Conectado em ${client.guilds.cache.size} servidores`);
        console.log(`👥 Servindo ${client.users.cache.size} usuários`);

        // Status inicial
        client.user.setPresence({
            activities: [{
                name: 'Use !ajuda para comandos!',
                type: 0 // PLAYING
            }],
            status: 'online'
        });

        // Array de status para rotacionar
        const activities = [
            { name: 'Use !ajuda para comandos!', type: 0 }, // PLAYING
            { name: `${client.users.cache.size} usuários`, type: 3 }, // WATCHING
            { name: 'comandos interativos', type: 2 }, // LISTENING
            { name: 'jogos com usuários', type: 5 }, // COMPETING
            { name: 'Desenvolvido com ❤️', type: 0 } // PLAYING
        ];

        let currentActivity = 0;

        // Rotacionar status a cada 5 minutos
        setInterval(() => {
            currentActivity = (currentActivity + 1) % activities.length;
            
            client.user.setPresence({
                activities: [activities[currentActivity]],
                status: 'online'
            });

            console.log(`🔄 Status alterado para: ${activities[currentActivity].name}`);
        }, 300000);

        console.log('🎮 Sistema de status ativado!');
    }
};