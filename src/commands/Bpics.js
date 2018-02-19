const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');


class Birb extends Command {
    constructor(...args) {
        super(...args);

        this.aliases      = ['bird', 'birb', 'lunar'];
        this.module       = 'Fun';
        this.description  = 'Tweet Tweet birb pictures';
        this.usage        = 'bird';
        this.example      = 'bird';
        this.cooldown     = 7500;
        this.expectedArgs = 0;
    }

    async execute({ message }) {
        try {
			const utils = this.utils;
			const errorText = `Error: ${this.config.emojis.sadcat || '🐦'} No birds found.`;
			const responses = [
				{ search: 'Looking for a birdies...', found: 'Found one!' },
			];

			const response = responses[utils.getRandomInt(0, responses.length - 1)];
			const msg = await this.sendMessage(message.channel, response.search);

			let res = await superagent.get('https://random.birb.pw/tweet/random');

			if (!res || !res.redirects || !res.redirects.length) {
                return this.error(message.channel, errorText);
            }

			return msg.edit({
				content: response.found,
				embed: {
					title: "https://random.birb.pw/tweet/random Tweet Tweet..",
					color: 0x3498db,
					image: {
						url: res.redirects[0],
					},
					url: res.redirects[0],
				},
			});
		} catch(err) {
			return this.error(message.channel, errorText);
		}
	}
}

module.exports = Birb;