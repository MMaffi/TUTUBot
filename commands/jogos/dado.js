module.exports = {
    name: 'dado',
    execute(message, args, client) {
        const sides = args[0] ? parseInt(args[0]) : 6;
        
        if (isNaN(sides) || sides < 2 || sides > 100) {
            return message.reply('❌ Por favor, especifique um número válido de lados (2-100)!');
        }

        const result = Math.floor(Math.random() * sides) + 1;
        return message.reply(`🎲 ${message.author} rolou um D${sides} e tirou **${result}**!`);
    }
};