import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Calendar,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { format } from "date-fns";

const History = () => {
  const { scans, patients, activePatientId, setActiveScanId } = useMedicalData();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [patientFilter, setPatientFilter] = useState(activePatientId || "all");

  const filteredScans = scans.filter((scan) => {
    const patient = patients.find(p => p.id === scan.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : '';
    const matchesSearch = scan.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "all" || scan.risk === riskFilter;
    const matchesPatient = patientFilter === "all" || scan.patientId === patientFilter;
    return matchesSearch && matchesRisk && matchesPatient;
  });

  const getRiskBadgeStyle = (risk: string) => {
    switch (risk) {
      case "high": return "text-risk-high bg-risk-high/10 border-risk-high/20";
      case "medium": return "text-risk-medium bg-risk-medium/10 border-risk-medium/20";
      default: return "text-risk-low bg-risk-low/10 border-risk-low/20";
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Scan History</h1>
            <p className="text-muted-foreground">View and manage previous analyses</p>
          </div>
        </div>

        <Card className="medical-card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by case ID or patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <div className="flex gap-3">
              <Select value={patientFilter} onValueChange={setPatientFilter}>
                <SelectTrigger className="w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="All Patients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[140px] bg-secondary border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {filteredScans.map((scan, index) => (
            <Card 
              key={scan.id}
              className="medical-card hover:border-primary/30 transition-all animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-primary/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{scan.caseId}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskBadgeStyle(scan.risk)}`}>
                      {scan.risk.charAt(0).toUpperCase() + scan.risk.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{getPatientName(scan.patientId)}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(scan.createdAt), 'MMM d, yyyy HH:mm')}
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">{scan.prediction}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-primary font-medium">{scan.confidence}% confidence</span>
                  </div>
                </div>
                <div className="flex gap-2 md:flex-shrink-0">
                  <Link to={`/explainability/${scan.id}`} onClick={() => setActiveScanId(scan.id)}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/reports/${scan.id}`} onClick={() => setActiveScanId(scan.id)}>
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      Report
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredScans.length === 0 && (
          <Card className="medical-card text-center py-12">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No scans found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default History;