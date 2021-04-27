const embeds = require('../../graphics/embeds');
const logger = require('../../utils/logger');

const rolesToHandle = ['757558822272499753', '765767478982213634', '792647495183630336'];

async function handleSession(channelID, member, notiChat, firstTime) {
   const userID = member.id;

   if (!member.voice.channelID || channelID !== member.voice.channelID) {
      return;
   }

   await notiChat.send(`<@${userID}>`, { embed: firstTime ? embeds.sessionGoalQuestion() : embeds.sessionGoalReminder() });

   const messageFilter = (m) => m.author.id === userID;
   const messageCollector = notiChat.createMessageCollector(messageFilter, { time: 300000 });
   let collected = false;

   messageCollector.on('collect', async (m) => {
      collected = true;
      messageCollector.stop();

      const goal = m.content;
      await notiChat.send(embeds.thxSessionGoal(userID, goal));
      setTimeout(() => {
         handleSession(channelID, member, notiChat, false);
      }, 3600000);
   });
   messageCollector.on('end', async () => {
      if (!collected && member.voice.channelID === channelID) {
         await member.voice.kick('User hasn\'t sent a session goal');
      }
   });
}

async function handleRoles(oldState, newState) {
   if (newState && newState.channelID === '808682176677019728') {
      await newState.member.roles.remove(rolesToHandle);
   // eslint-disable-next-line max-len
   } else if (oldState && (oldState.channel && oldState.channel.parentID === '777053324775260160') && (newState && newState.channel ? newState.channel.parentID !== '777053324775260160' : true)) {
      await oldState.member.roles.add(rolesToHandle);
   }
}

module.exports = async (client, oldState, newState) => {
   if (newState.channelID === '834643133513072680' || oldState.channelID === '834643133513072680') {
      return;
   }
   try {
      await handleRoles(oldState, newState);

      // eslint-disable-next-line max-len
      if (!newState.channel || newState.channel.parentID !== '777053324775260160' || newState.channelID === '808682176677019728') {
         return;
      }

      if (newState.channelID === oldState.channelID) {
         return;
      }

      const notiChat = newState.guild.channels.resolve('808687465602613258');
      if (!notiChat) {
         return;
      }

      await handleSession(newState.channelID, newState.member, notiChat, true);
   } catch (e) {
      logger.error('Error in Voice State Update event', e.stack);
   }
};
