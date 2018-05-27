const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');
const math = require('mathjs');
const limitedEval = math.eval;

/* eslint-disable func-names */
math.import({
    import:     function() { throw new Error('Import is disabled'); },
    createUnit: function() { throw new Error('CreateUnit is disabled'); },
    unit:       function() { throw new Error('Unit is disabled'); },
    eval:       function() { throw new Error('Eval is disabled'); },
    parse:      function() { throw new Error('Parse is disabled'); },
    simplify:   function() { throw new Error('Simplify is disabled'); },
    derivative: function() { throw new Error('Derivative is disabled'); },
    config:     function() { throw new Error('Config is disabled'); },
}, { override: true });
/* eslint-enable func-names */

async function request(i) {
    return await superagent.get(`http://numbersapi.com/${i}?json`);
}

class Math extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['math', 'calc'];
		this.module       = 'Fun';
		this.description  = 'Math command';
		this.usage        = ['math [math expression]', 'math fact'];
		this.example      = ['math 152 + 37', 'math pi * 3', 'math 12.7 cm to inch'];
		this.cooldown     = 3000;
        this.expectedArgs = 1;
        this.commands = [
            {
                name: 'fact',
                desc: 'Get a fact about a random number',
                usage: 'fact',
                cooldown: 3000,
            },
            {
                name: 'info',
                desc: 'Get info about a math function or data type',
                usage: 'info [math function / data type]',
                cooldown: 3000,
            },
        ];
	}

	async execute({ message, args }) {
		const input = args.join(' ');
        let res; // Used to get number facts
        let output; // Output from mathjs
        let result = {}; // Sends the result message
            result.embed = {};
            result.embed.fields = [];
            result.embed.color = 0x41dae2;

        if (args.length === 1 && !isNaN(args[0])) {
            res = await request(`${args[0]}/math`);
            if (res.body.found) {
                result.embed.fields.push({
                    name: `Fact about ${res.body.number}`,
                    value: res.body.text,
                    inline: false,
                });
            } else {
                result.embed.fields.push({
                    name: 'Input',
                    value: input,
                    inline: false,
                });

                result.embed.fields.push({
                    name: 'Output',
                    value: output,
                    inline: false,
                });
            }
        } else {
            try {
                output = limitedEval(input).toString();

                result.embed.fields.push({
                    name: 'Input',
                    value: input,
                    inline: false,
                });

                result.embed.fields.push({
                    name: 'Output',
                    value: output,
                    inline: false,
                });
            } catch (e) {
                return this.sendError(message.channel, e.message);
            }
        }

        return this.sendMessage(message.channel, result);
    }

    async fact({ message }) {
        try {
            const res = await request('random/math');

            if (res.body.found) {
                return this.sendMessage(message.channel, {
                    embed: {
                        color: 0x41dae2,
                        fields: [
                            {
                                name: `Fact about ${res.body.number}`,
                                value: res.body.text,
                                inline: false,
                            },
                        ],
                    },
                });
            }
        } catch (e) {
            return this.sendError(message.channel, 'An error occured');
        }
    }

    async info({ message, args }) {
        try {
            const helpJson = math.help(args[0]).toJSON();
            return this.sendMessage(message.channel, {
                embed: {
                    color: this.bot.configs.confTemplate.embed.colors.global,
                    fields: [
                        {
                            name: helpJson.name,
                            value: helpJson.description,
                            inline: false,
                        }, {
                            name: 'Syntax',
                            value: helpJson.syntax.join('\n'),
                            inline: false,
                        }, {
                            name: 'Examples',
                            value:  helpJson.examples.join('\n'),
                            inline: false,
                        },
                    ],
                    footer: {
                        text: `Category: ${helpJson.category}`,
                    },
                },
            });
        } catch (e) {
            return this.sendError(message.channel, 'Couldn\'t find that function or data type');
        }
    }
}

module.exports = Math;
