const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pesquisa',
    aliases: ['search', 'buscar'],
    description: 'Pesquisa rápida em múltiplos serviços',
    async execute(message, args, client) {
        await startQuickSearch(message, args, client);
    },

    // Handler para interações (botões e menus)
    buttonHandler: async (interaction, client) => {
        if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

        const customId = interaction.customId;
        
        if (customId.startsWith('search_')) {
            await handleSearchChoice(interaction, client);
            return true; // Indica que o handler foi encontrado
        }
        
        return false;
    }
};

async function startQuickSearch(context, args, client) {
    const query = args.join(' ');
    
    if (!query) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🔍 Sistema de Pesquisa Rápida')
            .setDescription('Pesquise em múltiplos serviços diretamente pelo Discord!')
            .addFields(
                {
                    name: '📝 Como usar',
                    value: '`!pesquisa [sua pesquisa]`\nExemplo: `!pesquisa discord.js`',
                    inline: false
                },
                {
                    name: '🌐 Serviços Disponíveis',
                    value: '• 🔍 Google\n• 📚 Wikipédia\n• 🎵 YouTube\n• 💻 Stack Overflow\n• 🐙 GitHub',
                    inline: false
                }
            )
            .setFooter({ text: 'Digite !pesquisa seguido do que quer buscar' });

        await context.channel.send({ embeds: [helpEmbed] });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(0x9B59B6)
        .setTitle('🔍 Pesquisa Rápida')
        .setDescription(`**Pesquisa:** "${query}"`)
        .addFields(
            {
                name: '🌐 Escolha um serviço',
                value: 'Selecione abaixo onde deseja pesquisar:',
                inline: false
            }
        )
        .setFooter({ 
            text: `Pesquisa solicitada por ${context.author.tag}`,
            iconURL: context.author.displayAvatarURL()
        })
        .setTimestamp();

    const components = createSearchComponents(query);

    await context.channel.send({ 
        embeds: [embed], 
        components 
    });
}

async function handleSearchChoice(interaction, client) {
    await interaction.deferUpdate();

    const customId = interaction.customId;
    
    if (interaction.isStringSelectMenu()) {
        // Menu de seleção
        const query = customId.replace('search_menu_', '');
        const selectedService = interaction.values[0];
        await performSearch(interaction, query, selectedService);
        
    } else if (interaction.isButton()) {
        // Botão específico
        const parts = customId.split('_');
        if (parts[0] === 'search' && parts[1] === 'new') {
            // Nova pesquisa - enviar mensagem de ajuda
            const helpEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle('🔍 Nova Pesquisa')
                .setDescription('Digite `!pesquisa [sua pesquisa]` para fazer uma nova busca.')
                .setFooter({ text: 'Exemplo: !pesquisa programação javascript' });

            await interaction.editReply({ 
                embeds: [helpEmbed], 
                components: [] 
            });
            return;
        }
        
        // Botão de serviço específico
        const service = parts[1];
        const query = parts.slice(2).join('_');
        await performSearch(interaction, query, service);
    }
}

async function performSearch(interaction, query, service) {
    const searchUrls = {
        google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        wikipedia: `https://pt.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        stackoverflow: `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`,
        github: `https://github.com/search?q=${encodeURIComponent(query)}&type=repositories`
    };

    const serviceNames = {
        google: 'Google',
        wikipedia: 'Wikipédia',
        youtube: 'YouTube',
        stackoverflow: 'Stack Overflow',
        github: 'GitHub'
    };

    const serviceIcons = {
        google: '🔍',
        wikipedia: '📚',
        youtube: '🎵',
        stackoverflow: '💻',
        github: '🐙'
    };

    if (!searchUrls[service]) {
        await interaction.followUp({ 
            content: '❌ Serviço de pesquisa não encontrado!', 
            ephemeral: true 
        });
        return;
    }

    const resultEmbed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle(`${serviceIcons[service]} Pesquisa no ${serviceNames[service]}`)
        .setDescription(`**Consulta:** "${query}"`)
        .addFields(
            {
                name: '🔗 Link da Pesquisa',
                value: `[Clique aqui para ver os resultados](${searchUrls[service]})`,
                inline: false
            }
        )
        .setFooter({ 
            text: `Pesquisa realizada no ${serviceNames[service]}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

    const newSearchButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('search_new')
                .setLabel('🔍 Nova Pesquisa')
                .setStyle(ButtonStyle.Success)
        );

    await interaction.editReply({ 
        embeds: [resultEmbed], 
        components: [newSearchButton] 
    });
}

function createSearchComponents(query) {
    // Menu de seleção
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`search_menu_${query}`)
        .setPlaceholder('🌐 Escolha um serviço de pesquisa...')
        .addOptions([
            {
                label: 'Google',
                value: 'google',
                description: 'Pesquisar no Google',
                emoji: '🔍'
            },
            {
                label: 'Wikipédia',
                value: 'wikipedia',
                description: 'Pesquisar na Wikipédia',
                emoji: '📚'
            },
            {
                label: 'YouTube',
                value: 'youtube',
                description: 'Pesquisar no YouTube',
                emoji: '🎵'
            },
            {
                label: 'Stack Overflow',
                value: 'stackoverflow',
                description: 'Pesquisar no Stack Overflow',
                emoji: '💻'
            },
            {
                label: 'GitHub',
                value: 'github',
                description: 'Pesquisar no GitHub',
                emoji: '🐙'
            }
        ]);

    const row1 = new ActionRowBuilder().addComponents(selectMenu);

    // Botões rápidos
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`search_google_${query}`)
                .setLabel('Google')
                .setEmoji('🔍')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`search_youtube_${query}`)
                .setLabel('YouTube')
                .setEmoji('🎵')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`search_wikipedia_${query}`)
                .setLabel('Wikipédia')
                .setEmoji('📚')
                .setStyle(ButtonStyle.Secondary)
        );

    return [row1, row2];
}