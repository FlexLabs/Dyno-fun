const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Dog extends Command {

    constructor(...args) {
        super(...args);

        this.name         = 'dog'
        this.aliases      = ['dog', 'puppy', 'doggo'];
        this.module       = 'Fun';
        this.description  = 'Find some cute dog pictures';
        this.usage        = 'dog';
        this.example      = 'dog';
        this.cooldown     = 3500;
        this.expectedArgs = 0;
    }

    async execute({ message }) {

         try {
            let res = await superagent.get('https://dog.ceo/api/breeds/image/random');
            return this.sendMessage(message.channel, {
                embed: {
                    title: `${this.config.emojis.dog || '🐶'} Woof!`,
                    color: 0x3498db,
                    image: {
                        url: res.body.message
                    },
                    footer: {
                        text: res.body.message
                    }
                }
            });
        } catch(err) {
            return this.error(message.channel, `Error: ${this.config.emojis.saddog || ''} No dogs found.`);
        }
    }
}

module.exports = Dog;
