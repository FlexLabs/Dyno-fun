const { Command } = require('@dyno.gg/dyno-core');

class Math extends Command {
	constructor(...args) {
		super(...args);
		
		this.aliases      = ['math'];
		this.module       = 'Fun';
		this.description  = 'Math command';
		this.usage        = 'math [math expression]';
		this.example      = 'math 152 + 37';
		this.cooldown     = 3000;
		this.expectedArgs = 1;
	}

	execute({ message, args }) {
		const math = require('mathjs')
		try {
			let input = args.join(' ')
            let output = math.eval(input).toString()
            return this.sendMessage(messsage.channel, `Answer: ${output}`)
		} catch (e) {
			return this.sendMessage(message.channel, "Couldn't evaluate the given expression!")
		}
	}
}

module.exports = Math;
