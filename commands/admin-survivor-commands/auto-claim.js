const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const bestcaptchasolver = require('bestcaptchasolver');
const SurvivorId = require('../../database/models/survivorId');
const { ACCESS_TOKEN, CONCURRENT_CODE_REDEEMS } = require('../../config.json');
const CONCURRENT = CONCURRENT_CODE_REDEEMS;
const CAPTCHA_ERROR = "20002";
const ERROR = "Error";

bestcaptchasolver.set_access_token(ACCESS_TOKEN);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auto-claim')
    .setDescription('Auto claims the input code for all stored Survivors!')
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('Code to claim')
        .setRequired(true),
    ),
  async execute(interaction) {
    if (interaction.user.id !== '137843252337442817') {
      return interaction.reply('Only Mercyfulsin has permission!');
    }

    await interaction.deferReply();
    const code_input = await interaction.options.getString('code');

    try {
      let survivorListID = [];
      const survivorList = await SurvivorId.findAll({ attributes: ['survivorId'] });
      survivorList.forEach(survivor => survivor.survivorId !== null ? survivorListID.push(survivor.survivorId) : '');

      if (survivorList.length === 0) {
        return interaction.editReply('No survivors found!');
      }

      bestcaptchasolver.account_balance().then(function (balance) {
        console.log('Starting Balance: $', balance);
      });

      let httpResults = {};
      httpResults['Error'] = [];
      httpResults[CAPTCHA_ERROR] = [];

      const processSurvivors = async (survivorListID) => {
        let results = [];
        for (let i = 0; i < survivorListID.length; i += CONCURRENT) {
          const group = survivorListID.slice(i, i + CONCURRENT);

          const promises = group.map(async (survivor) => {
            try {
              // Step 1: Fetch the captchaId
              const response = await fetch('https://mail.survivorio.com/api/v1/captcha/generate', {
                method: 'POST',
                headers: {
                  accept: 'application/json, text/plain, */*',
                  'accept-language': 'en-US,en;q=0.9,es-US;q=0.8,es;q=0.7,uk;q=0.6',
                  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                  'sec-ch-ua-mobile': '?0',
                  'sec-ch-ua-platform': '"Windows"',
                  'sec-fetch-dest': 'empty',
                  'sec-fetch-mode': 'cors',
                  'sec-fetch-site': 'same-site',
                  referer: 'https://gift.survivorio.com/',
                  'referrer-policy': 'strict-origin-when-cross-origin',
                }
              });

              if (!response.ok) {
                throw new Error(`Failed to fetch captcha: ${response.status}`);
              }

              const data = await response.json();
              const captchaId = data.data.captchaId;
              const captchaImageUrl = `https://mail.survivorio.com/api/v1/captcha/image/${captchaId}`;
              console.log(captchaImageUrl);
              const imageResponse = await fetch(captchaImageUrl);
              if (!imageResponse.ok) {
                throw new Error(`Failed to fetch Image: ${imageResponse.status}`);
              }

              const buffer = await imageResponse.arrayBuffer();
              const imageBase64 = Buffer.from(buffer).toString('base64');

              const captchaSolution = await bestcaptchasolver.submit_captcha({
                b64image: imageBase64,
                alphanumeric: 1,
                minlength: 4,
                maxlength: 4
              });

              const final = await bestcaptchasolver.retrieve_captcha(captchaSolution);

              const submitCode = await fetch(
                'https://mail.survivorio.com/api/v1/giftcode/claim',
                {
                  method: 'POST',
                  headers: {
                    accept: 'application/json, text/plain, */*',
                    'content-type': 'application/json',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    referer: 'https://gift.survivorio.com/',
                    'referrer-policy': 'strict-origin-when-cross-origin',
                  },
                  body: JSON.stringify({
                    userId: survivor,
                    giftCode: code_input,
                    captcha: final.text,
                    captchaId: captchaId
                  })
                }
              );

              if (!submitCode.ok) {
                throw new Error(`Failed to submit code: ${submitCode.status}`);
              }

              const finalRes = await submitCode.json();
              console.log(`Survivor: ${survivor} - Code: ${code_input} - Result: ${finalRes.code}: ${finalRes.message}`);
              if (httpResults[finalRes.code]) {
                httpResults[finalRes.code].push(survivor);
              } else {
                httpResults[finalRes.code] = [];
                httpResults[finalRes.code].push(survivor);
              }
              return `Survivor: ${survivor} - Code: ${code_input} - Result: ${finalRes.code}: ${finalRes.message}`;
            } catch (error) {
              console.error(`Unexpected error for ${survivor}: ${error}`);
              httpResults['Error'].push(survivor);
              return `Survivor: ${survivor} - Error: ${error.message}`;
            }
          });

          const groupResults = await Promise.all(promises);
          results.push(...groupResults);

          // Edit the reply after processing each group
          await interaction.editReply(`Currently on wave ${i}`);
        }
        return results;
      };

      let allResults = await processSurvivors(survivorListID);

      // Loop until no "20002" and "Error" keys are present
      while (httpResults[CAPTCHA_ERROR].length > 0 || httpResults['Error'].length > 0) {
        const retryList = [...httpResults[CAPTCHA_ERROR], ...httpResults[ERROR]];
        httpResults[CAPTCHA_ERROR] = [];
        httpResults[ERROR] = [];

        const retryResults = await processSurvivors(retryList);
        allResults.push(...retryResults);
      }

      console.log(`Results:\n ${allResults.join('\n')}`);
      console.log(`HTTP\n${JSON.stringify(httpResults)}`);

      // Send the final reply with all the results
      await interaction.editReply(`Final Results: Check Logs!!`);
    } catch (error) {
      console.error(error);
      httpResults['Error'].push(survivor);
      return interaction.editReply('An error occurred while processing the request!');
    }
  }
};
