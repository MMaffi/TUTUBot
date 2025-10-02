const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'welcome',
    description: 'Sistema de boas-vindas e despedidas',
    async execute(message, args, client) {
        await setupWelcomeSystem(message, args, client);
    },

    // Handler para eventos de membros (será chamado pelo event handler)
    memberEventHandler: async (member, action, client) => {
        await handleMemberEvent(member, action, client);
    }
};

// Configurações temporárias (em produção, salve em um banco de dados)
const serverConfigs = new Map();

async function setupWelcomeSystem(message, args, client) {
    const subCommand = args[0]?.toLowerCase();

    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply('❌ Você precisa ter permissão de administrador para configurar o sistema de boas-vindas.');
    }

    if (subCommand === 'config') {
        const channel = message.mentions.channels.first();
        const role = message.mentions.roles.first();
        
        if (!channel) {
            return message.reply('❌ Por favor, mencione um canal válido. Exemplo: `!welcome config #canal @cargo`');
        }

        // Verificar se o bot tem permissão no canal
        const botPermissions = channel.permissionsFor(message.guild.members.me);
        if (!botPermissions.has(PermissionFlagsBits.SendMessages) || !botPermissions.has(PermissionFlagsBits.EmbedLinks)) {
            return message.reply('❌ Eu preciso das permissões `Enviar Mensagens` e `Inserir Links` nesse canal!');
        }

        let roleStatus = 'Não configurado';
        let canManageRole = false;

        if (role) {
            // Verificar se o bot pode gerenciar este cargo específico
            const botMember = message.guild.members.me;
            const botHighestRole = botMember.roles.highest;
            
            if (role.position >= botHighestRole.position) {
                roleStatus = `⚠️ Cargo ${role.name} está muito alto (posição ${role.position}). O bot não pode gerenciá-lo.`;
            } else if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
                roleStatus = '❌ Bot não tem permissão para gerenciar cargos';
            } else {
                roleStatus = `✅ Cargo ${role} pode ser atribuído`;
                canManageRole = true;
            }
        }

        // Salvar configuração
        const config = {
            welcomeChannel: channel.id,
            initialRole: role?.id || null,
            enabled: true,
            canManageRole: canManageRole
        };
        
        serverConfigs.set(message.guild.id, config);

        const embed = new EmbedBuilder()
            .setColor(canManageRole || !role ? 0x2ECC71 : 0xF39C12)
            .setTitle('⚙️ Sistema de Boas-vindas Configurado')
            .addFields(
                {
                    name: '📝 Canal',
                    value: `${channel}`,
                    inline: true
                },
                {
                    name: '🎯 Cargo Inicial',
                    value: role ? `${role}` : 'Não configurado',
                    inline: true
                },
                {
                    name: '🔧 Status do Cargo',
                    value: roleStatus,
                    inline: false
                }
            )
            .setFooter({ 
                text: canManageRole || !role ? 
                    'Sistema configurado com sucesso!' : 
                    'Sistema configurado, mas cargo não pode ser atribuído automaticamente' 
            })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
        
    } else if (subCommand === 'test') {
        // Testar mensagem de boas-vindas
        const config = serverConfigs.get(message.guild.id);
        if (!config) {
            return message.reply('❌ Primeiro configure o sistema com `!welcome config #canal @cargo`');
        }

        // Simular entrada de membro
        await handleMemberEvent(message.member, 'join', client);
        
    } else if (subCommand === 'disable') {
        serverConfigs.delete(message.guild.id);
        await message.reply('✅ Sistema de boas-vindas desativado!');
        
    } else if (subCommand === 'fixroles') {
        // Comando para ajudar a solucionar problemas de hierarquia
        const botMember = message.guild.members.me;
        const botHighestRole = botMember.roles.highest;
        
        const roles = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .first(10); // Mostrar apenas os 10 cargos mais altos

        const rolesList = roles.map(role => {
            const isBotRole = role.id === botHighestRole.id;
            const canManage = role.position < botHighestRole.position;
            const status = isBotRole ? '🤖 **Cargo do Bot**' : canManage ? '✅ Pode gerenciar' : '❌ Não pode gerenciar';
            return `${status} - ${role} (Posição: ${role.position})`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🔧 Solucionador de Problemas de Cargos')
            .setDescription(`**Cargo mais alto do bot:** ${botHighestRole}\n**Posição:** ${botHighestRole.position}`)
            .addFields({
                name: '📋 Top 10 Cargos (mais altos primeiro)',
                value: rolesList || 'Nenhum cargo encontrado',
                inline: false
            })
            .addFields({
                name: '💡 Como corrigir',
                value: '1. Vá em **Configurações do Servidor** → **Cargos**\n2. Arraste o cargo do bot **ACIMA** do cargo que você quer gerenciar\n3. Salve as alterações',
                inline: false
            });

        await message.channel.send({ embeds: [embed] });
        
    } else if (subCommand === 'status') {
        // Mostrar status atual
        const config = serverConfigs.get(message.guild.id);
        const botMember = message.guild.members.me;
        
        const statusEmbed = new EmbedBuilder()
            .setColor(config ? 0x2ECC71 : 0xE74C3C)
            .setTitle('📊 Status do Sistema de Boas-vindas')
            .addFields(
                {
                    name: '🔧 Status',
                    value: config ? '✅ Ativo' : '❌ Inativo',
                    inline: true
                },
                {
                    name: '📝 Canal',
                    value: config ? `<#${config.welcomeChannel}>` : 'Não configurado',
                    inline: true
                },
                {
                    name: '🎯 Cargo Inicial',
                    value: config && config.initialRole ? `<@&${config.initialRole}>` : 'Não configurado',
                    inline: true
                },
                {
                    name: '🤖 Permissões do Bot',
                    value: botMember.permissions.has(PermissionFlagsBits.ManageRoles) ? 
                        '✅ Gerenciar Cargos' : '❌ Gerenciar Cargos',
                    inline: true
                },
                {
                    name: '⚡ Status do Cargo',
                    value: config && config.initialRole ? 
                        (config.canManageRole ? '✅ Pode atribuir' : '❌ Não pode atribuir') : 
                        '🔶 Não configurado',
                    inline: true
                }
            );

        await message.channel.send({ embeds: [statusEmbed] });
        
    } else {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('👋 Sistema de Boas-vindas')
            .setDescription('Configuração de mensagens automáticas para novos membros')
            .addFields(
                {
                    name: '⚙️ Configurar',
                    value: '`!welcome config #canal @cargo`\nDefine o canal e cargo inicial',
                    inline: false
                },
                {
                    name: '🧪 Testar',
                    value: '`!welcome test`\nTesta a mensagem de boas-vindas',
                    inline: false
                },
                {
                    name: '📊 Status',
                    value: '`!welcome status`\nMostra configuração atual',
                    inline: false
                },
                {
                    name: '🔧 Solucionar Problemas',
                    value: '`!welcome fixroles`\nMostra informações sobre hierarquia de cargos',
                    inline: false
                },
                {
                    name: '🚫 Desativar',
                    value: '`!welcome disable`\nDesativa o sistema',
                    inline: false
                }
            );

        await message.channel.send({ embeds: [helpEmbed] });
    }
}

async function handleMemberEvent(member, action, client) {
    const config = serverConfigs.get(member.guild.id);
    if (!config || !config.enabled) return;

    const channel = member.guild.channels.cache.get(config.welcomeChannel);
    if (!channel) {
        console.log('❌ Canal de boas-vindas não encontrado');
        return;
    }

    // Verificar permissões do bot no canal
    const botPermissions = channel.permissionsFor(member.guild.members.me);
    if (!botPermissions.has(PermissionFlagsBits.SendMessages) || !botPermissions.has(PermissionFlagsBits.EmbedLinks)) {
        console.log('❌ Bot sem permissões no canal de boas-vindas');
        return;
    }

    if (action === 'join') {
        // Dar cargo inicial se configurado e possível
        if (config.initialRole && config.canManageRole) {
            try {
                const role = member.guild.roles.cache.get(config.initialRole);
                if (role) {
                    await member.roles.add(role);
                    console.log(`✅ Cargo ${role.name} dado para ${member.user.tag}`);
                }
            } catch (error) {
                console.error('❌ Erro ao adicionar cargo:', error.message);
                // Continua mesmo com erro no cargo
            }
        } else if (config.initialRole && !config.canManageRole) {
            console.log(`⚠️ Cargo inicial configurado mas não pode ser atribuído automaticamente`);
        }

        // Mensagem de boas-vindas (sempre envia, mesmo sem cargo)
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle(`🎉 Bem-vindo(a) ao ${member.guild.name}!`)
            .setDescription(`Olá ${member}, seja muito bem-vindo(a) ao nosso servidor!`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                {
                    name: '👤 Membros',
                    value: `Agora somos **${member.guild.memberCount}** membros!`,
                    inline: true
                },
                {
                    name: '📅 Entrou em',
                    value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`,
                    inline: true
                },
                {
                    name: '📋 Regras',
                    value: 'Não se esqueça de ler as regras do servidor!',
                    inline: false
                }
            )
            .setFooter({ 
                text: `ID: ${member.user.id} | Divirta-se no servidor!`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        try {
            await channel.send({ 
                content: `👋 ${member.user.tag} acabou de entrar no servidor!`,
                embeds: [welcomeEmbed] 
            });
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem de boas-vindas:', error);
        }

    } else if (action === 'leave') {
        // Mensagem de despedida
        const goodbyeEmbed = new EmbedBuilder()
            .setColor(0xE74C3C)
            .setTitle('👋 Até mais!')
            .setDescription(`${member.user.tag} saiu do servidor.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                {
                    name: '👤 Membros restantes',
                    value: `Agora somos **${member.guild.memberCount}** membros.`,
                    inline: true
                },
                {
                    name: '📅 Saiu em',
                    value: `<t:${Math.floor(Date.now() / 1000)}:f>`,
                    inline: true
                }
            )
            .setFooter({ 
                text: `ID: ${member.user.id}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        try {
            await channel.send({ embeds: [goodbyeEmbed] });
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem de despedida:', error);
        }
    }
}