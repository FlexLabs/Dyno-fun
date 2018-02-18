const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');
const math = require('mathjs');
//

function hasTypes(i) {
	return /[+-/*^%]/.test(i);
};	
async function request(i) {
   	return await superagent.get(`http://numbersapi.com/${i}?json`);
};  
//

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

	async execute({ message, args }) {
		const input = args.join(' ');
        const errmsg = {
            exp: 'Couldn\'t evaluate the given expression',
            err: 'An Error Occured',
            fact: 'Couldn\'t get any facts for that number'
        };
        let res; // Used to get number facts
        let output; // Output from mathjs 
        let result = {}; // Sends the result message
            result.embed = {};
            result.embed.fields = [];
            result.embed.color = 0x41dae2;

        if(args.length > 1) { // If args is more than 1 word, example: 1 + 1
            try {
                output = math.eval(input).toString();

                result.embed.fields.push({
                    name: 'Input',
                    value: input,
                    inline: false
                });

                result.embed.fields.push({
                    name: 'Output',
                    value: output,
                    inline: false
                });

            } catch (e) {
                result = errmsg.exp;
            };
        } else if(args.length == 1 && hasTypes(args[0])) { // If args is a math expression in 1 word, example: 1+1
            try {
                output = math.eval(input).toString();

                result.embed.fields.push({
                    name: 'Input',
                    value: input,
                    inline: false
                });

                result.embed.fields.push({
                    name: 'Output',
                    value: output,
                    inline: false
                });

            } catch (e) {
                result = errmsg.exp;
            };
        } else if(args[0] == 'fact') { // Get a fact about a random number
            try {

                res = await request('random/math');

                if(res.body.found) {
                    result.embed.fields.push({
                        name: `Fact about ${res.body.number}`,
                        value: res.body.text,
                        inline: false
                    });
                }
            } catch (e) {
                result = errmsg.err;
            };
        } else if(args.length == 1 && isNaN(args[0])) { // If args is 1 word and NaN, example: pi 
            try {
                output = math.eval(input).toString();
                
                result.embed.fields.push({
                    name: 'Input',
                    value: input,
                    inline: false
                });

                result.embed.fields.push({
                    name: 'Output',
                    value: output,
                    inline: false
                });

                res = await request(`${output.split('.')[0]}/math`);

                if(res.body.found) {
                    result.embed.fields.push({
                        name: `Fact about ${res.body.number}`,
                        value: res.body.text,
                        inline: false
                    });
                }
            } catch (e) {
                result = errmsg.exp;
            };
        } else { // If args is just a number, not an experssion, example: 123
            output = math.eval(input).toString();

            res = await request(`${output.split('.')[0]}/math`);

            if(res.body.found) {
                result.embed.fields.push({
                    name: `Fact about ${res.body.number}`,
                    value: res.body.text,
                    inline: false
                });
            } else {
            result = errmsg.fact;
            }
        }

        this.sendMessage(message.channel, result);
	}
}

module.exports = Math;
