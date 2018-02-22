const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Trivia extends Command {
	constructor(...args) {
		super(...args);

		this.aliases        = ['trivia']; 
		this.module         = 'Fun';
		this.description    = 'Trivia time, get some friends and get a trivia game started! ';
		this.usage          = 'trivia';
		this.example        = 'trivia';
		this.cooldown       = 5000;
		this.expectedArgs   = 0;
	}	

		async execute({ message }) {
			try {
				let res = await superagent.get('http://jservice.io/api/random'); // http://jservice.io/api/random is the api site, there is so much to add.  
				set("Accept", "application/json")
               	 		return this.sendMessage(message.channel, res.body[0].question);
	
			} catch (err) {
				return this.error(message.channel, 'No Trivia questions found... Something went wrong');
			}
		}
	}
	
module.exports = Trivia; 
