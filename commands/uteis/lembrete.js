const reminders = new Map();

module.exports = {
    name: 'lembrete',
    execute(message, args, client) {
        if (args.length < 2) {
            return message.reply('❌ Use: `!lembrete 5m Lembrar de estudar`');
        }

        const time = args[0];
        const reminderText = args.slice(1).join(' ');

        // Converter tempo para milissegundos
        let milliseconds;
        if (time.endsWith('s')) milliseconds = parseInt(time) * 1000;
        else if (time.endsWith('m')) milliseconds = parseInt(time) * 60 * 1000;
        else if (time.endsWith('h')) milliseconds = parseInt(time) * 60 * 60 * 1000;
        else return message.reply('❌ Use: s (segundos), m (minutos) ou h (horas)');

        if (milliseconds > 24 * 60 * 60 * 1000) {
            return message.reply('❌ Máximo 24 horas!');
        }

        const reminderId = Date.now().toString();
        const reminder = {
            id: reminderId,
            userId: message.author.id,
            channelId: message.channel.id,
            text: reminderText,
            time: Date.now() + milliseconds
        };

        reminders.set(reminderId, reminder);

        // Agendar lembrete
        setTimeout(() => {
            const reminder = reminders.get(reminderId);
            if (reminder) {
                message.channel.send(`🔔 **Lembrete para <@${reminder.userId}>:** ${reminder.text}`);
                reminders.delete(reminderId);
            }
        }, milliseconds);

        const embed = {
            color: 0x00FF00,
            title: '⏰ Lembrete Agendado',
            fields: [
                { name: '📝 Lembrete', value: reminderText, inline: false },
                { name: '⏱️ Tempo', value: time, inline: true },
                { name: '👤 Usuário', value: message.author.tag, inline: true }
            ],
            footer: { text: `ID: ${reminderId}` }
        };

        message.channel.send({ embeds: [embed] });
    }
};