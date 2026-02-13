require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes, SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const AGENTS = {
  donna:  { name: 'Donna 🤖', emoji: '🤖' },
  stacy:  { name: 'Stacy 📋', emoji: '📋' },
  milan:  { name: 'Milan 🎨', emoji: '🎨' },
  tom:    { name: 'Tom 📊', emoji: '📊' },
  amanda: { name: 'Amanda 📱', emoji: '📱' },
  cody:   { name: 'Cody 🔧', emoji: '🔧' },
};

const webhooksPath = path.join(__dirname, 'webhooks.json');
let webhooks = {};
try { webhooks = JSON.parse(fs.readFileSync(webhooksPath, 'utf8')); } catch(e) {}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('post')
    .setDescription('Post a message as an agent')
    .addStringOption(opt =>
      opt.setName('agent').setDescription('Which agent').setRequired(true)
        .addChoices(
          { name: 'Donna', value: 'donna' },
          { name: 'Stacy', value: 'stacy' },
          { name: 'Milan', value: 'milan' },
          { name: 'Tom', value: 'tom' },
          { name: 'Amanda', value: 'amanda' },
          { name: 'Cody', value: 'cody' },
        ))
    .addStringOption(opt =>
      opt.setName('message').setDescription('Message to post').setRequired(true))
    .addChannelOption(opt =>
      opt.setName('channel').setDescription('Target channel (default: agent channel)').setRequired(false)),

  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check bot status'),

  new SlashCommandBuilder()
    .setName('create-channel')
    .setDescription('Create a new agent channel')
    .addStringOption(opt =>
      opt.setName('name').setDescription('Channel name').setRequired(true))
    .addStringOption(opt =>
      opt.setName('category').setDescription('Category ID to place channel in').setRequired(false)),
].map(cmd => cmd.toJSON());

// Register commands on ready
client.once('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );
    console.log('✅ Slash commands registered');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
});

// Helper: get or create webhook for a channel
async function getOrCreateWebhook(channel, agentName) {
  const existing = await channel.fetchWebhooks();
  let wh = existing.find(w => w.name === agentName);
  if (!wh) {
    wh = await channel.createWebhook({ name: agentName });
  }
  return wh;
}

// Helper: post as agent via webhook
async function postAsAgent(channel, agentKey, message) {
  const agent = AGENTS[agentKey];
  if (!agent) throw new Error('Unknown agent: ' + agentKey);
  
  // Try stored webhook first
  const channelName = channel.name;
  if (webhooks[channelName]) {
    const https = require('https');
    const url = new URL(webhooks[channelName]);
    const payload = JSON.stringify({ content: message, username: agent.name });
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: url.hostname, path: url.pathname + '?wait=true',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
      }, res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => res.statusCode < 300 ? resolve(JSON.parse(body)) : reject(new Error(body)));
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }
  
  // Fallback: create webhook on the fly
  const wh = await getOrCreateWebhook(channel, agent.name);
  return wh.send({ content: message, username: agent.name });
}

// Handle interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'post') {
      const agentKey = interaction.options.getString('agent');
      const message = interaction.options.getString('message');
      const channel = interaction.options.getChannel('channel') || interaction.channel;
      
      await interaction.deferReply({ ephemeral: true });
      await postAsAgent(channel, agentKey, message);
      await interaction.editReply({ content: `✅ Posted as ${AGENTS[agentKey].name} in #${channel.name}` });
    }
    
    else if (interaction.commandName === 'status') {
      const uptime = Math.floor(process.uptime());
      const h = Math.floor(uptime / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      await interaction.reply({
        content: `🟢 **OOC Unlimited Bot** is online\n⏱️ Uptime: ${h}h ${m}m\n🤖 Agents: ${Object.keys(AGENTS).join(', ')}\n📡 Webhooks: ${Object.keys(webhooks).length} channels`,
        ephemeral: true,
      });
    }
    
    else if (interaction.commandName === 'create-channel') {
      const name = interaction.options.getString('name');
      const categoryId = interaction.options.getString('category');
      
      await interaction.deferReply({ ephemeral: true });
      
      const guild = interaction.guild;
      const options = {
        name: name,
        type: ChannelType.GuildText,
        reason: 'Created by OOC Bot',
      };
      if (categoryId) options.parent = categoryId;
      
      const newChannel = await guild.channels.create(options);
      
      // Create webhook for the channel
      const wh = await newChannel.createWebhook({ name: 'OOC Bot' });
      webhooks[name] = wh.url;
      fs.writeFileSync(webhooksPath, JSON.stringify(webhooks, null, 2));
      
      await interaction.editReply({
        content: `✅ Created #${name} (ID: ${newChannel.id})\n🔗 Webhook saved to webhooks.json`,
      });
    }
  } catch (err) {
    console.error('Command error:', err);
    const reply = { content: `❌ Error: ${err.message}`, ephemeral: true };
    if (interaction.deferred) await interaction.editReply(reply);
    else await interaction.reply(reply);
  }
});

// Export for programmatic use
module.exports = { client, AGENTS, postAsAgent, webhooks };

client.login(process.env.DISCORD_TOKEN);
