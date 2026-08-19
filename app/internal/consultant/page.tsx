import ConsultantChat from "./ConsultantChat";

export default function ConsultantPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-1">AI Design Consultant</h1>
      <p className="text-subtle mb-8 text-sm">
        Internal only. Answers reflect Venus 2.1 RF and Contentstack's brand
        guidelines.
      </p>
      <ConsultantChat />
    </div>
  );
}
