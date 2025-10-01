module.exports = {
    name: 'limpar',
    execute(message, args, client) {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('❌ Você não tem permissão para usar este comando!');
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('❌ Por favor, especifique um número entre 1 e 100!');
        }

        message.channel.bulkDelete(amount, true).then(messages => {
            const logEmbed = {
                color: 65280,
                title: '🗑️ Mensagens Deletadas',
                fields: [
                    {
                        name: 'Moderador',
                        value: `${message.author.tag}`,
                        inline: true
                    },
                    {
                        name: 'Quantidade',
                        value: `${messages.size} mensagens`,
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString()
            };

            return message.channel.send({ embeds: [logEmbed] });
        }).catch(error => {
            console.error(error);
            return message.reply('❌ Erro ao deletar mensagens!');
        });
    }
};