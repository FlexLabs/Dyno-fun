const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class CatFacts extends Command {
	constructor(...args) {
		super(...args);

		this.aliases        = ['catfact', 'catfacts']; // meow facts
		this.module         = 'Fun';
		this.description    = 'Get random Cat Facts with this commmand';
		this.usage          = 'catfact';
		this.example        = 'catfact';
		this.cooldown       = 5000;
		this.expectedArgs   = 1;
	}	

		async execute({ message }) {
			try {
				let res = await superagent.get('https://catfact.ninja/fact');
				
				return this.sendMessage(message.channel, res.body.value.joke);
	
			} catch (err) {
				return this.error(message.channel, 'No Cat facts founds.. Something went wrong.');
			}
			
		}
		
	}
	
	module.exports = CatFacts; 


