'use strict';

const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

function isText(string) { // check that the input is text-number without extra symbol + max length 30 char
	return /^[a-zA-Z0-9]{1,30}$/.test(string);
}

function filterName(string) {
	return /[a-zA-Z0-9]{1,30}/g.exec(string)
}

class LoveCalc extends Command {
	constructor(...args) {
		super(...args);

		this.aliases = ['lovecalc', 'love'];
		this.module = 'Fun';
		this.description = 'Get your love power with someone';
		this.usage = 'love [user] [user]\nlove [user]';
		this.example = 'love KhaaZ Dyno\nlove Dyno';
		this.cooldown = 5000;
		this.expectedArgs = 1;
		this._apiKey = this.config.mashapeAPI.key;
	}

	async execute( { message,args } ) {

		let user1;
		let user2;

		// Mention, id, username, nickname => retrieve guild member
		if (args[0]) {
			user1 = this.resolveUser(guild, args[0]);
		} else {
			return this.error(message.channel, 'You need to give at least one name to test!');
		}

		if (args[1]) {
			user2 = this.resolveUser(guild, args[1]);
		} else {
			user2 = message.user.username; // 1 arg = test with the user who callsed the command
		}

		// get guild Member username OR get a valid text out of the input
		if (user1) {
			user1 = user1.username;
		} else if ( args[0].isText(string) ) {
			user1 = args[0];
		} else {
			user1 = filterName(args[0]);
			if (user1) {
				user1 = user1[0];
			}
		}

		if (user2) {
			user2 = user1.username;
		} else if ( args[1].isText(string) ) {
			user2 = args[1];
		} else {
			user2 = filterName(args[1]);
			if (user2) {
				user2 = user2[0];
			}
		}

		// no valid input for one of the args. Send back an error
		if ( !user1 || !user2 ) {
			return this.error(message.channel, 'Invalid input! Give a valid name!');
		}

		try {
			let res = await superagent
				.get(`https://love-calculator.p.mashape.com/getPercentage/?fname=${user1}&sname=${user2}`)
				.set('X-Mashape-Key', _apiKey)
				.set('Accept', 'application/json');

			const embed = {
				author: {
					name: '❤ Love compatibilty ❤'
				},
				color: 0xFF0000,
				description: `Testing compatibility for **${user1}** and **${user2}**`,
				fields: [
					{
						name: `${res.body.percentage}%`,
						value: res.body.result
					}
				],
				timestamp: new Date()		
			};

			return this.sendMessage(message.channel, { embed });

		} catch (err) {
			return this.error(message.channel, 'You have no compatibility with this command, an error occured!');
		}

	}

}

module.exports = LoveCalc;
