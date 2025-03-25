const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
require('dotenv').config(); // Load environment variables

// Create bot client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Role IDs
const MEMBER_ROLE_ID = '1353965386420457544'; // Member role
const UNVERIFIED_ROLE_ID = '1353991420649930844'; // Unverified role

// Check and remove "Unverified" role from all users
async function checkAllMembers(guild) {
    try {
        const members = await guild.members.fetch();
        members.forEach(async (member) => {
            if (member.roles.cache.has(MEMBER_ROLE_ID) && member.roles.cache.has(UNVERIFIED_ROLE_ID)) {
                await member.roles.remove(UNVERIFIED_ROLE_ID);
                console.log(`✅ Removed "Unverified" from ${member.user.tag}`);
            }
        });
    } catch (error) {
        console.error("❌ Error fetching members:", error);
    }
}

// Bot is ready
client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();
    if (!guild) {
        console.log("Bot is not in any servers!");
        return;
    }

    console.log(`🔍 Monitoring server: ${guild.name}`);

    // Check all users on startup
    await checkAllMembers(guild);

    // Check every 5 minutes
    setInterval(() => checkAllMembers(guild), 300000);
});

// Instantly remove "Unverified" when a user gets "Member"
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.roles.cache.has(MEMBER_ROLE_ID) && newMember.roles.cache.has(UNVERIFIED_ROLE_ID)) {
        await newMember.roles.remove(UNVERIFIED_ROLE_ID);
        console.log(`✅ Instantly removed "Unverified" from ${newMember.user.tag}`);
    }
});

// Web server for Railway
const app = express();
app.get('/', (req, res) => {
    res.send('Bot is alive!');
});
app.listen(3000, () => {
    console.log('🌐 Web server running to keep Railway bot online');
});

// Login bot
client.login(process.env.TOKEN);
