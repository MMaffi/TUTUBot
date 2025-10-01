module.exports = {
    name: 'calc',
    execute(message, args, client) {
        if (args.length === 0) {
            return message.reply('❌ Forneça uma expressão matemática! Ex: `!calc 2 + 2` ou `!calc 15 * (3 + 2)`');
        }

        const expressao = args.join(' ');

        // Substituir operadores para eval seguro
        const expressaoSegura = expressao
            .replace(/[^0-9+\-*/().]/g, '') // Remove caracteres não numéricos/operadores
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        try {
            // Avaliação segura
            const resultado = eval(expressaoSegura);

            if (isNaN(resultado) || !isFinite(resultado)) {
                return message.reply('❌ Expressão matemática inválida!');
            }

            const calcEmbed = {
                color: 0x2ECC71,
                title: '🧮 Calculadora',
                fields: [
                    {
                        name: '📝 Expressão',
                        value: `\`\`\`${expressao}\`\`\``,
                        inline: false
                    },
                    {
                        name: '🎯 Resultado',
                        value: `\`\`\`${resultado}\`\`\``,
                        inline: false
                    }
                ],
                footer: {
                    text: `Solicitado por: ${message.author.tag}`
                }
            };

            return message.channel.send({ embeds: [calcEmbed] });
        } catch (error) {
            return message.reply('❌ Expressão matemática inválida! Use apenas números e operadores básicos (+, -, *, /, ()).');
        }
    }
};