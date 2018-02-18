const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');


class Country extends Command {
    constructor(...args) {
        super(...args);

        this.aliases      = ['country'];
        this.module       = 'Fun';
        this.description  = 'Check the stats on a country';
        this.usage        = 'country [3 letter country code]';
        this.example      = 'country gbr';
        this.cooldown     = 3500;
        this.expectedArgs = 1;
    }

    async execute({ message }) {
        try {
            let countrycode = args[0];
            let res = await superagent.get('https://restcountries.eu/rest/v2/alpha/' + countrycode);

            let countryname = res.body.name;
            let countrypopulation = res.body.population;
            let countryregion = res.body.subregion;
            let countrycapital = res.body.capital;
            let countrydemonym = res.body.demonym;
            let countryareakm = res.body.area;
            let countryaream = parseInt(countryareakm * 0.62137).toLocaleString('en');
            let countrynativename = res.body.nativeName;
            let countrycurrencyname = res.body.currencies[0].name;
            let countrycurrencysymbol = res.body.currencies[0].symbol;
            let countryflag = `http://www.countryflags.io/${res.body.alpha2Code}/flat/64.png`;

            return this.sendMessage(message.channel, {
                embed: {
                    author: {
                        name: 'Country Information - ' + countrycode.toUpperCase(),
                        icon_url: countryflag
                    },
                    thumbnail: {
                        url: countryflag
                    },
                    color: 0x337fd5,
                    title: countryname,
                    fields: [
                        {
                            name: 'Population',
                            value: countrypopulation.toLocaleString('en'),
                            inline: true
                        },
                        {
                            name: 'Capital City',
                            value: countrycapital,
                            inline: true
                        },
                        {
                            name: 'Main Currency',
                            value: countrycurrencyname + ' (' + countrycurrencysymbol + ')',
                            inline: true
                        },
                        {
                            name: 'Located in',
                            value: countryregion,
                            inline: true
                        },
                        {
                            name: 'Demonym',
                            value: countrydemonym,
                            inline: true
                        },
                        {
                            name: 'Native Name',
                            value: countrynativename,
                            inline: true
                        },
                        {
                            name: 'Area',
                            value: `${countryareakm.toLocaleString('en')}km (${countryaream}m)`,
                            inline: true
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "via restcountries.eu"
                    }
                }
            });
        } catch (err) {
            return this.error(message.channel, 'Error! Unable to fetch country information.');
        }
    }
}

module.exports = Country;
