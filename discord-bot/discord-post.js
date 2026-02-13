#!/usr/bin/env node
/**
 * OOC Bot — Discord Webhook Poster
 * 
 * Usage:
 *   node discord-post.js <channel> <message> [--username "Name"] [--avatar URL] [--embed]
 * 
 * Examples:
 *   node discord-post.js alerts "🚨 NQ ALERT: H1 LONG at 25,300"
 *   node discord-post.js general "Good morning team!" --username "Donna"
 *   node discord-post.js trading "NQ up 150pts" --embed
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

const webhooks = JSON.parse(fs.readFileSync(path.join(__dirname, 'webhooks.json'), 'utf8'));

// Channel name aliases (strip # prefix)
function resolveChannel(name) {
  name = name.replace(/^#/, '').toLowerCase();
  if (webhooks[name]) return webhooks[name];
  // Try partial match
  const match = Object.keys(webhooks).find(k => k.includes(name));
  return match ? webhooks[match] : null;
}

function postWebhook(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + '?wait=true',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node discord-post.js <channel> <message> [--username "Name"] [--avatar URL] [--embed]');
    console.log('\nChannels:', Object.keys(webhooks).join(', '));
    process.exit(1);
  }

  const channel = args[0];
  const message = args[1];
  
  // Parse optional flags
  let username = 'OOC Bot';
  let avatarUrl = null;
  let useEmbed = false;

  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--username' && args[i+1]) { username = args[++i]; }
    else if (args[i] === '--avatar' && args[i+1]) { avatarUrl = args[++i]; }
    else if (args[i] === '--embed') { useEmbed = true; }
  }

  const webhookUrl = resolveChannel(channel);
  if (!webhookUrl) {
    console.error(`Unknown channel: ${channel}`);
    console.error('Available:', Object.keys(webhooks).join(', '));
    process.exit(1);
  }

  const payload = { username };
  if (avatarUrl) payload.avatar_url = avatarUrl;

  if (useEmbed) {
    payload.embeds = [{
      description: message,
      color: 0x5865F2,
      timestamp: new Date().toISOString()
    }];
  } else {
    payload.content = message;
  }

  try {
    const result = await postWebhook(webhookUrl, payload);
    console.log(`✅ Posted to #${channel} (msg ID: ${result.id})`);
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    process.exit(1);
  }
}

// If called directly
if (require.main === module) {
  main();
} else {
  // Export for use as module
  module.exports = { postWebhook, resolveChannel, webhooks };
}
