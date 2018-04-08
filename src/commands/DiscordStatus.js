const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');
const moment = require('moment');

function toUpper(i) {
    return i[0].toUpperCase() + i.substr(1);
}
//
async function request(i) {
    return await superagent
        .get(`https://srhpyqt94yxb.statuspage.io/api/v2/${i}`);
}
//
async function getComp(i) {
    const res = await request('components.json');
    return res.body.components.find(m => m.name === i);
}
//
function getTime(i) {
    return moment(i).format('dddd, MMMM Do YYYY, h:mm:ss a');
}

class DiscordStatus extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['discordstatus', 'ds'];
		this.module       = 'Fun';
		this.description  = 'Check Discord\'s server status';
		this.usage        = ['discordstatus', 'discordstatus [server]'];
		this.example      = ['discordstatus', 'discordstatus api', 'discordstatus eu west'];
		this.cooldown     = 3000;
        this.expectedArgs = 0;
        this.commands = [
            {
                name: 'list',
                desc: 'Get Discord\'s server list',
                usage: 'list',
                cooldown: 3000,
            },
            {
                name: 'incidents',
                desc: 'Get Discord\'s latest incidents',
                usage: 'incidents [incident number]',
                cooldown: 3000,
            },
        ];
	}

	async execute({ message, args }) {
        const errmsg = 'Couldn\'t fetch data from Discord';
        const input = args.join(' ').toLowerCase();
        let res;
        let result = {};
        result.embed = {};
        result.embed.footer = {};
        result.embed.fields = [];
        result.embed.thumbnail = {
            url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        };
        //
        async function getDiscordStatus() {
            try {
                res = await request('status.json');

                result.embed.title = 'Discord Status';
                result.embed.footer.text = 'Last updated at';
                result.embed.timestamp = res.body.page.updated_at;

                if (res.body.status.indicator === 'none') {
                    result.embed.color = 0x43b581;

                    result.embed.fields.push({
                        name: 'Indicator',
                        value: 'No indicator',
                        inline: false,
                    });
                } else {
                    result.embed.color = 0xF04747;

                    result.embed.fields.push({
                        name: 'Indicator',
                        value: toUpper(res.body.status.indicator),
                        inline: false,
                    });
                }

                result.embed.fields.push({
                    name: 'Description',
                    value: toUpper(res.body.status.description),
                    inline: false,
                });
            } catch (e) {
                result = errmsg;
            }
        }
        //

        async function getInfo(i) { // Get info about any server
            try {
                res = await getComp(i);

                result.embed.title = `${i} Status`;
                result.embed.timestamp = res.updated_at;
                result.embed.footer.text = 'Last updated at';

                if (res.status === 'operational') {
                    result.embed.color = 0x43b581;
                } else {
                    result.embed.color = 0xF04747;
                }

                result.embed.fields.push({
                    name: 'Status',
                    value: toUpper(res.status),
                    inline: false,
                });

                if (res.description === null) {
                    result.embed.fields.push({
                        name: 'Description',
                        value: 'No description',
                        inline: false,
                    });
                } else {
                    result.embed.fields.push({
                        name: 'Description',
                        value: toUpper(res.description),
                        inline: false,
                    });
                }
            } catch (e) {
                result = errmsg;
            }
        }
        //

        switch (input) {
        case 'api':
            await getInfo('API');
            break;
        case 'eu west':
            await getInfo('EU West');
            break;
        case 'gateway':
            await getInfo('Gateway');
            break;
        case 'eu central':
            await getInfo('EU Central');
            break;
        case 'cloudflare':
            await getInfo('CloudFlare');
            break;
        case 'singapore':
            await getInfo('Singapore');
            break;
        case 'media proxy':
            await getInfo('Media Proxy');
            break;
        case 'sydney':
            await getInfo('Sydney');
            break;
        case 'voice':
            await getInfo('Voice');
            break;
        case 'us central':
            await getInfo('US Central');
            break;
        case 'us east':
            await getInfo('US East');
            break;
        case 'us south':
            await getInfo('US South');
            break;
        case 'us west':
            await getInfo('US West');
            break;
        case 'brazil':
            await getInfo('Brazil');
            break;
        case 'hong kong':
            await getInfo('Hong Kong');
            break;
        case 'russia':
            await getInfo('Russia');
            break;
        case 'japan':
            await getInfo('Japan');
            break;
        default:
            await getDiscordStatus();
        }

        return this.sendMessage(message.channel, result);
    }

    async list({ message }) {
        const result = {};
        result.embed = {};
        result.embed.footer = {};
        result.embed.fields = [];
        result.embed.thumbnail = {
            url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        };
        result.embed.color = 0x41DAE2;
        //
        try {
            const res = await request('components.json');
            result.embed.fields.push({
                name: 'Server List',
                value: res.body.components.map(m => m.name).join(', '),
                inline: false,
            });
            return this.sendMessage(message.channel, result);
        } catch (e) {
            return this.error('Couldn\'t fetch data from Discord');
        }
    }

    async incidents({ message, args }) {
        const errmsg = 'Couldn\'t fetch data from Discord';
        let res;
        let result = {};
        result.embed = {};
        result.embed.footer = {};
        result.embed.fields = [];
        result.embed.thumbnail = {
            url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        };
        result.embed.color = 0x41DAE2;

        if (args[0] === 'list') {
            let a;
            if (+args[0] <= 5 && +args[0] >= 0) {
                a = +args[0];
            } else {
                a = 1;
            }

            try {
                res = await request('incidents.json');

                result.embed.title = 'Incidents List';

                for (let i = 0; i < res.body.incidents.length; i++) {
                    res.body.incidents[i].number = (i + 1).toString();
                }

                const incidents = res.body.incidents.slice((a * 10) - 10, a * 10);

                for (let i = 0; i < incidents.length; i++) {
                    result.embed.fields.push({
                        name: `**${incidents[i].number}.** ${incidents[i].name}`,
                        value: `Status: ${incidents[i].status}`,
                        inline: false,
                    });
                }
            } catch (e) {
                result = errmsg;
            }

            return this.sendMessage(message.channel, result);
        }

        result.embed.footer = {
            text: 'Last updated at',
        };
        //
        let a;
        if (+args[0] <= 50 && +args[0] >= 0) {
            a = +args[0] - 1;
        } else {
            a = 0;
        }
        //
        try {
            res = await request('incidents.json');

            if (a === 0) {
                result.embed.title = 'Latest Incident';
            }

            result.embed.fields.push({
                name: 'Title',
                value: res.body.incidents[a].name,
                inline: false,
            });

            result.embed.fields.push({
                name: 'Status',
                value: toUpper(res.body.incidents[a].status),
                inline: false,
            });

            result.embed.fields.push({
                name: 'Created',
                value: getTime(res.body.incidents[a].created_at),
                inline: false,
            });

            if (res.body.incidents[a].incident_updates[0]) {
                result.embed.timestamp = res.body.incidents[0].updated_at;

                let updates = res.body.incidents[a].incident_updates
                    .map(m => `**${toUpper(m.status)}`).join('\n\n');

                updates = updates.match(/[\s\S]{1,950}/g) || [];

                let info;

                if (updates[1]) {
                    info = `...\n\n[Full Info](https://status.discordapp.com/incidents/${res.body.incidents[a].id})`;
                } else {
                    info = '';
                }

                result.embed.fields.push({
                    name: 'Updates',
                    value: updates[0] + info,
                    inline: false,
                });
            }
            } catch (e) {
                result = errmsg;
            }

        return this.sendMessage(message.channel, result);
    }
}

module.exports = DiscordStatus;
