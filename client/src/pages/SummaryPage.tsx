import { useEffect, useState } from "react";
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
  fileId?: string;
}

interface FileDetails {
  _id: string;
  filename: string;
  extractedText?: string;
}

const SUMMARY_API_URL = "http://localhost:5000/api/summaries/generate";
const FILES_API_URL = "http://localhost:5000/api/files";

const SummaryPage = () => {
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lectureTitle, setLectureTitle] = useState("Lecture Notes");
  const [extractedText, setExtractedText] = useState("");

  const location = useLocation();
  const state = (location.state ?? {}) as SummaryLocationState;

  useEffect(() => {
    const stateText = state.extractedText?.trim();

    if (stateText) {
      setExtractedText(stateText);
      setLectureTitle(state.title || "Lecture Notes");
      return;
    }

    const fetchExtractedText = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        if (state.fileId) {
          const { data } = await axios.get<FileDetails>(`${FILES_API_URL}/${state.fileId}/details`, { headers });
          if (data.extractedText?.trim()) {
            setExtractedText(data.extractedText);
            setLectureTitle(data.filename || "Lecture Notes");
            return;
          }
        }

        const { data } = await axios.get<FileDetails[]>(FILES_API_URL, { headers });
        const latestWithText = data.find((file) => file.extractedText?.trim());

        if (latestWithText?.extractedText) {
          setExtractedText(latestWithText.extractedText);
          setLectureTitle(latestWithText.filename || "Lecture Notes");
        }
      } catch (err) {
        console.error("Failed to fetch extracted text", err);
      }
    };

    fetchExtractedText();
  }, [state.extractedText, state.fileId, state.title]);

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
        type: length,
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
          {!loading && !summary && !error && <p className="text-sm text-muted-foreground">Click "Generate Summary" to create study notes from your extracted PDF text.</p>}

          {!loading && !!summary && (
            <div className="prose prose-sm max-w-none text-foreground">
              {summary.split("\n").map((line, i) =>
                line.startsWith("**") && line.endsWith("**") ? (
                  <h3 key={i} className="font-heading text-base font-semibold mt-4 mb-2">{line.replace(/\*\*/g, "")}</h3>
                ) : line.startsWith("- ") ? (
                  <li key={i} className="text-sm text-muted-foreground ml-4">{line.slice(2)}</li>
                ) : (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
                )
              )}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SummaryPage;
