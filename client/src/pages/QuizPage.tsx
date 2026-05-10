import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Send } from "lucide-react";

interface Question {
  id: number;
  type: "mcq" | "tf" | "short";
  question: string;
  options?: string[];
  answer: string;
}

const questions: Question[] = [
  {
    id: 1, type: "mcq",
    question: "What does the learning rate (α) control in gradient descent?",
    options: ["Number of iterations", "Step size per iteration", "Size of the dataset", "Number of features"],
    answer: "Step size per iteration",
  },
  {
    id: 2, type: "tf",
    question: "Stochastic gradient descent uses the entire training set in each iteration.",
    answer: "False",
  },
  {
    id: 3, type: "mcq",
    question: "Which gradient descent variant uses a subset of training data per iteration?",
    options: ["Batch", "Stochastic", "Mini-batch", "Full-batch"],
    answer: "Mini-batch",
  },
  {
    id: 4, type: "short",
    question: "What happens when the learning rate is set too high?",
    answer: "divergence",
  },
  {
    id: 5, type: "tf",
    question: "The cost function measures the error between predicted and actual values.",
    answer: "True",
  },
];

const QuizPage = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (id: number, val: string) => {
    if (!submitted) setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const score = submitted
    ? questions.filter((q) => {
        const a = answers[q.id]?.toLowerCase().trim();
        return a === q.answer.toLowerCase().trim();
      }).length
    : 0;

  return (
    <DashboardLayout title="Quiz" subtitle="Test your knowledge on Machine Learning - Week 5">
      <div className="max-w-3xl space-y-6">
        {submitted && (
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="font-heading text-3xl font-bold text-foreground">{score}/{questions.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {score >= 4 ? "Great job! 🎉" : score >= 2 ? "Good effort! Review weak areas." : "Keep studying, you'll get there!"}
              </p>
            </div>
          </Card>
        )}

        {questions.map((q, i) => {
          const isCorrect = submitted && answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim();
          const isWrong = submitted && !isCorrect;

          return (
            <Card key={q.id} className={`p-6 ${isCorrect ? "border-success/30" : isWrong ? "border-destructive/30" : ""}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <span className="font-heading text-sm font-bold text-muted-foreground">Q{i + 1}</span>
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      {q.type === "mcq" ? "Multiple Choice" : q.type === "tf" ? "True / False" : "Short Answer"}
                    </Badge>
                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                  </div>
                </div>
                {submitted && (isCorrect ? <CheckCircle2 className="h-5 w-5 text-success shrink-0" /> : <XCircle className="h-5 w-5 text-destructive shrink-0" />)}
              </div>

              {q.type === "mcq" && q.options && (
                <RadioGroup value={answers[q.id] || ""} onValueChange={(v) => setAnswer(q.id, v)} className="ml-8 space-y-2">
                  {q.options.map((opt) => (
                    <div key={opt} className={`flex items-center space-x-2 p-2 rounded-md ${submitted && opt === q.answer ? "bg-success/10" : ""}`}>
                      <RadioGroupItem value={opt} id={`${q.id}-${opt}`} disabled={submitted} />
                      <Label htmlFor={`${q.id}-${opt}`} className="text-sm cursor-pointer">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === "tf" && (
                <RadioGroup value={answers[q.id] || ""} onValueChange={(v) => setAnswer(q.id, v)} className="ml-8 space-y-2">
                  {["True", "False"].map((opt) => (
                    <div key={opt} className={`flex items-center space-x-2 p-2 rounded-md ${submitted && opt === q.answer ? "bg-success/10" : ""}`}>
                      <RadioGroupItem value={opt} id={`${q.id}-${opt}`} disabled={submitted} />
                      <Label htmlFor={`${q.id}-${opt}`} className="text-sm cursor-pointer">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === "short" && (
                <div className="ml-8">
                  <Input
                    placeholder="Type your answer..."
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    disabled={submitted}
                  />
                  {submitted && <p className="text-xs text-muted-foreground mt-1">Correct answer: {q.answer}</p>}
                </div>
              )}
            </Card>
          );
        })}

        {!submitted && (
          <Button size="lg" className="w-full" onClick={() => setSubmitted(true)}>
            <Send className="mr-2 h-4 w-4" /> Submit Quiz
          </Button>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuizPage;
