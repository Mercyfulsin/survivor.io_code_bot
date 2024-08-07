// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { BOT_TOKEN } = require('./config.json');

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
    });

client.commands = new Collection();
client.buttons = new Collection();
const commandPath = path.join(__dirname, 'commands');
const buttonPath = path.join(__dirname, 'buttons');
const commandFolders = fs.readdirSync(commandPath);
const buttonFolders = fs.readdirSync(buttonPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(commandPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

for (const folder of buttonFolders) {
	const buttonsPath = path.join(buttonPath, folder);
	const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
	for (const file of buttonFiles) {
		const filePath = path.join(buttonsPath, file);
		const button = require(filePath);
		client.buttons.set(button.data.name, button);
	}
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Error handling for the client
client.on('error', (error) => {
    console.error('The client encountered an error:', error);
});

client.on('shardError', (error) => {
    console.error('A websocket connection encountered an error:', error);
});

// Handle WebSocket errors
client.on('disconnect', (event) => {
    console.warn('The client disconnected from the WebSocket. Reconnecting...', event);
});

client.on('reconnecting', () => {
    console.log('The client is attempting to reconnect to the WebSocket...');
});

client.on('resume', (replayedEvents) => {
    console.log(`The client has resumed and replayed ${replayedEvents} events.`);
});

// Log in to Discord with your client's token
client.login(BOT_TOKEN).catch((error) => {
    console.error('Failed to login:', error);
});