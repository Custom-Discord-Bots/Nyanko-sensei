const { MessageEmbed } = require('discord.js-light');
const colors = require('./colors');
const tipsManager = require('../utils/tips/tips-manager');
const { prefix } = require('../../config/commands-config.json');
const reactions = require('./reactions');

module.exports = {
   info(color, description) {
      return new MessageEmbed()
         .setColor(color || colors.primary)
         .setTitle('Info')
         .setDescription(description)
         .setFooter(`Use ${prefix}help for support`);
   },

   warn(description) {
      return new MessageEmbed()
         .setColor(colors.warn)
         .setTitle('Warning')
         .setDescription(description)
         .setFooter(`Use ${prefix}help for support`);
   },

   error(description) {
      return new MessageEmbed()
         .setColor(colors.error)
         .setTitle('Error')
         .setDescription(description)
         .setFooter(`Use ${prefix}help for support`);
   },

   tip() {
      return new MessageEmbed()
         .setColor(colors.primary)
         .setDescription(tipsManager.getRandomTip());
   },

   sessionGoalQuestion() {
      return new MessageEmbed()
         .setDescription(`${reactions.x_extended} I noticed that you haven't posted a session goal in <#808687465602613258> yet.`
            + '\nPlease do so within 5 minutes, otherwise you will be kicked out from the study room.');
   },

   thxSessionGoal(userID, goal) {
      return new MessageEmbed()
         .setDescription(`${reactions.ok_extended} <@${userID}> Thank you for posting your session goal:`
            + `\n\n${goal}`
            + '\n\nGood luck! I will check your progress later and will ask you to post another goal after one hour.');
   },

   sessionGoalReminder() {
      return new MessageEmbed()
         .setDescription(`${reactions.error_extended} It's been one hour since you posted your last session goal. Did you finish it?`
            + '\nIf yes, please post a new session goal. If no, kindly repost it.'
            + '\nPlease do so within 5 minutes, otherwise you will be kicked out from the study room.');
   },
};
