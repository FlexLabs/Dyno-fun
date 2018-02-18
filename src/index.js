const { Module } = require('@dyno.gg/dyno-core');
const commands = require('./commands');

/**
 * Fun Module
 * @class Fun
 * @extends Module
 */
class Fun extends Module {
	constructor(...args) {
		super(...args);
		this.module = 'Fun';
		this.friendlyName = 'Fun';
		this.description = 'Adds fun commands to your server!';
		this.list = true;
		this.enabled = true;
		this.hasPartial = false;
		this.commands = commands;
	}

	start() {}
}

exports.Fun = Fun;
