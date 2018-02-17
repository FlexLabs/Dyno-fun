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
            let res = await superagent.get('https://https://restcountries.eu/rest/v2/alpha/' + countrycode);

            let countryname = res.body.name;
            let countrypopulation = res.body.population;
            let countryregion = res.body.subregion;
            let countrycapital = res.body.capital;
            let countrydemonym = res.body.demonym;
            let countryarea = res.body.area;
            let countrynativename = res.body.nativeName;
            let countrycurrencyname = res.body.currencies[0].name;
            let countrycurrencysymbol = res.body.currencies[0].symbol;
            
            return this.sendMessage(message.channel, {
                embed: {
                    author: {
                        name: 'Country Information - ' + countrycode,
                    },
                    title: countryname,
                    fields: [
                        {
                            name: 'Population',
                            value: countrypopulation
                        },
                        {
                            name: 'Located in',
                            value: countryregion
                        },
                        {
                            name: 'Capital City',
                            value: countrycapital
                        },
                        {
                            name: 'Demonym',
                            value: countrydemonym
                        },
                        {
                            name: 'Area',
                            value: countryarea
                        },
                        {
                            name: 'Native Name',
                            value: countrynativename
                        },
                        {
                            name: 'Main currency',
                            value: countrycurrencyname + ' (' + countrycurrencysymbol + ')'
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "via restcountries.eu"
                    }
                }
            });
        } catch(err) {
            return this.error(message.channel, 'Error! Unable to fetch country information.');
        }
    }
}

module.exports = SteamStatus;