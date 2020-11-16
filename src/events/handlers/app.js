const { Logger } = require('logger');
const TTSPlayer = require('../../classes/TTSPlayer');
const prefix = process.env.PREFIX || require('../../../config/settings.json').prefix;
const { updatePresence, executeCommand } = require('../../common/utils');
const config = require('../../../config/settings.json');

const logger = new Logger();

const handleDebug = (info) => {
  logger.debug(info);
};

const handleError = (error) => {
  logger.error(error);
};

const handleGuildCreate = (guild, client) => {
  logger.info(`Joined ${guild.name} guild!`);
  updatePresence(client);
  guild.ttsPlayer = new TTSPlayer(guild);
  if (config[guild.id])
  {
    guild.config = config[guild.id];
  }
  else
  {
    guild.config = config;
  }
};

const handleGuildDelete = (guild, client) => {
  logger.info(`Left ${guild.name} guild!`);
  updatePresence(client);
  guild.ttsPlayer = null;
};

const handleGuildUnavailable = (guild) => {
  logger.warn(`Guild ${guild.name} is currently unavailable!`);
};

const handleInvalidated = () => {
  logger.error('Client connection invalidated, terminating execution with code 1.');
  process.exit(1);
};

const handleMessage = (message, client) => {
  if (!message.guild.config)
  {
    if (config[message.guild.id])
    {
      message.guild.config = config[message.guild.id];
    }
    else
    {
      message.guild.config = config;
    }
  }
  if (!message.content.startsWith(message.guild.config.prefix) || message.author.bot || !message.guild) {
    return;
  }

  const args = message.content.slice(message.guild.config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const options = {
    args,
    commands: client.commands
  };

  executeCommand(client, message, options, command);
};

const handleReady = (client) => {
  logger.info('Connected to Discord! - Ready.');
  updatePresence(client);

  client.guilds.cache.each((guild) => {
    if (!guild.config && config[guild.id])
    {
      guild.config = config[guild.id];
    }
    else
    {
      guild.config = config;
    }
    guild.ttsPlayer = new TTSPlayer(guild);
  });
};

const handleWarn = (info) => {
  logger.warn(info);
};

module.exports = {
  handleDebug,
  handleError,
  handleGuildCreate,
  handleGuildDelete,
  handleGuildUnavailable,
  handleInvalidated,
  handleMessage,
  handleReady,
  handleWarn
};
