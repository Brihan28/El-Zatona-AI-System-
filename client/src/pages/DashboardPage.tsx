import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, HelpCircle, AlertTriangle, Calendar, TrendingUp, BookOpen } from "lucide-react";

const stats = [
  { label: "Lectures Uploaded", value: "12", icon: FileText, change: "+3 this week" },
  { label: "Quizzes Completed", value: "28", icon: HelpCircle, change: "85% avg score" },
  { label: "Weak Topics", value: "4", icon: AlertTriangle, change: "Down from 7" },
  { label: "Study Streak", value: "6 days", icon: TrendingUp, change: "Keep going!" },
];

const recentLectures = [
  { name: "Machine Learning - Week 5", date: "2 hours ago", pages: 24 },
  { name: "Data Structures - Trees", date: "Yesterday", pages: 18 },
  { name: "Linear Algebra - Eigenvalues", date: "3 days ago", pages: 32 },
];

const weakTopics = [
  { topic: "Gradient Descent", subject: "Machine Learning", confidence: 35 },
  { topic: "AVL Trees", subject: "Data Structures", confidence: 42 },
  { topic: "Eigenvectors", subject: "Linear Algebra", confidence: 55 },
  { topic: "SQL Joins", subject: "Databases", confidence: 60 },
];

const DashboardPage = () => {
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your study overview.">
      <div className="space-y-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="font-heading text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Lectures */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Recent Lectures
            </h3>
            <div className="space-y-3">
              {recentLectures.map((l) => (
                <div key={l.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.date} · {l.pages} pages</p>
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>

          {/* Weak Topics */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> Weak Topics
            </h3>
            <div className="space-y-4">
              {weakTopics.map((t) => (
                <div key={t.topic}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.topic}</p>
                      <p className="text-xs text-muted-foreground">{t.subject}</p>
                    </div>
                    <span className="text-sm font-medium text-foreground">{t.confidence}%</span>
                  </div>
                  <Progress value={t.confidence} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Study Plan Preview */}
        <Card className="p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Today's Study Plan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { time: "9:00 AM", task: "Review ML Gradient Descent", duration: "45 min", done: true },
              { time: "11:00 AM", task: "Practice AVL Tree Quiz", duration: "30 min", done: false },
              { time: "2:00 PM", task: "Read Linear Algebra Ch.8", duration: "1 hour", done: false },
            ].map((item) => (
              <div
                key={item.task}
                className={`p-4 rounded-lg border ${item.done ? "bg-success/5 border-success/20" : "bg-card border-border"}`}
              >
                <p className="text-xs text-muted-foreground">{item.time} · {item.duration}</p>
                <p className={`text-sm font-medium mt-1 ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {item.task}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
