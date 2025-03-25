const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const TOKEN =
    "MTM1NDAyNDY4NjUzODcyMzQwOA.GE0jzJ.f4MicNZM44K1JesPERL4XVNVhkhnccEP0cD15s"; // Replace with the new token
const MEMBER_ROLE_ID = "1353965386420457544"; // Member role
const UNVERIFIED_ROLE_ID = "1353991420649930844"; // Unverified role

async function checkAllMembers(guild) {
    try {
        const members = await guild.members.fetch();
        members.forEach(async (member) => {
            if (
                member.roles.cache.has(MEMBER_ROLE_ID) &&
                member.roles.cache.has(UNVERIFIED_ROLE_ID)
            ) {
                await member.roles.remove(UNVERIFIED_ROLE_ID);
                console.log(`✅ Removed "Unverified" from ${member.user.tag}`);
            }
        });
    } catch (error) {
        console.error("❌ Error fetching members:", error);
    }
}

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first(); // Get the first server bot is in
    if (!guild) {
        console.log("Bot is not in any servers!");
        return;
    }

    console.log(`Monitoring server: ${guild.name}`);

    // Check all current users on startup
    await checkAllMembers(guild);

    // Recheck every 5 minutes
    setInterval(() => checkAllMembers(guild), 300000);
});

// Instantly remove "Unverified" when a user gets the "Member" role
client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (
        newMember.roles.cache.has(MEMBER_ROLE_ID) &&
        newMember.roles.cache.has(UNVERIFIED_ROLE_ID)
    ) {
        await newMember.roles.remove(UNVERIFIED_ROLE_ID);
        console.log(
            `✅ Instantly removed "Unverified" from ${newMember.user.tag}`,
        );
    }
});

client.login(TOKEN);
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Bot is alive!");
});

app.listen(3000, () => {
    console.log("Server is running to keep bot alive!");
});
