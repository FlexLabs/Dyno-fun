'use strict';

const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

function filterName(string) {
	return /[a-zA-Z0-9]{1,30}/g.exec(string);
}

function generateWord(length) {
	const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

	let word = '';

	for (let i = 0; i < length; i++) {
		word += letters[Math.floor(Math.random() * 26)];
	}
	return word;
}


class LoveCalc extends Command {
	constructor(...args) {
		super(...args);

		this.aliases = ['lovecalc', 'love'];
		this.module = 'Fun';
		this.description = 'Get your love power with someone';
		this.usage = ['love [user] [user]', 'love [user]'];
		this.example = ['love KhaaZ Dyno', 'love Dyno'];
		this.cooldown = 5000;
		this.expectedArgs = 1;
		this._apiKey = this.config.mashapeAPI.key;
	}

	async execute({ message, args }) {
		let user1 = this.resolveUser(message.channel.guild, args[0]) || args[0];
		user1 = user1.username || args[0];
		user1 = filterName(args[0]) ? filterName(args[0])[0] : generateWord(8); // can also default to a string (but less funny)

		let user2 = args[1] ? (this.resolveUser(message.chanel.guild, args[1]) || args[1]) : message.author;
		user2 = user2.username || args[1];
		user2 = filterName(args[1]) ? filterName(args[1])[1] : generateWord(8); // can also default to a string (but less funny)


		try {
			const res = await superagent
				.get(`https://love-calculator.p.mashape.com/getPercentage/?fname=${user1}&sname=${user2}`)
				.set('X-Mashape-Key', this._apiKey)
				.set('Accept', 'application/json');

			const embed = {
				author: {
					name: '❤ Love compatibilty ❤',
				},
				color: 0xFF0000,
				description: `Testing compatibility for **${args[0]}** and **${args[1]}**`,
				fields: [
					{
						name: `${res.body.percentage}%`,
						value: res.body.result,
					},
				],
				timestamp: new Date(),
			};

			return this.sendMessage(message.channel, { embed });
		} catch (err) {
			return this.error(message.channel, 'An error occured: You are incompatible with this command!');
		}
	}
}

module.exports = LoveCalc;
