const embeds = require('../../core/graphics/embeds');

function getTimeInMillis(time) {
   const daysRegExp = /(\d{1,2}d)/;
   const hoursRegExp = /(\d{1,2}h)/;
   const minutesRegExp = /(\d{1,2}m)/;

   let days = time.match(daysRegExp);
   let hours = time.match(hoursRegExp);
   let minutes = time.match(minutesRegExp);

   let millis = 0;

   if (days) {
      days = days[0].substring(0, days[0].length - 1);
      millis += parseInt(days, 10) * 86400000;
   }
   if (hours) {
      hours = hours[0].substring(0, hours[0].length - 1);
      millis += parseInt(hours, 10) * 3600000;
   }
   if (minutes) {
      minutes = minutes[0].substring(0, minutes[0].length - 1);
      millis += parseInt(minutes, 10) * 60000;
   }

   return millis === 0 ? null : millis;
}

module.exports = {
   name: 'mute',
   aliases: [],
   description: 'Mute a user.',
  
   // Whether the command requires arguments
   reqArgs: true,
   // Arguments usage
   usage: '[@user] [time] [reason]',
   // Example usage of the command
   exampleUsage: '@Giuliopime 2h Talking too much',
  
   category: 'moderators',
  
   // Command cooldown in milliseconds
   cooldown: 50,
  
   async run(ctx) {
      const userID = ctx.args[0].replace('<', '').replace('!', '').replace('@', '').replace('>', '');
      let member;
      try {
         member = await ctx.guild.members.fetch(userID);
      } catch {
         return ctx.sendEmbed(embeds.error('You need to provide a valid user mention or user ID'));
      }

      if (!member) {
         return ctx.sendEmbed(embeds.error('You need to provide a valid user mention or user ID'));
      }

      const time = ctx.args[1];

      if (!time) {
         return ctx.sendEmbed(embeds.error('Provide a valid time amount please'));
      }

      const timeMS = getTimeInMillis(time);
      
      if (!timeMS) {
         return ctx.sendEmbed(embeds.error('Provide a valid time amount'));      
      }

      ctx.args.shift();
      ctx.args.shift();

      const reason = ctx.args.join(' ');

      if (!reason) {
         return ctx.sendEmbed(embeds.error('Provide a reason please'));      
      }
      
      await ctx.sendEmbed(embeds.mute(member, time, reason));
      await member.send(`You have been muted (${time}) in ${member.guild.name} for: ${reason}`).catch(() => {});
      
      const roleIDs = member.roles.cache.keyArray();
      await member.roles.remove(roleIDs, reason);
      await member.roles.add('792364897248870412', reason);

      setTimeout(async () => {
         await member.roles.remove('792364897248870412', 'Unmuting user');
         await member.roles.add(roleIDs, 'Unmuting user');
      }, timeMS);
   },
};
