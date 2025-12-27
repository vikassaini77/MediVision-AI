import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile settings */}
        <Card className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Profile Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your personal information</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.fullName || ''} className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email || ''} className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Radiology" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">Medical License</Label>
              <Input id="license" defaultValue="MD-2024-XXXX" className="bg-secondary border-border" />
            </div>
          </div>
        </Card>

        {/* Notification settings */}
        <Card className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure alert preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: "high-risk", label: "High Risk Alerts", desc: "Immediate notification for high-risk findings", defaultChecked: true },
              { id: "analysis-complete", label: "Analysis Complete", desc: "Notify when scan analysis is finished", defaultChecked: true },
              { id: "weekly-report", label: "Weekly Reports", desc: "Receive weekly performance summary", defaultChecked: false },
              { id: "system-updates", label: "System Updates", desc: "Notifications about model updates", defaultChecked: true },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </div>
        </Card>

        {/* Analysis settings */}
        <Card className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Analysis Preferences</h2>
              <p className="text-sm text-muted-foreground">Configure AI analysis behavior</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Default Model</Label>
                <Select defaultValue="v2.4.1">
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v2.4.1">MedVision v2.4.1 (Latest)</SelectItem>
                    <SelectItem value="v2.3.0">MedVision v2.3.0</SelectItem>
                    <SelectItem value="v2.2.5">MedVision v2.2.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Confidence Threshold</Label>
                <Select defaultValue="90">
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="85">85% (More sensitive)</SelectItem>
                    <SelectItem value="90">90% (Balanced)</SelectItem>
                    <SelectItem value="95">95% (High precision)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              {[
                { id: "auto-gradcam", label: "Auto-generate Grad-CAM", desc: "Automatically create explainability heatmaps", defaultChecked: true },
                { id: "multi-findings", label: "Multiple Findings Detection", desc: "Report all detected abnormalities", defaultChecked: true },
                { id: "comparison", label: "Historical Comparison", desc: "Compare with patient's previous scans", defaultChecked: false },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Privacy & Security</h2>
              <p className="text-sm text-muted-foreground">Data protection settings</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: "anonymize", label: "Auto-anonymize Patient Data", desc: "Remove identifying information from reports", defaultChecked: true },
              { id: "audit-log", label: "Audit Logging", desc: "Track all system access and actions", defaultChecked: true },
              { id: "2fa", label: "Two-Factor Authentication", desc: "Additional security for your account", defaultChecked: false },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </div>
        </Card>

        {/* Display settings */}
        <Card className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Display</h2>
              <p className="text-sm text-muted-foreground">Interface preferences</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select defaultValue="mdy">
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select defaultValue="12h">
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button variant="medical" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
