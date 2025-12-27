import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { scans, patients, stats, setActiveScanId } = useMedicalData();
  const [animatedStats, setAnimatedStats] = useState<number[]>([0, 0, 0, 0]);

  const statsData = [
    { 
      label: "Total Scans", 
      value: stats.totalScans, 
      change: "+12%", 
      trend: "up",
      icon: Activity,
      color: "text-primary"
    },
    { 
      label: "High Risk Cases", 
      value: stats.highRiskCases, 
      change: "-5%", 
      trend: "down",
      icon: AlertTriangle,
      color: "text-risk-high"
    },
    { 
      label: "Analyzed Today", 
      value: stats.analyzedToday, 
      change: "+18%", 
      trend: "up",
      icon: CheckCircle,
      color: "text-risk-low"
    },
    { 
      label: "Total Patients", 
      value: patients.length, 
      change: "+3", 
      trend: "up",
      icon: Users,
      color: "text-accent"
    },
  ];

  useEffect(() => {
    const timers = statsData.map((stat, index) => {
      const target = stat.value;
      const duration = 1500;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      return setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
        }
        setAnimatedStats(prev => {
          const newStats = [...prev];
          newStats[index] = current;
          return newStats;
        });
      }, duration / steps);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, [stats.totalScans, stats.highRiskCases, stats.analyzedToday, patients.length]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-risk-high";
      case "medium": return "bg-risk-medium";
      default: return "bg-risk-low";
    }
  };

  const getRiskLabel = (risk: string) => {
    return risk.charAt(0).toUpperCase() + risk.slice(1);
  };

  const recentScans = scans.slice(0, 5);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. Rodriguez</p>
          </div>
          <div className="flex gap-3">
            <Link to="/patients">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Patients
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="medical">
                <Upload className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="medical-card animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {Math.round(animatedStats[index]).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className={`w-3 h-3 ${stat.trend === "up" ? "text-risk-low" : "text-risk-high rotate-180"}`} />
                    <span className={`text-xs ${stat.trend === "up" ? "text-risk-low" : "text-risk-high"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent scans */}
          <Card className="medical-card lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Scans</h2>
              <Link to="/history">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentScans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No scans yet. Upload your first scan to get started.</p>
                </div>
              ) : (
                recentScans.map((scan, index) => (
                  <div 
                    key={scan.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{scan.caseId}</p>
                        <p className="text-sm text-muted-foreground">{getPatientName(scan.patientId)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">{scan.confidence}%</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${getRiskColor(scan.risk)}`}>
                        {getRiskLabel(scan.risk)}
                      </div>
                      <Link to={`/explainability/${scan.id}`} onClick={() => setActiveScanId(scan.id)}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="medical-card">
            <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/patients" className="block">
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">Manage Patients</p>
                      <p className="text-sm text-muted-foreground">{patients.length} patient profiles</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/upload" className="block">
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">Upload New Scan</p>
                      <p className="text-sm text-muted-foreground">Analyze chest X-ray</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/reports" className="block">
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-risk-medium/10 text-risk-medium">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">Generate Report</p>
                      <p className="text-sm text-muted-foreground">Export findings</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/analytics" className="block">
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-risk-low/10 text-risk-low">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">View Analytics</p>
                      <p className="text-sm text-muted-foreground">Performance metrics</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* System status */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">System Status</span>
                <span className="flex items-center gap-2 text-sm text-risk-low">
                  <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Model Version</span>
                <span className="text-sm font-mono">v2.4.1</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;