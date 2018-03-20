const { Command } = require('@dyno.gg/dyno-core');

// this thing was made by Mika K.#2002 btw... If my discrim should change in the future or I should go missing, my user ID on Discord is 264762392683085834
class Slots extends Command {
	constructor(...args) {
		super(...args);

		this.aliases = ['slots'];
		this.module = 'Fun';
		this.description = 'Spin the slots and win the jackpot! ...or lose everything.';
		this.usage = 'slots';
		this.example = 'slots';
		this.cooldown = 5000;
		this.expectedArgs = 0;
	}

	checkJackpot(gameid, bonus) {
		// basically just checking if the highest possible score was reached
		if (gameid === '555' && bonus === 15) {
			return true;
		} else {
			return false;
		}
	}

	checkTriple(frst, scnd, thrd, gameid) {
		// these gameIDs are valid triples even though they do not follow the standard scheme
		const special = ['154', '215', '512', '451'];

		// If all emojis on the middle line are the same
		if (frst === scnd && scnd === thrd) {
			return true;
		} else if (frst - 1 === scnd && scnd === thrd + 1) { // If all emojis on the diagonal starting at the bottom left are the same
			return true;
		} else if (frst + 1 === scnd && scnd === thrd - 1) { // if all emojis on the diagonal starting at the top left are the same
			return true;
		} else if (special.indexOf(gameid) > -1) { // If it doesnt follow the scheme but is still a valid triple
			return true;
		} else {
			return false;
		}
	}

	checkDouble(frst, scnd, thrd) {
		// If either the first or the last two on the middle line are the same
		if (frst === scnd || scnd === thrd) {
			return true;
		} else {
			return false;
		}
	}

	execute({ message }) {
		const emojis = [':bullettrain_front:', ':white_sun_small_cloud:', ':lion_face:', ':earth_africa:', ':crown:', ':bullettrain_front:', ':white_sun_small_cloud:']; // Insert emoji strings of whatever you like

		let frst = Math.floor(Math.random() * 5) + 1;
		let scnd = Math.floor(Math.random() * 5) + 1;
		let thrd = Math.floor(Math.random() * 5) + 1;
		let bonus = Math.floor(Math.random() * 10) + 6;
		let gameid = frst.toString() + scnd.toString() + thrd.toString();

		let result = `\n<:dynov4:341008963254484992> ***DYNO SLOTS*** <:dynov4:341008963254484992>\n\n`;
		result += `--------------------------\n`;
		result += `\\\u2198     ${emojis[frst - 1]}  ${emojis[scnd - 1]}  ${emojis[thrd - 1]}     \\\u2199\n\n`;
		result += `\\\u25B6    ${emojis[frst]}  ${emojis[scnd]}  ${emojis[thrd]}    \\\u25C0\n\n`;
		result += `\\\u2197     ${emojis[frst + 1]}  ${emojis[scnd + 1]}  ${emojis[thrd + 1]}     \\\u2196`;
		result += `\n--------------------------\n\n\n`;

		message.channel.createMessage({
			embed: {
				url: 'https://dynobot.net/',
				description: `Spinning the wheels of fortune for [${message.member.username}](https://dynobot.net)...`,
				color: 1259143,
				thumbnail: {
					url: 'https://s18.postimg.org/hmpvac5qh/dynoslots_spin.gif',
				},
			},
		}).then(newmsg => {
			if (this.checkJackpot(gameid, bonus)) {
				setTimeout(() => {
					message.channel.editMessage(newmsg.id, {
						embed: {
							title: 'JACKPOT!',
							url: 'https://dynobot.net/',
							color: 13496340,
							description: `${result}**Woah, thats a Jackpot!** You were lucky and reached the best result in this game possible!\nNow thats a thing to screenshot and share with your friends, [${message.member.username}](https://dynobot.net)!`,
							footer: {
								text: `Game played by ${message.member.username}#${message.member.discriminator}`,
								icon_url: message.member.avatarURL,
							},
							thumbnail: {
								url: 'https://s17.postimg.org/w4v2gei1r/tumblr_mh79cf_ON001r88gpzo1_400.gif',
							},
						},
					});
				}, 2000);
			} else if (this.checkTriple(frst, scnd, thrd, gameid)) {
				setTimeout(() => {
					message.channel.editMessage(newmsg.id, {
						embed: {
							title: 'Congratulations!',
							url: 'https://dynobot.net/',
							color: 0x337fd5,
							description: `${result}You got **three in a row**, [${message.member.username}](https://dynobot.net). Amazing!`,
							footer: {
								text: `Game played by ${message.member.username}#${message.member.discriminator}`,
								icon_url: message.member.avatarURL,
							},
							thumbnail: {
								url: 'https://s18.postimg.org/u6kzxx9bd/dynoslots_win2.gif',
							},
						},
					});
				}, 2000);
			} else if (this.checkDouble(frst, scnd, thrd)) {
				setTimeout(() => {
					message.channel.editMessage(newmsg.id, {
						embed: {
							title: 'Thats a pair!',
							url: 'https://dynobot.net/',
							color: 8773445,
							description: `${result}**Thats a pair!**, [${message.member.username}](https://dynobot.net)! Not bad.`,
							footer: {
								text: `Game played by ${message.member.username}#${message.member.discriminator}`,
								icon_url: message.member.avatarURL,
							},
							thumbnail: {
								url: 'https://s17.postimg.org/j0pi3qd5b/giphy.gif',
							},
						},
					});
				}, 2000);
			} else { // if none of the above was true, the player has lost, so no additional check here
				setTimeout(() => {
					message.channel.editMessage(newmsg.id, {
						embed: {
							title: 'Try again!',
							url: 'https://dynobot.net/',
							color: 0xFF0000,
							description: `${result}**You lost,** better luck next time, [${message.member.username}](https://dynobot.net)!`,
							footer: {
								text: `Game played by ${message.member.username}#${message.member.discriminator}`,
								icon_url: message.member.avatarURL,
							},
							thumbnail: {
								url: 'https://s17.postimg.org/dcj7cxgjj/giphy.gif',
							},
						},
					});
				}, 2000);
			}
		});
	}
}

module.exports = Slots;
