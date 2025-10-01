module.exports = {
    name: 'emoji',
    execute(message, args, client) {
        // Definir o objeto emojis PRIMEIRO, antes de qualquer uso
        const emojis = {
            'feliz': '😊 😄 😁 🤗 🥳 😃 😀 🙃 😝 😜 🤪 🥰 😍 😘 😗 😙 😚 🤩 🥲',
            'triste': '😢 😭 😔 😞 😥 😓 😪 😫 😩 🥺 😰 😨 😱 😖 😣 ☹️ 🙁 😟 😕',
            'bravo': '😠 😡 🤬 👿 💢 🥵 😤 😾 👺 💀 ☠️ 🗯️ 🔥 💣 ⚡ 🚫 ❌ ⛔',
            'amo': '😍 🥰 😘 💕 💖 💗 💓 💞 💘 💝 💟 ❤️ 🧡 💛 💚 💙 💜 🤎 🖤',
            'risada': '😂 🤣 😹 😆 😂 💀 🫠 🥹 🫢 🤭 🤫 🤔 🫣 😏 🥴 😵 🤯 🤠',
            'animal': '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊',
            'comida': '🍕 🍔 🍟 🌭 🍿 🥓 🥩 🍗 🍖 🍤 🍳 🥐 🍞 🥨 🥞 🧀 🍝 🌮 🌯',
            'natureza': '🌳 🌲 🌴 🏞️ 🌅 🌄 🏔️ 🌋 🗻 ⛰️ 🏕️ 🏖️ 🏜️ 🏝️ 🪨 💮 🌺 🌸',
            'esportes': '⚽ 🏀 🏈 ⚾ 🎾 🏐 🏉 🎱 🏓 🏸 🥅 🏒 🏑 🥍 🏏 🎿 ⛷️ 🏂 🪂',
            'musica': '🎵 🎶 🎼 🎹 🎸 🎺 🎻 🪕 🥁 🎷 🎤 🎧 📻 🎚️ 🎛️ 🎙️ 🔊 🎧',
            'tech': '💻 🖥️ 🖨️ ⌨️ 🖱️ 🖲️ 💽 💾 💿 📀 📱 📟 📠 🔌 🔋 🖨️ 🕹️ 🎮',
            'transporte': '🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐 🚚 🚛 🚜 🏍️ 🛵 🚲 🛴 🚁',
            'objetos': '⌚ 📱 💡 🔦 🕯️ 🪔 📷 ⚗️ 🔭 🔬 💈 ⚖️ 🦯 🩺 💊 💉 🩹 🧴',
            'simbolos': '❤️ ✨ ⭐ 🌟 💫 💥 💯 ✅ 🔥 🌈 ☀️ 🌙 ⚡ ❄️ 💦 🍀 🍃 🍂',
            'bandeiras': '🏳️ 🏴 🏁 🚩 🏳️‍🌈 🏳️‍⚧️ 🏴‍☠️ 🇧🇷 🇺🇸 🇪🇺 🇯🇵 🇰🇷 🇨🇳 🇮🇳 🇦🇺',
            'mãos': '👋 🤚 🖐️ ✋ 🖖 👌 🤌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇',
            'rostos': '😀 😃 😄 😁 😆 😅 🤣 😂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 ☺️',
            'fantasia': '👻 💩 🤡 👹 👺 🦄 🧚 🧜 🧞 🧙 🦹 🦸 🧛 🧟 🧌 🐲 🐉 🦖',
            'festas': '🎉 🎊 🎈 🎂 🍰 🧁 🍭 🍬 🍫 🍩 🍪 🎁 🎀 🎄 🎇 🎆 ✨ 🥳',
            'clima': '☀️ 🌤️ ⛅ 🌥️ ☁️ 🌦️ 🌧️ ⛈️ 🌩️ 🌨️ ❄️ ⛄ 🌪️ 🌈 ⛱️ 🏖️ 🌊',
            'estudos': '📚 📖 📕 📗 📘 📙 📔 📒 📝 📄 📃 📜 📋 🖊️ ✏️ 📏 📐 🧮',
            'trabalho': '💼 📁 📂 🗂️ 📅 📆 🗒️ 🗓️ 📊 📈 📉 🧾 💵 💴 💶 💷 💳',
            'saude': '🏥 🏩 🏨 💊 💉 🩺 🩹 🧴 🧬 🦠 🧫 🧪 🌡️ 🚑 🚨 ⛑️ 🧑‍⚕️ 👨‍⚕️',
            'viagem': '🧳 ✈️ 🛫 🛬 🛩️ 💺 🚁 🛸 🚀 🛰️ 🗺️ 🧭 🏨 🏖️ 🏝️ 🏜️ 🗿',
            'relogio': '🕐 🕑 🕒 🕓 🕔 🕕 🕖 🕗 🕘 🕙 🕚 🕛 🕜 🕝 🕞 🕟 🕠 🕡',
            'setas': '⬆️ ↗️ ➡️ ↘️ ⬇️ ↙️ ⬅️ ↖️ ↕️ ↔️ ↩️ ↪️ ⤴️ ⤵️ 🔃 🔄 🔙 🔚',
            'numeros': '0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 *️⃣ #️⃣ 🔢 ▶️ ◀️',
            'formas': '🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🟥 🟧 🟨 🟩 🟦 🟪 🟫 ◼️ ◻️'
        };

        // Criar lista de categorias para o comando de ajuda
        const categoriasDisponiveis = Object.keys(emojis).join(', ');

        if (args.length === 0) {
            const embed = {
                color: 0xFFD700,
                title: '🎭 Gerador de Emojis - 30 Categorias!',
                description: 'Use: `!emoji tipo`\n\n**📂 Categorias disponíveis:**',
                fields: [
                    {
                        name: '🎭 Expressões',
                        value: '`feliz`, `triste`, `bravo`, `amo`, `risada`, `rostos`',
                        inline: true
                    },
                    {
                        name: '🐾 Animais & Natureza',
                        value: '`animal`, `natureza`, `clima`, `fantasia`',
                        inline: true
                    },
                    {
                        name: '🍕 Comida & Bebida',
                        value: '`comida`, `festas`',
                        inline: true
                    },
                    {
                        name: '⚽ Esportes & Lazer',
                        value: '`esportes`, `musica`, `tech`, `transporte`',
                        inline: true
                    },
                    {
                        name: '📚 Trabalho & Estudo',
                        value: '`estudos`, `trabalho`, `saude`, `viagem`',
                        inline: true
                    },
                    {
                        name: '🎨 Diversos',
                        value: '`objetos`, `simbolos`, `bandeiras`, `mãos`, `relogio`, `setas`, `numeros`, `formas`',
                        inline: true
                    }
                ],
                footer: { 
                    text: `Total: ${Object.keys(emojis).length} categorias | Solicitado por ${message.author.tag}` 
                }
            };
            return message.channel.send({ embeds: [embed] });
        }

        const tipo = args[0].toLowerCase();
        const emojiList = emojis[tipo];

        if (!emojiList) {
            return message.reply(`❌ Categoria "${tipo}" não encontrada! Use \`!emoji\` para ver todas as categorias.`);
        }

        const embed = {
            color: 0x00FF00,
            title: `🎭 Emojis - ${tipo.toUpperCase()}`,
            description: emojiList,
            footer: { 
                text: `${emojiList.split(' ').length} emojis | Use !emoji para mais categorias` 
            }
        };

        return message.channel.send({ embeds: [embed] });
    }
};