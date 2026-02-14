'use client';

import { PUSHBACK_EMAIL_HTML, PUSHBACK_EMAIL_SUBJECT } from '@/lib/email-template';

export default function EmailPreviewPage() {
  const previewHtml = PUSHBACK_EMAIL_HTML.replace(/{name}/g, 'John');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">📧 &ldquo;Expect the Pushback&rdquo; Email</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Sent within 1 hour of ICA submission. Inoculates new agents against negativity from friends and family.
        </p>
      </div>

      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden">
        {/* Email Header */}
        <div className="bg-[#1a1a1a] border-b border-[#262626] p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 w-16">From:</span>
            <span className="text-sm text-zinc-300">Gary Cosby Jr. &lt;gary@oocunlimited.com&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 w-16">To:</span>
            <span className="text-sm text-zinc-300">{'{agent email}'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 w-16">Subject:</span>
            <span className="text-sm text-white font-medium">{PUSHBACK_EMAIL_SUBJECT}</span>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-2">
          <iframe
            srcDoc={previewHtml}
            className="w-full border-0 rounded-lg"
            style={{ minHeight: '800px', background: '#fafafa' }}
            title="Email Preview"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
        <h3 className="font-semibold mb-3">Key Links in Email</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">🎧 Audiobook:</span>
            <a href="https://drive.google.com/file/d/1ZsPw1zyX104g9w7RINqBMSYHxhnhIAxW/view?usp=sharing" target="_blank" rel="noreferrer"
              className="text-indigo-400 hover:underline truncate">Building an Empire (Google Drive)</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">📅 Calendly:</span>
            <a href="https://api.leadconnectorhq.com/widget/bookings/gary-cosby-jr-personal-calendar-kd5a-po0d" target="_blank" rel="noreferrer"
              className="text-indigo-400 hover:underline truncate">Book CE Part 1</a>
          </div>
        </div>
      </div>
    </div>
  );
}
