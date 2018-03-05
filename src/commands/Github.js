const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Github extends Command {
    constructor(...args) {
        super(...args);

        this.aliases      = ['github', 'gh'];
        this.module       = 'Fun';
        this.description  = 'Get info on a Github repository.';
        this.usage        = ['github [repo name]', 'github [owner]/[repo name]'];
        this.example      = ['github linux', 'github torvalds/linux'];
        this.cooldown     = 10000;
        this.expectedArgs = 1;
    }

    async execute({ message, args }) {
        args = args.join(' ');
        let url;
        if (args.includes('/')) {
            args = args.split('/');
            url = `https://api.github.com/repos/${args[0]}/${args[1]}`;
        } else {
            url = `https://api.github.com/search/repositories?q=${args}`;
        }

        try {
            let res = await superagent.get(url);
            if (url === `https://api.github.com/search/repositories?q=${args}`) res.body = res.body.items[0];
            return this.sendMessage(message.channel, {
                embed: {
                    author: {
                        name: res.body.owner.login,
                        url: res.body.owner.html_url,
                        icon_url: res.body.owner.avatar_url,
                    },
                    thumbnail: {
                        url: res.body.owner.avatar_url,
                    },
                    fields: [
                        {
                            name: 'Repository:',
                            value: `[${res.body.name}](${res.body.html_url})`,
                            inline: true,
                        },
                        {
                            name: 'Most Used Language:',
                            value: res.body.language,
                            inline: true,
                        },
                        {
                            name: 'Forks:',
                            value: res.body.forks_count,
                            inline: true,
                        },
                        {
                            name: 'Watchers:',
                            value: res.body.watchers_count,
                            inline: true,
                        },
                        {
                            name: `Open Issues:`,
                            value: res.body.open_issues_count,
                            inline: true,
                        },
                        {
                            name: 'License:',
                            value: res.body.license.name,
                            inline: true,
                        },
                    ],
                    timestamp: res.body.created_at,
                    footer: {
                        text: 'Repo created at ',
                    },
                },
            });
        } catch (err) {
            return this.error(message.channel, 'An error has occured: Unable to fetch repository');
        }
    }
}

module.exports = Github;
