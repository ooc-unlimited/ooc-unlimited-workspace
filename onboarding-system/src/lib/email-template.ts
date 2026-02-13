export const PUSHBACK_EMAIL_SUBJECT = "Read This Before You Talk to ANYONE About Your New Business";

export const PUSHBACK_EMAIL_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.8; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fafafa; }
    .header { font-size: 28px; font-weight: bold; margin-bottom: 30px; color: #111; }
    .section { margin-bottom: 25px; }
    .highlight { background: #f0f0f0; padding: 20px; border-left: 4px solid #6366f1; margin: 20px 0; font-style: italic; }
    .cta { display: inline-block; background: #6366f1; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
    .audiobook-link { display: inline-block; background: #111; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
    .signature { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    p { margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="header">Before You Talk to Anyone...</div>
  
  <div class="section">
    <p>Hey {name},</p>
    
    <p>Congratulations on making one of the most important decisions of your life. I mean that. What you just did takes courage.</p>
    
    <p>But I need to prepare you for something that's about to happen — and if I don't tell you now, it might catch you off guard.</p>
  </div>

  <div class="section">
    <p><strong>The people closest to you are going to have opinions.</strong></p>
    
    <p>Your spouse, your parents, your best friend, your coworkers — some of them are going to question your decision. Some of them are going to be negative. Some might even try to talk you out of it.</p>
    
    <div class="highlight">
      "Why would you pay $199 for that?"<br>
      "That sounds like a scam."<br>
      "You're not a salesperson."<br>
      "Just keep your regular job."<br>
      "I looked it up online and..."
    </div>
    
    <p>Here's what I need you to understand: <strong>this is completely normal.</strong></p>
    
    <p>It happens to EVERY person who decides to build something bigger. Every entrepreneur. Every business owner. Every person who refuses to settle.</p>
  </div>

  <div class="section">
    <p>The people saying these things aren't bad people. They love you. But they're operating from <strong>their</strong> experience, <strong>their</strong> fears, and <strong>their</strong> limitations — not yours.</p>
    
    <p>Think about it: if they knew how to build wealth and financial freedom, wouldn't they have done it already?</p>
    
    <p>You don't ask someone who's never built a business how to build a business. You don't ask someone who's broke how to get rich. You don't ask someone who's never taken a risk whether you should take one.</p>
  </div>

  <div class="section">
    <p><strong>Here's what successful people do:</strong></p>
    
    <p>They protect their decision. They stay close to the people who are where they want to be. They put their head down, do the work, and let the RESULTS speak.</p>
    
    <p>You don't need to convince anyone right now. You don't need permission. You already made the decision — now just execute.</p>
    
    <div class="highlight">
      "First they ignore you, then they laugh at you, then they fight you, then you win." — Mahatma Gandhi
    </div>
  </div>

  <div class="section">
    <p><strong>Your homework before we meet:</strong></p>
    
    <p>Listen to at least 15 minutes of "Building an Empire" — it'll put you in the right mindset and give you a window into what's possible:</p>
    
    <p><a href="https://drive.google.com/file/d/1ZsPw1zyX104g9w7RINqBMSYHxhnhIAxW/view?usp=sharing" class="audiobook-link">🎧 Listen to Building an Empire</a></p>
    
    <p>And book your first training session (CE Part 1) — this is where we get you fully set up:</p>
    
    <p><a href="https://api.leadconnectorhq.com/widget/bookings/gary-cosby-jr-personal-calendar-kd5a-po0d" class="cta">📅 Book CE Part 1 Now</a></p>
  </div>

  <div class="section">
    <p>I'm telling you this because I believe in you. I wouldn't have brought you on if I didn't see potential. Let's prove the doubters wrong — together.</p>
    
    <p>See you at the training. 🔥</p>
  </div>

  <div class="signature">
    <p><strong>Gary Cosby Jr.</strong><br>
    OOC Unlimited<br>
    (321) 386-6527</p>
  </div>
</body>
</html>
`;
