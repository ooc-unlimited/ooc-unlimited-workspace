export interface SmsTemplate {
  id: string;
  name: string;
  trigger: string;
  content: string;
  stage?: number;
}

export const SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Text',
    trigger: 'Immediately after ICA submitted',
    stage: 1,
    content: `Hey {name}! 🎉 Welcome to the team! This is Gary Cosby Jr. I'm excited to have you on board. You just made a decision that's going to change your life and your family's future.

Here's what happens next:
1. Check your email — I'm sending you something important to read
2. Book your first training session using the link in that email
3. Listen to at least 15 minutes of the audiobook I'm sharing with you

Talk soon! 💪`
  },
  {
    id: 'ce1-reminder',
    name: 'CE Part 1 Reminder (24hr)',
    trigger: '24 hours before CE Part 1',
    stage: 4,
    content: `Hey {name}! Just a reminder — we have your CE Part 1 training tomorrow. Make sure you have:

✅ Zoom ready
✅ A quiet space
✅ 60-90 minutes blocked off

This is where we get you set up with everything you need. See you there! 🔥`
  },
  {
    id: 'ce2-nudge',
    name: 'CE Part 2 Booking Nudge',
    trigger: 'After CE Part 1 completed, if CE Part 2 not booked within 24hrs',
    stage: 5,
    content: `Hey {name}! Great job completing CE Part 1! 💪 Now let's keep the momentum going.

Book your CE Part 2 session here:
https://api.leadconnectorhq.com/widget/bookings/gary-cosby-jr-personal-calendar-kd5a-po0d

The sooner we get through Part 2, the sooner you're in the field making money. Let's go! 🚀`
  },
  {
    id: 'stall-24hr',
    name: 'Stall Re-engagement (24hr)',
    trigger: 'Agent hasnt moved stages in 24+ hours',
    content: `Hey {name}, checking in! 👋 I noticed we haven't connected on your next step yet. 

No pressure — just want to make sure you're good. What questions do you have? Let's get you moving forward.

Reply to this text and let me know what's up! 💬`
  },
  {
    id: 'stall-48hr',
    name: 'Stall Re-engagement (48hr)',
    trigger: 'Agent hasnt moved stages in 48+ hours',
    content: `{name}, I get it — life gets busy. But remember why you made this decision. The people who succeed in this business are the ones who keep showing up.

Let me know if something came up. I'm here to help you win. 🏆

Book your next session: https://api.leadconnectorhq.com/widget/bookings/gary-cosby-jr-personal-calendar-kd5a-po0d`
  },
  {
    id: 'phonezone-reminder',
    name: 'PhoneZone Reminder',
    trigger: 'Monday 6 PM EST (2hrs before PhoneZone)',
    content: `Hey {name}! 📞 PhoneZone is TONIGHT at 8 PM EST!

This is where we make calls together as a team. It's one of the most powerful things you can do for your business.

Zoom link coming soon. Be there! 💪🔥`
  },
  {
    id: 'ob2-scheduled',
    name: 'Onboarding 2 Confirmation',
    trigger: 'After Onboarding 2 is scheduled',
    stage: 8,
    content: `{name}, your Hands-On Training (Onboarding 2) is scheduled! 🎯

This is where we get into the 7 Fundamentals:
📞 Phone calls
🤝 Edifying
💬 Conversations
❓ Answering questions
📚 Product knowledge
✍️ Closing
🔄 Duplication

Come ready to practice. We learn by DOING. See you there! 🚀`
  },
  {
    id: 'field-training',
    name: 'Field Training Start',
    trigger: 'When agent moves to Field Training',
    stage: 10,
    content: `{name}, you're ready for the field! 🔥🔥🔥

Field training is where everything clicks. Real appointments, real conversations, real business.

I'll be right there with you. The faster we get you to exposures, the faster the skepticism fades and the confidence builds.

Let's schedule your first field session NOW. 💪`
  }
];
