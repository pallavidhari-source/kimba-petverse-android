import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Bell, BellOff, Trash2, UtensilsCrossed, Clock } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Morning Snack", "Evening Snack", "Midnight"];
const FOOD_UNITS = ["grams", "cups", "ml", "pieces", "scoops", "tablespoons"];

export default function FeedingReminders() {
  const { toast } = useToast();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [reminders, setReminders] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    meal_name: "Breakfast",
    food_type: "",
    quantity: "",
    unit: "grams",
    reminder_time: "08:00",
    days_of_week: [...DAYS],
  });

  useEffect(() => { fetchPets(); }, []);
  useEffect(() => { if (selectedPet) { fetchReminders(); fetchTodayLogs(); } }, [selectedPet]);

  const fetchPets = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("pets").select("*").eq("user_id", user.id);
    if (data) { setPets(data); if (data.length > 0) setSelectedPet(data[0].id); }
  };

  const fetchReminders = async () => {
    const { data } = await supabase.from("feeding_reminders").select("*").eq("pet_id", selectedPet).order("reminder_time");
    if (data) setReminders(data);
  };

  const fetchTodayLogs = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("feeding_logs").select("*").eq("pet_id", selectedPet).gte("fed_at", today);
    if (data) setLogs(data);
  };

  const toggleDay = (day: string) => {
    setForm(f => ({
      ...f,
      days_of_week: f.days_of_week.includes(day) ? f.days_of_week.filter(d => d !== day) : [...f.days_of_week, day]
    }));
  };

  const handleSubmit = async () => {
    if (!form.meal_name || !form.reminder_time || !selectedPet) {
      toast({ title: "Please fill required fields", variant: "destructive" }); return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("feeding_reminders").insert({
      ...form, pet_id: selectedPet, user_id: user.id, quantity: form.quantity || null,
    });

    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else {
      toast({ title: "⏰ Reminder set!" });
      setDialogOpen(false);
      setForm({ meal_name: "Breakfast", food_type: "", quantity: "", unit: "grams", reminder_time: "08:00", days_of_week: [...DAYS] });
      fetchReminders();
    }
  };

  const toggleReminder = async (id: string, current: boolean) => {
    await supabase.from("feeding_reminders").update({ is_active: !current }).eq("id", id);
    fetchReminders();
  };

  const deleteReminder = async (id: string) => {
    await supabase.from("feeding_reminders").delete().eq("id", id);
    fetchReminders();
    toast({ title: "Reminder deleted" });
  };

  const markFed = async (reminderId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("feeding_logs").insert({ reminder_id: reminderId, pet_id: selectedPet, user_id: user.id });
    fetchTodayLogs();
    toast({ title: "🍖 Marked as fed!" });
  };

  const isLoggedToday = (reminderId: string) => logs.some(l => l.reminder_id === reminderId);

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const selectedPetData = pets.find(p => p.id === selectedPet);
  const todayFedCount = reminders.filter(r => r.is_active && isLoggedToday(r.id)).length;
  const activeReminders = reminders.filter(r => r.is_active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🍽️ Feeding Reminders</h1>
            <p className="text-sm text-gray-500">Never miss a meal time</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 gap-2"><Plus size={16} /> Add Meal</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Set Feeding Reminder</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Meal Name *</Label>
                  <Select value={form.meal_name} onValueChange={v => setForm({ ...form, meal_name: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{MEAL_TYPES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time *</Label>
                  <Input type="time" value={form.reminder_time} onChange={e => setForm({ ...form, reminder_time: e.target.value })} />
                </div>
                <div>
                  <Label>Food Type</Label>
                  <Input placeholder="e.g. Royal Canin, Homemade, Raw" value={form.food_type} onChange={e => setForm({ ...form, food_type: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="Amount" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select value={form.unit} onValueChange={v => setForm({ ...form, unit: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{FOOD_UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Repeat on Days</Label>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map(day => (
                      <button key={day} onClick={() => toggleDay(day)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all border ${form.days_of_week.includes(day) ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200"}`}>
                        {day.slice(0, 1)}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600">Set Reminder</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pet Selector */}
        {pets.length === 0 ? (
          <Card className="text-center p-8 border-dashed">
            <p className="text-gray-500">No pets added yet</p>
          </Card>
        ) : (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {pets.map(pet => (
                <button key={pet.id} onClick={() => setSelectedPet(pet.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPet === pet.id ? "bg-orange-500 text-white shadow-md" : "bg-white text-gray-600 border hover:border-orange-300"}`}>
                  {pet.name}
                </button>
              ))}
            </div>

            {/* Today's Progress */}
            {activeReminders.length > 0 && (
              <Card className="mb-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Today's Progress for {selectedPetData?.name}</p>
                      <p className="text-2xl font-bold mt-1">{todayFedCount} / {activeReminders.length} meals</p>
                    </div>
                    <div className="text-5xl opacity-30">🐾</div>
                  </div>
                  <div className="mt-3 bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${activeReminders.length ? (todayFedCount / activeReminders.length) * 100 : 0}%` }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reminders List */}
            {reminders.length === 0 ? (
              <Card className="text-center p-8 border-dashed">
                <UtensilsCrossed size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No feeding reminders set</p>
                <p className="text-sm text-gray-400 mt-1">Add a reminder to track {selectedPetData?.name}'s meals</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {reminders.map(reminder => {
                  const fed = isLoggedToday(reminder.id);
                  return (
                    <Card key={reminder.id} className={`transition-all ${!reminder.is_active ? "opacity-60" : ""} ${fed ? "border-green-200 bg-green-50" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${fed ? "bg-green-100" : "bg-orange-100"}`}>
                            {fed ? "✅" : "🍖"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">{reminder.meal_name}</h3>
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{formatTime(reminder.reminder_time)}</span>
                              </div>
                            </div>
                            {reminder.food_type && (
                              <p className="text-sm text-gray-500">{reminder.food_type}{reminder.quantity ? ` • ${reminder.quantity} ${reminder.unit}` : ""}</p>
                            )}
                            <div className="flex gap-1 mt-1">
                              {DAYS.map(day => (
                                <span key={day} className={`text-xs px-1 rounded ${reminder.days_of_week?.includes(day) ? "text-orange-600 font-medium" : "text-gray-300"}`}>{day.slice(0, 1)}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="flex gap-1">
                              <Switch checked={reminder.is_active} onCheckedChange={() => toggleReminder(reminder.id, reminder.is_active)} />
                              <button onClick={() => deleteReminder(reminder.id)} className="text-gray-300 hover:text-red-400 ml-1"><Trash2 size={15} /></button>
                            </div>
                            {reminder.is_active && !fed && (
                              <Button size="sm" variant="outline" className="text-xs border-orange-300 text-orange-600 hover:bg-orange-50" onClick={() => markFed(reminder.id)}>
                                Mark Fed
                              </Button>
                            )}
                            {fed && <span className="text-xs text-green-600 font-medium">Fed today ✓</span>}
                          </div>
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
