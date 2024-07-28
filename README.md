# Discord Bot for Survivor.io Gift Code Redemption
**Note:** You can run this on your computer, server, vps, or host it on some service. This is not a bot you can just add to your discord.

Survivor.io requires you to visit their [website](https://gift.survivorio.com/) to redeem codes.
You will need to go into your game, copy youd User ID, come back to the website and paste your ID in.
Then you have to enter the code that was announced.
Then you have to enter the captcha.

New code? Please repeat the whole process...

This isn't very fun and a waste of time so why not a bot that can do it from the comfort of Discord?
Discord being what most Clans use to manage their members.
This bot will allow you to store your User ID and automatically submit both UserID and Gift Code.
All you need to do is press a button or two and enter the captcha!

**Update 07/27/2024:** Added support for auto completion of all DB entries using bestcaptchasolver.com as a captcha solver. This does incur a cost so use at your own risk.

## Setup

1. Download the repo, go into the the directory and install requirements
```npm install```

2. Rename `config_EXAMPLE.json` as `config.json` and fill it out with your Bot's Token, Client ID, Guild ID and any other setting found there.

3. Invite your bot to your discord server

4. Initiate DB and Assign Commands

```
1. node syncdb.js
2. node deploy-commands.js 
```

5. Edit `commands/admin-survivor-commands/auto-claim.js` Line #23 and #24 to either replicate allowing any admin to use it, such as `commands/admin-survivor-commands/set-code.js` or just update it to include your own ID if you don't want multiple people having access to a command that can cost you $$$.


## Commands

### /set-code
A Slash command only available to Admins (actually anyone that can Mute members with `PermissionFlagsBits.MuteMembers`) of the server. Whenever a new code is released, simply run the command and fill out the code form. You can change who can set the code by modifying the permission flagbits found in `commands/admin-survivor-commands/set-code.js`.

![setting-code](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/81a90db2-9e31-4f3c-9335-bc1fc7141e83)

### /prune-users
A Slash command only available to Admins (actually anyone that can Mute members with `PermissionFlagsBits.MuteMembers`) of the server. Running this command will delete anyone that is in the DB but is no longer on the server. Useful for cleaning out the DB if you use auto-claim, to save on $ and stop giving benefit to someone no longer playing / in your clan.

### /auto-claim
A Slash command only available to one person (unless modified in Step 5). This command will go through all the users in the DB and attempt to solve the captcha and claim the code. The bot will continue to loop until there are no more Captcha errors or general errors. You can update the concurrent attempts in `config.json`.

### /set-survivor-id
A Slash command that anyone can use. Users should set their ID before attempting to use the bot to redeem codes.
**Note:** Running the command again will override your previous entry.

**Update 07/27/2024:** A role is given to users that have submitted their survivor ID. See `config.json` for the role's ID.

![setting-id](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/f021aed7-aa98-40c4-88eb-6610994bfe0c)

### /get-survivor-id
A Slash command so that you can verify that the stored ID is correct.

### /get-code
A Slash command that returns the latest code. Really not useful. Delete it?

### /delete-survivor-id
A Slash command that allows users to remove themselves from the DB. Doing so also removes the role that is assigned when you enter your survivor ID to the DB.

## Visuals

### After running /set-code
After an admin adds a code, the bot will create a message with a button indicating what the current code is.

![image](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/7ac7b761-c7ed-4f93-ac12-c1116efa89fd)

Once a user clicks on the button and no errors occur (an ID exists for the discord user), a new ephemeral message will appear.
This message contains the captchaCode that the user is required to solve and a button to submit the captcha code.

![image](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/663d9ea8-37a5-4833-8841-6d6889418c31)

## User Perspective

![survivor-io_code_bot](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/6fceacba-669b-440a-9c21-7937e3bbb7f7)
