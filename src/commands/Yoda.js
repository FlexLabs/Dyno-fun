'use strict';

const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Yoda extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['yoda'];
		this.module       = 'Fun';
		this.description  = 'Speak like Master Yoda.';
		this.usage        = 'yoda [text]';
		this.example      = 'yoda I can speak like Master Yoda!';
		this.cooldown     = 5000;
        this.expectedArgs = 1;
        this._apiKey = this.config.mashapeAPI.key;
	}

	async execute({ message, args }) {
		try {
			let input = args.join(' ');

			let res = await superagent
				.get(`https://yoda.p.mashape.com/yoda?sentence=${input}`)
				.set('X-Mashape-Key', _apiKey)
				.set( 'Accept', 'text/plain' );
			
			return this.sendMessage(message.channel, res.text);

		} catch (err) {
			return this.error(message.channel, 'An error Occured. You loose connection with the force!');
		}
		
	}
	
}

module.exports = DadJoke;
