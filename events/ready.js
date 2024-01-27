const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		/*
     * equivalent to: CREATE TABLE tags(
     * name VARCHAR(255),
     * description TEXT,
     * username VARCHAR(255),
     * usage_count INT NOT NULL DEFAULT 0
     * );
     */
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
