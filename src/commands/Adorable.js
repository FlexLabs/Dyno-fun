const { Command } = require('@dyno.gg/dyno-core');

class AdorableAvatar extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['adorable', 'adorableavatar', 'adorableav'];
		this.module       = 'Fun';
		this.description  = 'Get an adorable avatar based on your identifier.';
		this.usage        = 'adorable <identifier>';
		this.example      = 'adorable Eleos';
		this.cooldown     = 3000;
		this.expectedArgs = 1;
	}

	execute({ message, args }) {
		return this.sendMessage(message.channel, {embed: {
        title: `Getting an adorable ${args}!`,
        color: 0x3498db,
        image: {
            url: `https://api.adorable.io/avatars/285/${args}.png`,
        },
        url: `https://api.adorable.io/avatars/285/${args}.png`,
      },
    });
	}
}

module.exports = AdorableAvatar;
