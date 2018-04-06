const superagent = require('superagent');

class Prefetcher {
    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.cache = [];
    }

    get() {
        let item = this.cache[0];
        this.cache.splice(0, 1);
        this.prefetch();
        return item;
    }

    async prefetch() {
        let res = await superagent
            .get(this.url)
            .set({ Authorization: this.options.auth ? this.options.auth : '' })
            .set({ Accept: this.options.accept ? this.options.accept : 'application/json' });

        this.cache.push(res);
    }

    init() {
        for(let i = 0; i < 4; i++) {
            this.prefetch();
        }
    }
}

module.exports = Prefetcher;
