module.exports = {
   checkTextPerms(channel) {
      return Object.entries(this.textChannelPerms)
         .filter((p) => !channel.permissionsFor(channel.guild.me.id).has(p[0]))
         .map((p) => p[1]);
   },

   checkVoicePerms(vc) {
      return Object.entries(this.voiceChannelPerms)
         .filter((p) => !vc.permissionsFor(vc.guild.me.id).has(p[0]))
         .map((p) => p[1]);
   },

   checkGuildPerms(guild) {
      return Object.entries(this.guildPerms)
         .filter((p) => !guild.me.hasPermission(p[0]))
         .map((p) => p[1]);
   },

   // You can find a list of available permissions at
   // https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS

   textChannelPerms: {
      VIEW_CHANNEL: 'Read Messages',
      SEND_MESSAGES: 'Send Messages',
      EMBED_LINKS: 'Embed Links',
      ADD_REACTIONS: 'Add Reactions',
   },

   guildPerms: {
      KICK_MEMBERS: 'Kick members',
      BAN_MEMBERS: 'Ban members',
      MANAGE_ROLES: 'Manage Roles',
      MOVE_MEMBERS: 'Move Members',
   },

   voiceChannelPerms: {
      VIEW_CHANNEL: 'View Channel',
      CONNECT: 'Connect',
   },
};
