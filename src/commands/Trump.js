const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Trump extends Command {
	constructor(...args) {
		super(...args);

		this.aliases        = ['trump', 'trumpquote']; // BUild That WaLL
		this.module         = 'Fun';
		this.description    = 'Best quotes and tweet from our supreme dictator Donald Trump';
		this.usage          = 'trump';
		this.example        = 'trump';
		this.cooldown       = 5000;
		this.expectedArgs   = 0;
	}

		async execute({ message }) {
			try {
				let res = await superagent.get('https://api.whatdoestrumpthink.com/api/v1/quotes/random');

				return this.sendMessage(message.channel, res.body.message);
			} catch (err) {
				return this.error(message.channel, 'No Trump quotes found...  Something went wrong.');
			}
		}
	}

module.exports = Trump;
