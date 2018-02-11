const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Define extends Command {
    constructor(...args) {
	    super(...args);

	    this.aliases      = ['define'];
	    this.module       = 'Fun';
	    this.description  = 'Define a word.';
	    this.usage        = 'define [word]';
	    this.example      = 'define discord';
	    this.cooldown     = 3000;
	    this.expectedArgs = 0;
    }

    async execute({ message, args }) {
        let word = args[0];
	    try {
            let res = await superagent.get('http://api.pearson.com/v2/dictionaries/ldoce5/entries').query({'headword': word});
            res = JSON.parse(res.text);

            let definition = res.results[0].senses[0].definition[0];
            let example = res.results[0].senses[0].examples[0].text;
            let part_of_speech = res.results[0].part_of_speech;

            return this.sendMessage(message.channel, {embed: {
                title: `Word: ${word}`,
                description: `**Definition:** ${definition}\n\n**Example:** ${example}`,
                color: 0x3498db,
                footer: {
                    text: `Part of speech: ${part_of_speech}`
                },
                timestamp: new Date()
            }});
	    } catch(err) {
	        return this.error(message.channel, 'An error occured: Unable to find definition.');
	    }
    }
}

module.exports = Define;
