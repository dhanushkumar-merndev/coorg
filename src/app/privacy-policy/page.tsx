import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import TransitionLink from "@/components/navigation/TransitionLink";
import { contactPhone, contactTelephone, whatsappUrl } from "@/data/contact";
import { siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteName}`,
  description: "How Star Managed Farmlands collects, uses, shares and protects the personal information you share through this website and our enquiry form.",
  alternates: { canonical: "/privacy-policy" },
};

const updated = "2026-11-14";

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: <>
      <p>This website is operated by {siteName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), a land and estate practice based in Coorg (Kodagu), Karnataka, India.</p>
      <p>This policy explains what personal information we collect when you use this website or contact us, why we collect it, and the choices you have. It is written with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 (and the rules made under them) in mind.</p>
    </>,
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: <>
      <h3>Information you give us</h3>
      <p>When you submit the enquiry form, we collect:</p>
      <ul>
        <li>your name, phone number and email address;</li>
        <li>your answers about purpose, number of plots, budget range and preferred site-visit timing;</li>
        <li>the area of interest you choose and any note you choose to add; and</li>
        <li>the page of the website you enquired from.</li>
      </ul>
      <p>If you call us, message us on WhatsApp or email us, we receive the details you share in that conversation, along with your phone number or account name.</p>
      <h3>Information collected automatically</h3>
      <p>Like most websites, when you browse we and our service providers may receive technical information such as your IP address, browser and device type, approximate location derived from your IP address, referring page, pages viewed and the time of your visit. This comes from our hosting provider&rsquo;s server logs and from Google Tag Manager and any measurement tags it loads (see <a href="#cookies">Cookies and similar technologies</a>).</p>
      <p>We do not ask for, and ask you not to send us, sensitive information such as financial account details, government identity numbers or health information through the website.</p>
    </>,
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    content: <>
      <p>We use the information described above to:</p>
      <ul>
        <li>respond to your enquiry and contact you by phone, WhatsApp or email about it;</li>
        <li>understand what you are looking for and share projects, plots or estates that may suit you;</li>
        <li>arrange and follow up on site visits you ask for;</li>
        <li>keep a record of our conversations so we do not ask you the same questions twice;</li>
        <li>understand how the website is used so we can improve it;</li>
        <li>protect the website against spam, misuse and security threats; and</li>
        <li>comply with our legal obligations.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for automated decisions that have legal or similarly significant effects on you.</p>
    </>,
  },
  {
    id: "consent",
    title: "Your consent",
    content: <>
      <p>By submitting the enquiry form or contacting us, you consent to us processing your information for the purposes above, including contacting you about your enquiry, even if your number is registered on the National Do Not Call registry.</p>
      <p>You can withdraw your consent at any time by contacting us (see <a href="#contact">Contact and grievances</a>). Withdrawing consent will not affect anything we did before you withdrew it, but it may mean we cannot continue helping with your enquiry.</p>
    </>,
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: <>
      <p>We share personal information only where needed for the purposes above:</p>
      <ul>
        <li><strong>Service providers</strong> who help us run the website and our enquiry process, including our website hosting provider and Google (for Google Workspace tools in which enquiries are recorded, and for Google Tag Manager). They process information on our behalf and under their own security and privacy commitments.</li>
        <li><strong>Messaging platforms</strong> such as WhatsApp, when you choose to contact us through them. Their own privacy policies apply to how they handle your messages.</li>
        <li><strong>Landowners, developers, legal advisers or registration professionals</strong> connected with a property, but only when you decide to move forward on that property and with your knowledge.</li>
        <li><strong>Authorities</strong> where we are required to by law, court order or a lawful government request, or where necessary to protect our rights, safety or property, or that of others.</li>
      </ul>
    </>,
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    content: <>
      <p>This website uses Google Tag Manager, which may load tags that set cookies or use similar technologies to measure visits, understand which pages are useful and, where enabled, measure the performance of our advertising. These tools may collect the technical information described above.</p>
      <p>You can block or delete cookies in your browser settings, and you can opt out of Google Analytics measurement using Google&rsquo;s browser add-on. Blocking cookies will not stop the website or the enquiry form from working.</p>
    </>,
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: <>
      <p>We keep enquiry information for as long as we are in conversation with you and for a reasonable period afterwards, so we can follow up on your interest or answer questions about past discussions. If you buy or engage a service from us, we keep related records for as long as the law requires.</p>
      <p>When information is no longer needed, we delete it or anonymise it. You can ask us to delete your information sooner (see <a href="#your-rights">Your rights</a>).</p>
    </>,
  },
  {
    id: "security",
    title: "How we protect it",
    content: <>
      <p>We use reasonable technical and organisational measures to protect your information, including encrypted (HTTPS) connections to this website, server-side validation of form submissions, and access to enquiry records limited to the people who need it.</p>
      <p>No method of transmission or storage is completely secure. If we become aware of a personal data breach that affects you, we will notify you and the relevant authorities as the law requires.</p>
    </>,
  },
  {
    id: "transfers",
    title: "Where it is stored",
    content: <>
      <p>Some of our service providers, including our hosting provider and Google, may store or process information on servers outside India. Where this happens, we rely on providers that apply recognised security safeguards, and we follow any restrictions on cross-border transfer notified under Indian law.</p>
    </>,
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: <>
      <p>Subject to applicable law, you have the right to:</p>
      <ul>
        <li>ask for a summary of the personal information we hold about you and how we use it;</li>
        <li>ask us to correct, complete or update information that is inaccurate or out of date;</li>
        <li>ask us to delete your information where it is no longer needed for the purpose it was collected for or the law does not require us to keep it;</li>
        <li>withdraw your consent at any time;</li>
        <li>nominate another person to exercise these rights on your behalf in the event of death or incapacity; and</li>
        <li>raise a grievance with us, and if it is not resolved, approach the Data Protection Board of India.</li>
      </ul>
      <p>To use any of these rights, contact us using the details below. We may need to verify your identity before acting on a request.</p>
    </>,
  },
  {
    id: "children",
    title: "Children",
    content: <>
      <p>This website is meant for adults. We do not knowingly collect personal information from anyone under 18. If you believe a child has shared information with us, please contact us and we will delete it.</p>
    </>,
  },
  {
    id: "third-party-links",
    title: "Links to other websites",
    content: <>
      <p>This website may link to other websites and services, such as WhatsApp, maps or downloadable documents hosted elsewhere. We are not responsible for their privacy practices, so please read their policies before sharing information with them.</p>
    </>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: <>
      <p>We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top shows when it last changed. If a change significantly affects how we use information you have already given us, we will let you know before it takes effect.</p>
    </>,
  },
  {
    id: "contact",
    title: "Contact and grievances",
    content: <>
      <p>For any question, request or complaint about your personal information or this policy, please contact us:</p>
      <address>
        <strong>{siteName}</strong><br />
        Coorg (Kodagu), Karnataka, India<br />
        Phone: <a href={`tel:${contactTelephone}`}>{contactPhone}</a><br />
        WhatsApp: <a href={whatsappUrl("Hello Star Managed Farmlands, I have a question about my personal information.")} target="_blank" rel="noreferrer">Message us</a>
      </address>
      <p>We aim to acknowledge requests within 7 days and to resolve them within 30 days. Please also read our <TransitionLink href="/terms">Terms of Use</TransitionLink>.</p>
    </>,
  },
];

export default function PrivacyPolicyPage() {
  return <LegalPage
    eyebrow="LEGAL / PRIVACY"
    title={["Privacy", "policy."]}
    intro="What we collect when you explore this website or enquire with us, why we collect it, and the choices you have."
    updated={updated}
    sections={sections}
    related={{ href: "/terms", label: "Terms of Use", line: "The terms that apply when you use this website and its information." }}
  />;
}
