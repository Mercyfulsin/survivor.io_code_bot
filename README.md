# Discord Bot for Survivor.io Gift Code Redemption

Survivor.io requires you to visit their [website](https://gift.survivorio.com/) to redeem codes.
You will need to go into your game, copy youd User ID, come back to the website and paste your ID in.
Then you have to enter the code that was announced.
Then you have to enter the captcha.

New code? Please repeat the whole process...

This isn't very fun and a waste of time so why not a bot that can do it from the comfort of Discord?
Discord being what most Clans use to manage their members.
This bot will allow you to store your User ID and automatically submit both UserID and Gift Code.
All you need to do is press a button or two and enter the captcha!

## Commands

### /set-code
A Slash command only available to Admins of the server. Whenever a new code is released, simply run the command and fill out the code form.
![setting-code](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/81a90db2-9e31-4f3c-9335-bc1fc7141e83)

### /set-survivor-id
A Slash command that anyone can use. Users should set their ID before attempting to use the bot to redeem codes.
**Note:** Running the command again will override your previous entry.
![setting-id](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/f021aed7-aa98-40c4-88eb-6610994bfe0c)

### /get-survivor-id
A Slash command so that you can verify that the stored ID is correct.

## Visuals

### After running /set-code
After an admin adds a code, the bot will create a message with a button indicating what the current code is.
![image](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/7ac7b761-c7ed-4f93-ac12-c1116efa89fd)

Once a user clicks on the button and no errors occur (an ID exists for the discord user), a new ephemeral message will appear.
This message contains the captchaCode that the user is required to solve and a button to submit the captcha code.
![image](https://github.com/Mercyfulsin/survivor.io_code_bot/assets/16928058/663d9ea8-37a5-4833-8841-6d6889418c31)
