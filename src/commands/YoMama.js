const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class YoMama extends Command {
	constructor(...args) {
		super(...args);

		this.aliases        = ['yomama', 'mamajoke']; // Yoooo mama!
		this.module         = 'Fun';
		this.description    = 'Roast your friends with these mama joke (Dyno is not responsible for any broken hearts or broken friendships.';
		this.usage          = 'yomama';
		this.example        = 'yomama';
		this.cooldown       = 5000;
		this.expectedArgs   = 0;
	}	

		async execute({ message }) {
			try {
				let res = await superagent.get('http://api.yomomma.info/');	
			return this.sendMessage(message.channel, JSON.parse(res.text).joke);
	
			} catch (err) {
				return this.error(message.channel, 'No Mama jokes founds...  Something went wrong.');
			}
		}
	}
	
module.exports = YoMama; 