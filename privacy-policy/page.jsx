export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for SpinRoster — how we handle your data.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <main style={{
      maxWidth: 720,
      margin: "0 auto",
      padding: "48px 24px 80px",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: "#1a1a2e",
      lineHeight: 1.7,
    }}>
      <a href="/" style={{ fontSize: 14, color: "#6a64ff", textDecoration: "none", display: "inline-block", marginBottom: 32 }}>
        ← Back to SpinRoster
      </a>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: "-1px" }}>Privacy Policy</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 40 }}>Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

      <Section title="1. Who we are">
        SpinRoster ("we", "our", or "us") operates the website at spinroster.com — a free classroom spin wheel tool for teachers. We are based in Latvia, European Union.
      </Section>

      <Section title="2. What data we collect">
        <strong>We do not collect personal data.</strong> SpinRoster stores your class rosters and settings only in your browser's local storage. This data never leaves your device and is never sent to our servers.
        <br /><br />
        The only data we receive is:
        <ul>
          <li>Standard web server logs (IP address, browser type, pages visited) — retained for 30 days for security purposes</li>
          <li>Anonymous usage statistics via Google Analytics (if enabled) — see section 4</li>
        </ul>
      </Section>

      <Section title="3. Cookies">
        SpinRoster itself does not set cookies. However, we use Google AdSense to display advertisements, which may set cookies on your device to show relevant ads. You can manage or opt out of personalised advertising at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#6a64ff" }}>adssettings.google.com</a>.
        <br /><br />
        We ask for your consent before AdSense cookies are set (see the cookie banner on your first visit).
      </Section>

      <Section title="4. Google AdSense">
        We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our site or other sites. You may opt out of personalised advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: "#6a64ff" }}>aboutads.info</a>. For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#6a64ff" }}>Google's Privacy Policy</a>.
      </Section>

      <Section title="5. Your rights (GDPR)">
        As an EU resident you have the right to:
        <ul>
          <li>Access any personal data we hold about you</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Lodge a complaint with the Data State Inspectorate of Latvia (<a href="https://www.dvi.gov.lv" target="_blank" rel="noopener noreferrer" style={{ color: "#6a64ff" }}>dvi.gov.lv</a>)</li>
        </ul>
        Since we do not collect personal data beyond server logs, there is typically nothing to delete. To request deletion of server logs, contact us at the email below.
      </Section>

      <Section title="6. Children's privacy">
        SpinRoster is a tool for teachers, not for children directly. We do not knowingly collect any personal information from children under 13. Class roster data (student names) is stored only in the teacher's browser and never transmitted to our servers.
      </Section>

      <Section title="7. Third-party links">
        Our site may contain links to external websites. We are not responsible for the privacy practices of those sites.
      </Section>

      <Section title="8. Changes to this policy">
        We may update this policy from time to time. The "last updated" date at the top of this page will reflect any changes. Continued use of the site after changes constitutes acceptance of the updated policy.
      </Section>

      <Section title="9. Contact">
        For any privacy-related questions, contact us at: <a href="mailto:privacy@spinroster.com" style={{ color: "#6a64ff" }}>privacy@spinroster.com</a>
      </Section>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#1a1a2e" }}>{title}</h2>
      <p style={{ margin: 0, color: "#444", fontSize: 15 }}>{children}</p>
    </section>
  );
}
