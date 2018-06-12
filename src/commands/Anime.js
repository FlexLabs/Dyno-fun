const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');


class Anime extends Command {
	constructor(...args) {
		super(...args);

		this.name = 'anime';
		this.aliases = ['animu'];
		this.module = 'Fun';
		this.description = 'Get info about an anime';
		this.usage = 'anime <anime>';
		this.example = 'anime acchi kocchi';
		this.cooldown = 5000;
		this.expectedArgs = 1;
	}

	async execute({ message, args }) {
		const msg = await this.sendMessage(message.channel, {
			embed: {
				color: 0x337fd5,
				thumbnail: {
					url: 'https://cdn.dyno.gg/fun/discord_loading.gif',
				},
				title: 'Looking for an anime...',
			},
		});
		let res;
		let anime;

		try {
			res = await superagent.get(`https://api.jikan.me/search/anime/${args.slice(1).join(' ')}/1`);
			anime = res.body.result[0];
		} catch (err) {
			return msg.edit({
				content: `${this.utils.emoji.error} I couldn't find any.`,
				embed: {},
			});
		}
		return msg.edit({
			embed: {
				author: {
					name: `${anime.title}`,
					url: `${anime.url}`,
					icon_url: 'https://myanimelist.cdn-dena.com/img/sp/icon/apple-touch-icon-256.png',
				},
				color: 0x337fd5,
				thumbnail: {
					url: anime.image_url,
				},
				timestamp: new Date(),
				fields: [{
						name: 'Episodes',
						value: `${anime.episodes}`,
						inline: true,
					},
					{
						name: 'Type',
						value: `${anime.type}`,
						inline: true,
					},
					{
						name: 'Score',
						value: `${anime.score}`,
						inline: true,
					},
					{
						name: 'Members',
						value: `${anime.members}`,
						inline: true,
					},
					{
						name: 'Description',
						value: `${anime.description}`,
					},
				],
			},
		});
	}
}

module.exports = Anime;
