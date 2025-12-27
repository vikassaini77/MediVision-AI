import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  UserPlus, 
  User, 
  Calendar,
  Activity,
  FileText,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { generatePatientId } from "@/types/medical";
import { toast } from "sonner";
import { format } from "date-fns";

const Patients = () => {
  const { patients, scans, addPatient, deletePatient, setActivePatientId } = useMedicalData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    notes: string;
  }>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    notes: "",
  });

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || patient.patientId.toLowerCase().includes(query);
  });

  const getPatientScanCount = (patientId: string) => {
    return scans.filter(s => s.patientId === patientId).length;
  };

  const getPatientLatestScan = (patientId: string) => {
    const patientScans = scans.filter(s => s.patientId === patientId);
    if (patientScans.length === 0) return null;
    return patientScans.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  const handleAddPatient = () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.dateOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }

    addPatient({
      patientId: generatePatientId(),
      firstName: newPatient.firstName,
      lastName: newPatient.lastName,
      dateOfBirth: newPatient.dateOfBirth,
      gender: newPatient.gender,
      notes: newPatient.notes || undefined,
    });

    setNewPatient({ firstName: "", lastName: "", dateOfBirth: "", gender: "male", notes: "" });
    setIsAddDialogOpen(false);
    toast.success("Patient added successfully");
  };

  const handleDeletePatient = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This will also delete all associated scans.`)) {
      deletePatient(id);
      toast.success("Patient deleted");
    }
  };

  const handleViewPatient = (patientId: string) => {
    setActivePatientId(patientId);
    navigate("/history");
  };

  const handleNewScan = (patientId: string) => {
    setActivePatientId(patientId);
    navigate("/upload");
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-risk-high bg-risk-high/10 border-risk-high/20";
      case "medium": return "text-risk-medium bg-risk-medium/10 border-risk-medium/20";
      default: return "text-risk-low bg-risk-low/10 border-risk-low/20";
    }
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Patient Management</h1>
            <p className="text-muted-foreground">Manage patient profiles and linked scans</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="medical">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Create a new patient profile to link scans and track medical history.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newPatient.firstName}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newPatient.lastName}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={newPatient.dateOfBirth}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={newPatient.gender}
                      onValueChange={(value) => setNewPatient(prev => ({ ...prev, gender: value as 'male' | 'female' | 'other' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes</Label>
                  <Textarea
                    id="notes"
                    value={newPatient.notes}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any relevant medical history or notes..."
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button variant="medical" onClick={handleAddPatient}>Add Patient</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="medical-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or patient ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </Card>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="medical-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </Card>
          <Card className="medical-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scans.length}</p>
                <p className="text-sm text-muted-foreground">Total Scans</p>
              </div>
            </div>
          </Card>
          <Card className="medical-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-risk-high/10 text-risk-high">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scans.filter(s => s.risk === 'high').length}</p>
                <p className="text-sm text-muted-foreground">High Risk Cases</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Patients list */}
        <div className="space-y-3">
          {filteredPatients.map((patient, index) => {
            const scanCount = getPatientScanCount(patient.id);
            const latestScan = getPatientLatestScan(patient.id);
            
            return (
              <Card 
                key={patient.id}
                className="medical-card hover:border-primary/30 transition-all animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-medical flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{patient.firstName} {patient.lastName}</h3>
                      <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {patient.patientId}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        DOB: {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{patient.gender}</span>
                      <span>•</span>
                      <span>{scanCount} scan{scanCount !== 1 ? 's' : ''}</span>
                      {patient.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px]">{patient.notes}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Latest scan info */}
                    {latestScan && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Latest:</span>
                        <span className="text-xs font-mono">{latestScan.caseId}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(latestScan.risk)}`}>
                          {latestScan.risk.charAt(0).toUpperCase() + latestScan.risk.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {latestScan.prediction}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient.id)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Scans
                    </Button>
                    <Button variant="medical" size="sm" onClick={() => handleNewScan(patient.id)}>
                      <Activity className="w-4 h-4 mr-1" />
                      New Scan
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-risk-high"
                      onClick={() => handleDeletePatient(patient.id, `${patient.firstName} ${patient.lastName}`)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredPatients.length === 0 && (
          <Card className="medical-card text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No patients found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Add your first patient to get started"}
            </p>
            {!searchQuery && (
              <Button variant="medical" onClick={() => setIsAddDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            )}
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Patients;
