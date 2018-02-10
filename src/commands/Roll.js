const { Command } = require('@dyno.gg/dyno-core');

class Roll extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['roll'];
		this.module       = 'Fun';
		this.description  = 'Roll the dice';
		this.usage        = 'roll [number of dice]';
		this.example      = 'roll 5';
		this.cooldown     = 3000;
		this.expectedArgs = 0;
	}

	execute({ message, args }) {
		let dice = (args && args.length) ? args[0] : 1;
		let results = [];

		dice = dice > 5 ? 5 : dice;

		for (let i = 0; i < dice; i++) {
			results.push(Math.floor(Math.random() * 6) + 1);
		}

		results = results.join(', ');
		return this.sendMessage(message.channel, `${message.author.mention} You rolled ${results}`);
	}
}

module.exports = Roll;
