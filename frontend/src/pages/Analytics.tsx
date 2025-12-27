import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, Activity, AlertTriangle, CheckCircle } from "lucide-react";

const scanVolumeData = [
  { name: "Mon", scans: 42 },
  { name: "Tue", scans: 38 },
  { name: "Wed", scans: 55 },
  { name: "Thu", scans: 48 },
  { name: "Fri", scans: 62 },
  { name: "Sat", scans: 28 },
  { name: "Sun", scans: 22 },
];

const riskDistribution = [
  { name: "Low Risk", value: 68, color: "hsl(142, 70%, 45%)" },
  { name: "Medium Risk", value: 24, color: "hsl(45, 90%, 50%)" },
  { name: "High Risk", value: 8, color: "hsl(0, 75%, 55%)" },
];

const confidenceTrend = [
  { date: "Dec 18", avg: 94.2 },
  { date: "Dec 19", avg: 95.1 },
  { date: "Dec 20", avg: 93.8 },
  { date: "Dec 21", avg: 96.2 },
  { date: "Dec 22", avg: 95.5 },
  { date: "Dec 23", avg: 94.8 },
  { date: "Dec 24", avg: 95.9 },
];

const findingsBreakdown = [
  { type: "Normal", count: 847, percentage: 68 },
  { type: "Opacity", count: 186, percentage: 15 },
  { type: "Effusion", count: 112, percentage: 9 },
  { type: "Consolidation", count: 62, percentage: 5 },
  { type: "Other", count: 40, percentage: 3 },
];

const Analytics = () => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {payload[0].name}: {payload[0].value}
            {payload[0].name === "avg" ? "%" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Performance metrics and insights</p>
        </div>

        {/* Quick stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Weekly Scans", value: "295", change: "+12%", icon: Activity, trend: "up" },
            { label: "Avg Confidence", value: "95.2%", change: "+0.5%", icon: TrendingUp, trend: "up" },
            { label: "High Risk Cases", value: "23", change: "-8%", icon: AlertTriangle, trend: "down" },
            { label: "Normal Findings", value: "68%", change: "+3%", icon: CheckCircle, trend: "up" },
          ].map((stat, index) => (
            <Card 
              key={stat.label} 
              className="medical-card animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.trend === "up" ? "text-risk-low" : "text-risk-high"}`}>
                    {stat.change} vs last week
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scan volume chart */}
          <Card className="medical-card">
            <h3 className="font-semibold mb-4">Weekly Scan Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scanVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="scans" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Risk distribution pie chart */}
          <Card className="medical-card">
            <h3 className="font-semibold mb-4">Risk Distribution</h3>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 ml-4">
                {riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Confidence trend */}
          <Card className="medical-card">
            <h3 className="font-semibold mb-4">Model Confidence Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={confidenceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[90, 100]}
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="avg" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorConfidence)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Findings breakdown */}
          <Card className="medical-card">
            <h3 className="font-semibold mb-4">Findings Breakdown</h3>
            <div className="space-y-4">
              {findingsBreakdown.map((item, index) => (
                <div 
                  key={item.type}
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm text-muted-foreground">{item.count} cases</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-medical transition-all duration-1000"
                      style={{ 
                        width: `${item.percentage}%`,
                        opacity: 1 - index * 0.15
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Model performance */}
        <Card className="medical-card">
          <h3 className="font-semibold mb-4">Model Performance Metrics</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "Sensitivity", value: "96.8%", desc: "True positive rate" },
              { metric: "Specificity", value: "94.2%", desc: "True negative rate" },
              { metric: "Precision", value: "93.5%", desc: "Positive predictive value" },
              { metric: "F1 Score", value: "95.1%", desc: "Harmonic mean" },
            ].map((item) => (
              <div key={item.metric} className="text-center p-4 rounded-lg bg-secondary/50">
                <p className="text-2xl font-bold text-primary">{item.value}</p>
                <p className="font-medium mt-1">{item.metric}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Analytics;
