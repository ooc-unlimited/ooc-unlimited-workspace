export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, nav, .sidebar, button.fixed { display: none !important; }
        main { margin-left: 0 !important; padding: 0 !important; }
      `}} />
      <div className="fixed inset-0 overflow-auto bg-[#0a0a0a]">{children}</div>
    </>
  );
}
