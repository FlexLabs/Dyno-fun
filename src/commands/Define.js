const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Define extends Command {
    constructor(...args) {
	    super(...args);

	    this.aliases      = ['define'];
	    this.module       = 'Fun';
	    this.description  = 'Define a word.';
	    this.usage        = 'define [word]';
	    this.example      = 'define dyno';
	    this.cooldown     = 3000;
	    this.expectedArgs = 0;
    }

    async execute({ message, args }) {
        const dynoWords = [ 'dyno', '168274283414421504', '155149108183695360'];
        let word = args[0];
	    try {
            let res = await superagent.get('http://api.pearson.com/v2/dictionaries/ldoce5/entries').query({'headword': word});
            res = JSON.parse(res.text);
            let definition;
            let example;
            let part_of_speech;

            if (dynoWords.find(w => word.toLowerCase().startsWith(w))) {
                //definition = this.dyno.globalConfig.definition || `Moderation. Music. Commands. Utilities. Fun. It's the best Discord bot™`;
                definition = `Moderation. Music. Commands. Utilities. Fun. It's the best Discord bot™`;
                example = 'Dude have you checked out Dyno? It\'s literally the best bot.';
                part_of_speech = 'best bot';
            }
            else {
                definition = res.results[0].senses[0].definition[0];
                example;
                if (!res.results[0].senses[0].examples) example = 'No example given.';
                else example = res.results[0].senses[0].examples[0].text;
                part_of_speech = res.results[0].part_of_speech;
            }

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