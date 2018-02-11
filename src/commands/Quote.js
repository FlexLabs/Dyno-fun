const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Quote extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['quote'];
		this.module       = 'Fun';
		this.description  = 'Get a random quote.';
		this.usage        = 'quote';
		this.example      = 'quote';
		this.cooldown     = 3000;
		this.expectedArgs = 0;
	}

	async execute({ message, args }) {
		try {
			let res = await superagent.get('https://talaikis.com/api/quotes/random/');
			res = JSON.parse(res.body.text);
			return this.sendMessage(message.channel, `${res.quote} - **${res.author}**`);
		} catch(err) {
			return this.error(message.channel, 'An error occured: Unable to fetch quote.');
		}
	}
}

module.exports = Quote;
