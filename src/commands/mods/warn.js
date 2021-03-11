const embeds = require('../../core/graphics/embeds');

module.exports = {
   name: 'warn',
   aliases: [],
   description: 'Warn a user.',
  
   // Whether the command requires arguments
   reqArgs: true,
   // Arguments usage
   usage: '[@user] [reason]',
   // Example usage of the command
   exampleUsage: '@Giuliopime Bad words usage',
  
   category: 'moderators',
  
   // Command cooldown in milliseconds
   cooldown: 50,
  
   async run(ctx) {
      const userID = ctx.args[0].replace('<', '').replace('!', '').replace('@', '').replace('>');
      const member = await ctx.guild.members.fetch(userID);

      if (!member) {
         return ctx.sendEmbed(embeds.error('You need to provide a valid user mention or user ID'));
      }

      const reason = ctx.args.shift().join(' ');

      if (!reason) {
         return ctx.sendEmbed(embeds.error('Provide a reason please'));      
      }
      
      await ctx.sendEmbed(embeds.warn(member, reason));
      await member.send(`You have been warned in ${member.guild.name} for: ${reason}`).catch(() => {});
   },
};
