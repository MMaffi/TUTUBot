module.exports = {
    name: 'piada',
    execute(message, args, client) {
        const piadas = [
            {
                pergunta: "Por que o Python não gosta de natureza?",
                resposta: "Porque ele prefere ficar no seu jardim (garden)."
            },
            {
                pergunta: "Qual é o café mais perigoso do mundo?",
                resposta: "O ex-presso!"
            },
            {
                pergunta: "Por que o JavaScript foi ao psicólogo?",
                resposta: "Porque tinha problemas de undefined!"
            },
            {
                pergunta: "O que um código disse para o outro?",
                resposta: "Você me completa!"
            },
            {
                pergunta: "Por que o bot foi preso?",
                resposta: "Porque estava dando muito reply!"
            }
        ];

        const piada = piadas[Math.floor(Math.random() * piadas.length)];
        
        message.channel.send(`**${piada.pergunta}**`).then(msg => {
            setTimeout(() => {
                msg.reply(`🎭 ${piada.resposta}`);
            }, 3000);
        });
    }
};