const { Logger } = require('logger');
const { splitToPlayable } = require('../common/utils');
const allowOver200 = process.env.ALLOW_OVER_200 || require('../../config/settings.json').allow_more_than_200_chars;
const pipotron_list = require('../../data/pipotron.json')
const logger = new Logger();

module.exports = {
  name: 'pipotron',
  group: "user",
  description: `pipotron`,
  emoji: ':juggling:',
  execute(message, options) {
    const { channel } = message.member.voice;
    const { ttsPlayer, name: guildName, voice } = message.guild;
    const connection = voice ? voice.connection : null;
	  options.args = "";
	  var d = false
	  for (let i = 0; i < pipotron_list.length; i++)
	  {
		  tmp = pipotron_list[i][Math.floor(Math.random() * pipotron_list[i].length)]
		  if (d == true)
		  {
			if ("aeiouéè".indexOf(tmp[0]) > -1)
				tmp = "d'" + tmp
			else
				tmp = "de " + tmp
 			d = false
		  }
		  if (tmp[tmp.length - 1] == '#')
		  {
			d = true
		  	tmp = tmp.substring(0,tmp.length - 3)
		  }
		  options.args += tmp + " "
	  }
	  options.args = options.args.split(" ")
    const [atLeastOneWord] = options.args;

    if (!channel) {
      message.reply('you need to be in a voice channel first.');
      return;
    }

    if (!channel.joinable) {
      message.reply('I cannot join your voice channel.');
      return;
    }

    if (!atLeastOneWord) {
      message.reply('you need to specify a message.');
      return;
    }
    if (connection) {
      splitToPlayable(options.args)
        .then((phrases) => {
          ttsPlayer.say(phrases);
        })
        .catch((error) => {
          message.reply(error);
        });
    } else {
      channel.join()
        .then(() => {
          logger.info(`Joined ${channel.name} in ${guildName}.`);
          message.channel.send(`Joined ${channel}.`);
          splitToPlayable(options.args)
            .then((phrases) => {
              ttsPlayer.say(phrases);
            })
            .catch((error) => {
              message.reply(error);
            });
        })
        .catch((error) => {
          throw error;
        });
    }
  }
}
