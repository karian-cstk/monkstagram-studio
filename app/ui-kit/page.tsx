import { uiKitComponents } from "@/content/ui-kit";
import { changelog } from "@/content/changelog";
import { iconsCore } from "@/content/icons-core";
import { iconsExtended } from "@/content/icons-extended";
import UIKitTabs from "./UIKitTabs";

export const metadata = { title: "UI Kit — Monkstagram Studio" };

export default function UIKitPage() {
  const icons = [...iconsCore, ...iconsExtended];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="ledger-line text-sm text-amethyst tracking-widest uppercase mb-4">
        Venus UI Kit
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
        Every component, and why it exists.
      </h1>
      <p className="mt-4 max-w-2xl text-subtle">
        This is the public face of Venus, our internal design system — its
        components, icon library, and changelog, together. Each entry
        includes the rationale behind it — not just what it does.
      </p>

      <UIKitTabs components={uiKitComponents} changelog={changelog} icons={icons} />
    </div>
  );
}
