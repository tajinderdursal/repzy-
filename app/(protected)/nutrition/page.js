"use client";

import { useState, useRef, useEffect } from "react";


export default function NutritionPage() {


 
  

  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [tracker, setTracker] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeFood, setActiveFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [goalpopup, setgoalpopup] = useState(false);
  const [goal, setgoal] = useState(null);
  const [user, setUser] = useState(null);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(150);
  const [carbsGoal, setCarbsGoal] = useState(250);
  const [fatGoal, setFatGoal] = useState(70);
  const [dtapoup, setdtapopup] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const timeoutRef = useRef(null);
  const [genderpopup, setgenderpopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activity, setActivity] = useState("beginner");
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [meal, setMeal] = useState("breakfast");
  const [historyData, setHistoryData] = useState([]);
  const [aiTips, setAiTips] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const foodSuggestions = {
    protein: ["🥚 Eggs", "🍗 Chicken", "🧀 Paneer", "🥛 Milk", "🌱 Soy chunks"],
    carbs: ["🍚 Rice", "🍞 Bread", "🍌 Banana", "🥔 Potato", "🥣 Oats"],
    fat: ["🥜 Nuts", "🥑 Avocado", "🧈 Peanut butter", "🫒 Olive oil"],
  };

  const totalCalories = tracker.reduce((s, i) => s + i.calories, 0);
  const totalProtein  = tracker.reduce((s, i) => s + i.protein,  0);
  const totalCarbs    = tracker.reduce((s, i) => s + i.carbs,    0);
  const totalFat      = tracker.reduce((s, i) => s + i.fat,      0);

  const getAdvancedSuggestions = () => {
    const tips = [];
    if (!calorieGoal || !proteinGoal || !carbsGoal || !fatGoal)
      return ["Add your goals to get AI suggestions."];
    const caloriePercent = (totalCalories / calorieGoal) * 100;
    const proteinPercent = (totalProtein  / proteinGoal) * 100;
    const carbsPercent   = (totalCarbs    / carbsGoal)   * 100;
    const fatPercent     = (totalFat      / fatGoal)     * 100;
    const issues = [
      { name: "calories", value: caloriePercent },
      { name: "protein",  value: proteinPercent },
      { name: "carbs",    value: carbsPercent   },
      { name: "fat",      value: fatPercent     },
    ];
    issues.sort((a, b) => a.value - b.value);
    if (caloriePercent < 80)       tips.push("⚠️ You are under-eating today.");
    else if (caloriePercent > 120) tips.push("❌ Calories too high today.");
    if (proteinPercent < 80)       tips.push(`💪 Protein is low. Try: ${foodSuggestions.protein.slice(0, 3).join(", ")}`);
    if (carbsPercent < 80)         tips.push(`🍞 Carbs are low. Add: ${foodSuggestions.carbs.slice(0, 3).join(", ")}`);
    else if (carbsPercent > 120)   tips.push("🍞 Too many carbs. Reduce rice/bread.");
    if (fatPercent < 80)           tips.push(`🥑 Healthy fats low. Add: ${foodSuggestions.fat.slice(0, 3).join(", ")}`);
    else if (fatPercent > 120)     tips.push("🥑 Fat intake high. Avoid fried food.");
    if (goal === "loseweight" && caloriePercent > 100) tips.push("🔥 You are in surplus. This slows fat loss.");
    if (goal === "gainmuscle" && proteinPercent < 100) tips.push("🏋️ Increase protein for muscle growth.");
    const mealCalories = { breakfast: 0, lunch: 0, dinner: 0 };
    tracker.forEach((item) => {
      const t = item.meal || "breakfast";
      mealCalories[t] = (mealCalories[t] || 0) + item.calories;
    });
    if (mealCalories.breakfast === 0) tips.push("🌅 Skipping breakfast may reduce energy.");
    const avg = (caloriePercent + proteinPercent + carbsPercent + fatPercent) / 4;
    if (avg >= 90 && avg <= 110) tips.push("✅ Great balance today!");
    if (tips.length === 0) tips.push("👍 Decent day, but can improve.");
    return tips.slice(0, 3);
  };

  useEffect(() => {
    setAiTips(getAdvancedSuggestions());
  }, [tracker, calorieGoal, proteinGoal, carbsGoal, fatGoal, goal]);

  useEffect(() => {
    const fetchUser = async () => {
      const res  = await fetch("/api/profile");
      const data = await res.json();

      setUser(data);
      setWeight(data.weight   || "");
      setHeight(data.height   || "");
      setAge(data.age         || "");
      setGender(data.gender   || "");
      setCalorieGoal(data.calorieGoal || 2000);
      setProteinGoal(data.proteinGoal || 150);
      setCarbsGoal(data.carbsGoal     || 250);
      setFatGoal(data.fatGoal         || 70);
      setActivity(data.activity       || "beginner");
      setgoal(data.goal               || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    fetchTodayFood();
  }, [user]);

  const fetchHistory = async () => {
    if (!user?._id) return;
    setLoadingHistory(true);
    try {
      const res  = await fetch(`/api/food/history?userId=${user._id}`);
      const data = await res.json();
      const grouped = {};
      data.foods.forEach((item) => {
        const d = item.date;
        if (!grouped[d]) grouped[d] = { date: d, calories: 0, protein: 0, carbs: 0, fat: 0 };
        grouped[d].calories += item.calories;
        grouped[d].protein  += item.protein;
        grouped[d].carbs    += item.carbs;
        grouped[d].fat      += item.fat;
      });
      const result = Object.values(grouped)
        .map((day) => {
          const caloriePercent = (day.calories / calorieGoal) * 100;
          const proteinPercent = (day.protein  / proteinGoal) * 100;
          const carbsPercent   = (day.carbs    / carbsGoal)   * 100;
          const fatPercent     = (day.fat      / fatGoal)     * 100;
          const overallPercent = Math.min(
            Math.round((caloriePercent + proteinPercent + carbsPercent + fatPercent) / 4),
            100
          );
          return {
            ...day,
            percent: overallPercent,
            status: overallPercent >= 90 ? "Completed" : "Not Completed",
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(result);
    } catch (err) {
      console.error(err);
    }
    setLoadingHistory(false);
  };

  const goalpopupwindow    = () => setgoalpopup(true);
  const genderselectionpopup = () => setgenderpopup(true);

  const meals = {
    breakfast: tracker.filter((item) => item.meal === "breakfast"),
    lunch:     tracker.filter((item) => item.meal === "lunch"),
    dinner:    tracker.filter((item) => item.meal === "dinner"),
    snacks:    tracker.filter((item) => item.meal === "snacks"),
  };

  const activityMap = { beginner: 1.3, active: 1.55, athlete: 1.75 };

  const calculateBMR = () => {
    if (!weight || !height || !age || !gender) return 0;
    if (gender === "Male") return 10 * weight + 6.25 * height - 5 * age + 5;
    else                   return 10 * weight + 6.25 * height - 5 * age - 161;
  };

  const calculateTDEE = () => calculateBMR() * (activityMap[activity?.toLowerCase()] || 1.3);

  const calculateGoals = (g) => {
    const tdeeValue = calculateTDEE();
    let calories = 0;
    if (g === "loseweight") calories = tdeeValue - 300;
    if (g === "gainmuscle") calories = tdeeValue + 200;
    if (g === "gainweight") calories = tdeeValue + 400;
    let proteinPerKg = 0;
    if (g === "loseweight") proteinPerKg = 2.0;
    if (g === "gainmuscle") proteinPerKg = 1.8;
    if (g === "gainweight") proteinPerKg = 1.6;
    const protein = Math.round(weight * proteinPerKg);
    const fat     = Math.round((calories * 0.25) / 9);
    const carbs   = Math.round((calories - (protein * 4 + fat * 9)) / 4);
    return { calories: Math.round(calories), protein, carbs, fat };
  };

  const dataPopup = (selected) => { setgoal(selected); setdtapopup(true); };

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const res  = await fetch(`/api/nutrition?q=${query}`);
    const data = await res.json();
    const rawFoods   = data.foods || [];
    const uniqueFoods = [];
    const seen = new Set();
    for (let food of rawFoods) {
      const baseName = food.description.toLowerCase().trim().split(",")[0];
      if (!seen.has(baseName)) { seen.add(baseName); uniqueFoods.push(food); }
    }
    setFoods(uniqueFoods);
    setShowResults(true);
    setLoading(false);
    timeoutRef.current = setTimeout(() => setShowResults(false), 2000);
  };

  const getNutrient = (food, names, numbers) => {
    const nutrients = food.foodNutrients || [];
    const item = nutrients.find(
      (n) => names.includes(n.nutrientName) || numbers.includes(n.nutrientNumber)
    );
    return item ? Math.round(item.value) : 0;
  };

  const addToTracker = async (food, qty, mealType) => {
    const factor = qty / 100;
    const item = {
      userId:   user?._id,
      name:     food.description,
      quantity: qty,
      calories: Math.round(getNutrient(food, ["Energy"],                     ["208"]) * factor),
      protein:  Math.round(getNutrient(food, ["Protein"],                     ["203"]) * factor),
      carbs:    Math.round(getNutrient(food, ["Carbohydrate, by difference"], ["205"]) * factor),
      fat:      Math.round(getNutrient(food, ["Total lipid (fat)"],           ["204"]) * factor),
      date:     new Date().toISOString().split("T")[0],
      meal:     mealType || "breakfast",
    };
    try {
      const res  = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      setTracker((prev) => [...prev, data.data]);
      setActiveFood(null);
     
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await fetch(`/api/food?id=${id}`, { method: "DELETE" });
      setTracker((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodayFood = async () => {
    if (!user?._id) return;
    const today = new Date().toISOString().split("T")[0];
    try {
      const res  = await fetch(`/api/food?userId=${user._id}&date=${today}`);
      const data = await res.json();
      setTracker(data.foods || []);
    } catch (err) {
      console.error(err);
    }
  };

  const calPct = calorieGoal ? Math.round((totalCalories / calorieGoal) * 100) : 0;

  return (
    <div
      className="relative min-h-screen bg-[#080c10] text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* AMBIENT GLOWS */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-32 -left-20 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.20) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.16) 0%, transparent 70%)" }}
        />
      </div>
 <div className="mt-30 mb-32 width-full">

 </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* HERO */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
        Track every macro.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Hit every goal.
            </span>
          </h1>
          <p className="text-sm text-white/45">Grip on your nutrition goals</p>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search food to add..."
            className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-white/30 outline-none focus:border-blue-500/60 backdrop-blur-xl transition"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 sm:flex-none px-7 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 active:scale-95 transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? "..." : "Search"}
            </button>
            <select
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none appearance-none cursor-pointer backdrop-blur-xl min-w-[130px]"
            >
              <option value="breakfast" style={{ background: "#0f141e" }}>🍳 Breakfast</option>
              <option value="lunch"     style={{ background: "#0f141e" }}>🍛 Lunch</option>
              <option value="dinner"    style={{ background: "#0f141e" }}>🍲 Dinner</option>
              <option value="snacks"    style={{ background: "#0f141e" }}>🍫 Snacks</option>
            </select>
          </div>
        </div>

        {/* GOAL QUICK-SELECT */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40 mr-1">Goal</span>
          {[
            { label: "Lose Weight", value: "loseweight" },
            { label: "Gain Muscle", value: "gainmuscle" },
            { label: "Gain Weight", value: "gainweight" },
          ].map((g) => {
            const active = goal === g.value;
            return (
              <button
                key={g.value}
                onClick={() => dataPopup(g.value)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition backdrop-blur-xl ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-green-500 border-transparent text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 border-white/10 text-white/55 hover:border-blue-400/50 hover:text-white"
                }`}
              >
                {active && <span className="mr-1">✓</span>}
                {g.label}
              </button>
            );
          })}
          {goal && (
            <button
              onClick={() => setgoal(null)}
              className="text-xs text-white/25 hover:text-red-400 transition ml-1"
            >
              ✕ clear
            </button>
          )}
        </div>

        {/* SEARCH DROPDOWN */}
        {showResults && (
          <div
            onMouseEnter={() => clearTimeout(timeoutRef.current)}
            onMouseLeave={() => {
              timeoutRef.current = setTimeout(() => setShowResults(false), 2000);
            }}
            className="fixed top-28 left-1/2 -translate-x-1/2 w-[90vw] max-w-[480px] max-h-[360px] overflow-y-auto rounded-2xl z-50 bg-[#0a0f1c]/96 border border-white/10 backdrop-blur-2xl shadow-2xl"
          >
            <div className="p-2">
              {foods.map((food, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-white/5 transition border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-white/85 pr-4">{food.description}</span>
                  <button
                    onClick={() => { setActiveFood(food); setQuantity(100); setShowResults(false); }}
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-lg bg-gradient-to-br from-blue-500 to-green-500 hover:opacity-80 transition"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI SUGGESTIONS */}
        {aiTips.length > 0 && (
          <div
            className="mb-8 p-5 rounded-2xl border backdrop-blur-xl"
            style={{ background: "rgba(59,130,246,0.07)", borderColor: "rgba(59,130,246,0.2)" }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
              🤖 Smart Suggestions
            </h2>
            {aiTips.map((tip, i) => (
              <p key={i} className="text-sm text-white/75 mb-1.5 last:mb-0">{tip}</p>
            ))}
          </div>
        )}

        {/* DAILY SUMMARY */}
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black tracking-tight">🔥 Daily Summary</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-green-400">Live</span>
            </div>
          </div>

          {[
            { label: "Calories", emoji: "🔥", val: totalCalories, goal: calorieGoal, unit: "kcal", bar: "from-blue-500 to-green-500"     },
            { label: "Protein",  emoji: "💪", val: totalProtein,  goal: proteinGoal, unit: "g",    bar: "from-green-400 to-emerald-500"  },
            { label: "Carbs",    emoji: "🍞", val: totalCarbs,    goal: carbsGoal,   unit: "g",    bar: "from-blue-400 to-cyan-400"      },
            { label: "Fat",      emoji: "🥑", val: totalFat,      goal: fatGoal,     unit: "g",    bar: "from-purple-400 to-violet-500"  },
          ].map((m) => {
            const pct = m.goal ? Math.min((m.val / m.goal) * 100, 100) : 0;
            return (
              <div key={m.label} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/80">{m.emoji} {m.label}</span>
                  <span className="text-white/45">
                    {m.val} <span className="text-white/25">/ {m.goal} {m.unit}</span>
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${m.bar} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Calories", val: totalCalories, unit: "kcal", color: "text-green-400"   },
              { label: "Protein",  val: totalProtein,  unit: "g",    color: "text-emerald-400" },
              { label: "Carbs",    val: totalCarbs,    unit: "g",    color: "text-blue-400"    },
              { label: "Fat",      val: totalFat,      unit: "g",    color: "text-purple-400"  },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center py-3 rounded-xl bg-white/5 border border-white/[0.08]">
                <span className={`text-2xl font-black ${s.color}`}>{s.val}</span>
                <span className="text-xs text-white/40 mt-0.5">{s.label}</span>
                <span className="text-xs text-white/20">{s.unit}</span>
              </div>
            ))}
          </div>

          <button
            onClick={async () => {
              if (!showHistory) await fetchHistory();
              setShowHistory((p) => !p);
            }}
            className="mt-6 px-5 py-2 rounded-xl text-sm font-medium bg-white/[0.06] border border-white/10 hover:bg-white/10 backdrop-blur-xl transition"
          >
            {showHistory ? "Hide History" : "📅 View History"}
          </button>

          {showHistory && (
            <div className="mt-5 pt-5 border-t border-white/[0.08]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">📅 History</h3>
              {loadingHistory && (
                <p className="text-sm text-white/40 animate-pulse">Loading history...</p>
              )}
              {!loadingHistory && history.length === 0 && (
                <p className="text-sm text-white/25">No history yet. Start tracking your food 🍎</p>
              )}
              {!loadingHistory && history.map((day, i) => {
                let barColor = "bg-white/25";
                if (day.percent > 100) barColor = "bg-red-500";
                else if (day.percent >= 80) barColor = "bg-gradient-to-r from-blue-500 to-green-500";
                return (
                  <div key={i} className="mb-4 transform hover:scale-[1.01] transition">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/45">{day.date}</span>
                      <span className={day.status === "Completed" ? "text-green-400" : "text-white/30"}>
                        {day.percent}% • {day.status}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-700`}
                        style={{ width: `${Math.min(day.percent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MEAL LOG */}
        <div>
          <h2 className="text-lg font-black tracking-tight mb-6">📊 Daily Tracker</h2>

          {[
            { title: "Breakfast", emoji: "🍳", key: "breakfast" },
            { title: "Lunch",     emoji: "🍛", key: "lunch"     },
            { title: "Dinner",    emoji: "🍲", key: "dinner"    },
            { title: "Snacks",    emoji: "🍫", key: "snacks"    },
          ].map((section) => (
            <div key={section.key} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-base font-bold">{section.emoji} {section.title}</h3>
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs text-white/25 font-mono">
                  {meals[section.key].reduce((s, i) => s + i.calories, 0)} kcal
                </span>
              </div>

              {meals[section.key].length === 0 ? (
                <p className="py-5 text-center rounded-xl bg-white/[0.03] border border-dashed border-white/[0.08] text-sm text-white/20">
                  No items added
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {meals[section.key].map((item, i) => (
                    <div
                      key={i}
                      className="group p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                          <span className="text-xs text-white/35">{item.quantity}g</span>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-xs bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-0.5">
                        {item.calories}
                      </div>
                      <div className="text-xs text-white/20 mb-3">kcal</div>
                      <div className="flex gap-3 text-xs font-mono">
                        <span className="text-green-400">💪 {item.protein}g</span>
                        <span className="text-blue-400">🍞 {item.carbs}g</span>
                        <span className="text-purple-400">🥑 {item.fat}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GOAL SELECTION POPUP */}
      {goalpopup && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm">
          <div
            className="w-[90vw] max-w-[360px] rounded-2xl p-7 bg-[#0f1520]/95 border border-white/10 backdrop-blur-2xl shadow-2xl"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(59,130,246,0.1)" }}
          >
            <h3 className="text-xl font-black mb-1">Select Your Goal</h3>
            <p className="text-sm text-white/40 mb-6">We'll calculate your personalized macros</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Lose Weight", value: "loseweight", desc: "Calorie deficit, high protein" },
                { label: "Gain Muscle", value: "gainmuscle", desc: "Calorie surplus, max protein"  },
                { label: "Gain Weight", value: "gainweight", desc: "High calorie, balanced macros"  },
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() => { dataPopup(g.value); setgoal(g.value); setgoalpopup(false); }}
                  className={`w-full py-4 px-5 rounded-xl text-left transition border ${
                    goal === g.value
                      ? "bg-blue-500/15 border-blue-500/40"
                      : "bg-white/[0.04] border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <div className="font-bold text-sm text-white">{g.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{g.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setgoalpopup(false)}
              className="mt-5 w-full py-2.5 rounded-xl text-sm text-white/40 border border-white/[0.08] hover:bg-white/5 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DETAILS POPUP */}
      {dtapoup && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm">
          <div
            className="w-[90vw] max-w-[380px] rounded-2xl p-7 bg-[#0f1520]/95 border border-white/10 backdrop-blur-2xl shadow-2xl"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(59,130,246,0.1)" }}
          >
            <h3 className="text-xl font-black mb-1">Enter Your Details</h3>
            <p className="text-sm text-white/40 mb-5">We'll calculate your personalized goals</p>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-white/35 mb-1 uppercase tracking-wider">Weight</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    placeholder="kg"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-blue-500/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/35 mb-1 uppercase tracking-wider">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    placeholder="cm"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-blue-500/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/35 mb-1 uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    placeholder="yrs"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-blue-500/60 transition"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="relative">
                <label className="block text-xs text-white/35 mb-1.5 uppercase tracking-wider">Gender</label>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 cursor-pointer flex justify-between items-center text-sm"
                >
                  <span className={gender ? "text-white" : "text-white/30"}>{gender || "Select Gender"}</span>
                  <span className="text-white/30 text-xs">▾</span>
                </div>
                {isOpen && (
                  <div className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 bg-[#0d1320] border border-white/10 shadow-xl">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        onClick={() => { setGender(g); setIsOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.06] transition"
                        style={{ color: gender === g ? "#4ade80" : "rgba(255,255,255,0.7)" }}
                      >
                        {gender === g && <span className="mr-2">✓</span>}{g}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity */}
              <div className="relative">
                <label className="block text-xs text-white/35 mb-1.5 uppercase tracking-wider">Activity Level</label>
                <div
                  onClick={() => setIsActivityOpen(!isActivityOpen)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 cursor-pointer flex justify-between items-center text-sm"
                >
                  <span className={activity ? "text-white capitalize" : "text-white/30"}>{activity || "Select Activity"}</span>
                  <span className="text-white/30 text-xs">▾</span>
                </div>
                {isActivityOpen && (
                  <div className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 bg-[#0d1320] border border-white/10 shadow-xl">
                    {[
                      { label: "Beginner — Sedentary", value: "Beginner" },
                      { label: "Active — Moderate",    value: "Active"   },
                      { label: "Athlete — Intense",    value: "Athlete"  },
                    ].map((a) => (
                      <button
                        key={a.value}
                        onClick={() => { setActivity(a.value); setIsActivityOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.06] transition"
                        style={{ color: activity === a.value ? "#4ade80" : "rgba(255,255,255,0.7)" }}
                      >
                        {activity === a.value && <span className="mr-2">✓</span>}{a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 active:scale-95 transition shadow-lg shadow-blue-500/20"
                onClick={async () => {
                  const goals = calculateGoals(goal);
                  setCalorieGoal(goals.calories);
                  setProteinGoal(goals.protein);
                  setCarbsGoal(goals.carbs);
                  setFatGoal(goals.fat);
                  await fetch("/api/profile", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: user._id,
                      weight, height, age, gender, activity, goal,
                      calorieGoal: goals.calories,
                      proteinGoal: goals.protein,
                      carbsGoal:   goals.carbs,
                      fatGoal:     goals.fat,
                    }),
                  });
                  alert("Goals saved ✅");
                  setdtapopup(false);
                  setgoalpopup(false);
                }}
              >
                Save
              </button>
              <button
                onClick={() => setdtapopup(false)}
                className="px-5 py-3 rounded-xl text-sm text-white/40 border border-white/[0.08] hover:bg-white/5 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUANTITY POPUP */}
      {activeFood && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm">
          <div className="w-[90vw] max-w-[360px] rounded-2xl p-7 bg-[#0f1520]/95 border border-white/10 backdrop-blur-2xl shadow-2xl">
            <h3 className="text-lg font-black mb-1">Add Food</h3>
            <p className="text-sm text-white/40 mb-5 leading-relaxed">{activeFood.description}</p>

            {/* Live macro preview */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { label: "Cal",  val: Math.round(getNutrient(activeFood, ["Energy"],                     ["208"]) * quantity / 100), color: "text-green-400"   },
                { label: "Pro",  val: Math.round(getNutrient(activeFood, ["Protein"],                     ["203"]) * quantity / 100), color: "text-emerald-400" },
                { label: "Carb", val: Math.round(getNutrient(activeFood, ["Carbohydrate, by difference"], ["205"]) * quantity / 100), color: "text-blue-400"    },
                { label: "Fat",  val: Math.round(getNutrient(activeFood, ["Total lipid (fat)"],           ["204"]) * quantity / 100), color: "text-purple-400"  },
              ].map((m) => (
                <div key={m.label} className="text-center py-3 rounded-xl bg-white/5 border border-white/[0.08]">
                  <div className={`text-lg font-black ${m.color}`}>{m.val}</div>
                  <div className="text-xs text-white/35 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="relative mb-3">
              <label className="block text-xs text-white/35 mb-1.5 uppercase tracking-wider">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-blue-500/60 transition"
              />
              <span className="absolute right-4 bottom-3 text-xs text-white/30">g</span>
            </div>

            <div className="mb-5">
              <label className="block text-xs text-white/35 mb-1.5 uppercase tracking-wider">Meal</label>
              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none appearance-none cursor-pointer"
              >
                <option value="breakfast" style={{ background: "#0f141e" }}>🍳 Breakfast</option>
                <option value="lunch"     style={{ background: "#0f141e" }}>🍛 Lunch</option>
                <option value="dinner"    style={{ background: "#0f141e" }}>🍲 Dinner</option>
                <option value="snacks"    style={{ background: "#0f141e" }}>🍫 Snacks</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => addToTracker(activeFood, quantity, meal)}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 active:scale-95 transition shadow-lg shadow-blue-500/20"
              >
                Add
              </button>
              <button
                onClick={() => setActiveFood(null)}
                className="px-5 py-3 rounded-xl text-sm text-white/40 border border-white/[0.08] hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}