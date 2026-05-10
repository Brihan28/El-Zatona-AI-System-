import { useMemo, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, FileText } from "lucide-react";

interface SummaryLocationState {
  extractedText?: string;
  title?: string;
}

const SUMMARY_API_URL = "http://localhost:5000/api/summaries/generate";

const SummaryPage = () => {
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const state = (location.state ?? {}) as SummaryLocationState;

  const extractedText = state.extractedText || localStorage.getItem("extractedPdfText") || "";
  const lectureTitle = state.title || "Lecture Notes";

  const displaySummary = useMemo(() => {
    if (!summary) return "";

    const lines = summary.split("\n").filter((line) => line.trim() !== "");

    if (length === "short") {
      return lines.slice(0, Math.max(4, Math.ceil(lines.length * 0.35))).join("\n");
    }

    if (length === "medium") {
      return lines.slice(0, Math.max(8, Math.ceil(lines.length * 0.7))).join("\n");
    }

    return summary;
  }, [length, summary]);

  const generateSummary = async () => {
    if (!extractedText.trim()) {
      setError("No extracted PDF text found. Please upload a file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post<{ summary: string }>(SUMMARY_API_URL, {
        text: extractedText,
      });

      setSummary(data.summary || "");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || "Failed to generate summary"
        : "Failed to generate summary";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="AI Summary" subtitle="AI-generated lecture summaries">
      <div className="max-w-4xl space-y-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{lectureTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-border overflow-hidden">
                {(["short", "medium", "long"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`px-3 py-1.5 text-sm capitalize transition-colors ${
                      length === l ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                    type="button"
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={generateSummary} disabled={loading}>
                <RefreshCw className={`mr-1 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                {summary ? "Regenerate" : "Generate Summary"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary">AI Generated</Badge>
            <Badge variant="outline">{length} summary</Badge>
          </div>

          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {loading && <p className="text-sm text-muted-foreground">Generating summary, please wait...</p>}

          {!loading && !summary && !error && (
            <p className="text-sm text-muted-foreground">Click "Generate Summary" to create study notes from your extracted PDF text.</p>
          )}

          {!loading && !!summary && (
            <div className="prose prose-sm max-w-none text-foreground">
              {displaySummary.split("\n").map((line, i) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return (
                    <h3 key={i} className="font-heading text-base font-semibold mt-4 mb-2">
                      {line.replace(/\*\*/g, "")}
                    </h3>
                  );
                }

                if (line.startsWith("- ")) {
                  return (
                    <li key={i} className="text-sm text-muted-foreground ml-4">
                      {line.slice(2)}
                    </li>
                  );
                }

                return (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SummaryPage;
