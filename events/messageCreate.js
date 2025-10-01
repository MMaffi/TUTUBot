require('dotenv').config();

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignorar mensagens de outros bots
        if (message.author.bot) return;
        
        const prefix = process.env.PREFIX || '!';
        
        // Verificar se a mensagem começa com o prefixo
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        console.log(`📨 Comando recebido: ${commandName} por ${message.author.tag}`);

        // Buscar o comando
        const command = client.commands.get(commandName);

        if (!command) {
            return message.reply(`❌ Comando não encontrado! Use **${prefix}ajuda** para ver os comandos disponíveis.`);
        }

        try {
            await command.execute(message, args, client);
            console.log(`✅ Comando executado: ${commandName}`);
        } catch (error) {
            console.error(`❌ Erro no comando ${commandName}:`, error);
            await message.reply('❌ Ocorreu um erro ao executar este comando!');
        }
    }
};