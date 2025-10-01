const axios = require('axios');

module.exports = {
    name: 'meme',
    execute(message, args, client) {
        const subreddits = ['dankmemes', 'memes', 'wholesomememes', 'me_irl'];
        const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

        axios.get(`https://meme-api.com/gimme/${subreddit}`)
            .then(response => {
                const meme = response.data;
                const memeEmbed = {
                    color: 0xFF9900,
                    title: meme.title,
                    url: meme.postLink,
                    image: { url: meme.url },
                    footer: {
                        text: `👍 ${meme.ups} | r/${meme.subreddit}`
                    }
                };
                return message.channel.send({ embeds: [memeEmbed] });
            })
            .catch(error => {
                console.error(error);
                return message.reply('❌ Não consegui buscar um meme no momento!');
            });
    }
};