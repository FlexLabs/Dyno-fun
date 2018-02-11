const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');


class Cat extends Command {
    constructor(...args) {
        super(...args);
        this.name         = 'cat'
        this.aliases      = ['kitty'];
        this.module        = 'Fun';
        this.description  = 'Find some cute cat pictures';
        this.usage        = 'cat';
        this.example      = 'cat';
        this.cooldown     = 3500;
        this.expectedArgs = 0;
    }

async execute({ message }) {
    try {
            let res = await superagent.get('http://thecatapi.com/api/images/get?format=src&results_per_page=1');
            return this.sendMessage(message.channel, ({
                embed: {
                    title: "🐱 Meowww..",
                    color: 0x3498db,
                    image: {
                        url: res.redirects[0]
                    },
                    footer: {
                        text: res.redirects[0]
                    }
                }
            });
        } catch(err) {
            return this.error(message.channel, 'An error occured: No cats found.');
        }
    }
}

module.exports = Cat;
