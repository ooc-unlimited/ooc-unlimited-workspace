# Discord Bot Setup Guide — OOC Unlimited

## Overview
One bot application serving multiple agent personalities (Donna, Milan, Amanda, Devin, Tom) across dedicated channels in the OOC Unlimited Discord server.

**Architecture:** Single bot token + per-channel webhooks for agent identities.

---

## Step 1: Create the Discord Application

1. Go to **https://discord.com/developers/applications**
2. Log in with Gary's Discord account (4074934215 / Hotboy56$)
3. Click **"New Application"**
4. Name it: `OOC Bot` (or `OOC Unlimited Bot`)
5. Accept the Terms of Service
6. Note the **Application ID** and **Public Key**

## Step 2: Create the Bot User

1. In your application, go to the **"Bot"** tab (left sidebar)
2. Click **"Add Bot"** → Confirm
3. Set the bot's username: `OOC Bot`
4. Upload an avatar (OOC Unlimited logo)
5. Under **Privileged Gateway Intents**, enable:
   - ✅ **Message Content Intent** (needed to read message content)
   - ✅ **Server Members Intent** (needed for member events)
   - ✅ **Presence Intent** (optional, for online status)
6. Click **"Reset Token"** → Copy and save the token securely
   - ⚠️ **NEVER commit this token to git or share it publicly**
   - Store it in a `.env` file

## Step 3: Set Bot Permissions

Use this permissions integer when generating the invite URL:

**Required permissions:**
- `MANAGE_CHANNELS` (create/edit channels)
- `MANAGE_ROLES` (assign roles to users)
- `SEND_MESSAGES` (post in channels)
- `VIEW_CHANNEL` (see channels)
- `READ_MESSAGE_HISTORY` (read past messages)
- `MANAGE_MESSAGES` (delete/pin messages)
- `EMBED_LINKS` (rich embeds)
- `ATTACH_FILES` (upload files)
- `ADD_REACTIONS` (react to messages)
- `MANAGE_WEBHOOKS` (create webhooks for agent personalities)
- `USE_APPLICATION_COMMANDS` (slash commands)
- `SEND_POLLS` (polls)

**Permission integer:** `536874064` (covers all above — verify with Discord's calculator)

**Invite URL format:**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_APP_ID&permissions=536874064&scope=bot%20applications.commands
```

## Step 4: Invite Bot to OOC Unlimited Server

1. Replace `YOUR_APP_ID` in the URL above with your Application ID
2. Open the URL in a browser
3. Select **OOC Unlimited** server from the dropdown
4. Confirm permissions
5. Bot should appear in the member list

## Step 5: Project Setup (discord.js v14+)

```bash
# Create project directory
mkdir ooc-discord-bot && cd ooc-discord-bot

# Initialize Node.js project
npm init -y

# Install discord.js (v14+)
npm install discord.js

# Install dotenv for environment variables
npm install dotenv

# Create .env file
cat > .env << 'EOF'
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=1471377225021526071
EOF
```

### Project Structure
```
ooc-discord-bot/
├── .env                    # Bot token & config (NEVER commit)
├── .gitignore              # Include .env
├── package.json
├── src/
│   ├── index.js            # Main bot entry point
│   ├── commands/           # Slash command definitions
│   │   ├── ping.js
│   │   ├── post.js         # Post as specific agent
│   │   └── alert.js        # Send alerts
│   ├── events/             # Event handlers
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   └── messageCreate.js
│   ├── agents/             # Agent personality configs
│   │   ├── donna.js
│   │   ├── milan.js
│   │   ├── amanda.js
│   │   ├── devin.js
│   │   └── tom.js
│   └── utils/
│       ├── webhooks.js     # Webhook management
│       └── permissions.js  # Permission helpers
└── deploy-commands.js      # Register slash commands
```

### Main Bot File (`src/index.js`)
```javascript
require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
```

### Agent Webhook System (`src/utils/webhooks.js`)
```javascript
// Each agent posts via webhook with custom name/avatar
const AGENTS = {
  donna: {
    name: 'Donna',
    avatar: 'https://example.com/donna-avatar.png',
    channelId: '1471377600592216064',
  },
  milan: {
    name: 'Milan',
    avatar: 'https://example.com/milan-avatar.png',
    channelId: '1471377604035612828',
  },
  amanda: {
    name: 'Amanda',
    avatar: 'https://example.com/amanda-avatar.png',
    channelId: '1471377607499972769',
  },
  devin: {
    name: 'Devin',
    avatar: 'https://example.com/devin-avatar.png',
    channelId: '1471377611136565363',
  },
  tom: {
    name: 'Tom',
    avatar: 'https://example.com/tom-avatar.png',
    channelId: '1471377614559248415',
  },
};

async function getOrCreateWebhook(channel, agentName) {
  const webhooks = await channel.fetchWebhooks();
  let webhook = webhooks.find(wh => wh.name === agentName);
  if (!webhook) {
    webhook = await channel.createWebhook({ name: agentName });
  }
  return webhook;
}

async function postAsAgent(client, agentKey, message, targetChannelId = null) {
  const agent = AGENTS[agentKey];
  const channelId = targetChannelId || agent.channelId;
  const channel = await client.channels.fetch(channelId);
  const webhook = await getOrCreateWebhook(channel, agent.name);
  
  await webhook.send({
    content: message,
    username: agent.name,
    avatarURL: agent.avatar,
  });
}

module.exports = { AGENTS, getOrCreateWebhook, postAsAgent };
```

### Register Slash Commands (`deploy-commands.js`)
```javascript
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('post')
    .setDescription('Post a message as an agent')
    .addStringOption(opt =>
      opt.setName('agent')
        .setDescription('Which agent')
        .setRequired(true)
        .addChoices(
          { name: 'Donna', value: 'donna' },
          { name: 'Milan', value: 'milan' },
          { name: 'Amanda', value: 'amanda' },
          { name: 'Devin', value: 'devin' },
          { name: 'Tom', value: 'tom' },
        ))
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('Message to post')
        .setRequired(true))
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Target channel (default: agent\'s channel)')
        .setRequired(false)),
  
  new SlashCommandBuilder()
    .setName('alert')
    .setDescription('Send an alert to #alerts')
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('Alert message')
        .setRequired(true)),
  
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if bot is alive'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  console.log('Registering slash commands...');
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands },
  );
  console.log('Done!');
})();
```

## Step 6: Deploy Slash Commands

```bash
node deploy-commands.js
```

## Step 7: Run the Bot

```bash
node src/index.js
```

For production, use PM2:
```bash
npm install -g pm2
pm2 start src/index.js --name ooc-bot
pm2 save
pm2 startup  # auto-start on reboot
```

---

## Key Channel IDs (OOC Unlimited)

| Channel | ID |
|---------|-----|
| #general | 1471377225889878028 |
| #approvals | 1471377576445349898 |
| #pipeline | 1471377580400574475 |
| #alerts | 1471377583877787648 |
| #research | 1471377587472302112 |
| #social-drafts | 1471377590743859242 |
| #daily-digest | 1471377593747116157 |
| #trading | 1471377597123526747 |
| #donna | 1471377600592216064 |
| #milan | 1471377604035612828 |
| #amanda | 1471377607499972769 |
| #devin | 1471377611136565363 |
| #tom | 1471377614559248415 |

---

## Best Practices

1. **Use slash commands only** — message content intent is privileged and unnecessary for new bots
2. **Webhooks for agent identity** — each agent posts with unique name/avatar via webhook
3. **Store token in .env** — never hardcode, never commit
4. **Rate limit awareness** — Discord rate limits: 5 requests/5s per channel for messages
5. **Error handling** — wrap all Discord API calls in try/catch, log errors
6. **Sharding** — not needed until bot is in 2,500+ servers (OOC is 1 server, skip this)
7. **Use embeds** — rich embeds look professional for alerts, digests, and reports

---

## Next Steps

- [ ] Create Discord application at developer portal
- [ ] Generate bot token and store securely
- [ ] Initialize Node.js project with discord.js
- [ ] Set up agent webhook configs with avatars
- [ ] Register slash commands
- [ ] Deploy bot (PM2 on Mac mini or cloud)
- [ ] Connect OpenClaw agents to post via bot API

---

*Guide created: 2026-02-12*
