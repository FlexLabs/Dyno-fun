const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');


class Bunnies extends Command {
    constructor(...args) {
        super(...args);

        this.aliases      = ['bunny', 'bunnies']; // I have been bitten by 2 Bunnies in my lifetime.
        this.module       = 'Fun';
        this.description  = 'Random Adorable Bunnies';
        this.usage        = 'bunny';
        this.example      = 'bunny';
        this.cooldown     = 7500;
        this.expectedArgs = 0;
    }

    async execute({ message }) {
	const errorText = `Error: ${this.config.emojis.rabbit || '🐰'} No bunnies found.`;
        try {
			const utils = this.utils;
			const responses = [
				{ search: 'Looking for a bunnies...', found: 'Found one!' },
			];

            const [res, msg] = await Promise.all([
                superagent.get('https://api.bunnies.io/v2/loop/random/?media=poster'),
                this.sendMessage(message.channel, response.search),

            ]);

            const response = responses[utils.getRandomInt(0, responses.length - 1)];

			return msg.edit({
				content: response.found,
				embed: {
					title: 'Bunnies!!!',
					color: 0x008080,
					image: {
						url: `https://api.bunnies.io/v2/loop/random/${res.body.media.poster}`,
					},
					url: `https://api.bunnies.io/v2/loop/random/${res.body.media.poster}`,
				},
			});
		} catch (err) {
			return this.error(message.channel, errorText);
		}
	}
}
module.exports = Bunnies;
