export interface CGPATagInfo {
  tag: string;
  badgeBg: string;
  badgeTextColor: string;
  emoji: string;
  tierLabel: string;
  description: string;
}

export function getCoolCGPATag(cgpa: number | 'N/A'): CGPATagInfo {
  if (cgpa === 'N/A') {
    return {
      tag: '🌱 Pending Marks',
      badgeBg: 'bg-pink-100 border border-pink-200',
      badgeTextColor: 'text-pink-700 font-black',
      emoji: '🌱',
      tierLabel: 'No Grades Logged',
      description: 'Your GPA is N/A because no marks details have been entered yet.'
    };
  }
  if (cgpa >= 9.5) {
    return {
      tag: '⚡ Outstanding',
      badgeBg: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500',
      badgeTextColor: 'text-slate-950 font-black shadow-xs',
      emoji: '⚡',
      tierLabel: 'Top 1% Standing',
      description: 'Near-perfect academic dominance across all semesters!'
    };
  }
  if (cgpa >= 9.0) {
    return {
      tag: '🌟 Exceptional',
      badgeBg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500',
      badgeTextColor: 'text-white font-black',
      emoji: '🌟',
      tierLabel: 'Outstanding Distinction',
      description: 'Consistently crushing course objectives with top grades!'
    };
  }
  if (cgpa >= 8.5) {
    return {
      tag: '🔥 Excellent',
      badgeBg: 'bg-gradient-to-r from-pink-500 to-rose-500',
      badgeTextColor: 'text-white font-black',
      emoji: '🔥',
      tierLabel: 'High Caliber Performance',
      description: 'Blazing through semester exams with stellar precision!'
    };
  }
  if (cgpa >= 8.0) {
    return {
      tag: '🚀 Very Good',
      badgeBg: 'bg-gradient-to-r from-indigo-500 to-blue-500',
      badgeTextColor: 'text-white font-black',
      emoji: '🚀',
      tierLabel: 'Top Tier Rank',
      description: 'Flying high above university average grade thresholds!'
    };
  }
  if (cgpa >= 7.5) {
    return {
      tag: '✨ Good',
      badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      badgeTextColor: 'text-white font-black',
      emoji: '✨',
      tierLabel: 'First Class Distinction',
      description: 'Solid academic foundation with strong semester consistency!'
    };
  }
  if (cgpa >= 7.0) {
    return {
      tag: '🎯 Above Average',
      badgeBg: 'bg-gradient-to-r from-teal-500 to-cyan-500',
      badgeTextColor: 'text-white font-black',
      emoji: '🎯',
      tierLabel: 'Steady Performance',
      description: 'On target! Steady study habits keeping GPA in safe orbit.'
    };
  }
  if (cgpa >= 6.0) {
    return {
      tag: '📈 Average',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      badgeTextColor: 'text-white font-black',
      emoji: '📈',
      tierLabel: 'Moderate Standing',
      description: 'Unlocking potential! Ready to surge into higher grade tiers.'
    };
  }
  if (cgpa > 0) {
    return {
      tag: '⚠️ Needs Improvement',
      badgeBg: 'bg-gradient-to-r from-rose-600 to-red-600',
      badgeTextColor: 'text-white font-black',
      emoji: '⚠️',
      tierLabel: 'Focus Required',
      description: 'Identify core weak areas and build steady momentum!'
    };
  }
  return {
    tag: '🌱 Getting Started',
    badgeBg: 'bg-gradient-to-r from-gray-400 to-gray-600',
    badgeTextColor: 'text-white font-black',
    emoji: '🌱',
    tierLabel: 'Semester Debut',
    description: 'Ready to log your first semester marks and conquer your targets!'
  };
}

export const MOTIVATIONAL_QUOTES = [
  "Small daily improvements over time lead to stunning academic results.",
  "Focus on progress, not perfection — every study session counts.",
  "Consistency is the secret bridge between ambitious goals and real achievements.",
  "Your future self will thank you for the extra focus you put in today.",
  "Discipline is choosing between what you want now and what you want most.",
  "Hard work beats talent when talent doesn't work hard.",
  "Strive for continuous improvement; excellence is a daily habit.",
  "The secret of getting ahead is simply getting started.",
  "Believe in your momentum — small steps lead to big grade victories.",
  "Push yourself, because no one else is going to do it for you.",
  "Success isn't overnight — it's the sum of small efforts repeated daily.",
  "Clear minds, focused targets, high results.",
  "One focused hour of study today conquers tomorrow's exam stress.",
  "Stay curious, stay disciplined, and watch your GPA soar.",
  "Great things are never done in comfort zones — keep pushing forward!",
  "Master your fundamentals today; conquer complex challenges tomorrow.",
  "Every expert was once a beginner who refused to quit.",
  "Action cures anxiety — start with one topic and build momentum."
];

export function getRandomMotivationalQuote(): string {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}

export interface CartoonIconInfo {
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export function getSkillCartoonIcon(courseName: string): CartoonIconInfo {
  const name = courseName.toLowerCase();
  
  if (name.includes('web') || name.includes('dev') || name.includes('code') || name.includes('react') || name.includes('js') || name.includes('programming') || name.includes('html') || name.includes('css')) {
    return { emoji: '👾', bgColor: 'bg-indigo-100/80', textColor: 'text-indigo-600', borderColor: 'border-indigo-200/50' };
  }
  if (name.includes('cloud') || name.includes('aws') || name.includes('azure') || name.includes('network') || name.includes('devops')) {
    return { emoji: '☁️', bgColor: 'bg-sky-100/80', textColor: 'text-sky-600', borderColor: 'border-sky-200/50' };
  }
  if (name.includes('ai') || name.includes('data') || name.includes('ml') || name.includes('python') || name.includes('science') || name.includes('algorithm')) {
    return { emoji: '🤖', bgColor: 'bg-violet-100/80', textColor: 'text-violet-600', borderColor: 'border-violet-200/50' };
  }
  if (name.includes('design') || name.includes('art') || name.includes('ui') || name.includes('ux') || name.includes('creative') || name.includes('figma') || name.includes('paint') || name.includes('draw')) {
    return { emoji: '🎨', bgColor: 'bg-rose-100/80', textColor: 'text-rose-600', borderColor: 'border-rose-200/50' };
  }
  if (name.includes('market') || name.includes('business') || name.includes('sale') || name.includes('finance') || name.includes('startup') || name.includes('money') || name.includes('stock')) {
    return { emoji: '🦁', bgColor: 'bg-amber-100/80', textColor: 'text-amber-600', borderColor: 'border-amber-200/50' };
  }
  if (name.includes('speak') || name.includes('english') || name.includes('lang') || name.includes('write') || name.includes('book') || name.includes('read') || name.includes('novel')) {
    return { emoji: '🦊', bgColor: 'bg-orange-100/80', textColor: 'text-orange-600', borderColor: 'border-orange-200/50' };
  }
  if (name.includes('health') || name.includes('fit') || name.includes('sport') || name.includes('gym') || name.includes('run') || name.includes('yoga')) {
    return { emoji: '🦖', bgColor: 'bg-emerald-100/80', textColor: 'text-emerald-600', borderColor: 'border-emerald-200/50' };
  }
  if (name.includes('music') || name.includes('song') || name.includes('sing') || name.includes('guitar') || name.includes('piano')) {
    return { emoji: '🎸', bgColor: 'bg-fuchsia-100/80', textColor: 'text-fuchsia-600', borderColor: 'border-fuchsia-200/50' };
  }
  if (name.includes('cooking') || name.includes('bake') || name.includes('chef') || name.includes('food') || name.includes('cake')) {
    return { emoji: '🧁', bgColor: 'bg-pink-100/80', textColor: 'text-pink-600', borderColor: 'border-pink-200/50' };
  }
  
  const cutePool: CartoonIconInfo[] = [
    { emoji: '🦄', bgColor: 'bg-pink-100/80', textColor: 'text-pink-600', borderColor: 'border-pink-200/50' },
    { emoji: '🐼', bgColor: 'bg-slate-100/80', textColor: 'text-slate-700', borderColor: 'border-slate-300/50' },
    { emoji: '🐨', bgColor: 'bg-zinc-100/80', textColor: 'text-zinc-600', borderColor: 'border-zinc-300/50' },
    { emoji: '🐯', bgColor: 'bg-amber-100/80', textColor: 'text-amber-600', borderColor: 'border-amber-200/50' },
    { emoji: '🦕', bgColor: 'bg-teal-100/80', textColor: 'text-teal-600', borderColor: 'border-teal-200/50' },
    { emoji: '🐙', bgColor: 'bg-purple-100/80', textColor: 'text-purple-600', borderColor: 'border-purple-200/50' },
    { emoji: '🐝', bgColor: 'bg-yellow-100/80', textColor: 'text-yellow-600', borderColor: 'border-yellow-200/50' },
    { emoji: '🦉', bgColor: 'bg-emerald-100/80', textColor: 'text-emerald-700', borderColor: 'border-emerald-200/50' },
    { emoji: '🚀', bgColor: 'bg-indigo-100/80', textColor: 'text-indigo-600', borderColor: 'border-indigo-200/50' },
    { emoji: '💡', bgColor: 'bg-yellow-100/80', textColor: 'text-yellow-600', borderColor: 'border-yellow-200/50' },
    { emoji: '🍦', bgColor: 'bg-fuchsia-100/80', textColor: 'text-fuchsia-600', borderColor: 'border-fuchsia-200/50' }
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % cutePool.length;
  return cutePool[index];
}
