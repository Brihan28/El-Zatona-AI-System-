import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, HelpCircle } from "lucide-react";

const quizHistory = [
  { name: "ML Week 5 Quiz", date: "Apr 7, 2026", score: "4/5", pct: 80 },
  { name: "DS Trees Quiz", date: "Apr 6, 2026", score: "3/5", pct: 60 },
  { name: "LA Eigenvalues Quiz", date: "Apr 4, 2026", score: "5/5", pct: 100 },
  { name: "DB Normalization Quiz", date: "Apr 2, 2026", score: "2/5", pct: 40 },
];

const ProfilePage = () => {
  return (
    <DashboardLayout title="Profile" subtitle="Manage your account">
      <div className="max-w-4xl space-y-6">
        {/* Info */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground font-heading text-xl">JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">John Doe</h3>
              <p className="text-sm text-muted-foreground">john.doe@university.edu</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input defaultValue="Doe" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Email</Label>
              <Input defaultValue="john.doe@university.edu" type="email" />
            </div>
          </div>
          <Button className="mt-4">Save Changes</Button>
        </Card>

        {/* Documents */}
        <Card className="p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Uploaded Documents
          </h3>
          <div className="text-sm text-muted-foreground">
            <p>12 documents uploaded · 45.2 MB total</p>
          </div>
        </Card>

        {/* Quiz History */}
        <Card className="p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> Quiz History
          </h3>
          <div className="space-y-3">
            {quizHistory.map((q) => (
              <div key={q.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{q.name}</p>
                  <p className="text-xs text-muted-foreground">{q.date}</p>
                </div>
                <Badge variant={q.pct >= 80 ? "default" : q.pct >= 60 ? "secondary" : "destructive"}>
                  {q.score}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
