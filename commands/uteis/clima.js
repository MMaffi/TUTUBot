const axios = require('axios');
require('dotenv').config();

module.exports = {
    name: 'clima',
    execute(message, args, client) {
        // Verificar se a API key existe
        const apiKey = process.env.WEATHER_API_KEY;
        
        if (!apiKey || apiKey === 'sua_chave_api_weather_aqui') {
            return message.reply('❌ Comando clima não configurado. API key não encontrada.');
        }

        if (args.length === 0) {
            return message.reply('❌ Especifique uma cidade! Ex: `!clima São Paulo`');
        }

        const cidade = args.join(' ');

        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`)
            .then(response => {
                const data = response.data;
                
                // Emojis para diferentes condições climáticas
                const emojis = {
                    '01d': '☀️', // céu limpo dia
                    '01n': '🌙', // céu limpo noite
                    '02d': '⛅', // poucas nuvens dia
                    '02n': '☁️', // poucas nuvens noite
                    '03d': '☁️', // nublado
                    '03n': '☁️', // nublado
                    '04d': '☁️', // muito nublado
                    '04n': '☁️', // muito nublado
                    '09d': '🌧️', // chuva
                    '09n': '🌧️', // chuva
                    '10d': '🌦️', // chuva com sol
                    '10n': '🌧️', // chuva noite
                    '11d': '⛈️',  // tempestade
                    '11n': '⛈️',  // tempestade
                    '13d': '❄️',  // neve
                    '13n': '❄️',  // neve
                    '50d': '🌫️',  // névoa
                    '50n': '🌫️'   // névoa
                };

                const emoji = emojis[data.weather[0].icon] || '🌤️';

                const climaEmbed = {
                    color: 0x3498DB,
                    title: `${emoji} Clima em ${data.name}, ${data.sys.country}`,
                    thumbnail: {
                        url: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                    },
                    fields: [
                        {
                            name: '🌡️ Temperatura',
                            value: `${Math.round(data.main.temp)}°C`,
                            inline: true
                        },
                        {
                            name: '💨 Sensação Térmica',
                            value: `${Math.round(data.main.feels_like)}°C`,
                            inline: true
                        },
                        {
                            name: '📝 Condição',
                            value: data.weather[0].description,
                            inline: true
                        },
                        {
                            name: '📈 Mín/Máx',
                            value: `${Math.round(data.main.temp_min)}°C / ${Math.round(data.main.temp_max)}°C`,
                            inline: true
                        },
                        {
                            name: '💧 Umidade',
                            value: `${data.main.humidity}%`,
                            inline: true
                        },
                        {
                            name: '🌬️ Vento',
                            value: `${data.wind.speed} m/s`,
                            inline: true
                        },
                        {
                            name: '☁️ Nuvens',
                            value: `${data.clouds.all}%`,
                            inline: true
                        },
                        {
                            name: '🏙️ Pressão',
                            value: `${data.main.pressure} hPa`,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `Solicitado por: ${message.author.tag} | Fonte: OpenWeatherMap`
                    },
                    timestamp: new Date().toISOString()
                };

                return message.channel.send({ embeds: [climaEmbed] });
            })
            .catch(error => {
                console.error('Erro API clima:', error.response?.data || error.message);
                
                if (error.response?.status === 401) {
                    return message.reply('❌ API key inválida. Verifique sua chave do OpenWeatherMap.');
                } else if (error.response?.status === 404) {
                    return message.reply('❌ Cidade não encontrada! Verifique o nome e tente novamente.');
                } else {
                    return message.reply('❌ Erro ao buscar informações do clima. Tente novamente mais tarde.');
                }
            });
    }
};