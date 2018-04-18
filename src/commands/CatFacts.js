const { Command } = require('@dyno.gg/dyno-core');
const Prefetcher = require('../Prefetcher');

class CatFacts extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['catfact', 'catfacts']; // meow facts
		this.module       = 'Fun';
		this.description  = 'Get random Cat Facts with this commmand';
		this.usage        = 'catfact';
		this.example      = 'catfact';
		this.cooldown     = 5000;
		this.expectedArgs = 0;
		this.factCache    = new Prefetcher('https://catfact.ninja/fact');

		this.factCache.init();
	}

		async execute({ message }) {
			try {
				let res = await this.factCache.get();

				return this.sendMessage(message.channel, res.body.fact);
			} catch (err) {
				return this.error(message.channel, 'No Cat facts founds.. Something went wrong.');
			}
		}
	}

	module.exports = CatFacts;
