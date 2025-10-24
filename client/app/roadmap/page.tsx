import SectionHeader from "@/app/components/SectionHeader";
import RoadmapCard from "@/app/components/RoadmapCard";
import FAQAccordion from "@/app/components/FAQAccordion";

export default function RoadmapPage() {
  const roadmap = [
    {
      phase: "Phase 1",
      title: "Core Marketplace Launch",
      description:
        "Establish foundational marketplace infrastructure, secure OG integration for content storage, and enable basic buying/selling features.",
      status: "Completed",
    },
    {
      phase: "Phase 2",
      title: "Creator Monetization & Analytics",
      description:
        "Introduce advanced creator tools, detailed sales analytics, and diverse monetization options like subscriptions and tiered content.",
      status: "In Progress",
    },
    {
      phase: "Phase 3",
      title: "Advanced Content Security & Decentralization",
      description:
        "Implement enhanced encryption protocols, explore on-chain governance models, and integrate more decentralized storage solutions.",
      status: "Future",
    },
    {
      phase: "Phase 4",
      title: "Community & Engagement",
      description:
        "Develop community features, creator-buyer interaction tools, and a robust feedback system for platform evolution.",
      status: "Future",
    },
  ];

  const faqs = [
    {
      question: "What if storage deal expires?",
      answer:
        "DecryptPay’s smart contracts include built-in renewal checks, automatically extending storage deals on OG to ensure your content remains permanently accessible and censorship-resistant.",
    },
    {
      question: "How does DecryptPay ensure content security?",
      answer: "Through encryption protocols and decentralized storage.",
    },
    { question: "What are the fees for selling content?", answer: "Fees vary by transaction size and gas cost." },
    { question: "Can I sell any type of digital content?", answer: "Yes, as long as it complies with our policies." },
    { question: "How do I withdraw my earnings?", answer: "Connect your wallet and request a payout." },
    { question: "What is OG and why is it used?", answer: "OG is a decentralized storage network ensuring data permanence." },
  ];

  return (
    <div className="bg-black text-white min-h-screen px-8 py-16">
      <SectionHeader
        title="Platform Roadmap & Frequently Asked Questions"
        subtitle="Explore the future of DecryptPay and find answers to common questions about our decentralized content marketplace."
      />

      <h2 className="text-2xl font-bold mb-8 text-center">
        Our Development Roadmap
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {roadmap.map((item, i) => (
          <RoadmapCard key={i} {...item} />
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="bg-gray-900 rounded-xl p-6">
        {faqs.map((faq, i) => (
          <FAQAccordion key={i} {...faq} />
        ))}
      </div>
    </div>
  );
}
