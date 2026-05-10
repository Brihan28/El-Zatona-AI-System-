import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, FileText } from "lucide-react";

const summaryText = `Machine Learning Week 5 covers the fundamental concepts of gradient descent optimization. 

**Key Concepts:**
- Gradient descent is an iterative optimization algorithm used to minimize the cost function
- The learning rate (α) controls the step size in each iteration
- Batch gradient descent uses the entire training set, while stochastic gradient descent uses individual samples
- Mini-batch gradient descent is a compromise between the two approaches

**Important Formulas:**
- Weight update rule: w = w - α · ∂J/∂w
- The cost function measures the error between predicted and actual values

**Convergence:**
- The algorithm converges when the change in cost function becomes negligible
- Too high a learning rate can cause divergence
- Too low a learning rate results in slow convergence

**Applications:**
Linear regression, logistic regression, and neural network training all rely on gradient descent variants for optimization.`;

const SummaryPage = () => {
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");

  return (
    <DashboardLayout title="AI Summary" subtitle="AI-generated lecture summaries">
      <div className="max-w-4xl space-y-6">
        {/* Controls */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Machine Learning - Week 5</span>
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
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-1 h-3.5 w-3.5" /> Regenerate
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary content */}
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary">AI Generated</Badge>
            <Badge variant="outline">{length} summary</Badge>
          </div>
          <div className="prose prose-sm max-w-none text-foreground">
            {summaryText.split("\n").map((line, i) => {
              if (line.startsWith("**") && line.endsWith("**")) {
                return <h3 key={i} className="font-heading text-base font-semibold mt-4 mb-2">{line.replace(/\*\*/g, "")}</h3>;
              }
              if (line.startsWith("- ")) {
                return <li key={i} className="text-sm text-muted-foreground ml-4">{line.slice(2)}</li>;
              }
              if (line.trim() === "") return <br key={i} />;
              return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>;
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SummaryPage;
