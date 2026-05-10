import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, BookOpen, TrendingUp } from "lucide-react";

const weeklyPlan = [
  { day: "Monday", tasks: ["Review Gradient Descent", "ML Quiz Practice"], completed: true },
  { day: "Tuesday", tasks: ["AVL Trees Deep Dive", "DS Problem Set"], completed: true },
  { day: "Wednesday", tasks: ["Eigenvalue Practice", "LA Chapter 8"], completed: false },
  { day: "Thursday", tasks: ["SQL Joins Workshop", "DB Quiz"], completed: false },
  { day: "Friday", tasks: ["Full Review Session", "Mock Exam"], completed: false },
];

const recommendations = [
  { topic: "Gradient Descent Variants", reason: "Low quiz score (35%)", priority: "high" },
  { topic: "AVL Tree Rotations", reason: "Missed 3 questions", priority: "high" },
  { topic: "Matrix Diagonalization", reason: "Haven't reviewed yet", priority: "medium" },
  { topic: "Normal Forms in DB", reason: "Last reviewed 2 weeks ago", priority: "low" },
];

const StudyPlanPage = () => {
  const completedDays = weeklyPlan.filter((d) => d.completed).length;

  return (
    <DashboardLayout title="Study Plan" subtitle="Your personalized weekly study plan">
      <div className="max-w-5xl space-y-6">
        {/* Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-lg font-semibold text-foreground">Weekly Progress</h3>
            <span className="text-sm font-medium text-primary">{completedDays}/{weeklyPlan.length} days</span>
          </div>
          <Progress value={(completedDays / weeklyPlan.length) * 100} className="h-3" />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly plan */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> This Week
            </h3>
            <div className="space-y-3">
              {weeklyPlan.map((day) => (
                <div key={day.day} className={`p-4 rounded-lg border ${day.completed ? "bg-success/5 border-success/20" : "bg-card border-border"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{day.day}</span>
                    {day.completed && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                  <ul className="space-y-1">
                    {day.tasks.map((t) => (
                      <li key={t} className={`text-xs ${day.completed ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
                        • {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Recommended Topics
            </h3>
            <div className="space-y-3">
              {recommendations.map((r) => (
                <div key={r.topic} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{r.topic}</span>
                    <Badge variant={r.priority === "high" ? "destructive" : r.priority === "medium" ? "default" : "secondary"} className="text-xs">
                      {r.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Topics Mastered", value: "8", icon: CheckCircle2 },
            { label: "Hours Studied", value: "24h", icon: Clock },
            { label: "Lectures Reviewed", value: "12", icon: BookOpen },
          ].map((s) => (
            <Card key={s.label} className="p-5 text-center">
              <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudyPlanPage;
