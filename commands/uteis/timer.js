module.exports = {
    name: 'timer',
    execute(message, args, client) {
        if (args.length === 0) {
            return message.reply('❌ Especifique o tempo! Ex: `!timer 30s` ou `!timer 5m`');
        }

        const tempo = args[0];
        const unidade = tempo.slice(-1).toLowerCase();
        const valor = parseInt(tempo.slice(0, -1));

        if (isNaN(valor) || valor <= 0) {
            return message.reply('❌ Tempo inválido! Use formato como: 30s, 5m, 1h');
        }

        let milissegundos;
        switch (unidade) {
            case 's':
                milissegundos = valor * 1000;
                break;
            case 'm':
                milissegundos = valor * 60 * 1000;
                break;
            case 'h':
                milissegundos = valor * 60 * 60 * 1000;
                break;
            default:
                return message.reply('❌ Unidade inválida! Use: s (segundos), m (minutos), h (horas)');
        }

        if (milissegundos > 24 * 60 * 60 * 1000) {
            return message.reply('❌ O timer não pode ser maior que 24 horas!');
        }

        const timerEmbed = {
            color: 0xF1C40F,
            title: '⏰ Timer Iniciado',
            description: `Timer definido para **${tempo}**\nVou te avisar quando o tempo acabar!`,
            footer: {
                text: `Solicitado por: ${message.author.tag}`
            }
        };

        message.channel.send({ embeds: [timerEmbed] }).then(() => {
            setTimeout(() => {
                const alertEmbed = {
                    color: 0xE74C3C,
                    title: '🔔 Timer Concluído!',
                    description: `⏰ **${tempo}** se passaram!\n${message.author}`,
                    footer: {
                        text: 'Timer finalizado'
                    }
                };

                message.channel.send({ embeds: [alertEmbed] });
            }, milissegundos);
        });
    }
};