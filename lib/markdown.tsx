import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} className="ledger-line text-xs bg-shadow-heavy px-1.5 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/** Minimal renderer for the headings, lists, code fences, and bold/inline-code
 * used by our own storybook-handoff .md files — not a general-purpose parser. */
export function renderMarkdown(markdown: string): ReactNode {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-1 my-3">
        {listBuffer.map((item, idx) => (
          <li key={idx} className="text-subtle leading-relaxed">
            {renderInline(item, `li-${blocks.length}-${idx}`)}
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  const isTableRow = (line: string) => line.trim().startsWith("|") && line.trim().endsWith("|");
  const isTableSeparator = (line: string) => /^\|[\s:|-]+\|$/.test(line.trim());
  const splitRow = (line: string) =>
    line
      .trim()
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());

  while (i < lines.length) {
    const line = lines[i];

    if (isTableRow(line) && isTableSeparator(lines[i + 1] ?? "")) {
      const headerCells = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      flushList();
      blocks.push(
        <div key={`table-${blocks.length}`} className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-shadow-border">
                {headerCells.map((cell, idx) => (
                  <th key={idx} className="text-left py-2 pr-4 font-semibold text-crystal-clear">
                    {renderInline(cell, `th-${blocks.length}-${idx}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-shadow-border/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2 pr-4 text-subtle align-top">
                      {renderInline(cell, `td-${blocks.length}-${rIdx}-${cIdx}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (line.trim() === "---") {
      flushList();
      blocks.push(<hr key={`hr-${blocks.length}`} className="my-6 border-shadow-border" />);
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      flushList();
      blocks.push(
        <pre
          key={`code-${blocks.length}`}
          className="ledger-line text-xs bg-shadow-heavy border border-shadow-border rounded-lg p-4 overflow-x-auto my-3"
        >
          {codeLines.join("\n")}
        </pre>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        <h4 key={`h4-${blocks.length}`} className="font-semibold mt-6 mb-1">
          {renderInline(line.slice(4), `h4-${blocks.length}`)}
        </h4>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="text-lg font-semibold mt-7 mb-2">
          {renderInline(line.slice(3), `h3-${blocks.length}`)}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      flushList();
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="text-xl font-semibold mb-2">
          {renderInline(line.slice(2), `h2-${blocks.length}`)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
      i++;
      continue;
    }

    if (line.trim() === "") {
      flushList();
      i++;
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-subtle leading-relaxed my-3">
        {renderInline(line, `p-${blocks.length}`)}
      </p>
    );
    i++;
  }

  flushList();
  return <>{blocks}</>;
}
