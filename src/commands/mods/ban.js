const embeds = require('../../core/graphics/embeds');

module.exports = {
   name: 'ban',
   aliases: [],
   description: 'Ban a user from the server.',
  
   // Whether the command requires arguments
   reqArgs: true,
   // Arguments usage
   usage: '[@user] [reason]',
   // Example usage of the command
   exampleUsage: '@Giuliopime Bad guy',
  
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

      await ctx.sendEmbed(embeds.ban(member, reason));
      await member.send(`You have been banned from ${member.guild.name} for: ${reason}`).catch(() => {});
      await member.ban({ reason })
         .catch(() => ctx.sendEmbed(embeds.error('Couldn\'t ban user, check roles hierarchy')));
   },
};
