const { MessageEmbed } = require("discord.js");
exports.run = async({ client, message, args, lang }) => {

    if (!message.member.hasPermission("BAN_MEMBERS")) return message.quote(lang.ban.perm);

    var member_in = message.mentions.members.first()
    if(!member_in) return message.quote(lang.ban.invalidMember);

    var motivo = args.slice(1).join(' ');

    let embedquase = new MessageEmbed()
    //.setDescription(`Voce deseja punir o membro ${membroBan.user.tag} pelo motivo ` + '`' + `${motivo ? motivo : "Motivo não definido"}` + '` ?')
    .setDescription(lang.ban.punishMessage.replace("+target+", member_in.user.tag).replace("+motivo+", motivo ? motivo : "Motivo não definido"))
    .setColor('#00BFFF');

    message.channel.send(embedquase).then(msg => {
        msg.react('✅')
        msg.react('❌')
 
        const coletor = msg.createReactionCollector((r, u) => r.emoji.name === "✅" && u.id === message.author.id, { time: 100000 });
        
        coletor.on("collect", async r => {
            try {
                member_in.ban({reason: 'Você foi banido do servidor.' })
                r.users.remove(message.author.id)
            }catch {
                message.channel.send(`Eu não tenho permissão para banir esse membro :(`)
                r.users.remove(message.author.id)
            }
        })
 })
}
exports.help = {
    name: "ban",
    aliases: ['banir', 'banish', 'punish'],
    description: "Banir o jogador mencionado pelo motivo inserido.",
    usage: 'ban [@user] (reason)'
};
