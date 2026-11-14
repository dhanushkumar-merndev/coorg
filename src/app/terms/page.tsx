import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import TransitionLink from "@/components/navigation/TransitionLink";
import { contactPhone, contactTelephone, whatsappUrl } from "@/data/contact";
import { siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Use | ${siteName}`,
  description: "The terms that apply when you use the Star Managed Farmlands website, including how to read property information, imagery and the live inventory.",
  alternates: { canonical: "/terms" },
};

const updated = "2026-11-14";

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    content: <>
      <p>These Terms of Use apply to your use of this website, operated by {siteName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By using the website, you agree to these terms and to our <TransitionLink href="/privacy-policy">Privacy Policy</TransitionLink>. If you do not agree, please do not use the website.</p>
      <p>You must be at least 18 years old and able to enter into a legally binding contract under Indian law to make an enquiry through this website.</p>
    </>,
  },
  {
    id: "purpose",
    title: "What this website is for",
    content: <>
      <p>This website introduces Coorg, our projects, estates and managed farmland services, and lets you start a conversation with us. It is a source of general information and a way to enquire. It is not a marketplace, and you cannot buy, book or reserve property through it.</p>
    </>,
  },
  {
    id: "no-offer",
    title: "Information is not an offer",
    content: <>
      <p>Nothing on this website is an offer, invitation to offer, promise or contract for the sale, lease or management of any property. Descriptions, areas, layouts, amenities, prices, availability and timelines are indicative and may change without notice.</p>
      <p>The only terms that bind us, or you, on any property or service are those set out in a written agreement signed by both parties. Where a project is required to be registered under the Real Estate (Regulation and Development) Act, 2016, the applicable registration details will be shared with you before any booking.</p>
    </>,
  },
  {
    id: "imagery",
    title: "Images, renders and plans",
    content: <>
      <p>Some images on this website are photographs of actual properties. Others are conceptual, illustrative, artistic or generic images of the Coorg landscape, and are labelled as such where they appear. Renders, master plans and layout illustrations are for representation only and are not sanctioned or legally authoritative plans.</p>
      <p>Please do not rely on any image to judge the exact condition, boundaries, size or features of a property. We encourage you to visit in person.</p>
    </>,
  },
  {
    id: "live-inventory",
    title: "Live inventory",
    content: <>
      <p>The live inventory shows the status of plots as we last recorded it. It may not reflect very recent changes, and its plans and figures are illustrative. A plot shown as available is not held or reserved for you until we confirm it in writing.</p>
    </>,
  },
  {
    id: "due-diligence",
    title: "Your own checks and advice",
    content: <>
      <p>Buying land, particularly agricultural or plantation land, involves legal, regulatory and tax considerations, including rules on who may hold certain categories of land in Karnataka. Before committing to any purchase, you are responsible for carrying out your own due diligence on title, approvals, land use, eligibility, access and any other matter important to you, and for taking independent legal, tax and financial advice.</p>
      <p>We will share the documents and information available to us on request, but our doing so does not replace your own independent verification.</p>
    </>,
  },
  {
    id: "no-guarantees",
    title: "No investment advice or guaranteed returns",
    content: <>
      <p>Nothing on this website is investment, financial or tax advice. Any reference to crops, yields, appreciation, rental potential or income is general and illustrative. We do not guarantee any return, income or increase in value from any property or managed farmland arrangement. Past performance does not indicate future results.</p>
      <p>Farm management, plantation care and related services, where offered, are governed solely by a separate written agreement.</p>
    </>,
  },
  {
    id: "enquiries",
    title: "Enquiries and communication",
    content: <>
      <p>When you submit an enquiry, you confirm that the information you give is accurate and is your own, and you agree that we may contact you by phone, WhatsApp or email about it. Submitting an enquiry does not create any obligation for you or for us.</p>
      <p>Please do not submit enquiries on behalf of someone else without their permission, or use the form to send spam, advertising or unlawful content.</p>
    </>,
  },
  {
    id: "acceptable-use",
    title: "Using the website properly",
    content: <>
      <p>You agree not to:</p>
      <ul>
        <li>use the website for any unlawful, misleading or fraudulent purpose;</li>
        <li>attempt to gain unauthorised access to the website, its servers or connected systems, or interfere with how it works;</li>
        <li>scrape, copy or harvest content or data from the website in bulk, except as permitted by its robots.txt file; or</li>
        <li>introduce viruses or other harmful code.</li>
      </ul>
    </>,
  },
  {
    id: "intellectual-property",
    title: "Our content and brand",
    content: <>
      <p>The website&rsquo;s text, design, graphics, photographs, illustrations, 3D scenes, logos and the {siteName} name and marks belong to us or our licensors and are protected by law. You may view and print pages for your personal, non-commercial use. You may not otherwise copy, reproduce, modify, distribute or use them commercially without our written permission.</p>
    </>,
  },
  {
    id: "third-party-links",
    title: "Links to other websites",
    content: <>
      <p>The website may link to third-party websites and services, such as WhatsApp or maps. We do not control them and are not responsible for their content, availability or practices. Your use of them is at your own risk and subject to their terms.</p>
    </>,
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: <>
      <p>We work to keep the website accurate and available, but it is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We do not warrant that it will be uninterrupted, error-free or free of harmful components, or that its information is complete or current.</p>
      <p>To the fullest extent the law allows, we are not liable for any indirect, incidental, special or consequential loss, or for any loss of profit, opportunity or data, arising from your use of or reliance on the website. Nothing in these terms limits any liability that cannot be limited under Indian law.</p>
    </>,
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: <>
      <p>You agree to indemnify us against any claims, losses or costs arising from your breach of these terms or your misuse of the website.</p>
    </>,
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    content: <>
      <p>These terms are governed by the laws of India. We would always prefer to resolve a concern through conversation first. Subject to that, the courts at Madikeri, Kodagu, Karnataka will have exclusive jurisdiction over any dispute arising from these terms or your use of the website.</p>
    </>,
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: <>
      <p>We may update these terms from time to time. The &ldquo;Last updated&rdquo; date at the top shows when they last changed. Continuing to use the website after a change means you accept the updated terms.</p>
      <p>If any part of these terms is found to be unenforceable, the rest will continue to apply.</p>
    </>,
  },
  {
    id: "contact",
    title: "Contact us",
    content: <>
      <p>For questions about these terms, please contact us:</p>
      <address>
        <strong>{siteName}</strong><br />
        Coorg (Kodagu), Karnataka, India<br />
        Phone: <a href={`tel:${contactTelephone}`}>{contactPhone}</a><br />
        WhatsApp: <a href={whatsappUrl("Hello Star Managed Farmlands, I have a question about your website terms.")} target="_blank" rel="noreferrer">Message us</a>
      </address>
    </>,
  },
];

export default function TermsPage() {
  return <LegalPage
    eyebrow="LEGAL / TERMS"
    title={["Terms", "of use."]}
    intro="The terms that apply when you explore this website, read about our projects and estates, or make an enquiry."
    updated={updated}
    sections={sections}
    related={{ href: "/privacy-policy", label: "Privacy Policy", line: "How we collect, use and protect the information you share with us." }}
  />;
}
