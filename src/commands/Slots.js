const { Command } = require('@dyno.gg/dyno-core');

class Slots extends Command {
    constructor(...args) {
        super(...args);

       	this.aliases      = ['slots'];
        this.module       = 'Fun';
        this.description  = 'Spin the slots and win the jackpot! ...or loose everything.';
        this.usage        = 'slots';
        this.example      = 'slots';
        this.cooldown     = 5000;
        this.expectedArgs = 0;
    }

	checkJackpot(gameid, bonus) {
		if(gameid === "555" && bonus === 15) { return true } //basically just checking if the highest possible score was reached
		else { return false }; 
	}
	
	checkTriple(frst, scnd, thrd, gameid) {
		const special = ["154", "215", "512", "451"]; //these gameIDs are valid triples even though they do not follow the standard scheme
		
		if(frst === scnd && scnd === thrd) { return true } //If all emojis on the middle line are the same
		else if(frst - 1 === scnd && scnd === thrd + 1) { return true }  //If all emojis on the diagonal starting at the bottom left are the same
		else if(frst + 1 === scnd && scnd === thrd - 1) { return true } //if all emojis on the diagonal starting at the top left are the same
		else if(special.indexOf(gameid) > -1) { return true } //If it doesnt follow the scheme but is still a valid triple
		else { return false };
	}
	
	checkDouble(frst, scnd, thrd) {
		if(frst === scnd || scnd === thrd) { return true } //If either the first or the last two on the middle line are the same
		else { return false };
	}

	execute({ msg }) {

		const emojis = [":bullettrain_front:",":white_sun_small_cloud:",":lion_face:",":earth_africa:",":crown:",":bullettrain_front:",":white_sun_small_cloud:"]; //Insert emoji strings of whatever you like

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

		msg.channel.createMessage({
			embed:{
				url:"https://dynobot.net/",
				description:`Spinning the wheels of fortune for [${msg.member.username}](https://dynobot.net)...`,
				color: 1259143,
				thumbnail: {
	      			url: "https://s18.postimg.org/hmpvac5qh/dynoslots_spin.gif"
	    		}
			}
		}).then(newmsg => {
			if(checkJackpot(gameid, bonus)) {
				setTimeout(function() { msg.channel.editMessage(newmsg.id, {
					embed:{
						title:"JACKPOT!",
						url:"https://dynobot.net/",
						color: 13496340,
						description:`${result}**Woah, thats a Jackpot!** You were lucky and reached the best result in this game possible!\nNow thats a thing to screenshot and share with your friends, [${msg.member.username}](https://dynobot.net)!`,
						footer:{
							text:`Game played by ${msg.member.username}#${msg.member.discriminator}`,
							icon_url:msg.member.avatarURL
						},
						thumbnail: {
	      					url: "https://s17.postimg.org/w4v2gei1r/tumblr_mh79cf_ON001r88gpzo1_400.gif"
	    				}
					}
				}) }, 2000)		
			} //this thing was made by Mika K.#2002 btw... If my discrim should change in the future or I should go missing, my user ID on Discord is 264762392683085834
			else if(checkTriple(frst, scnd, thrd, gameid)) {
				setTimeout(function() { msg.channel.editMessage(newmsg.id, {
					embed:{
						title:"Congratulations!",
						url:"https://dynobot.net/",
						color: 0x337fd5,
						description:`${result}You got **three in a row**, [${msg.member.username}](https://dynobot.net). Amazing!`,
						footer:{
							text:`Game played by ${msg.member.username}#${msg.member.discriminator}`,
							icon_url:msg.member.avatarURL
						},
						thumbnail: {
							url:"https://s18.postimg.org/u6kzxx9bd/dynoslots_win2.gif"
	    				}
					}
				}) }, 2000)
			}
			else if(checkDouble(frst, scnd, thrd)) {
				setTimeout(function() { msg.channel.editMessage(newmsg.id, {
					embed:{
						title:"Thats a pair!",
						url:"https://dynobot.net/",
						color: 8773445,
						description:`${result}**Thats a pair!**, [${msg.member.username}](https://dynobot.net)! Not bad.`,
						footer:{
							text:`Game played by ${msg.member.username}#${msg.member.discriminator}`,
							icon_url:msg.member.avatarURL
						},
						thumbnail: {
	      					url: "https://s17.postimg.org/j0pi3qd5b/giphy.gif"
	   		 			}
					}
				}) }, 2000)
			}
			else { //if none of the above was true, the player has lost, so no additional check here
				setTimeout(function() { msg.channel.editMessage(newmsg.id, {
					embed:{
						title:"Try again!",
						url:"https://dynobot.net/",
						color: 0xFF0000,
						description:`${result}**You lost,** better luck next time, [${msg.member.username}](https://dynobot.net)!`,
						footer:{
							text:`Game played by ${msg.member.username}#${msg.member.discriminator}`,
							icon_url:msg.member.avatarURL
						},
						thumbnail: {
	    	  				url:"https://s17.postimg.org/dcj7cxgjj/giphy.gif"
	    				}
					}
				}) }, 2000)
			}
		})
	}
}

module.exports = Slots;
