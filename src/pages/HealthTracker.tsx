import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Syringe, Stethoscope, Pill, Weight, AlertCircle, Calendar, Trash2 } from "lucide-react";

const RECORD_TYPES = [
  { value: "vaccination", label: "Vaccination", icon: Syringe, color: "bg-green-100 text-green-700 border-green-200" },
  { value: "checkup", label: "Vet Checkup", icon: Stethoscope, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "medication", label: "Medication", icon: Pill, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "surgery", label: "Surgery", icon: Heart, color: "bg-red-100 text-red-700 border-red-200" },
  { value: "allergy", label: "Allergy", icon: AlertCircle, color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "weight", label: "Weight Log", icon: Weight, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
];

export default function HealthTracker() {
  const { toast } = useToast();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [form, setForm] = useState({
    record_type: "checkup",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    vet_name: "",
    vet_clinic: "",
    next_due_date: "",
    cost: "",
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) fetchRecords();
  }, [selectedPet]);

  const fetchPets = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("pets").select("*").eq("user_id", user.id).order("name");
    if (data) {
      setPets(data);
      if (data.length > 0) setSelectedPet(data[0].id);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("health_records")
      .select("*")
      .eq("pet_id", selectedPet)
      .order("date", { ascending: false });
    if (data) setRecords(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date || !selectedPet) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("health_records").insert({
      ...form,
      pet_id: selectedPet,
      user_id: user.id,
      cost: form.cost ? parseFloat(form.cost) : null,
      next_due_date: form.next_due_date || null,
    });

    if (error) {
      toast({ title: "Error saving record", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Health record saved!" });
      setDialogOpen(false);
      setForm({ record_type: "checkup", title: "", description: "", date: new Date().toISOString().split("T")[0], vet_name: "", vet_clinic: "", next_due_date: "", cost: "" });
      fetchRecords();
    }
  };

  const deleteRecord = async (id: string) => {
    await supabase.from("health_records").delete().eq("id", id);
    fetchRecords();
    toast({ title: "Record deleted" });
  };

  const getTypeInfo = (type: string) => RECORD_TYPES.find(t => t.value === type) || RECORD_TYPES[1];

  const filteredRecords = filterType === "all" ? records : records.filter(r => r.record_type === filterType);
  const upcomingDue = records.filter(r => r.next_due_date && new Date(r.next_due_date) > new Date()).slice(0, 3);
  const selectedPetData = pets.find(p => p.id === selectedPet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏥 Health Tracker</h1>
            <p className="text-sm text-gray-500">Keep your pet's health records organized</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Plus size={16} /> Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Health Record</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Record Type *</Label>
                  <Select value={form.record_type} onValueChange={v => setForm({ ...form, record_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RECORD_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Title *</Label>
                  <Input placeholder="e.g. Annual Vaccination, Weight Check" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <Label>Date *</Label>
                  <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Vet Name</Label>
                    <Input placeholder="Dr. Name" value={form.vet_name} onChange={e => setForm({ ...form, vet_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Clinic</Label>
                    <Input placeholder="Clinic name" value={form.vet_clinic} onChange={e => setForm({ ...form, vet_clinic: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Next Due Date</Label>
                    <Input type="date" value={form.next_due_date} onChange={e => setForm({ ...form, next_due_date: e.target.value })} />
                  </div>
                  <div>
                    <Label>Cost (₹)</Label>
                    <Input type="number" placeholder="0.00" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea placeholder="Additional details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">Save Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pet Selector */}
        {pets.length === 0 ? (
          <Card className="text-center p-8 border-dashed">
            <p className="text-gray-500 mb-3">No pets added yet</p>
            <Button variant="outline" onClick={() => window.location.href = "/my-pets"}>Add Your First Pet</Button>
          </Card>
        ) : (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {pets.map(pet => (
                <button key={pet.id} onClick={() => setSelectedPet(pet.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPet === pet.id ? "bg-emerald-600 text-white shadow-md" : "bg-white text-gray-600 border hover:border-emerald-300"}`}>
                  {pet.name}
                </button>
              ))}
            </div>

            {/* Upcoming Due */}
            {upcomingDue.length > 0 && (
              <Card className="mb-4 border-amber-200 bg-amber-50">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center gap-2 text-amber-700"><Calendar size={16} /> Upcoming Due</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2">
                  {upcomingDue.map(r => (
                    <div key={r.id} className="flex items-center justify-between text-sm">
                      <span className="text-amber-800 font-medium">{r.title}</span>
                      <span className="text-amber-600">{new Date(r.next_due_date).toLocaleDateString('en-IN')}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Total Records", value: records.length, color: "text-emerald-600" },
                { label: "This Year", value: records.filter(r => new Date(r.date).getFullYear() === new Date().getFullYear()).length, color: "text-blue-600" },
                { label: "Upcoming", value: upcomingDue.length, color: "text-amber-600" },
              ].map(s => (
                <Card key={s.label} className="text-center p-3">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              <button onClick={() => setFilterType("all")} className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterType === "all" ? "bg-gray-800 text-white" : "bg-white text-gray-600"}`}>All</button>
              {RECORD_TYPES.map(t => (
                <button key={t.value} onClick={() => setFilterType(t.value)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterType === t.value ? "bg-gray-800 text-white" : "bg-white text-gray-600"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Records List */}
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading records...</div>
            ) : filteredRecords.length === 0 ? (
              <Card className="text-center p-8 border-dashed">
                <Heart size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No health records yet for {selectedPetData?.name}</p>
                <p className="text-sm text-gray-400 mt-1">Add your first record to get started</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredRecords.map(record => {
                  const typeInfo = getTypeInfo(record.record_type);
                  const Icon = typeInfo.icon;
                  return (
                    <Card key={record.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg border ${typeInfo.color}`}>
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-gray-900">{record.title}</h3>
                                <Badge variant="outline" className={`text-xs ${typeInfo.color}`}>{typeInfo.label}</Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              {record.vet_name && <p className="text-sm text-gray-500">Dr. {record.vet_name} {record.vet_clinic && `• ${record.vet_clinic}`}</p>}
                              {record.description && <p className="text-sm text-gray-600 mt-1">{record.description}</p>}
                              <div className="flex gap-3 mt-2 flex-wrap">
                                {record.next_due_date && <span className="text-xs text-amber-600 font-medium">📅 Due: {new Date(record.next_due_date).toLocaleDateString('en-IN')}</span>}
                                {record.cost && <span className="text-xs text-gray-500">💰 ₹{record.cost}</span>}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => deleteRecord(record.id)} className="text-gray-300 hover:text-red-400 transition-colors ml-2 flex-shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
