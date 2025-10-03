// SIMULATE PORT FOR RENDER
const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => res.send("Bot rodando!"));
app.listen(PORT, () => console.log(`Servidor web na porta ${PORT}`));

// -----------------------------------------------------------------------------

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Criar cliente Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// Objeto para armazenar todos os comandos
client.commands = new Map();

// Carregar comandos por categoria
function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    
    // Verificar se a pasta commands existe
    if (!fs.existsSync(commandsPath)) {
        console.log('❌ Pasta commands não encontrada!');
        return;
    }

    const categoryFolders = fs.readdirSync(commandsPath).filter(item => {
        const itemPath = path.join(commandsPath, item);
        return fs.statSync(itemPath).isDirectory();
    });

    console.log(`📁 Categorias encontradas: ${categoryFolders.join(', ')}`);

    for (const category of categoryFolders) {
        const categoryPath = path.join(commandsPath, category);
        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

        console.log(`📂 Carregando comandos da categoria: ${category}`);

        for (const file of commandFiles) {
            try {
                const command = require(path.join(categoryPath, file));
                
                if (!command.name) {
                    console.log(`⚠️  Comando sem nome no arquivo: ${file}`);
                    continue;
                }

                client.commands.set(command.name, command);
                console.log(`✅ Comando carregado: ${command.name} (${category})`);
            } catch (error) {
                console.error(`❌ Erro ao carregar comando ${file}:`, error.message);
            }
        }
    }

    console.log(`🎯 Total de comandos carregados: ${client.commands.size}`);
}

// Carregar eventos
function loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    
    if (!fs.existsSync(eventsPath)) {
        console.log('❌ Pasta events não encontrada!');
        return;
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        try {
            const event = require(path.join(eventsPath, file));
            
            if (!event.name) {
                console.log(`⚠️  Evento sem nome no arquivo: ${file}`);
                continue;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(`✅ Evento carregado: ${event.name}`);
        } catch (error) {
            console.error(`❌ Erro ao carregar evento ${file}:`, error.message);
        }
    }
}

// Inicialização
async function initializeBot() {
    loadCommands();
    loadEvents();
    client.login(process.env.DISCORD_TOKEN);
}

initializeBot();

// Tratamento de erros
process.on('unhandledRejection', error => {
    console.error('Erro não tratado:', error);
});

process.on('uncaughtException', error => {
    console.error('Exceção não capturada:', error);
});