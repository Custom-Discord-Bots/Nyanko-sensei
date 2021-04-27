const commandHandler = require('../../command-handler/command-handler');
const permissionsHandler = require('../../discord-utils/permissions-handler');
const cooldownManager = require('../../utils/cooldowns-manager');
const embeds = require('../../graphics/embeds');
const Logger = require('../../utils/logger');
const Ctx = require('../../command-handler/Ctx');
const commandConfigs = require('../../../config/commands-config.json');
const { prefix } = require('../../../config/commands-config.json');

const openedTickets = [];

module.exports = async (client, message) => {
   try {
      // Don't listen to bot messages
      if (message.author.bot) {
         return;
      }

      if (openedTickets.includes(message.channel.id)) {
         return;
      }

      // Tickets
      if (!message.guild) {
         openedTickets.push(message.channel.id);

         const { content } = message;
         const mainServer = client.guilds.resolve('434318830416822273');

         const sChannel = await mainServer.channels.create(message.author.username, {
            parent: '834979470187823114',
            permissionOverwrites: [
               {
                  id: mainServer.id,
                  deny: ['VIEW_CHANNEL'],
               },
               {
                  id: '834975515668512790',
                  allow: ['VIEW_CHANNEL'],
               },
               {
                  id: '800870831109832764',
                  allow: ['VIEW_CHANNEL'],
               },
            ],
         });

         await sChannel.send(embeds.newTicket(message.author.username));
         await sChannel.send(content);

         const pmFilter = (m) => !m.author.bot;
         const smFilter = (m) => !m.author.bot;

         const pmCollector = message.channel.createMessageCollector(pmFilter);
         const smCollector = sChannel.createMessageCollector(smFilter);

         let archived = false;

         pmCollector.on('collect', async (m) => {
            sChannel.send(m.content);
         });

         pmCollector.on('end', () => {
            message.channel.send('Ticket closed');
         });

         smCollector.on('collect', async (m) => {
            if (m.content === `${prefix}archive`) {
               archived = true;
               await m.react('🆗');
            }
            if (m.content === `${prefix}close`) {
               await m.react('🆗');
               pmCollector.stop();
               smCollector.stop();
               return;
            }

            message.channel.send(m.content)
               .catch(() => {
                  sChannel.send(embeds.error('Failed to send private message to user!'));
               });
         });

         smCollector.on('end', () => {
            const index = openedTickets.indexOf(message.channel.id);
            if (index > -1) {
               openedTickets.splice(index, 1);
            }

            if (!archived) {
               sChannel.delete('Deleted ticket channel');
            }
         });
      } else {
         const { guild, channel, member } = message;


         // COMMAND CHECK

         const commandCheck = await commandHandler.getCommandData(message, commandConfigs.prefix);
         if (!commandCheck.command) {
            return;
         }

         const { command, args } = commandCheck;

         if (command.reqArgs && !args.length) {
            await channel.send(embeds.error('The command is missing some arguments'));
            return;
         }

         // PERMISSIONS CHECK
         const missingTextPerms = permissionsHandler.checkTextPerms(channel);
         if (missingTextPerms.length > 0) {
            await channel.send(embeds.error(`Missing text channel permissions:\n- ${missingTextPerms.join('\n- ')}`));
            return;
         }

         const missingGuildPerms = permissionsHandler.checkGuildPerms(guild);
         if (missingGuildPerms.length > 0) {
            await channel.send(embeds.error(`Missing server permissions:\n- ${missingGuildPerms.join('\n- ')}`));
            return;
         }

         if (command.category.toLowerCase() === 'moderators' && !member.hasPermission('ADMINISTRATOR')) {
            return channel.send(embeds.error('You need admin permissions to use this command.'));
         }

         // COOLDOWN CHECK
         const userOnCooldown = await cooldownManager.isCmdOnCooldown(member.id, command);
         if (userOnCooldown) {
            await channel.send(embeds.error('Cooldown mate'));
            return;
         }


         // EXECUTE THE COMMAND
         const ctx = new Ctx(message, command.name, args);

         const error = await commandHandler.runCommand(ctx);
         Logger.command(ctx);
         if (error) {
            await channel.send(embeds.error(`Error while executing the command ${command.name}`));
            Logger.error(`Error caused by the ${ctx.commandName} command`, error);
         }
      }
   } catch (e) {
      Logger.error('Error from message event', e);
   }
};
