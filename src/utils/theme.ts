export interface ThemeOption {
  id: string;
  name: string;
  hex: string;
  emoji: string;
  category: string;
}

export const PRESET_THEMES: ThemeOption[] = [
  // Blues
  { id: 'peaceful-blue', name: 'Peaceful Blue', hex: '#a0c8ef', emoji: '🩵', category: 'Blues' },
  { id: 'angel-blue', name: 'Angel Blue', hex: '#8caee2', emoji: '☁️', category: 'Blues' },
  { id: 'bright-blue', name: 'Bright Blue', hex: '#48b2f8', emoji: '💧', category: 'Blues' },
  { id: 'turquoise-blue', name: 'Turquoise Blue', hex: '#13b5ce', emoji: '💎', category: 'Blues' },
  { id: 'happy-blue', name: 'Happy Blue', hex: '#2d9cdb', emoji: '🌊', category: 'Blues' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#0052cc', emoji: '💙', category: 'Blues' },
  { id: 'blueberry', name: 'Blueberry', hex: '#312482', emoji: '🫐', category: 'Blues' },
  { id: 'navy-blue', name: 'Navy Blue', hex: '#0d0850', emoji: '🌃', category: 'Blues' },

  // Teals & Aquas
  { id: 'ice-blue', name: 'Ice Blue', hex: '#cbe6e9', emoji: '🧊', category: 'Teals & Aquas' },
  { id: 'robins-egg', name: 'Robins Egg', hex: '#8ed8d8', emoji: '🦩', category: 'Teals & Aquas' },
  { id: 'happy-sky', name: 'Happy Sky', hex: '#7fd5e5', category: 'Teals & Aquas', emoji: '🌤️' },
  { id: 'aqua-blue', name: 'Aqua Blue', hex: '#36c2c2', category: 'Teals & Aquas', emoji: '💧' },
  { id: 'aqua-mint', name: 'Aqua Mint', hex: '#3ebfb2', category: 'Teals & Aquas', emoji: '🍃' },
  { id: 'teal', name: 'Teal', hex: '#0f9d9a', category: 'Teals & Aquas', emoji: '🧪' },
  { id: 'medium-teal', name: 'Medium Teal', hex: '#1b8b8c', category: 'Teals & Aquas', emoji: '💎' },
  { id: 'dark-teal', name: 'Dark Teal', hex: '#18686b', category: 'Teals & Aquas', emoji: '🌊' },

  // Greens
  { id: 'pastel-green', name: 'Pastel Green', hex: '#c8e6c9', emoji: '🌱', category: 'Greens' },
  { id: 'celery-green', name: 'Celery Green', hex: '#a4d994', emoji: '🥬', category: 'Greens' },
  { id: 'pistachio', name: 'Pistachio', hex: '#9bd398', emoji: '🥑', category: 'Greens' },
  { id: 'seafoam', name: 'Seafoam', hex: '#a3c3b2', emoji: '🌿', category: 'Greens' },
  { id: 'fresh-green', name: 'Fresh Green', hex: '#9ece2a', emoji: '🍏', category: 'Greens' },
  { id: 'green-grass', name: 'Green Grass', hex: '#7cba28', emoji: '🍃', category: 'Greens' },
  { id: 'emerald', name: 'Emerald', hex: '#529b4c', emoji: '❇️', category: 'Greens' },
  { id: 'forest-green', name: 'Forest Green', hex: '#386739', emoji: '🌲', category: 'Greens' },

  // Purples & Lilacs
  { id: 'pastel-lilac', name: 'Pastel Lilac', hex: '#d5d5f2', emoji: '🪻', category: 'Purples & Lilacs' },
  { id: 'lilac', name: 'Lilac', hex: '#b9b5e3', emoji: '🌸', category: 'Purples & Lilacs' },
  { id: 'lavender', name: 'Lavender', hex: '#c29cd2', emoji: '🪻', category: 'Purples & Lilacs' },
  { id: 'plum', name: 'Plum', hex: '#71629b', emoji: '🍇', category: 'Purples & Lilacs' },
  { id: 'violet', name: 'Violet', hex: '#58217b', emoji: '💜', category: 'Purples & Lilacs' },
  { id: 'orchid-purple', name: 'Orchid Purple', hex: '#9b1b7a', emoji: '🔮', category: 'Purples & Lilacs' },
  { id: 'blue-violet', name: 'Blue Violet', hex: '#3b207e', emoji: '🎆', category: 'Purples & Lilacs' },
  { id: 'eggplant', name: 'Eggplant', hex: '#52184b', emoji: '🍆', category: 'Purples & Lilacs' },

  // Pinks & Fuchsia
  { id: 'pastel-pink', name: 'Pastel Pink', hex: '#fad0dd', emoji: '🩰', category: 'Pinks' },
  { id: 'cotton-candy', name: 'Cotton Candy', hex: '#f8b3c8', emoji: '🍬', category: 'Pinks' },
  { id: 'dusty-rose', name: 'Dusty Rose', hex: '#eba0b3', emoji: '🌷', category: 'Pinks' },
  { id: 'sweet-pink', name: 'Sweet Pink', hex: '#f58fa8', emoji: '💖', category: 'Pinks' },
  { id: 'rose-pink', name: 'Rose', hex: '#f0558a', emoji: '🌹', category: 'Pinks' },
  { id: 'hot-pink', name: 'Hot Pink', hex: '#ec2b8a', emoji: '⚡', category: 'Pinks' },
  { id: 'mamey-pink', name: 'Mamey Pink', hex: '#e83f7d', emoji: '🎀', category: 'Pinks' },
  { id: 'fuchsia', name: 'Fuchsia', hex: '#c20067', emoji: '🌺', category: 'Pinks' },

  // Corals & Reds
  { id: 'pale-peach', name: 'Pale Peach', hex: '#fde0d9', emoji: '🍑', category: 'Corals & Reds' },
  { id: 'peach', name: 'Peach', hex: '#f9b9a3', emoji: '🍊', category: 'Corals & Reds' },
  { id: 'light-coral', name: 'Light Coral', hex: '#f58a7a', emoji: '🪸', category: 'Corals & Reds' },
  { id: 'honey-red', name: 'Honey Red', hex: '#f26161', emoji: '🍓', category: 'Corals & Reds' },
  { id: 'coral-red', name: 'Coral Red', hex: '#e74c3c', emoji: '🎈', category: 'Corals & Reds' },
  { id: 'tomato-red', name: 'Tomato Red', hex: '#d32f2f', emoji: '🍅', category: 'Corals & Reds' },
  { id: 'wine-red', name: 'Wine Red', hex: '#8b0000', emoji: '🍷', category: 'Corals & Reds' },
  { id: 'burgundy', name: 'Burgundy', hex: '#4a0e17', emoji: '🍒', category: 'Corals & Reds' },

  // Oranges & Browns
  { id: 'happy-orange', name: 'Happy Orange', hex: '#ff9f1c', emoji: '🍊', category: 'Oranges & Browns' },
  { id: 'tangerine', name: 'Tangerine', hex: '#f26419', emoji: '🟧', category: 'Oranges & Browns' },
  { id: 'tango', name: 'Tango', hex: '#ff5722', emoji: '💥', category: 'Oranges & Browns' },
  { id: 'burnt-orange', name: 'Burnt Orange', hex: '#e67e22', emoji: '🌅', category: 'Oranges & Browns' },
  { id: 'pumpkin', name: 'Pumpkin', hex: '#d35400', emoji: '🎃', category: 'Oranges & Browns' },
  { id: 'rust', name: 'Rust', hex: '#a04000', emoji: '🍂', category: 'Oranges & Browns' },
  { id: 'leather', name: 'Leather', hex: '#8b4513', emoji: '🪵', category: 'Oranges & Browns' },
  { id: 'chocolate', name: 'Chocolate', hex: '#3e1f0b', emoji: '🍫', category: 'Oranges & Browns' },

  // Yellows & Golds
  { id: 'buttercup', name: 'Buttercup', hex: '#fff176', emoji: '🌼', category: 'Yellows & Golds' },
  { id: 'vanilla', name: 'Vanilla', hex: '#fff59e', emoji: '🍦', category: 'Yellows & Golds' },
  { id: 'honey', name: 'Honey', hex: '#fdd835', emoji: '🍯', category: 'Yellows & Golds' },
  { id: 'bright-yellow', name: 'Bright Yellow', hex: '#ffea00', emoji: '☀️', category: 'Yellows & Golds' },
  { id: 'sunny-yellow', name: 'Sunny Yellow', hex: '#fbc02d', emoji: '🌻', category: 'Yellows & Golds' },
  { id: 'mustard-yellow', name: 'Mustard Yellow', hex: '#e6b800', emoji: '🌟', category: 'Yellows & Golds' },
  { id: 'camel', name: 'Camel', hex: '#c2a649', emoji: '🐪', category: 'Yellows & Golds' },
  { id: 'sand', name: 'Sand', hex: '#d4c483', emoji: '🏖️', category: 'Yellows & Golds' },

  // Neutrals & Grays
  { id: 'tan-cream', name: 'Tan Cream', hex: '#e6d7c3', emoji: '📜', category: 'Neutrals & Grays' },
  { id: 'soft-taupe', name: 'Soft Taupe', hex: '#bcaaa4', emoji: '☕', category: 'Neutrals & Grays' },
  { id: 'taupe', name: 'Taupe', hex: '#8d6e63', emoji: '🪵', category: 'Neutrals & Grays' },
  { id: 'dark-brown', name: 'Dark Brown', hex: '#4e342e', emoji: '☕', category: 'Neutrals & Grays' },
  { id: 'soft-grey', name: 'Soft Grey', hex: '#c0c0c0', emoji: '🩶', category: 'Neutrals & Grays' },
  { id: 'slate-grey', name: 'Slate Grey', hex: '#808080', emoji: '🩶', category: 'Neutrals & Grays' },
  { id: 'charcoal', name: 'Charcoal', hex: '#424242', emoji: '⬛', category: 'Neutrals & Grays' },
  { id: 'onyx-black', name: 'Onyx Black', hex: '#212121', emoji: '🖤', category: 'Neutrals & Grays' },
];

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return { h: 330, s: 81, l: 60 };
  const r = (num >> 16) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function applyThemeColor(hex: string) {
  if (!hex || typeof hex !== 'string') return;
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
  const { h, s } = hexToHsl(cleanHex);

  const sat = Math.max(s, 35);

  const shades = {
    50: hslToHex(h, Math.min(sat, 95), 97),
    100: hslToHex(h, Math.min(sat, 90), 92),
    200: hslToHex(h, Math.min(sat, 85), 83),
    300: hslToHex(h, Math.min(sat, 80), 71),
    400: hslToHex(h, Math.min(sat, 75), 60),
    500: cleanHex,
    600: hslToHex(h, Math.min(sat + 5, 100), 42),
    700: hslToHex(h, Math.min(sat + 10, 100), 34),
    800: hslToHex(h, Math.min(sat + 10, 100), 26),
    900: hslToHex(h, Math.min(sat + 15, 100), 19),
    bgLight: hslToHex(h, Math.min(sat, 100), 97),
    borderLight: hslToHex(h, Math.min(sat, 85), 88),
  };

  const root = document.documentElement;
  root.style.setProperty('--theme-50', shades[50]);
  root.style.setProperty('--theme-100', shades[100]);
  root.style.setProperty('--theme-200', shades[200]);
  root.style.setProperty('--theme-300', shades[300]);
  root.style.setProperty('--theme-400', shades[400]);
  root.style.setProperty('--theme-500', shades[500]);
  root.style.setProperty('--theme-600', shades[600]);
  root.style.setProperty('--theme-700', shades[700]);
  root.style.setProperty('--theme-800', shades[800]);
  root.style.setProperty('--theme-900', shades[900]);
  root.style.setProperty('--theme-bg-light', shades.bgLight);
  root.style.setProperty('--theme-border-light', shades.borderLight);

  root.style.setProperty('--color-pink-50', shades[50]);
  root.style.setProperty('--color-pink-100', shades[100]);
  root.style.setProperty('--color-pink-200', shades[200]);
  root.style.setProperty('--color-pink-300', shades[300]);
  root.style.setProperty('--color-pink-400', shades[400]);
  root.style.setProperty('--color-pink-500', shades[500]);
  root.style.setProperty('--color-pink-600', shades[600]);
  root.style.setProperty('--color-pink-700', shades[700]);
  root.style.setProperty('--color-pink-800', shades[800]);
  root.style.setProperty('--color-pink-900', shades[900]);

  root.style.setProperty('--color-rose-50', shades[50]);
  root.style.setProperty('--color-rose-100', shades[100]);
  root.style.setProperty('--color-rose-200', shades[200]);
  root.style.setProperty('--color-rose-300', shades[300]);
  root.style.setProperty('--color-rose-400', shades[400]);
  root.style.setProperty('--color-rose-500', shades[500]);
  root.style.setProperty('--color-rose-600', shades[600]);
  root.style.setProperty('--color-rose-700', shades[700]);
  root.style.setProperty('--color-rose-800', shades[800]);
  root.style.setProperty('--color-rose-900', shades[900]);

  root.style.setProperty('--color-fuchsia-50', shades[50]);
  root.style.setProperty('--color-fuchsia-100', shades[100]);
  root.style.setProperty('--color-fuchsia-200', shades[200]);
  root.style.setProperty('--color-fuchsia-300', shades[300]);
  root.style.setProperty('--color-fuchsia-400', shades[400]);
  root.style.setProperty('--color-fuchsia-500', shades[500]);
  root.style.setProperty('--color-fuchsia-600', shades[600]);
  root.style.setProperty('--color-fuchsia-700', shades[700]);
  root.style.setProperty('--color-fuchsia-800', shades[800]);
  root.style.setProperty('--color-fuchsia-900', shades[900]);
}
