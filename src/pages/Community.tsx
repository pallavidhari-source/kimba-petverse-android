import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Plus, Search, Flame, Clock } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Posts", emoji: "🌟" },
  { value: "general", label: "General", emoji: "💬" },
  { value: "health", label: "Health & Vet", emoji: "🏥" },
  { value: "training", label: "Training", emoji: "🎓" },
  { value: "nutrition", label: "Nutrition", emoji: "🥩" },
  { value: "adoption", label: "Adoption", emoji: "🐾" },
  { value: "lost-found", label: "Lost & Found", emoji: "🔍" },
];

const SAMPLE_POSTS = [
  { id: "1", title: "My Golden Retriever refuses to eat new food — any tips?", content: "We switched to a new brand of kibble and now Bruno just sniffs it and walks away. Been 3 days! Has anyone dealt with this? Thinking of mixing old food.", category: "nutrition", created_at: new Date(Date.now() - 3600000).toISOString(), likes_count: 23, comments_count: 8, author: "Priya S." },
  { id: "2", title: "🚨 LOST DOG — Beagle near Jubilee Hills, Hyderabad", content: "Our 2-year-old male Beagle named Biscuit went missing near Road 36, Jubilee Hills. He has a blue collar. Please contact 98765 43210 if found!", category: "lost-found", created_at: new Date(Date.now() - 7200000).toISOString(), likes_count: 45, comments_count: 12, author: "Rahul M." },
  { id: "3", title: "Best training tips for an 8-week old Labrador puppy?", content: "Just brought home a Lab puppy! First time pet parent here. Looking for basic training tips — sit, stay, potty training. Any good trainers in Hyderabad?", category: "training", created_at: new Date(Date.now() - 86400000).toISOString(), likes_count: 18, comments_count: 15, author: "Anjali K." },
  { id: "4", title: "3 Persian kittens available for adoption in Bengaluru", content: "Found 3 Persian mix kittens (2 white, 1 grey), approximately 6 weeks old. Vaccinated and dewormed. Looking for loving forever homes. Based in Koramangala.", category: "adoption", created_at: new Date(Date.now() - 172800000).toISOString(), likes_count: 67, comments_count: 22, author: "Meera T." },
  { id: "5", title: "What vaccines does my dog need and when?", content: "My vet gave a schedule but I'm confused about which are mandatory vs optional. Can someone share a simple vaccine schedule for dogs in India?", category: "health", created_at: new Date(Date.now() - 259200000).toISOString(), likes_count: 34, comments_count: 19, author: "Kiran P." },
];

export default function CommunityForum() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>(SAMPLE_POSTS);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ title: "", content: "", category: "general" });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false }).limit(50);
    if (data && data.length > 0) setPosts([...data, ...SAMPLE_POSTS]);
    setLoading(false);
  };

  const handlePost = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Please fill in title and content", variant: "destructive" }); return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast({ title: "Please sign in to post", variant: "destructive" }); return; }

    const { error } = await supabase.from("community_posts").insert({ ...form, user_id: user.id });
    if (error) { toast({ title: "Error posting", variant: "destructive" }); }
    else {
      toast({ title: "✅ Post shared with the community!" });
      setDialogOpen(false);
      setForm({ title: "", content: "", category: "general" });
      fetchPosts();
    }
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + (likedPosts.has(postId) ? -1 : 1) } : p));
  };

  const getCategoryInfo = (cat: string) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[1];

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const filtered = posts.filter(p => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">💬 Community</h1>
            <p className="text-sm text-gray-500">Connect with fellow pet lovers</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-500 hover:bg-pink-600 gap-2"><Plus size={16} /> Post</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Share with Community</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter(c => c.value !== "all").map(c => <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input placeholder="Title of your post..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <Textarea placeholder="Share your story, question, or tip..." rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                </div>
                <Button onClick={handlePost} className="w-full bg-pink-500 hover:bg-pink-600">Share Post</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search posts..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${category === cat.value ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-600 border-gray-200"}`}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No posts found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(post => {
              const catInfo = getCategoryInfo(post.category);
              const liked = likedPosts.has(post.id);
              return (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-pink-200 text-pink-600 bg-pink-50">
                        {catInfo.emoji} {catInfo.label}
                      </Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> {timeAgo(post.created_at)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 leading-tight">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 text-sm transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}>
                          <Heart size={16} fill={liked ? "currentColor" : "none"} />
                          <span>{post.likes_count + (liked && !likedPosts.has(post.id) ? 1 : 0)}</span>
                        </button>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <MessageCircle size={16} />
                          <span>{post.comments_count}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{post.author || "Community Member"}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
