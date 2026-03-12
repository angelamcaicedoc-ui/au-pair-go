import { getSectionContent } from "@/content/sections/index";

interface SectionContentProps {
  sectionId: string;
}

export default function SectionContent({ sectionId }: SectionContentProps) {
  const content = getSectionContent(sectionId);

  if (!content) return null;

  // Simple markdown-like rendering
  const lines = content.split("\n");

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex items-center gap-2">
        <span>📖</span>
        <span className="font-semibold text-gray-800 text-sm">
          Guía & Contenido
        </span>
      </div>
      <div className="p-4 prose prose-sm max-w-none">
        {lines.map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="text-lg font-bold text-gray-800 mt-4 mb-2 first:mt-0">
                {line.slice(3)}
              </h2>
            );
          }
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} className="text-base font-semibold text-gray-700 mt-3 mb-1">
                {line.slice(4)}
              </h3>
            );
          }
          if (line.startsWith("- [ ]")) {
            return (
              <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
                <input type="checkbox" className="mt-1 rounded flex-shrink-0" readOnly />
                <span className="text-sm text-gray-700">{line.slice(6)}</span>
              </div>
            );
          }
          if (line.startsWith("- **")) {
            const match = line.match(/^- \*\*(.+?)\*\*:? ?(.*)/);
            if (match) {
              return (
                <div key={i} className="flex gap-1.5 ml-2 my-0.5 text-sm">
                  <span className="flex-shrink-0 text-gray-400">•</span>
                  <span className="text-gray-700">
                    <strong>{match[1]}:</strong> {match[2]}
                  </span>
                </div>
              );
            }
          }
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <div key={i} className="flex gap-1.5 ml-2 my-0.5 text-sm">
                <span className="flex-shrink-0 text-gray-400">•</span>
                <span className="text-gray-700">{line.slice(2)}</span>
              </div>
            );
          }
          if (line.startsWith("| ")) {
            return (
              <div key={i} className="text-xs font-mono text-gray-600 my-0.5 ml-2">
                {line}
              </div>
            );
          }
          if (line.trim() === "" || line.trim() === "---") {
            return <div key={i} className="my-2" />;
          }
          // Inline bold
          const parts = line.split(/\*\*(.+?)\*\*/g);
          return (
            <p key={i} className="text-sm text-gray-700 my-0.5">
              {parts.map((part, j) =>
                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}
