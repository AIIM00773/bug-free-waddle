import  { useState } from "react";
import { Clock,  CheckCircle2, ChevronRight, PlayCircle, Package, ShieldCheck } from "lucide-react";

// Robust content structure
const CURRICULUM = [
  {
    id: "getting-started",
    title: "Store Foundations",
    icon: ShieldCheck,
    lessons: [
      { 
        title: "Understanding Soko payout cycles", 
        duration: "3 min",
        content: "We process payouts every 48 hours for verified merchants. Ensure your M-Pesa or Bank details in the 'Finance' section match your registered business name to prevent manual audit delays.",
        takeaways: ["Verify your payout destination in settings", "Payouts are net of the platform commission"]
      },
      { 
        title: "How commission cuts work", 
        duration: "5 min",
        content: "Soko charges a flat 3.5% commission on successful sales. This fee covers payment gateway costs, platform maintenance, and order processing security.",
        takeaways: ["Commission is deducted automatically", "Platform cut is only applied on 'Completed' orders"]
      }
    ]
  },
  {
    id: "catalog-mastery",
    title: "Catalog Mastery",
    icon: Package,
    lessons: [
      { 
        title: "Writing product descriptions", 
        duration: "6 min",
        content: "Great descriptions answer the 'Why, How, and What'. Focus on dimensions, materials, and benefits rather than just features. High-converting products use bullet points for readability.",
        takeaways: ["Focus on benefits over features", "Use clear, concise bullet points"]
      }
    ]
  }
];

export const PendingVerification = () => {
  const [activeLesson, setActiveLesson] = useState(CURRICULUM[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const isCompleted = completedLessons.includes(activeLesson.title);

  const handleComplete = () => {
    if (!isCompleted) {
      setCompletedLessons([...completedLessons, activeLesson.title]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 p-4 md:p-8 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row overflow-hidden">
        
        {/* SIDEBAR: Navigation */}
        <div className="w-full md:w-80 bg-slate-50 p-6 border-r border-slate-100 flex flex-col">
          <div className="mb-8">
            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-3">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900">Verification Pending</h2>
            <p className="text-xs text-slate-500 mt-1">Reviewing your store credentials...</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            {CURRICULUM.map((track) => (
              <div key={track.id}>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <track.icon className="h-3 w-3" /> {track.title}
                </h3>
                <div className="space-y-1">
                  {track.lessons.map((lesson) => (
                    <button
                      key={lesson.title}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-all ${
                        activeLesson.title === lesson.title 
                        ? "bg-white shadow-sm text-emerald-700 border border-emerald-100" 
                        : "text-slate-600 hover:bg-white/50"
                      }`}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {completedLessons.includes(lesson.title) ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <PlayCircle className="h-3 w-3" />}
                        {lesson.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT VIEWPORT */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full mb-4">
            LESSON: {activeLesson.duration}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">{activeLesson.title}</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-8">{activeLesson.content}</p>
            
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Key Takeaways</h4>
              <ul className="space-y-3">
                {activeLesson.takeaways?.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleComplete}
              disabled={isCompleted}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                isCompleted 
                ? "bg-emerald-100 text-emerald-700 cursor-default" 
                : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isCompleted ? "Lesson Completed" : "Mark as Complete"}
              {!isCompleted && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};