import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Dog, Cat, Heart, Weight, Ruler, Clock, Info } from "lucide-react";

// Using free public APIs: dog.ceo, TheDogAPI, TheCatAPI
const DOG_BREEDS_DATA = [
  { name: "Labrador Retriever", origin: "Canada", lifespan: "10-12 years", weight: "25-36 kg", height: "55-62 cm", temperament: ["Friendly", "Active", "Outgoing", "Gentle"], group: "Sporting", care: "Medium", hypoallergenic: false, description: "One of the most popular breeds worldwide. Labs are friendly, outgoing, and active companions with a gentle nature, making them ideal family pets and service dogs.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Labrador_on_Quantock_%282175262184%29.jpg/1200px-Labrador_on_Quantock_%282175262184%29.jpg" },
  { name: "German Shepherd", origin: "Germany", lifespan: "9-13 years", weight: "22-40 kg", height: "55-65 cm", temperament: ["Confident", "Courageous", "Smart", "Loyal"], group: "Herding", care: "High", hypoallergenic: false, description: "Highly intelligent and versatile working dogs known for their courage, loyalty, and ability to learn commands quickly. Popular as police and military dogs.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/German_Shepherd_Dog_Gg_alone.jpg/1200px-German_Shepherd_Dog_Gg_alone.jpg" },
  { name: "Golden Retriever", origin: "Scotland", lifespan: "10-12 years", weight: "25-34 kg", height: "51-61 cm", temperament: ["Trustworthy", "Friendly", "Reliable", "Kind"], group: "Sporting", care: "Medium", hypoallergenic: false, description: "Friendly, reliable, and trustworthy. Golden Retrievers are patient and devoted family companions, excellent with children and other pets.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Golden_Retriever_Dukedestiny01_drvd.jpg/1200px-Golden_Retriever_Dukedestiny01_drvd.jpg" },
  { name: "French Bulldog", origin: "France", lifespan: "10-12 years", weight: "7-13 kg", height: "27-35 cm", temperament: ["Playful", "Adaptable", "Smart", "Affectionate"], group: "Non-Sporting", care: "Low", hypoallergenic: false, description: "Adaptable, playful and smart. French Bulldogs make excellent apartment dogs and companions for city dwellers due to their low exercise needs.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/1200px-Camponotus_flavomarginatus_ant.jpg" },
  { name: "Beagle", origin: "England", lifespan: "12-15 years", weight: "9-11 kg", height: "33-41 cm", temperament: ["Merry", "Curious", "Friendly", "Independent"], group: "Hound", care: "Medium", hypoallergenic: false, description: "Merry and fun-loving beagles are curious explorers who love sniffing everything. Great with families and other dogs.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/000_0783.jpg/1200px-000_0783.jpg" },
  { name: "Poodle", origin: "Germany/France", lifespan: "12-15 years", weight: "20-32 kg", height: "38-61 cm", temperament: ["Intelligent", "Active", "Alert", "Instinctual"], group: "Non-Sporting", care: "High", hypoallergenic: true, description: "One of the most intelligent breeds, Poodles are highly trainable and hypoallergenic. They come in standard, miniature, and toy sizes.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Full_attention_%284987832842%29.jpg/1200px-Full_attention_%284987832842%29.jpg" },
  { name: "Rottweiler", origin: "Germany", lifespan: "8-10 years", weight: "35-60 kg", height: "56-69 cm", temperament: ["Loyal", "Loving", "Confident", "Protective"], group: "Working", care: "High", hypoallergenic: false, description: "Powerful and loyal guardians, Rottweilers are devoted family companions when properly trained and socialized from puppyhood.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/1200px-YellowLabradorLooking_new.jpg" },
  { name: "Siberian Husky", origin: "Siberia", lifespan: "12-14 years", weight: "16-27 kg", height: "50-60 cm", temperament: ["Outgoing", "Mischievous", "Gentle", "Intelligent"], group: "Working", care: "High", hypoallergenic: false, description: "Athletic and outgoing sled dogs known for their striking appearance and high energy. They need lots of exercise and love cold weather.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Black-Magic-Big-Siberian-Husky.jpg/1200px-Black-Magic-Big-Siberian-Husky.jpg" },
  { name: "Dachshund", origin: "Germany", lifespan: "12-16 years", weight: "3-9 kg", height: "20-27 cm", temperament: ["Stubborn", "Devoted", "Lively", "Courageous"], group: "Hound", care: "Low", hypoallergenic: false, description: "Playful and curious with a big personality in a small body. Dachshunds were bred to hunt badgers and have an independent spirit.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Dachshund_Tan_dog_called_Trojan.jpg/1200px-Dachshund_Tan_dog_called_Trojan.jpg" },
  { name: "Shih Tzu", origin: "Tibet", lifespan: "10-16 years", weight: "4-7 kg", height: "20-28 cm", temperament: ["Affectionate", "Playful", "Outgoing", "Gentle"], group: "Toy", care: "High", hypoallergenic: true, description: "Bred to be a companion, the Shih Tzu is outgoing, affectionate and lively. Their long flowing coat requires daily grooming.", image: "" },
  { name: "Doberman Pinscher", origin: "Germany", lifespan: "10-13 years", weight: "27-45 kg", height: "60-72 cm", temperament: ["Loyal", "Fearless", "Alert", "Intelligent"], group: "Working", care: "Medium", hypoallergenic: false, description: "Elegant and powerful, Dobermans are loyal family protectors with high intelligence and trainability.", image: "" },
  { name: "Border Collie", origin: "Scotland", lifespan: "12-15 years", weight: "14-20 kg", height: "46-56 cm", temperament: ["Energetic", "Alert", "Intelligent", "Tenacious"], group: "Herding", care: "Very High", hypoallergenic: false, description: "Considered the most intelligent dog breed. Border Collies are tireless workers that need a job to do and plenty of exercise.", image: "" },
];

const CAT_BREEDS_DATA = [
  { name: "Persian", origin: "Iran", lifespan: "12-17 years", weight: "3-5 kg", temperament: ["Gentle", "Quiet", "Docile", "Playful"], care: "Very High", hypoallergenic: false, description: "Known for their long, beautiful coats and calm personalities. Persians are quiet, docile cats that enjoy a peaceful indoor life.", image: "" },
  { name: "Maine Coon", origin: "USA", lifespan: "9-15 years", weight: "4-8 kg", temperament: ["Gentle", "Playful", "Sociable", "Intelligent"], care: "Medium", hypoallergenic: false, description: "One of the largest domestic cat breeds with a friendly, dog-like personality. They love water and are highly sociable.", image: "" },
  { name: "Siamese", origin: "Thailand", lifespan: "11-15 years", weight: "3-5 kg", temperament: ["Active", "Talkative", "Affectionate", "Social"], care: "Low", hypoallergenic: false, description: "One of the oldest and most recognized breeds. Siamese are talkative, social cats that form strong bonds with their owners.", image: "" },
  { name: "Bengal", origin: "USA", lifespan: "12-16 years", weight: "4-7 kg", temperament: ["Wild", "Playful", "Energetic", "Curious"], care: "Medium", hypoallergenic: false, description: "Bengal cats have a wild appearance with leopard-like spots. They are highly active, playful, and love climbing.", image: "" },
  { name: "Ragdoll", origin: "USA", lifespan: "13-18 years", weight: "4-9 kg", temperament: ["Calm", "Gentle", "Sociable", "Easygoing"], care: "Medium", hypoallergenic: false, description: "Named for their tendency to go limp when held, Ragdolls are gentle giants known for their blue eyes and affectionate nature.", image: "" },
  { name: "British Shorthair", origin: "UK", lifespan: "14-20 years", weight: "4-8 kg", temperament: ["Calm", "Tolerant", "Devoted", "Patient"], care: "Low", hypoallergenic: false, description: "One of the oldest cat breeds known for their dense, plush coat and round faces. They are calm, easygoing companions.", image: "" },
];

const CARE_COLORS: Record<string, string> = {
  "Low": "bg-green-100 text-green-700",
  "Medium": "bg-yellow-100 text-yellow-700",
  "High": "bg-orange-100 text-orange-700",
  "Very High": "bg-red-100 text-red-700",
};

export default function BreedDatabase() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"dogs" | "cats">("dogs");
  const [selected, setSelected] = useState<any>(null);

  const data = tab === "dogs" ? DOG_BREEDS_DATA : CAT_BREEDS_DATA;
  const filtered = data.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.temperament.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    (b as any).group?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🐾 Breed Database</h1>
          <p className="text-sm text-gray-500">Explore breeds and find your perfect match</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[{ key: "dogs", label: "🐕 Dogs", count: DOG_BREEDS_DATA.length }, { key: "cats", label: "🐈 Cats", count: CAT_BREEDS_DATA.length }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as any); setSearch(""); setSelected(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? "bg-violet-600 text-white shadow-md" : "bg-white text-gray-600 border hover:border-violet-300"}`}>
              {t.label} <span className="opacity-70">({t.count})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder={`Search ${tab} breeds, temperament...`} className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
                    <p className="text-violet-200 text-sm">{selected.origin} • {(selected as any).group || "Cat"}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">{selected.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1"><Clock size={13} /> Lifespan</div>
                    <p className="font-semibold text-gray-900 text-sm">{selected.lifespan}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1"><Weight size={13} /> Weight</div>
                    <p className="font-semibold text-gray-900 text-sm">{selected.weight}</p>
                  </div>
                  {selected.height && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1"><Ruler size={13} /> Height</div>
                      <p className="font-semibold text-gray-900 text-sm">{selected.height}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1"><Info size={13} /> Care Level</div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CARE_COLORS[selected.care]}`}>{selected.care}</span>
                  </div>
                </div>

                {selected.hypoallergenic && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl p-3">
                    <span className="text-green-600">✅</span>
                    <p className="text-green-700 text-sm font-medium">Hypoallergenic — good for allergy sufferers</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Temperament</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.temperament.map((t: string) => (
                      <Badge key={t} variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breed Cards */}
        <div className="grid grid-cols-1 gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400">No breeds found for "{search}"</p>
            </div>
          ) : (
            filtered.map(breed => (
              <Card key={breed.name} className="hover:shadow-md transition-all cursor-pointer active:scale-98" onClick={() => setSelected(breed)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-2xl flex-shrink-0">
                      {tab === "dogs" ? "🐕" : "🐈"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{breed.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CARE_COLORS[breed.care]}`}>{breed.care} care</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{breed.origin} • {breed.lifespan}</p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {breed.temperament.slice(0, 3).map(t => (
                          <span key={t} className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                        {breed.hypoallergenic && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Hypoallergenic</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
