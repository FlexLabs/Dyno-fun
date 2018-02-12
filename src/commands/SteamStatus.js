const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');


class SteamStatus extends Command {
    constructor(...args) {
        super(...args);

        this.aliases      = ['steamstatus'];
        this.module       = 'Fun';
        this.description  = 'Check the status of Steam';
        this.usage        = 'steamstatus';
        this.example      = 'steamstatus';
        this.cooldown     = 3500;
        this.expectedArgs = 0;
    }

    async execute({ message }) {
        try {
                let res = await superagent.get('https://steamgaug.es/api/v2');
                let icon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2000px-Steam_icon_logo.svg.png';
                let steamcommunity = res.body.SteamCommunity;
                let steamstore = res.body.SteamStore;
                let steamclient = res.body.ISteamClient;

                console.log(res.body);

                steamcommunity.online ? 'Online' : 'Offline';
                steamclientstatus.online ? 'Online' : 'Offline';
                steamstorestatus.online ? 'Online' : 'Offline';

                return this.sendMessage(message.channel, {
                    embed: {
                        color: 0x666666,
                        author: {
                            name: 'Steam Status via steamgaug.es',
                            icon_url: icon
                        },
                        title: 'Steam Community',
                        description: steamcommunitystatus,
                        fields: [
                            {
                                name: 'Steam Client:',
                                value: steamclientstatus
                            },
                            {
                                name: 'Steam Store:',
                                value: steamstorestatus
                            }
                        ],
                        thumbnail: {
                            url: icon
                        },
                        timestamp: new Date()
                    }
                });
            } catch(err) {
                return this.error(message.channel, 'Error! Unable to fetch steam status.');
            }
        }
}

module.exports = SteamStatus;