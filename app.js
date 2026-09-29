/* =========================================================
   Wardrobe Master — app.js
   Vanilla JS, no build step. State persists to localStorage.
   SEED_ITEMS comes from seed-items.js (loaded before this file).
   ========================================================= */

/* ---------------------------- Icons ---------------------------- */
const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 4l8 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  history: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14.5" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M4 9.5h16" stroke="currentColor" stroke-width="1.8"/><path d="M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  jump: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14.5" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M4 9.5h16" stroke="currentColor" stroke-width="1.8"/><path d="M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9.5 15.5 12 13l2.5 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  wardrobe: `<svg viewBox="0 0 24 24" fill="none"><rect x="4.5" y="3.5" width="15" height="17" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M12 3.5v17" stroke="currentColor" stroke-width="1.8"/><path d="M9.3 12v1.3M14.7 12v1.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  inspire: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5a5.5 5.5 0 0 1 3.2 10c-.6.4-1 1.1-1 1.9v.6H9.8v-.6c0-.8-.4-1.5-1-1.9a5.5 5.5 0 0 1 3.2-10Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.8 19h4.4M10.3 21h3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 15V4M8 8l4-4 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 4h4l1 3H9l1-3ZM8 10v7M12 10v7M16 10v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6.5 7 7.2 19a1.5 1.5 0 0 0 1.5 1.4h6.6a1.5 1.5 0 0 0 1.5-1.4L17.5 7" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  washBoost: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5c1.5 2.2 3.8 4.6 3.8 7.4A3.8 3.8 0 1 1 8.2 11c0-2.8 2.3-5.2 3.8-7.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m18.5 3.5.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6.6-1.5ZM19.5 11l.4 1 .9.4-.9.4-.4 1-.4-1-.9-.4.9-.4.4-1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="9" cy="6" r="2" fill="var(--color-surface)" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="12" r="2" fill="var(--color-surface)" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="18" r="2" fill="var(--color-surface)" stroke="currentColor" stroke-width="1.6"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.7"/><path d="M19 19 15.2 15.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  top: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
  bottom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h12l1 6.5-1.8 11a1 1 0 0 1-1 .8h-2a1 1 0 0 1-1-.8L12 12l-1.2 9a1 1 0 0 1-1 .8H7.8a1 1 0 0 1-1-.8L5 10l1-6.5Z"/><path d="M6 7.5h12"/></svg>`,
  outer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.4 4.5 16 3a4 4 0 0 0-8 0L3.6 4.5A2 2 0 0 0 2 6.5V10c0 .6.4 1 1 1h2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9h2c.6 0 1-.4 1-1V6.5a2 2 0 0 0-1.6-2z"/><path d="M12 7v15"/><path d="M8 3v4.5l4 2.5 4-2.5V3"/></svg>`,
  shoes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8c0-3.5 1.5-4.5 3-4.5s3 1 3 4.5c0 3-.8 6-.8 8.5 0 2.5-.7 3.5-2.2 3.5S5.8 19 5.8 16.5C5.8 14 5 11.5 5 8Z"/><path d="M5.2 8.5h5.6M5.1 11.5h5.8"/><path d="M13 8c0-3.5 1.5-4.5 3-4.5s3 1 3 4.5c0 3-.8 6-.8 8.5 0 2.5-.7 3.5-2.2 3.5s-2.2-1-2.2-3.5c0-2.5-.8-5-.8-8.5Z"/><path d="M13.2 8.5h5.6M13.1 11.5h5.8"/></svg>`,
  hat: `<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 15.5c0-4.5 3.3-8 7.5-8s7.5 3.5 7.5 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M2.5 15.5h19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  accessory: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 12v8.5M9.5 20.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  custom: `<svg viewBox="0 0 24 24" fill="none"><path d="M11 3.5H6a2.5 2.5 0 0 0-2.5 2.5v5c0 .6.2 1.1.6 1.5l8 8a2 2 0 0 0 2.8 0l5-5a2 2 0 0 0 0-2.8l-8-8c-.4-.4-.9-.6-1.5-.6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/></svg>`,
  retired: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="16" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 7l2.5-3.5h11L20 7" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.5 11.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  rack: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 20h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 4.5a1.6 1.6 0 1 1 1.3 2.5L12 8.2 4 13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 8.2l8 5.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  basket: `<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 10h15l-1.4 8.4a1.5 1.5 0 0 1-1.5 1.3H7.4a1.5 1.5 0 0 1-1.5-1.3L4.5 10Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3.5 10h17M8 10 9.5 5M16 10 14.5 5M12 13v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12.5" r="3.2" stroke="currentColor" stroke-width="1.6"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 15V3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 7 4 12l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12h8a6 6 0 0 1 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none"><path d="m15 7 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12h-8a6 6 0 0 0-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  shopping: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 8.5h12l1 11H5l1-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none"><path d="M10 13.5a4 4 0 0 0 5.7.1l2.1-2.1a4 4 0 0 0-5.7-5.7l-1.2 1.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M14 10.5a4 4 0 0 0-5.7-.1l-2.1 2.1a4 4 0 0 0 5.7 5.7l1.2-1.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 4.5 19.5 9.5 8.5 20.5H3.5v-5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  towel: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 3.5h12a1 1 0 0 1 1 1V17H5V4.5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 17v3M11 17v3.5M13 17v3M17 17v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  sheets: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="7.5" width="18" height="11" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M3 12.5h18" stroke="currentColor" stroke-width="1.4"/><path d="M7.5 7.5V6a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v1.5" stroke="currentColor" stroke-width="1.4"/></svg>`,
  toothbrush: `<svg viewBox="0 0 24 24" fill="none"><rect x="10.5" y="9" width="3" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="9" y="4" width="6" height="6" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M10 4V2M12 4V1.5M14 4V2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  razor: `<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="5" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M8 6.5h8" stroke="currentColor" stroke-width="1.2"/><path d="M12 9v11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8.5 20h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  scissors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  wind: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4M19 17v4M3 5h4M17 19h4"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  flip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>`,
  wand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4-2 4 4-2Z"/><path d="m20 9-4 2 2 4Z"/><path d="M17.8 11.8 3 21"/><path d="m7 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  sandbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4-2 4 4-2Z"/><path d="m20 9-4 2 2 4Z"/><path d="M17.8 11.8 3 21"/><circle cx="7" cy="7" r="2.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>`,
  invert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7 10 5-6 5 6"/><path d="M12 4v16"/><path d="m17 14-5 6-5-6"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  rain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6M8 14v6M12 16v6"/></svg>`,
  heavyRain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m9.2 22 3-7M9 13l-3 7M17 13l-3 7"/></svg>`,
  cloudSun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`,
  cloudRain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6M8 14v6M12 16v6"/></svg>`,
  cloudLightning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
};
function applyStaticIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(el => {
    if (!el.querySelector('svg') || el.textContent.trim() === '✕') {
      el.innerHTML = ICONS.close;
    }
  });
}

/* ---------------------------- Constants ---------------------------- */
const STORAGE_KEY = 'wardrobeAppState_v2';
const COLOR_FAMILIES = [
  { id: 'black', name: '黑色', hex: '#222222' },
  { id: 'white', name: '白色', hex: '#FFFFFF' },
  { id: 'gray', name: '灰色', hex: '#9E9E9E' },
  { id: 'blue', name: '藍色', hex: '#2563EB' },
  { id: 'green', name: '綠色', hex: '#16A34A' },
  { id: 'yellow', name: '黃色', hex: '#EAB308' },
  { id: 'red', name: '紅色', hex: '#DC2626' },
  { id: 'pink', name: '粉色', hex: '#EC4899' },
  { id: 'purple', name: '紫色', hex: '#9333EA' },
  { id: 'orange', name: '橘色', hex: '#EA580C' },
  { id: 'brown', name: '棕色', hex: '#78350F' },
  { id: 'beige', name: '米/杏色', hex: '#F5EBE0' },
];

const TEN_COLORS = [
  { name: '紅', hex: '#DC2626' },
  { name: '橘', hex: '#EA580C' },
  { name: '黃', hex: '#EAB308' },
  { name: '綠', hex: '#16A34A' },
  { name: '藍', hex: '#2563EB' },
  { name: '紫', hex: '#9333EA' },
  { name: '黑', hex: '#18181B' },
  { name: '白', hex: '#FFFFFF' },
  { name: '粉紅', hex: '#EC4899' },
  { name: '灰牛仔', hex: '#5C6B73' }
];

function getColorHexByName(name) {
  if (!name) return '';
  const match = TEN_COLORS.find(c => c.name === name || c.name === name.replace(/色$/, ''));
  if (match) return match.hex;
  const legacy = COMMON_COLOR_PRESETS.find(c => c.name === name || c.name.includes(name));
  return legacy ? legacy.hex : '';
}

const COMMON_COLOR_PRESETS = [
  { name: '黑色', hex: '#1C1C1E', family: '黑色' },
  { name: '白色', hex: '#FFFFFF', family: '白色' },
  { name: '深灰', hex: '#4B5563', family: '灰色' },
  { name: '淺灰', hex: '#D1D5DB', family: '灰色' },
  { name: '深藍', hex: '#1E3A8A', family: '藍色' },
  { name: '淺藍', hex: '#60A5FA', family: '藍色' },
  { name: '軍綠', hex: '#3F6212', family: '綠色' },
  { name: '淺綠', hex: '#86EFAC', family: '綠色' },
  { name: '深紅', hex: '#991B1B', family: '紅色' },
  { name: '紅色', hex: '#EF4444', family: '紅色' },
  { name: '粉紅', hex: '#F472B6', family: '粉色' },
  { name: '黃色', hex: '#FACC15', family: '黃色' },
  { name: '橘色', hex: '#FB923C', family: '橘色' },
  { name: '紫色', hex: '#A855F7', family: '紫色' },
  { name: '卡其/棕', hex: '#A16207', family: '棕色' },
  { name: '米杏', hex: '#F5EBE0', family: '米/杏色' },
];

function hexToHsl(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function rgbToHex(col) {
  if (!col) return '';
  if (col.startsWith('#')) return col.toLowerCase();
  const match = col.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return col.toLowerCase();
  const r = Number(match[1]).toString(16).padStart(2, '0');
  const g = Number(match[2]).toString(16).padStart(2, '0');
  const b = Number(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toLowerCase();
}

function classifyColorFamily(hex) {
  if (!hex || typeof hex !== 'string') return '其他';
  const clean = hex.trim().toLowerCase();
  const match = COMMON_COLOR_PRESETS.find(p => p.hex.toLowerCase() === clean);
  if (match) return match.family;
  try {
    const { h, s, l } = hexToHsl(clean);
    if (l >= 88 && s <= 30) return '白色';
    if (l <= 14) return '黑色';
    if (s <= 14) return '灰色';
    if (h >= 25 && h <= 50 && s >= 15 && s <= 55 && l >= 72) return '米/杏色';
    if ((h >= 345 && h <= 360) || (h >= 0 && h < 14)) {
      if (l >= 70 && s >= 30) return '粉色';
      if (l < 45 && s < 50) return '棕色';
      return '紅色';
    }
    if (h >= 14 && h < 42) {
      if (l < 52 && s < 65) return '棕色';
      return '橘色';
    }
    if (h >= 42 && h < 68) {
      if (l < 40) return '棕色';
      return '黃色';
    }
    if (h >= 68 && h < 165) return '綠色';
    if (h >= 165 && h < 260) return '藍色';
    if (h >= 260 && h < 315) return '紫色';
    if (h >= 315 && h < 345) return '粉色';
    return '其他';
  } catch (_) {
    return '其他';
  }
}
const FIXED_CATEGORIES = ['top', 'bottom', 'outer', 'shoes', 'hat', 'accessory'];
const CATEGORY_LABEL = { top: '上衣', bottom: '褲子', outer: '外套', shoes: '鞋子', hat: '帽子', accessory: '配件' };
const ASPECT_RATIOS = { '1:1': 1, '3:4': 0.75, '2:3': 2/3 };
const ASPECT_LABELS = { '1:1': '方形', '3:4': '直式', '2:3': '窄長' };
function getCategoryAspectKey(category) {
  return (state.profile.categoryAspect && state.profile.categoryAspect[category]) || (category === 'bottom' ? '3:4' : '1:1');
}
function getCategoryAspectRatio(category) {
  return ASPECT_RATIOS[getCategoryAspectKey(category)] || 1;
}
const MAIN_SLOTS = ['top', 'bottom', 'shoes'];
const EXTRA_SLOTS = ['outer', 'hat', 'accessory'];
const ALL_SLOTS = MAIN_SLOTS.concat(EXTRA_SLOTS);
const HOME_SLOT_RATIOS = { hat: 2.2, top: 1.08, bottom: 0.72, shoes: 1.45 };
const OUTFIT_LAYOUT_DEFAULTS = {
  hat: { scale: 92, x: 0, y: 0 },
  top: { scale: 100, x: 0, y: 0 },
  bottom: { scale: 104, x: 0, y: 0 },
  shoes: { scale: 102, x: 0, y: 0 },
};
function normalizeOutfitLayout(layout) {
  const result = {};
  Object.keys(OUTFIT_LAYOUT_DEFAULTS).forEach(slot => {
    const raw = layout?.[slot] || {};
    result[slot] = {
      scale: Math.min(130, Math.max(70, Number(raw.scale) || OUTFIT_LAYOUT_DEFAULTS[slot].scale)),
      x: Math.min(28, Math.max(-28, Number(raw.x) || 0)),
      y: Math.min(28, Math.max(-28, Number(raw.y) || 0)),
    };
  });
  return result;
}
const CONSUMABLE_DEFS = [
  { id: 'towelA', name: '浴巾 A', cycleDays: 7, icon: 'towel' },
  { id: 'towelB', name: '浴巾 B', cycleDays: 7, icon: 'towel' },
  { id: 'sheets', name: '床單枕頭套', cycleDays: 20, icon: 'sheets' },
  { id: 'toothbrush', name: '電動牙刷刷頭', cycleDays: 180, icon: 'toothbrush' },
  { id: 'razor', name: '刮鬍刀片', cycleDays: 120, icon: 'razor' },
];
const LENGTH_TAGS = ['長', '短'];
const CONSUMABLE_IMAGES = {
  towelA: 'assets/c-towel-a.jpg',
  towelB: 'assets/c-towel-b.jpg',
  sheets: 'assets/c-sheets.jpg',
  toothbrush: 'assets/c-toothbrush.jpg',
  razor: 'assets/c-razor.jpg',
};
function consumableImage(c) {
  if (!c) return '';
  if (c.id === 'towelA' && (!c.image || c.image === 'assets/c-towel.jpg')) return 'assets/c-towel-a.jpg';
  if (c.id === 'towelB' && (!c.image || c.image === 'assets/c-towel.jpg')) return 'assets/c-towel-b.jpg';
  return c.image || CONSUMABLE_IMAGES[c.id] || '';
}

/* ---------------------------- Category helpers ---------------------------- */
function allCategoryIds() { return FIXED_CATEGORIES.concat(state.customCategories.map(c => c.id)); }
function categoryLabel(id) {
  if (CATEGORY_LABEL[id]) return CATEGORY_LABEL[id];
  const c = state.customCategories.find(x => x.id === id);
  return c ? c.label : id;
}
function categoryIcon(id) { return ICONS[id] || ICONS.custom; }
function isShortsItem(item) {
  if (!item || item.category !== 'bottom') return false;
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const name = item.name || '';
  return tags.includes('短') || name.includes('短褲') || name.includes('短');
}

/* ---------------------------- Utilities ---------------------------- */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2 - d1) / 86400000);
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function fmtDate(dateStr) {
  // display dates with "/" per the user's preference; storage stays ISO
  // (yyyy-mm-dd) since <input type="date"> requires that internally.
  return dateStr ? dateStr.replace(/-/g, '/') : '';
}
function fmtHeaderDate() {
  const d = new Date();
  const weekday = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][d.getDay()];
  return `${d.getMonth()+1}月${d.getDate()}日・${weekday}`;
}
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('is-shown');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('is-shown'), 2200);
}

/* ---------------------------- Image compression ---------------------------- */
function readFileAsImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function knockoutWhiteCanvas(canvas) {
  try {
    const w = canvas.width, h = canvas.height;
    if (!w || !h) return;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const cornerIndices = [0, (w - 1) * 4, (w * (h - 1)) * 4, (w * h - 1) * 4];
    let whiteCorners = 0;
    for (const idx of cornerIndices) {
      if (data[idx + 3] >= 20 && data[idx] >= 230 && data[idx + 1] >= 230 && data[idx + 2] >= 230) whiteCorners++;
    }
    if (whiteCorners === 0) return;
    const visited = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let qHead = 0, qTail = 0;
    const isWhite = (idx) => {
      if (data[idx + 3] < 20) return true;
      return data[idx] >= 230 && data[idx + 1] >= 230 && data[idx + 2] >= 230;
    };
    for (let x = 0; x < w; x++) {
      let p = x;
      if (isWhite(p * 4)) { visited[p] = 1; queue[qTail++] = p; }
      p = (h - 1) * w + x;
      if (isWhite(p * 4)) { visited[p] = 1; queue[qTail++] = p; }
    }
    for (let y = 0; y < h; y++) {
      let p = y * w;
      if (!visited[p] && isWhite(p * 4)) { visited[p] = 1; queue[qTail++] = p; }
      p = y * w + (w - 1);
      if (!visited[p] && isWhite(p * 4)) { visited[p] = 1; queue[qTail++] = p; }
    }
    while (qHead < qTail) {
      const p = queue[qHead++];
      const x = p % w;
      const y = (p / w) | 0;
      if (x > 0 && !visited[p - 1] && isWhite((p - 1) * 4)) { visited[p - 1] = 1; queue[qTail++] = p - 1; }
      if (x < w - 1 && !visited[p + 1] && isWhite((p + 1) * 4)) { visited[p + 1] = 1; queue[qTail++] = p + 1; }
      if (y > 0 && !visited[p - w] && isWhite((p - w) * 4)) { visited[p - w] = 1; queue[qTail++] = p - w; }
      if (y < h - 1 && !visited[p + w] && isWhite((p + w) * 4)) { visited[p + w] = 1; queue[qTail++] = p + w; }
    }
    for (let i = 0; i < w * h; i++) {
      if (visited[i]) data[i * 4 + 3] = 0;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch(e) {}
}

async function compressImageFile(file, maxDim = 640) {
  const img = await readFileAsImage(file);
  let { width, height } = img;
  if (width > height) {
    if (width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
  } else {
    if (height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
  }
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  knockoutWhiteCanvas(canvas);
  return canvas.toDataURL('image/png');
}

/* ---------------------------- Photo adjust (crop/zoom/pan to a target ratio) ---------------------------- */
let photoAdjust = null; // { scale, x, y, baseScale, iw, ih, frameW, frameH, isPng, onApply }
function openPhotoAdjust(imgSrc, category, onApply) {
  const sourceSheet = document.querySelector('.modal-sheet.is-active')?.id;
  if (sourceSheet && sourceSheet !== 'modal-photo-adjust') modalReturnTo = sourceSheet;
  const ratio = getCategoryAspectRatio(category); // width / height
  const frame = document.getElementById('photoAdjustFrame');
  const frameW = Math.min(280, Math.max(220, (frame.parentElement?.clientWidth || 320) - 12));
  const frameH = Math.round(frameW / ratio);
  frame.style.width = frameW + 'px';
  frame.style.height = frameH + 'px';
  const isPng = imgSrc.startsWith('data:image/png') || imgSrc.startsWith('data:image/webp') || /\.(png|webp)$/i.test(imgSrc);
  frame.style.backgroundColor = 'transparent';
  const img = document.getElementById('photoAdjustImg');
  photoAdjust = { scale: 1, x: 0, y: 0, frameW, frameH, minScale: 0.5, maxScale: 2.5, isPng, onApply };
  img.onload = () => {
    const iw = img.naturalWidth, ih = img.naturalHeight;
    photoAdjust.iw = iw; photoAdjust.ih = ih;
    photoAdjust.baseScale = Math.max(frameW / iw, frameH / ih);
    photoAdjust.x = (frameW - iw * photoAdjust.baseScale) / 2;
    photoAdjust.y = (frameH - ih * photoAdjust.baseScale) / 2;
    applyPhotoAdjustTransform();
  };
  img.src = imgSrc;
  const slider = document.getElementById('photoZoomSlider');
  slider.min = 50;
  slider.max = 250;
  slider.value = 100;
  openModal('modal-photo-adjust');
}
function clampPhotoPosition(s) {
  const totalScale = s.baseScale * s.scale;
  const w = s.iw * totalScale, h = s.ih * totalScale;
  const centeredX = (s.frameW - w) / 2;
  const centeredY = (s.frameH - h) / 2;
  const minX = w >= s.frameW ? s.frameW - w : centeredX;
  const maxX = w >= s.frameW ? 0 : centeredX;
  const minY = h >= s.frameH ? s.frameH - h : centeredY;
  const maxY = h >= s.frameH ? 0 : centeredY;
  s.x = Math.min(maxX, Math.max(minX, s.x));
  s.y = Math.min(maxY, Math.max(minY, s.y));
}
function applyPhotoAdjustTransform() {
  const s = photoAdjust;
  if (!s || !s.iw) return;
  const img = document.getElementById('photoAdjustImg');
  const totalScale = s.baseScale * s.scale;
  const w = s.iw * totalScale, h = s.ih * totalScale;
  clampPhotoPosition(s);
  img.style.width = w + 'px';
  img.style.height = h + 'px';
  img.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
}
function setPhotoScale(nextScale, focusX, focusY) {
  const s = photoAdjust;
  if (!s || !s.iw) return;
  const oldTotal = s.baseScale * s.scale;
  const fx = focusX ?? s.frameW / 2;
  const fy = focusY ?? s.frameH / 2;
  const contentX = (fx - s.x) / oldTotal;
  const contentY = (fy - s.y) / oldTotal;
  s.scale = Math.min(s.maxScale, Math.max(s.minScale, nextScale));
  const newTotal = s.baseScale * s.scale;
  s.x = fx - contentX * newTotal;
  s.y = fy - contentY * newTotal;
  applyPhotoAdjustTransform();
  document.getElementById('photoZoomSlider').value = Math.round(s.scale * 100);
}
function wirePhotoAdjust() {
  const frame = document.getElementById('photoAdjustFrame');
  const pointers = new Map();
  let dragStart = null;
  let pinchStart = null;
  const pointFromEvent = e => { const rect = frame.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top }; };
  const distance = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const midpoint = () => {
    const [a, b] = [...pointers.values()];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  };
  frame.addEventListener('pointerdown', e => {
    if (!photoAdjust) return;
    pointers.set(e.pointerId, pointFromEvent(e));
    frame.setPointerCapture(e.pointerId);
    if (pointers.size === 1) dragStart = { x: e.clientX, y: e.clientY, ox: photoAdjust.x, oy: photoAdjust.y };
    if (pointers.size === 2) pinchStart = { distance: distance(), scale: photoAdjust.scale, midpoint: midpoint() };
  });
  frame.addEventListener('pointermove', e => {
    if (!photoAdjust || !pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, pointFromEvent(e));
    if (pointers.size >= 2 && pinchStart) {
      const ratio = distance() / Math.max(1, pinchStart.distance);
      const point = midpoint();
      setPhotoScale(pinchStart.scale * ratio, point.x, point.y);
      return;
    }
    if (pointers.size === 1 && dragStart) {
      photoAdjust.x = dragStart.ox + (e.clientX - dragStart.x);
      photoAdjust.y = dragStart.oy + (e.clientY - dragStart.y);
      applyPhotoAdjustTransform();
    }
  });
  const endPointer = e => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) dragStart = null;
  };
  frame.addEventListener('pointerup', endPointer);
  frame.addEventListener('pointercancel', endPointer);
  frame.addEventListener('pointerleave', e => { if (e.buttons === 0) endPointer(e); });
  document.getElementById('photoZoomSlider').addEventListener('input', e => {
    if (!photoAdjust) return;
    setPhotoScale(Number(e.target.value) / 100);
  });
  document.getElementById('btnPhotoAdjustApply').addEventListener('click', () => {
    const s = photoAdjust;
    if (!s || !s.iw) { toast('照片還沒載入完成，請稍候再按套用'); return; }
    const outW = 640, outH = Math.round(outW / (s.frameW / s.frameH));
    const scaleOut = outW / s.frameW;
    const totalScale = s.baseScale * s.scale;
    const canvas = document.createElement('canvas');
    canvas.width = outW; canvas.height = outH;
    ctx.clearRect(0, 0, outW, outH);
    const img = document.getElementById('photoAdjustImg');
    ctx.drawImage(img, s.x * scaleOut, s.y * scaleOut, s.iw * totalScale * scaleOut, s.ih * totalScale * scaleOut);
    knockoutWhiteCanvas(canvas);
    let dataUrl;
    try {
      dataUrl = canvas.toDataURL('image/png');
    } catch (err) {
      toast('照片儲存失敗，請重新選取照片');
      return;
    }
    const cb = s.onApply;
    photoAdjust = null;
    if (cb) cb(dataUrl);
    requestAnimationFrame(() => closeModal());
  });
}

/* ---------------------------- State ---------------------------- */
function defaultState() {
  return {
    profile: {
      name: '',
      avatar: '',
      cardImageScale: 72,
      weather: { city: '', latitude: null, longitude: null, timezone: 'auto', current: null, updatedAt: 0 },
      outfitLayout: normalizeOutfitLayout(OUTFIT_LAYOUT_DEFAULTS),
      washThresholds: { bottom: 3, outer: 5, shoes: 8, hat: 8, accessory: 8 },
      categoryAspect: { top: '1:1', bottom: '3:4', outer: '1:1', shoes: '1:1', hat: '1:1', accessory: '1:1' },
    },
    items: JSON.parse(JSON.stringify(typeof SEED_ITEMS !== 'undefined' ? SEED_ITEMS : [])),
    customCategories: [],
    today: { date: todayStr(), top: null, bottom: null, shoes: null, outer: null, hat: null, accessory: null },
    ootdHistory: [],
    consumables: CONSUMABLE_DEFS.map(c => ({ id: c.id, name: c.name, cycleDays: c.cycleDays, icon: c.icon, startDate: todayStr(), history: [] })),
    activeTowel: 'towelA',
    laundry: { lastWashDate: todayStr(), cycleDays: 2, snoozedUntil: null, history: [] },
    wishlist: [],
    styleGallery: [],
    haircuts: [],
    geminiApiKey: '',
    drafts: { addItem: null, wishlist: null },
    sandboxItems: [],
  };
}
const IDB_NAME = 'wardrobe_db';
const IDB_STORE = 'app_state';
const IDB_KEY = 'wardrobeAppState_v2';
let idbInstancePromise = null;

function getIDB() {
  if (idbInstancePromise) return idbInstancePromise;
  idbInstancePromise = new Promise(resolve => {
    if (!('indexedDB' in window)) { resolve(null); return; }
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => { console.warn('IndexedDB open failed', req.error); resolve(null); };
    } catch (e) {
      console.warn('IndexedDB error', e);
      resolve(null);
    }
  });
  return idbInstancePromise;
}

async function idbGet(key) {
  try {
    const db = await getIDB();
    if (!db) return null;
    return new Promise(resolve => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

async function idbSet(key, val) {
  try {
    const db = await getIDB();
    if (!db) return false;
    return new Promise(resolve => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(val, key);
      req.onsuccess = () => resolve(true);
      req.onerror = e => { console.warn('idbSet failed', e); resolve(false); };
    });
  } catch (e) {
    return false;
  }
}

function hydrateState(rawObj) {
  const base = defaultState();
  if (!rawObj) return base;
  const parsed = typeof rawObj === 'string' ? JSON.parse(rawObj) : rawObj;
  const profile = Object.assign({}, base.profile, parsed.profile || {});
  profile.washThresholds = Object.assign({}, base.profile.washThresholds, (parsed.profile && parsed.profile.washThresholds) || {});
  profile.categoryAspect = Object.assign({}, base.profile.categoryAspect, (parsed.profile && parsed.profile.categoryAspect) || {});
  profile.weather = Object.assign({}, base.profile.weather, (parsed.profile && parsed.profile.weather) || {});
  profile.outfitLayout = normalizeOutfitLayout((parsed.profile && parsed.profile.outfitLayout) || base.profile.outfitLayout);
  profile.cardImageScale = Math.min(100, Math.max(45, Number(profile.cardImageScale) || 72));
  profile.avatar = typeof profile.avatar === 'string' ? profile.avatar : '';
  const normalizedItems = (Array.isArray(parsed.items) ? parsed.items : []).map(i => {
    if (!i.colorFamily) {
      if (i.color) {
        i.colorFamily = classifyColorFamily(i.colorHex || '') || i.color;
      } else {
        const found = COLOR_FAMILIES.find(f => i.name && (i.name.includes(f.name) || i.name.includes(f.name.replace('色', ''))));
        if (found) {
          i.color = found.name;
          i.colorFamily = found.name;
          i.colorHex = found.hex;
        }
      }
    }
    return i;
  });
  return {
    profile,
    items: normalizedItems,
    customCategories: Array.isArray(parsed.customCategories) ? parsed.customCategories : [],
    today: Object.assign({}, base.today, parsed.today || {}),
    ootdHistory: Array.isArray(parsed.ootdHistory) ? parsed.ootdHistory : [],
    consumables: Array.isArray(parsed.consumables) && parsed.consumables.length ? parsed.consumables : base.consumables,
    activeTowel: parsed.activeTowel === 'towelB' ? 'towelB' : 'towelA',
    laundry: Object.assign({}, base.laundry, parsed.laundry || {}),
    wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
    styleGallery: Array.isArray(parsed.styleGallery) ? parsed.styleGallery : [],
    haircuts: Array.isArray(parsed.haircuts) ? parsed.haircuts : [],
    geminiApiKey: typeof parsed.geminiApiKey === 'string' ? parsed.geminiApiKey : (localStorage.getItem('gemini_api_key') || ''),
    drafts: Object.assign({}, base.drafts, parsed.drafts || {}),
    sandboxItems: Array.isArray(parsed.sandboxItems) ? parsed.sandboxItems : [],
  };
}

let state = loadState();
window.state = state; // exposed for easy debugging via Safari/Chrome devtools console

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return hydrateState(raw);
  } catch (e) {
    console.error('讀取資料失敗，改用預設狀態', e);
    return defaultState();
  }
}

async function loadStateAsync() {
  try {
    const idbData = await idbGet(IDB_KEY);
    if (idbData) {
      const hydrated = hydrateState(idbData);
      Object.keys(state).forEach(k => delete state[k]);
      Object.assign(state, hydrated);
      normalizeLoadedState();
      return;
    }
    // Migration from localStorage if IndexedDB is fresh
    const rawLocal = localStorage.getItem(STORAGE_KEY);
    if (rawLocal) {
      const hydrated = hydrateState(rawLocal);
      Object.keys(state).forEach(k => delete state[k]);
      Object.assign(state, hydrated);
      normalizeLoadedState();
      await idbSet(IDB_KEY, state);
      console.log('Successfully migrated wardrobe state from localStorage to IndexedDB');
    }
  } catch (err) {
    console.error('loadStateAsync failed', err);
  }
}

function normalizeLoadedState() {
  state.items.forEach(item => {
    item.washHistory = Array.isArray(item.washHistory) ? item.washHistory : [];
    item.lastWashedDate = item.lastWashedDate || null;
    item.extraWash = !!item.extraWash;
    if (item.status === 'dirty' && !item.basketAt) item.basketAt = item.lastWornDate || todayStr();
    if (item.status === 'resting' && !item.restingSince) item.restingSince = item.lastWornDate || todayStr();
    if (item.status !== 'dirty') item.basketAt = item.basketAt || null;
    if (item.status !== 'resting') item.restingSince = item.restingSince || null;
  });
  state.wishlist = Array.isArray(state.wishlist) ? state.wishlist : [];
  state.styleGallery = (Array.isArray(state.styleGallery) ? state.styleGallery : [])
    .filter(photo => photo && typeof photo.image === 'string' && photo.image)
    .map(photo => ({ id: photo.id || uid(), image: photo.image, createdAt: photo.createdAt || Date.now() }));
  state.profile = state.profile || {};
  state.profile.cardImageScale = Math.min(100, Math.max(45, Number(state.profile.cardImageScale) || 72));
  state.profile.avatar = typeof state.profile.avatar === 'string' ? state.profile.avatar : '';
  state.profile.weather = Object.assign({ city: '', area: '', latitude: null, longitude: null, timezone: 'auto', current: null, updatedAt: 0, tempOffset: 0, tempUnit: 'C' }, state.profile.weather || {});
  state.profile.outfitLayout = normalizeOutfitLayout(state.profile.outfitLayout);
  state.laundry = Object.assign({ lastWashDate: todayStr(), cycleDays: 2, snoozedUntil: null, history: [] }, state.laundry || {});
  state.laundry.history = Array.isArray(state.laundry.history) ? state.laundry.history : [];
  state.consumables = Array.isArray(state.consumables) ? state.consumables : [];
  state.consumables.forEach(c => {
    c.history = Array.isArray(c.history) ? c.history : [];
    c.laundryPending = !!c.laundryPending;
    c.laundryAt = c.laundryAt || null;
    if (c.id === 'towelA' && (!c.image || c.image === 'assets/c-towel.jpg')) c.image = 'assets/c-towel-a.jpg';
    if (c.id === 'towelB' && (!c.image || c.image === 'assets/c-towel.jpg')) c.image = 'assets/c-towel-b.jpg';
  });
  state.drafts = Object.assign({ addItem: null, wishlist: null }, state.drafts || {});
  if (!Array.isArray(state.sandboxes) || state.sandboxes.length === 0) {
    state.sandboxes = [
      {
        id: 'sb_default',
        name: '沙盒 1',
        items: Array.isArray(state.sandboxItems) ? state.sandboxItems : []
      }
    ];
  }
  if (!state.currentSandboxId || !state.sandboxes.some(s => s.id === state.currentSandboxId)) {
    state.currentSandboxId = state.sandboxes[0]?.id || 'sb_default';
  }
}
normalizeLoadedState();

function getCurrentSandbox() {
  if (!Array.isArray(state.sandboxes) || state.sandboxes.length === 0) {
    state.sandboxes = [{ id: 'sb_default', name: '沙盒 1', items: [] }];
    state.currentSandboxId = 'sb_default';
  }
  let sb = state.sandboxes.find(s => s.id === state.currentSandboxId);
  if (!sb) {
    sb = state.sandboxes[0];
    state.currentSandboxId = sb.id;
  }
  if (!Array.isArray(sb.items)) sb.items = [];
  return sb;
}

const HISTORY_LIMIT = 40;
let historyReady = false;
let historySnapshot = null;
let undoStack = [];
let redoStack = [];
let undoViews = [];
let redoViews = [];
let undoLabels = [];
let redoLabels = [];
let lastHistoryAt = 0;
let lastChangedView = 'home';
let activeView = 'home';
let applyingHistory = false;
function cloneState(value) { return JSON.parse(JSON.stringify(value)); }
function stateSignature(value) { return JSON.stringify(value); }

function inferActionLabel(before, after) {
  if (!before || !after) return '資料變更';
  const bItems = before.items || [];
  const aItems = after.items || [];
  if (aItems.length > bItems.length) {
    const added = aItems.find(it => !bItems.some(b => b.id === it.id)) || aItems[aItems.length - 1];
    return added ? `新增單品「${added.name}」` : '新增單品';
  }
  if (aItems.length < bItems.length) {
    const diff = bItems.find(it => !aItems.some(a => a.id === it.id));
    return diff ? `刪除單品「${diff.name}」` : '刪除單品';
  }
  // Check profile name change
  if (before.profile?.name !== after.profile?.name) {
    return `改名「${after.profile?.name || '無'}」`;
  }
  // Item specific diffs
  for (let i = 0; i < aItems.length; i++) {
    const a = aItems[i];
    const b = bItems.find(it => it.id === a.id);
    if (!b) continue;
    if (a.name !== b.name) {
      return `改名「${a.name}」`;
    }
    if (a.image !== b.image) {
      return `更換「${a.name}」照片`;
    }
    if (a.status !== b.status) {
      const statusMap = { clean: '乾淨', resting: '暫存衣架', dirty: '洗衣籃', retired: '典藏' };
      return `「${a.name}」移至${statusMap[a.status] || a.status}`;
    }
    if (a.price !== b.price) {
      return `修改「${a.name}」價格`;
    }
    if (a.color !== b.color || a.colorHex !== b.colorHex) {
      return `修改「${a.name}」顏色`;
    }
    if (a.category !== b.category) {
      return `修改「${a.name}」分類為${categoryLabel(a.category)}`;
    }
    if (a.brand !== b.brand) {
      return `修改「${a.name}」品牌為「${a.brand || '無'}」`;
    }
    if (a.material !== b.material) {
      return `修改「${a.name}」材質`;
    }
  }
  // Detect tag additions or removals
  const bTags = new Set(bItems.flatMap(i => i.tags || []));
  const aTags = new Set(aItems.flatMap(i => i.tags || []));
  for (const t of aTags) {
    if (!bTags.has(t)) return `新增標籤「${t}」`;
  }
  for (const t of bTags) {
    if (!aTags.has(t)) return `刪除標籤「${t}」`;
  }
  // Detect brand changes
  const bBrands = new Set(bItems.map(i => i.brand).filter(Boolean));
  const aBrands = new Set(aItems.map(i => i.brand).filter(Boolean));
  for (const b of aBrands) {
    if (!bBrands.has(b)) return `新增品牌「${b}」`;
  }
  for (const b of bBrands) {
    if (!aBrands.has(b)) return `刪除品牌「${b}」`;
  }
  const bDirty = bItems.filter(it => it.status === 'dirty').length;
  const aDirty = aItems.filter(it => it.status === 'dirty').length;
  if (aDirty > bDirty) return '單品送洗';
  const bRest = bItems.filter(it => it.status === 'resting').length;
  const aRest = aItems.filter(it => it.status === 'resting').length;
  if (aRest > bRest) return '移至暫存衣架';
  const bRet = bItems.filter(it => it.status === 'retired').length;
  const aRet = aItems.filter(it => it.status === 'retired').length;
  if (aRet > bRet) return '移入典藏';
  if (bRet > aRet) return '恢復自典藏';
  if (JSON.stringify(before.today) !== JSON.stringify(after.today)) {
    const changedSlot = ALL_SLOTS.find(s => before.today[s] !== after.today[s]);
    if (changedSlot) {
      const it = after.today[changedSlot] ? findItem(after.today[changedSlot]) : null;
      return it ? `換上「${it.name}」` : `清除今日${categoryLabel(changedSlot)}`;
    }
    return '更換今日穿搭';
  }
  return '資料修改';
}

function updateHistoryControls() {
  const undo = document.getElementById('btnUndo');
  const redo = document.getElementById('btnRedo');
  if (undo) undo.disabled = undoStack.length === 0;
  if (redo) redo.disabled = redoStack.length === 0;

  const undoDesc = document.getElementById('undoActionDesc');
  const redoDesc = document.getElementById('redoActionDesc');
  if (undoDesc) {
    const lastLabel = undoLabels[undoLabels.length - 1];
    undoDesc.textContent = undoStack.length ? `復原${lastLabel || '上一個變更'}` : '無可復原操作';
  }
  if (redoDesc) {
    const lastLabel = redoLabels[redoLabels.length - 1];
    redoDesc.textContent = redoStack.length ? `重做${lastLabel || '已復原變更'}` : '無可重做操作';
  }
}

function pushHistory(before, actionLabel) {
  const now = Date.now();
  const label = actionLabel || inferActionLabel(before, state) || '變更';
  if (now - lastHistoryAt > 650 || !undoStack.length) {
    undoStack.push(cloneState(before));
    undoViews.push(lastChangedView);
    undoLabels.push(label);
    if (undoStack.length > HISTORY_LIMIT) {
      undoStack.shift();
      undoViews.shift();
      undoLabels.shift();
    }
  } else if (undoLabels.length) {
    undoLabels[undoLabels.length - 1] = label;
  }
  lastHistoryAt = now;
  redoStack = [];
  redoViews = [];
  redoLabels = [];
}

let dbSaveTimer = null;
let dbSavePending = false;
async function persistStateToDB() {
  if (dbSavePending) return;
  dbSavePending = true;
  try {
    const snapshot = cloneState(state);
    await idbSet(IDB_KEY, snapshot);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (quotaErr) {
      // Ignored: IndexedDB is our primary persistent store with gigabytes of quota
    }
  } catch (e) {
    console.error('IndexedDB save failed', e);
  } finally {
    dbSavePending = false;
  }
}

function saveState(options = {}) {
  const next = cloneState(state);
  if (historyReady && !applyingHistory && !options.skipHistory) {
    if (!historySnapshot || stateSignature(historySnapshot) !== stateSignature(next)) {
      pushHistory(historySnapshot, options.action);
    }
  }
  historySnapshot = next;
  updateHistoryControls();

  clearTimeout(dbSaveTimer);
  dbSaveTimer = setTimeout(persistStateToDB, 150);
}

function replaceStateFromSnapshot(snapshot) {
  Object.keys(state).forEach(key => delete state[key]);
  Object.assign(state, cloneState(snapshot));
}

function syncHomeThemeColor(isHome, isNight) {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) return;
  if (!isHome) {
    themeMeta.setAttribute('content', '#ffffff');
    return;
  }
  if (activeView === 'wardrobe' && uiWardrobeCat === 'retired') {
    themeMeta.setAttribute('content', '#D8B45B');
    return;
  }
  // Seamless match with the atmosphere gradient top
  themeMeta.setAttribute('content', isNight ? '#0F172A' : '#3A88E9');
}

function activateView(view) {
  activeView = view;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('is-active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('is-active', v.id === 'view-' + view));
  const app = document.getElementById('app');
  const isHome = view === 'home';
  app.classList.toggle('is-home-view', isHome);
  const current = state.profile.weather?.current;
  const isNight = current && current.is_day != null ? Number(current.is_day) === 0 : (new Date().getHours() >= 18 || new Date().getHours() < 6);
  document.documentElement.classList.toggle('home-page', isHome);
  document.documentElement.classList.toggle('night-page', isHome && isNight);
  document.body.classList.toggle('home-page', isHome);
  document.body.classList.toggle('night-page', isHome && isNight);
  const isRetired = view === 'wardrobe' && uiWardrobeCat === 'retired';
  document.getElementById('mainScroll').classList.toggle('is-retired-scroll', isRetired);
  app.classList.toggle('is-retired-view', isRetired);
  syncHomeThemeColor(isHome, isNight);

  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.getElementById('mainScroll').scrollTop = 0;
  syncHomeRackExpansion();
  if (view === 'history') {
    renderHistory();
  } else if (view === 'wardrobe') {
    renderWardrobe();
  } else if (view === 'more') {
    renderHaircuts();
    renderConsumables();
  } else if (view === 'home') {
    renderHome();
  } else if (view === 'inspiration') {
    renderWishlist();
    setupInspirationCarousel();
  }
}

function restoreHistoryView(view) {
  if (view && document.getElementById('view-' + view)) {
    forceCloseModal({ skipPersist: true });
    activateView(view);
  }
}

function undoState() {
  if (!undoStack.length) return;
  const target = undoStack.pop();
  const targetView = undoViews.pop() || activeView;
  const label = undoLabels.pop() || '變更';
  redoStack.push(cloneState(state));
  redoViews.push(activeView);
  redoLabels.push(label);
  applyingHistory = true;
  replaceStateFromSnapshot(target);
  saveState({ skipHistory: true });
  applyingHistory = false;
  renderAll();
  renderAvatar();
  renderCardImageScale();
  updateHistoryControls();
  restoreHistoryView(targetView);
  toast(`已還原${label}`);
}

function redoState() {
  if (!redoStack.length) return;
  const target = redoStack.pop();
  const targetView = redoViews.pop() || activeView;
  const label = redoLabels.pop() || '變更';
  undoStack.push(cloneState(state));
  undoViews.push(activeView);
  undoLabels.push(label);
  applyingHistory = true;
  replaceStateFromSnapshot(target);
  saveState({ skipHistory: true });
  applyingHistory = false;
  renderAll();
  renderAvatar();
  renderCardImageScale();
  updateHistoryControls();
  restoreHistoryView(targetView);
  toast(`已重做${label}`);
}

function ensureNewDay() {
  if (state.today.date === todayStr()) return;
  const hadAny = ALL_SLOTS.some(s => state.today[s]);
  if (hadAny) state.ootdHistory.push({ ...state.today });
  state.items.forEach(it => { it.wornToday = false; });
  const fresh = { date: todayStr() };
  ALL_SLOTS.forEach(s => { fresh[s] = null; });
  state.today = fresh;
  saveState();
}

/* ---------------------------- Wear / laundry logic ---------------------------- */
function findItem(id) { return state.items.find(i => i.id === id); }
function getThreshold(category) {
  const t = state.profile.washThresholds || {};
  const v = t[category];
  if (v === null) return Infinity; // "無" — never mark dirty from wear count alone
  return v ?? 5;
}
function computeStatusAfterWear(item) {
  if ((item.wearCount || 0) <= 0) return 'clean';
  if (item.category === 'top') return 'dirty';
  const threshold = getThreshold(item.category);
  if (item.category === 'bottom') {
    // only tops (immediate) and pants (threshold) use the temp-rack/resting stage
    return item.wearCount >= threshold ? 'dirty' : 'resting';
  }
  // outer/shoes/hat/accessory: no "resting" holding stage — clean until the
  // threshold is hit, then straight to dirty. They never populate the temp rack.
  return item.wearCount >= threshold ? 'dirty' : 'clean';
}
function applyWear(itemId) {
  const item = findItem(itemId);
  if (!item || item.wornToday) return;
  const previousStatus = item.status;
  item.wearCount = (item.wearCount || 0) + 1;
  item.totalWearCount = (item.totalWearCount || 0) + 1;
  item.lastWornDate = todayStr();
  item.wornToday = true;
  item.wearHistory = item.wearHistory || [];
  item.wearHistory.unshift(todayStr());
  item.status = computeStatusAfterWear(item);
  if (item.status === 'resting' && previousStatus !== 'resting') item.restingSince = todayStr();
  if (item.status === 'dirty' && previousStatus !== 'dirty') item.basketAt = todayStr();
  if (item.status !== 'resting') item.restingSince = null;
}
function revertWear(itemId) {
  const item = findItem(itemId);
  if (!item || !item.wornToday) return;
  item.wearCount = Math.max(0, (item.wearCount || 0) - 1);
  item.totalWearCount = Math.max(0, (item.totalWearCount || 0) - 1);
  item.wornToday = false;
  if (item.wearHistory && item.wearHistory[0] === todayStr()) item.wearHistory.shift();
  item.status = computeStatusAfterWear(item);
  if (item.status === 'resting' && !item.restingSince) item.restingSince = item.lastWornDate || todayStr();
  if (item.status !== 'dirty') item.basketAt = null;
  if (item.status !== 'resting') item.restingSince = null;
}
function setTodaySlot(slot, itemId) {
  const prev = state.today[slot];
  if (prev === itemId) return;
  if (prev) revertWear(prev);
  state.today[slot] = itemId;
  if (itemId) applyWear(itemId);
  saveState();
  renderHome();
  renderWardrobe();
  renderHistory();
}
function recordLaundryEvent(date = todayStr(), options = {}) {
  state.laundry = state.laundry || { lastWashDate: date, cycleDays: 2, snoozedUntil: null, history: [] };
  state.laundry.history = Array.isArray(state.laundry.history) ? state.laundry.history : [];
  const boostedIds = Array.from(new Set(
    (options.boostedItemIds || (options.extraWash && options.itemId ? [options.itemId] : [])).filter(Boolean)
  ));
  const consumableIds = Array.from(new Set((options.consumableIds || []).filter(Boolean)));
  const index = state.laundry.history.findIndex(entry => (typeof entry === 'string' ? entry : entry?.date) === date);
  if (index < 0) {
    if (!boostedIds.length && !consumableIds.length) { state.laundry.history.unshift(date); return; }
    const entry = { date };
    if (boostedIds.length) entry.extraWashItemIds = boostedIds;
    if (consumableIds.length) entry.laundryConsumableIds = consumableIds;
    state.laundry.history.unshift(entry);
    return;
  }
  if (!boostedIds.length && !consumableIds.length) return;
  const existing = state.laundry.history[index];
  const entry = typeof existing === 'string' ? { date: existing } : (existing || { date });
  if (boostedIds.length) entry.extraWashItemIds = Array.from(new Set([...(entry.extraWashItemIds || []), ...boostedIds]));
  if (consumableIds.length) entry.laundryConsumableIds = Array.from(new Set([...(entry.laundryConsumableIds || []), ...consumableIds]));
  state.laundry.history[index] = entry;
}
function laundryHistoryDates() {
  return new Set((state.laundry?.history || []).map(entry => typeof entry === 'string' ? entry : entry?.date).filter(Boolean));
}
function laundryExtraWashDates() {
  return new Set((state.laundry?.history || [])
    .filter(entry => typeof entry !== 'string' && Array.isArray(entry?.extraWashItemIds) && entry.extraWashItemIds.length)
    .map(entry => entry.date).filter(Boolean));
}
function syncLatestLaundryDate() {
  state.laundry = state.laundry || { lastWashDate: todayStr(), cycleDays: 2, snoozedUntil: null, history: [] };
  const dates = (state.laundry?.history || [])
    .map(e => typeof e === 'string' ? e : e?.date)
    .filter(Boolean)
    .sort();
  if (dates.length) {
    state.laundry.lastWashDate = dates[dates.length - 1];
  }
}
function recordItemWash(item, date = todayStr()) {
  if (!item) return;
  const extraWash = !!item.extraWash;
  item.washHistory = item.washHistory || [];
  item.washHistory.unshift({ date, basketAt: item.basketAt || null, extraWash });
  recordLaundryEvent(date, { itemId: item.id, extraWash });
  item.lastWashedDate = date;
  item.wearCount = 0;
  item.status = 'clean';
  item.basketAt = null;
  item.restingSince = null;
  item.wornToday = false;
  item.extraWash = false;
}
function markItemClean(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  recordItemWash(item);
  saveState();
  renderAll();
  toast(`${item.name} 已記錄清洗日期`);
}
function sendToBasketNow(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  if (item.status !== 'dirty') item.basketAt = todayStr();
  item.status = 'dirty';
  item.restingSince = null;
  saveState();
  renderAll();
  toast(`${item.name} 已丟進洗衣籃`);
}
function sendToTempRackNow(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  item.status = 'resting';
  item.restingSince = todayStr();
  item.basketAt = null;
  saveState({ action: `將「${item.name}」移至暫存衣架` });
  renderAll();
  toast(`已將「${item.name}」移至暫存衣架`);
}
function toggleExtraWash(itemId) {
  const item = findItem(itemId);
  if (!item || !['resting', 'dirty'].includes(item.status)) return;
  item.extraWash = !item.extraWash;
  saveState();
  renderAll();
  const activeModal = document.querySelector('.modal-sheet.is-active')?.id;
  if (activeModal === 'modal-laundry') openLaundryModal();
  if (activeModal === 'modal-rack-overview') openRackOverview();
  toast(item.extraWash ? `${item.name} 已標記加強清洗` : `${item.name} 已取消加強清洗`);
}
function wearOnceMore(itemId) {
  // "再穿一次": don't wash it yet — temporarily un-flag dirty so it's
  // selectable in the try-on picker again. wearCount is untouched, so the
  // next actual wear will very likely push it straight back to dirty.
  const item = findItem(itemId);
  if (!item) return;
  item.status = 'resting';
  item.restingSince = todayStr();
  item.basketAt = null;
  saveState();
  renderAll();
  toast(`${item.name} 可以再穿一次`);
}
function retireItem(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  item.status = 'retired';
  saveState();
  renderAll();
  toast(`${item.name} 已移入典藏`);
}
function restoreItem(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  item.status = 'clean';
  saveState();
  renderAll();
  toast(`${item.name} 已回到衣櫥`);
}
function deleteItemPermanently(itemId) {
  state.items = state.items.filter(i => i.id !== itemId);
  ALL_SLOTS.forEach(s => { if (state.today[s] === itemId) state.today[s] = null; });
  saveState();
  renderAll();
}
function importSeedItems() {
  if (typeof SEED_ITEMS === 'undefined' || !Array.isArray(SEED_ITEMS) || !SEED_ITEMS.length) {
    toast('找不到舊衣物清單資料，請確認網頁有完整載入（可以試著重新整理一次）');
    return;
  }
  const byId = new Map(state.items.map(i => [i.id, i]));
  let added = 0, pricePatched = 0;
  SEED_ITEMS.forEach(seed => {
    const existing = byId.get(seed.id);
    if (!existing) {
      state.items.push(JSON.parse(JSON.stringify(seed)));
      added++;
    } else if ((existing.price === null || existing.price === undefined) && seed.price != null) {
      // narrow, safe backfill: only touches items that are STILL missing a price
      // (an earlier import bug dropped prices) — never overwrites a price you've
      // since set yourself.
      existing.price = seed.price;
      pricePatched++;
    }
  });
  saveState();
  renderAll();
  const parts = [];
  if (added) parts.push(`已匯入 ${added} 件舊衣物`);
  if (pricePatched) parts.push(`補上 ${pricePatched} 件的價格`);
  toast(parts.length ? parts.join('，') : '這些衣物已經在衣櫥裡了');
}

/* ---------------------------- Consumables logic ---------------------------- */
function daysUsed(c) { return Math.max(0, daysBetween(c.startDate, todayStr())); }
function isOverdue(c) { return c.cycleDays !== null && daysUsed(c) >= c.cycleDays; }
function isTowelId(id) { return id === 'towelA' || id === 'towelB'; }
function isLaundryConsumable(c) { return !!c && (isTowelId(c.id) || c.id === 'sheets'); }
function getPendingLaundryConsumables() {
  return (state.consumables || []).filter(c => isLaundryConsumable(c) && c.laundryPending);
}
function sendConsumableToLaundry(id) {
  const c = state.consumables.find(x => x.id === id);
  if (!c || !isLaundryConsumable(c) || c.laundryPending) return;
  c.laundryPending = true;
  c.laundryAt = todayStr();
  if (isTowelId(id) && state.activeTowel === id) {
    const otherId = id === 'towelA' ? 'towelB' : 'towelA';
    const other = state.consumables.find(x => x.id === otherId);
    state.activeTowel = otherId;
    if (other) other.startDate = todayStr();
  }
  saveState();
  renderAll();
  closeModal();
  toast(`${c.name} 已放入洗衣籃，等待清洗中`);
}
function handleConsumableReset(id) {
  const c = state.consumables.find(x => x.id === id);
  if (!c) return;
  if (isTowelId(id)) {
    const isActive = state.activeTowel === id;
    if (isActive) {
      c.history.unshift({ date: c.startDate });
      const other = id === 'towelA' ? 'towelB' : 'towelA';
      state.activeTowel = other;
      const otherC = state.consumables.find(x => x.id === other);
      otherC.startDate = todayStr();
      toast(`${c.name} 已丟進洗衣籃，換 ${otherC.name} 開始使用`);
    } else {
      state.activeTowel = id;
      c.startDate = todayStr();
      toast(`已切換為使用 ${c.name}`);
    }
  } else {
    c.history.unshift({ date: c.startDate });
    c.startDate = todayStr();
    toast(`${c.name} 已重新計算週期`);
  }
  saveState();
  renderConsumables();
  renderWishlist();
  renderNotifications();
}

/* ---------------------------- Laundry day (whole-basket cadence) ---------------------------- */
function nextWashDate() {
  const natural = addDays(state.laundry.lastWashDate, state.laundry.cycleDays);
  if (state.laundry.snoozedUntil && state.laundry.snoozedUntil > natural) return state.laundry.snoozedUntil;
  return natural;
}
function isLaundryDueToday() { return nextWashDate() <= todayStr(); }
function completeConsumableLaundry(c, date = todayStr()) {
  if (!c) return;
  c.history = Array.isArray(c.history) ? c.history : [];
  c.history.unshift({ date: c.laundryAt || date, washedDate: date, status: 'washed' });
  c.lastWashedDate = date;
  c.startDate = date;
  c.laundryPending = false;
  c.laundryAt = null;
}
function completeLaundryDone(targetDate = todayStr()) {
  const dirtyItems = state.items.filter(item => item.status === 'dirty');
  const pendingConsumables = getPendingLaundryConsumables();
  dirtyItems.forEach(item => recordItemWash(item, targetDate));
  pendingConsumables.forEach(c => completeConsumableLaundry(c, targetDate));
  recordLaundryEvent(targetDate, {
    boostedItemIds: dirtyItems.filter(i => i.extraWash).map(i => i.id),
    consumableIds: pendingConsumables.map(c => c.id)
  });
  if (!state.laundry.lastWashDate || targetDate >= state.laundry.lastWashDate) {
    state.laundry.lastWashDate = targetDate;
  }
  state.laundry.snoozedUntil = null;
  syncLatestLaundryDate();
  saveState();
  renderAll();
  toast(`已記錄 ${formatDayWithWeekday(targetDate)} 洗衣服完成`);
}
function markLaundryDone(targetDate = todayStr()) {
  const boostedItems = state.items.filter(item => item.status === 'dirty' && item.extraWash);
  if (boostedItems.length) {
    const names = boostedItems.slice(0, 8).map(item => item.name).join('、');
    const suffix = boostedItems.length > 8 ? ` 等 ${boostedItems.length} 件` : '';
    openConfirm('確認洗好了嗎？', `以下單品已標記「加強清洗」：${names}${suffix}。確認後會把加強清洗註記寫入單品歷史與洗衣歷史（日期：${formatDayWithWeekday(targetDate)}）。`, [
      { label: '先不要', kind: 'secondary', returnTo: 'modal-laundry' },
      { label: '確認洗好了', kind: 'primary', onClick: () => completeLaundryDone(targetDate) },
    ]);
    return false;
  }
  completeLaundryDone(targetDate);
  return true;
}
function postponeLaundry() {
  // postpone relative to *today* when overdue, not from a stale past date —
  // otherwise "postpone one day" from a week-overdue date doesn't actually
  // push the reminder past today at all.
  const base = nextWashDate() > todayStr() ? nextWashDate() : todayStr();
  state.laundry.snoozedUntil = addDays(base, 1);
  saveState();
  renderNotifications();
  toast('已延後一天洗衣');
}

/* ---------------------------- Notifications (derived) ---------------------------- */
function getNotifications() {
  const list = [];
  state.items.filter(i => i.status === 'dirty').forEach(i => {
    list.push({ type: 'item', id: i.id, text: `${i.name} 該洗了`, thumb: i });
  });
  state.consumables.forEach(c => {
    if (c.laundryPending) return;
    if (isTowelId(c.id) && state.activeTowel !== c.id) return; // standby towel: no reminder
    if (isOverdue(c)) list.push({ type: 'consumable', id: c.id, text: `${c.name} 已經用了 ${daysUsed(c)} 天，該更換了`, icon: c.icon });
  });
  const pendingConsumables = getPendingLaundryConsumables();
  if (isLaundryDueToday() || pendingConsumables.length) {
    const overdueDays = Math.max(0, daysBetween(nextWashDate(), todayStr()));
    const pendingText = pendingConsumables.length ? `洗衣籃有 ${pendingConsumables.length} 件耗材等待清洗` : '';
    list.push({ type: 'laundry', id: 'laundry', text: pendingText || (overdueDays > 0 ? `已經過了 ${overdueDays} 天沒洗衣服了` : '今天該洗衣服囉'), icon: 'basket' });
  }
  return list;
}

/* ============================================================
   RENDER
   ============================================================ */
function renderAll() {
  ensureNewDay();
  renderHeader();
  renderHome();
  renderHistory();
  renderWardrobe();
  renderConsumables();
  renderHairstyleSection();
  renderNotifications();
  renderWishlist();
  renderAvatar();
  renderCardImageScale();
}

function renderHeader() {
  document.getElementById('headerDate').textContent = fmtHeaderDate();
  document.getElementById('headerGreeting').textContent = state.profile.name ? `哈囉，${state.profile.name}` : '哈囉';
  const current = state.profile.weather?.current;
  const isNight = current && current.is_day != null ? Number(current.is_day) === 0 : (new Date().getHours() >= 18 || new Date().getHours() < 6);
  const app = document.getElementById('app');
  app.classList.toggle('is-night-view', isNight);
  document.documentElement.classList.toggle('night-page', isNight && document.documentElement.classList.contains('home-page'));
  document.body.classList.toggle('night-page', isNight && document.body.classList.contains('home-page'));
  syncHomeThemeColor(activeView === 'home', isNight);
  const sceneSky = document.getElementById('sceneSky');
  const weatherCode = Number(current?.weather_code);
  const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const snowCodes = [71, 73, 75, 77, 85, 86];
  const cloudyCodes = [2, 3, 45, 48];
  const isRain = rainCodes.includes(weatherCode);
  const isSnow = snowCodes.includes(weatherCode);
  const isCloudy = cloudyCodes.includes(weatherCode);
  sceneSky?.classList.toggle('is-night', isNight);
  sceneSky?.classList.toggle('is-rain', isRain);
  sceneSky?.classList.toggle('is-snow', isSnow);
  sceneSky?.classList.toggle('is-cloudy', isCloudy);
  sceneSky?.classList.toggle('is-clear', !isRain && !isSnow && !isCloudy);
  renderWeather();
}

function itemPhotoStyle(item) {
  return item.image ? `background-image:url('${item.image}');background-repeat:no-repeat;background-position:center;background-size:contain;background-color:transparent;` : 'background-color:transparent;';
}

const transparentCleanCache = new Map();
function cleanTransparentImage(imgUrl, callback) {
  if (!imgUrl || typeof imgUrl !== 'string') {
    if (callback) callback(imgUrl, false);
    return;
  }
  if (transparentCleanCache.has(imgUrl)) {
    if (callback) callback(transparentCleanCache.get(imgUrl), false);
    return;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) {
        transparentCleanCache.set(imgUrl, imgUrl);
        if (callback) callback(imgUrl, false);
        return;
      }
      const cvs = document.createElement('canvas');
      cvs.width = w; cvs.height = h;
      const ctx = cvs.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      const cornerIndices = [0, (w - 1) * 4, (w * (h - 1)) * 4, (w * h - 1) * 4];
      let whiteCorners = 0;
      let transCorners = 0;
      for (const idx of cornerIndices) {
        if (data[idx + 3] < 20) transCorners++;
        else if (data[idx] >= 230 && data[idx + 1] >= 230 && data[idx + 2] >= 230) whiteCorners++;
      }

      let modified = false;
      if (!(transCorners === 4 || (transCorners > 0 && whiteCorners === 0))) {
        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let qHead = 0, qTail = 0;
        const isWhite = (idx) => {
          if (data[idx + 3] < 20) return true;
          return data[idx] >= 230 && data[idx + 1] >= 230 && data[idx + 2] >= 230;
        };
        for (let x = 0; x < w; x++) {
          let p = x;
          if (isWhite(p * 4)) { visited[p] = 1; queue[qTail++] = p; }
          p = (h - 1) * w + x;
          if (isWhite(p * 4)) { visited[p] = 1; queue[qTail++] = p; }
        }
        for (let y = 0; y < h; y++) {
          let p = y * w;
          if (!visited[p] && isWhite(p * 4)) { visited[p] = 1; queue[qTail++] = p; }
          p = y * w + (w - 1);
          if (!visited[p] && isWhite(p * 4)) { visited[p] = 1; queue[qTail++] = p; }
        }
        while (qHead < qTail) {
          const p = queue[qHead++];
          const x = p % w;
          const y = (p / w) | 0;
          if (x > 0 && !visited[p - 1] && isWhite((p - 1) * 4)) { visited[p - 1] = 1; queue[qTail++] = p - 1; }
          if (x < w - 1 && !visited[p + 1] && isWhite((p + 1) * 4)) { visited[p + 1] = 1; queue[qTail++] = p + 1; }
          if (y > 0 && !visited[p - w] && isWhite((p - w) * 4)) { visited[p - w] = 1; queue[qTail++] = p - w; }
          if (y < h - 1 && !visited[p + w] && isWhite((p + w) * 4)) { visited[p + w] = 1; queue[qTail++] = p + w; }
        }
        for (let i = 0; i < w * h; i++) {
          if (visited[i]) {
            if (data[i * 4 + 3] !== 0) { data[i * 4 + 3] = 0; modified = true; }
          }
        }
        if (modified) {
          ctx.putImageData(imgData, 0, 0);
        }
      }

      // Auto-crop / trim transparent borders so cutout clothes have no empty margins
      let minX = w, maxX = -1, minY = h, maxY = -1;
      const latestData = ctx.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const a = latestData[(y * w + x) * 4 + 3];
          if (a > 20) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX >= minX && maxY >= minY) {
        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;
        if (minX > 3 || minY > 3 || maxX < w - 4 || maxY < h - 4) {
          const trimCvs = document.createElement('canvas');
          trimCvs.width = cropW;
          trimCvs.height = cropH;
          const trimCtx = trimCvs.getContext('2d');
          trimCtx.drawImage(cvs, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
          const cleanUrl = trimCvs.toDataURL('image/png');
          transparentCleanCache.set(imgUrl, cleanUrl);
          if (callback) callback(cleanUrl, true);
          return;
        }
      }

      if (modified) {
        const cleanUrl = cvs.toDataURL('image/png');
        transparentCleanCache.set(imgUrl, cleanUrl);
        if (callback) callback(cleanUrl, true);
      } else {
        transparentCleanCache.set(imgUrl, imgUrl);
        if (callback) callback(imgUrl, false);
      }
    } catch(e) {
      transparentCleanCache.set(imgUrl, imgUrl);
      if (callback) callback(imgUrl, false);
    }
  };
  img.onerror = () => {
    transparentCleanCache.set(imgUrl, imgUrl);
    if (callback) callback(imgUrl, false);
  };
  img.src = imgUrl;
}

const trimBoundsCache = new Map();
function getImageTrimBounds(imgUrl, callback) {
  if (!imgUrl) return;
  if (trimBoundsCache.has(imgUrl)) {
    callback(trimBoundsCache.get(imgUrl));
    return;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const cvs = document.createElement('canvas');
      const w = 100, h = Math.round(100 * (img.naturalHeight / img.naturalWidth || 1));
      cvs.width = w; cvs.height = h;
      const ctx = cvs.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let minX = w, maxX = 0, minY = h, maxY = 0;
      let found = false;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const a = data[idx + 3];
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          if (a > 25 && !(r > 246 && g > 246 && b > 246)) {
            found = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (found) {
        const bounds = {
          padTop: minY / h,
          padBottom: (h - 1 - maxY) / h,
          contentWidth: (maxX - minX + 1) / w,
          contentHeight: (maxY - minY + 1) / h
        };
        trimBoundsCache.set(imgUrl, bounds);
        callback(bounds);
      }
    } catch(e) {
      // ignore cross-origin security errors gracefully
    }
  };
  img.src = imgUrl;
}
function itemPhotoMarkup(item) {
  return item.image
    ? `<img class="item-photo-image" src="${escapeHtml(item.image)}" alt="" loading="lazy">`
    : thumbInner(item);
}
function calendarPhotoStyle(item) {
  const pos = item?.category === 'bottom' ? 'center top' : 'center bottom';
  return item?.image ? `background-image:url('${item.image}');background-repeat:no-repeat;background-position:${pos};background-size:contain;background-color:transparent;` : 'background-color:transparent;';
}
function thumbInner(item) {
  return item.image ? '' : (categoryIcon(item.category) || '');
}

const SIMPLE_ICONS_SLUGS_URL = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/slugs.md';
const SIMPLE_ICONS_CDN_URL = 'https://cdn.simpleicons.org/';
const BRAND_NAME_ALIASES = {
  '優衣庫': 'Uniqlo', 'ユニクロ': 'Uniqlo', '無印良品': 'Muji', '耐吉': 'Nike', '愛迪達': 'Adidas',
  '匡威': 'Converse', '新百倫': 'New Balance', '彪馬': 'Puma', '北面': 'The North Face',
  '迪卡儂': 'Decathlon', '古馳': 'Gucci', '香奈兒': 'Chanel', '路易威登': 'Louis Vuitton',
};
let brandIconCatalog = null;
let brandIconCatalogPromise = null;
let pendingBrandIcon = null;
let pendingBrandName = '';
function brandIconMarkup(item, size = 'tiny') {
  if (!item?.brandIcon) return '';
  return `<span class="brand-icon brand-icon-${size}"><img src="${escapeHtml(item.brandIcon)}" alt="" loading="lazy"></span>`;
}
function parseBrandSlugCatalog(markdown) {
  return String(markdown || '').split('\n').map(line => {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|/);
    return match ? { name: match[1].trim().replace(/`/g, ''), slug: match[2].trim() } : null;
  }).filter(Boolean);
}
async function loadBrandIconCatalog() {
  if (brandIconCatalog) return brandIconCatalog;
  if (!brandIconCatalogPromise) brandIconCatalogPromise = fetch(SIMPLE_ICONS_SLUGS_URL).then(r => { if (!r.ok) throw new Error('brand catalog failed'); return r.text(); }).then(parseBrandSlugCatalog).then(list => { brandIconCatalog = list; return list; });
  return brandIconCatalogPromise;
}
function brandSearchTerms(query) {
  const q = String(query || '').trim();
  const alias = BRAND_NAME_ALIASES[q] || '';
  return Array.from(new Set([q, alias, q.toLowerCase()].filter(Boolean)));
}
function findBrandIconMatches(query, catalog) {
  const terms = brandSearchTerms(query).map(t => t.toLowerCase());
  return catalog.map(entry => {
    const name = entry.name.toLowerCase();
    const score = Math.min(...terms.map(term => name === term ? 0 : name.startsWith(term) ? 1 : name.includes(term) ? 2 : 99));
    return { ...entry, score };
  }).filter(entry => entry.score < 99).sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)).slice(0, 8);
}
function renderBrandSelectedPreview() {
  const preview = document.getElementById('brandSelectedPreview');
  if (!preview) return;
  if (!pendingBrandIcon) { preview.classList.add('is-hidden'); preview.innerHTML = ''; return; }
  preview.classList.remove('is-hidden');
  preview.innerHTML = `${brandIconMarkup({ brandIcon: pendingBrandIcon }, 'medium')}<span>${escapeHtml(pendingBrandName || document.getElementById('fieldBrand')?.value.trim() || '')}</span><small>已選擇品牌圖示</small>`;
}
async function searchBrandIcons() {
  const input = document.getElementById('fieldBrand');
  const results = document.getElementById('brandSearchResults');
  const status = document.getElementById('brandSearchStatus');
  const query = input?.value.trim();
  if (!results || !status || !query) { if (status) status.textContent = '請先輸入品牌名稱。'; return; }
  results.innerHTML = '<p class="settings-helper">搜尋品牌圖示中…</p>';
  status.textContent = '正在從網路尋找品牌圖示…';
  try {
    const catalog = await loadBrandIconCatalog();
    const matches = findBrandIconMatches(query, catalog);
    results.innerHTML = matches.length ? matches.map((match, index) => `<button type="button" class="brand-search-result" data-brand-index="${index}"><span class="brand-icon brand-icon-small"><img src="${SIMPLE_ICONS_CDN_URL}${encodeURIComponent(match.slug)}" alt="" loading="lazy"></span><span><b>${escapeHtml(match.name)}</b><small>${escapeHtml(match.slug)}</small></span></button>`).join('') : '<p class="settings-helper">找不到相符圖示，仍可保存品牌文字。</p>';
    results._matches = matches;
    status.textContent = matches.length ? `找到 ${matches.length} 個相符品牌，點選一個即可套用。` : '沒有相符圖示；品牌名稱仍會正常保存。';
  } catch (error) {
    results.innerHTML = '<p class="settings-helper">品牌圖示搜尋暫時無法連線，仍可保存品牌文字。</p>';
    status.textContent = '搜尋失敗，請稍後再試。品牌欄位仍可正常保存。';
  }
}
function syncBrandForm(brand, brandIcon) {
  const input = document.getElementById('fieldBrand');
  const results = document.getElementById('brandSearchResults');
  const status = document.getElementById('brandSearchStatus');
  if (input) input.value = brand || '';
  pendingBrandName = brand || '';
  pendingBrandIcon = brandIcon || null;
  if (results) { results.innerHTML = ''; results._matches = []; }
  if (status) status.textContent = brandIcon ? '已載入這件單品的品牌圖示。' : '輸入品牌名稱後搜尋官方風格圖示。';
  renderBrandSelectedPreview();
}

function renderEstablishedBrandChips() {
  const wrap = document.getElementById('brandEstablishedWrap');
  const chips = document.getElementById('brandEstablishedChips');
  if (!wrap || !chips) return;
  const brandMap = new Map();
  state.items.forEach(it => {
    const b = (it.brand || '').trim();
    if (b && !brandMap.has(b.toLowerCase())) {
      brandMap.set(b.toLowerCase(), { brand: b, brandIcon: it.brandIcon });
    }
  });
  const list = Array.from(brandMap.values());
  if (list.length > 0) {
    wrap.hidden = false;
    chips.innerHTML = list.map(b => `
      <button type="button" class="brand-chip" data-brand="${escapeHtml(b.brand)}">
        ${b.brandIcon ? brandIconMarkup(b, 'tiny') : ''}
        <span>${escapeHtml(b.brand)}</span>
      </button>
    `).join('');
    chips.querySelectorAll('.brand-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const brandName = btn.dataset.brand;
        const found = list.find(x => x.brand === brandName);
        document.getElementById('fieldBrand').value = brandName;
        pendingBrandName = brandName;
        pendingBrandIcon = found?.brandIcon || null;
        formDirty = true;
        renderBrandSelectedPreview();
      });
    });
  } else {
    wrap.hidden = true;
  }
}

function renderAvatar() {
  const img = document.getElementById('avatarImage');
  const fallback = document.getElementById('avatarFallback');
  const btn = document.getElementById('btnSettings');
  const src = state.profile.avatar || '';
  if (img && fallback && btn) {
    img.hidden = !src;
    fallback.hidden = !!src;
    fallback.style.display = src ? 'none' : '';
    img.style.display = src ? 'block' : 'none';
    btn.classList.toggle('has-avatar', !!src);
    btn.setAttribute('aria-label', src ? '設定（已使用自訂頭像）' : '設定');
    if (src) img.src = src;
  }
  const sImg = document.getElementById('settingsAvatarImg');
  const sFallback = document.getElementById('settingsAvatarFallback');
  if (sImg && sFallback) {
    sImg.hidden = !src;
    sFallback.hidden = !!src;
    sFallback.style.display = src ? 'none' : '';
    sImg.style.display = src ? 'block' : 'none';
    if (src) sImg.src = src;
  }
  const clear = document.getElementById('btnClearAvatar');
  if (clear) clear.classList.toggle('is-hidden', !src);
}
function renderCardImageScale() {
  const value = Math.min(100, Math.max(45, Number(state.profile.cardImageScale) || 72));
  state.profile.cardImageScale = value;
  document.getElementById('app')?.style.setProperty('--card-image-size', `${value}%`);
  const slider = document.getElementById('cardImageScale');
  const output = document.getElementById('cardImageScaleValue');
  if (slider) slider.value = String(value);
  if (output) output.textContent = `${value}%`;
}
const WEATHER_LABELS = {
  0: ['晴朗', ''], 1: ['大致晴朗', ''], 2: ['局部多雲', ''], 3: ['陰天', ''],
  45: ['霧', ''], 48: ['霧', ''], 51: ['細雨', ''], 53: ['細雨', ''], 55: ['細雨', ''],
  56: ['冰雨', ''], 57: ['冰雨', ''], 61: ['小雨', ''], 63: ['中雨', ''], 65: ['大雨', ''],
  66: ['冰雨', ''], 67: ['冰雨', ''], 71: ['小雪', ''], 73: ['中雪', ''], 75: ['大雪', ''],
  77: ['雪粒', ''], 80: ['陣雨', ''], 81: ['陣雨', ''], 82: ['大陣雨', ''],
  85: ['陣雪', ''], 86: ['大陣雪', ''], 95: ['雷雨', ''], 96: ['雷雨', ''], 99: ['雷雨', ''],
};
function weatherText(code, isNight) {
  return WEATHER_LABELS[Number(code)] || ['天氣', ''];
}
function formatDisplayTemp(celsius) {
  if (!Number.isFinite(Number(celsius))) return '';
  const offset = Number(state.profile.weather?.tempOffset || 0);
  const adjustedC = Number(celsius) + offset;
  if (state.profile.weather?.tempUnit === 'F') {
    const f = Math.round(adjustedC * 9 / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(adjustedC)}°`;
}
function weatherAreaLabel(weather) {
  const raw = weather?.area || String(weather?.city || '').split(' · ')[0] || '';
  return raw || '桃園市中壢區';
}
function renderWeather() {
  const el = document.getElementById('sceneWeather');
  const sumEl = document.getElementById('settingsWeatherSummary');
  const w = state.profile.weather || {};
  const area = weatherAreaLabel(w);
  if (!w.city || !w.current) {
    const fallback = w.city ? `${area}・天氣更新中` : '設定地區後顯示天氣';
    if (el) el.textContent = fallback;
    if (sumEl) sumEl.textContent = fallback;
    return;
  }
  const isNight = w.current.is_day != null ? Number(w.current.is_day) === 0 : (new Date().getHours() >= 18 || new Date().getHours() < 6);
  const [label, symbol] = weatherText(w.current.weather_code, isNight);
  const temp = formatDisplayTemp(w.current.temperature_2m);
  const text = `${area}・${symbol} ${label}${temp ? ` ${temp}` : ''}`;
  if (el) el.textContent = text;
  if (sumEl) sumEl.textContent = text;
  updateWeatherPreview();
}
function syncWeatherSettings() {
  const input = document.getElementById('weatherCityInput');
  const status = document.getElementById('weatherStatus');
  const offsetInput = document.getElementById('weatherTempOffset');
  const offsetValue = document.getElementById('weatherTempOffsetValue');
  const btnUnitC = document.getElementById('btnTempUnitC');
  const btnUnitF = document.getElementById('btnTempUnitF');
  const w = state.profile.weather || {};
  if (input) input.value = w.city || '';
  if (status) {
    const area = weatherAreaLabel(w);
    status.textContent = w.city && w.current
      ? `目前地點：${area}・上次更新 ${new Date(w.updatedAt || Date.now()).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`
      : (w.city ? `目前地點：${area}・等待天氣資料` : '選擇城市或使用 GPS 定位後，景觀窗會顯示目前天氣。');
  }
  if (offsetInput && offsetValue) {
    const off = Number(w.tempOffset || 0);
    offsetInput.value = String(off);
    offsetValue.textContent = (off > 0 ? `+${off}` : `${off}`) + '°C';
  }
  if (btnUnitC && btnUnitF) {
    const isF = w.tempUnit === 'F';
    btnUnitC.classList.toggle('is-active', !isF);
    btnUnitF.classList.toggle('is-active', isF);
  }
  updateWeatherPreview();
}
const CITY_SEARCH_ALIASES = { '台北': 'Taipei', '臺北': 'Taipei', '中壢': 'Zhongli', '桃園': 'Taoyuan', '台中': 'Taichung', '臺中': 'Taichung', '台南': 'Tainan', '臺南': 'Tainan', '高雄': 'Kaohsiung', '新竹': 'Hsinchu', '基隆': 'Keelung', '香港': 'Hong Kong', '澳門': 'Macau' };
async function searchWeatherCities() {
  const input = document.getElementById('weatherCityInput');
  const results = document.getElementById('weatherSearchResults');
  const q = input?.value.trim();
  if (!results || !q || q.length < 2) { if (results) results.innerHTML = '<p class="settings-helper">請輸入至少兩個字再搜尋。</p>'; return; }
  results.innerHTML = '<p class="settings-helper">搜尋城市中…</p>';
  try {
    const terms = [q, CITY_SEARCH_ALIASES[q]].filter(Boolean);
    let locations = [];
    for (const term of terms) {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=6&language=zh&format=json`;
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = await response.json();
      locations = Array.isArray(data.results) ? data.results : [];
      if (locations.length) break;
    }
    results.innerHTML = locations.length ? locations.map((loc, i) => `<button type="button" class="weather-result" data-weather-index="${i}"><b>${escapeHtml(loc.name)}</b><span>${escapeHtml([loc.admin2 || loc.admin1, loc.country].filter(Boolean).join(' · '))}</span></button>`).join('') : '<p class="settings-helper">找不到這個城市，請換個名稱試試。</p>';
    results._locations = locations;
  } catch (e) {
    results.innerHTML = '<p class="settings-helper">城市搜尋暫時失敗，請確認網路後再試。</p>';
  }
}
async function selectWeatherLocation(location) {
  if (!location) return;
  const area = [location.admin1 || location.admin2, location.name].filter(Boolean).join('');
  const city = location.name;
  state.profile.weather = Object.assign(state.profile.weather || {}, {
    city,
    area: area || city,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone || 'auto',
    current: null,
    updatedAt: 0,
  });
  saveState({ action: `設定天氣城市為「${area || city}」` });
  syncWeatherSettings();
  renderHeader();
  await refreshWeather(true);
  updateWeatherPreview();
  toast(`已選擇「${area || city}」`);
}

let currentPreviewSceneIndex = 0;
const WEATHER_PREVIEW_SCENES = [
  { id: 'real', name: '即時真實天氣', isReal: true },
  { id: 'clear_day', name: '晴天・白天', label: '晴天', code: 0, is_day: 1, temp: 26, isNight: false, isRain: false, isCloudy: false, isClear: true },
  { id: 'clear_night', name: '晴天・夜晚', label: '晴朗夜晚', code: 0, is_day: 0, temp: 20, isNight: true, isRain: false, isCloudy: false, isClear: true },
  { id: 'cloudy_day', name: '陰天・白天', label: '陰天', code: 3, is_day: 1, temp: 22, isNight: false, isRain: false, isCloudy: true, isClear: false },
  { id: 'cloudy_night', name: '陰天・夜晚', label: '陰天夜晚', code: 3, is_day: 0, temp: 19, isNight: true, isRain: false, isCloudy: true, isClear: false },
  { id: 'rain_day', name: '雨天・白天', label: '小雨', code: 61, is_day: 1, temp: 21, isNight: false, isRain: true, isCloudy: true, isClear: false },
  { id: 'rain_night', name: '雨天・夜晚', label: '雨夜', code: 61, is_day: 0, temp: 18, isNight: true, isRain: true, isCloudy: true, isClear: false },
  { id: 'heavy_day', name: '大雨・白天', label: '大雨', code: 65, is_day: 1, temp: 19, isNight: false, isRain: true, isCloudy: true, isClear: false },
  { id: 'heavy_night', name: '大雨・夜晚', label: '大雨夜晚', code: 65, is_day: 0, temp: 17, isNight: true, isRain: true, isCloudy: true, isClear: false },
  { id: 'sun_shower', name: '晴時多雲偶陣雨', label: '晴時多雲偶陣雨', code: 80, is_day: 1, temp: 24, isNight: false, isRain: true, isCloudy: true, isClear: false },
];

function updateWeatherPreview() {
  const scene = WEATHER_PREVIEW_SCENES[currentPreviewSceneIndex];
  if (!scene) return;
  const sky = document.getElementById('weatherPreviewSky');
  const locEl = document.getElementById('weatherPreviewLocation');
  const weatherEl = document.getElementById('weatherPreviewWeather');
  const badgeEl = document.getElementById('weatherPreviewBadge');
  const btnApply = document.getElementById('btnApplyPreviewScene');
  const btnReset = document.getElementById('btnResetRealWeather');

  const w = state.profile.weather || {};
  const area = weatherAreaLabel(w);
  if (locEl) locEl.textContent = area;

  let isNight = false;
  let isRain = false;
  let isCloudy = false;
  let isClear = true;
  let weatherTextStr = '';
  let tempStr = '';

  if (scene.isReal) {
    const cur = w.current;
    if (cur) {
      isNight = cur.is_day != null ? Number(cur.is_day) === 0 : (new Date().getHours() >= 18 || new Date().getHours() < 6);
      const code = Number(cur.weather_code);
      const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
      const cloudyCodes = [2, 3, 45, 48];
      isRain = rainCodes.includes(code);
      isCloudy = cloudyCodes.includes(code);
      isClear = !isRain && !isCloudy;
      const [label, symbol] = weatherText(code, isNight);
      weatherTextStr = `${label}`;
      tempStr = formatDisplayTemp(cur.temperature_2m);
    } else {
      weatherTextStr = '正在載入氣象…';
      tempStr = '';
    }
  } else {
    isNight = !!scene.isNight;
    isRain = !!scene.isRain;
    isCloudy = !!scene.isCloudy;
    isClear = !!scene.isClear;
    weatherTextStr = scene.label;
    tempStr = formatDisplayTemp(scene.temp);
  }

  if (weatherEl) {
    weatherEl.textContent = `${weatherTextStr} ${tempStr}`.trim();
  }
  if (badgeEl) {
    const iconSvg = scene.isReal ? ICONS.refresh : scene.isNight ? ICONS.moon : scene.isRain ? ICONS.rain : scene.isCloudy ? ICONS.cloud : ICONS.sun;
    badgeEl.innerHTML = `<span class="icon-inline">${iconSvg}</span><span>${escapeHtml(scene.name)}</span>`;
  }

  if (sky) {
    sky.classList.toggle('is-night', isNight);
    sky.classList.toggle('is-rain', isRain);
    sky.classList.toggle('is-cloudy', isCloudy);
    sky.classList.toggle('is-clear', isClear);
  }

  const dotsContainer = document.getElementById('weatherPreviewDots');
  if (dotsContainer) {
    dotsContainer.innerHTML = WEATHER_PREVIEW_SCENES.map((s, i) =>
      `<span class="weather-dot ${i === currentPreviewSceneIndex ? 'is-active' : ''}" data-index="${i}" title="${escapeHtml(s.name)}"></span>`
    ).join('');
    dotsContainer.querySelectorAll('.weather-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        currentPreviewSceneIndex = Number(dot.dataset.index);
        updateWeatherPreview();
      });
    });
  }

  const isCurrentActive = scene.isReal ? !state.weatherSimulation : state.weatherSimulation === scene.id;
  if (btnApply) {
    if (isCurrentActive) {
      btnApply.innerHTML = `<span class="icon-inline">${ICONS.check}</span> 目前首頁已套用此場景`;
      btnApply.classList.add('is-active-btn');
    } else {
      btnApply.textContent = scene.isReal ? '套用即時真實天氣至首頁' : `套用「${scene.name}」至主頁`;
      btnApply.classList.remove('is-active-btn');
    }
  }
  if (btnReset) {
    btnReset.classList.toggle('is-hidden', !state.weatherSimulation);
  }
}
async function refreshWeather(force = false) {
  if (state.weatherSimulation && !force) {
    renderWeather();
    return;
  }
  if (force && state.weatherSimulation) {
    state.weatherSimulation = null;
  }
  const w = state.profile.weather || {};
  if (w.latitude == null || w.longitude == null) { syncWeatherSettings(); renderWeather(); return; }
  if (!force && w.current && Date.now() - Number(w.updatedAt || 0) < 30 * 60 * 1000) { renderWeather(); return; }
  const status = document.getElementById('weatherStatus');
  if (status) status.textContent = `${w.city}・正在更新天氣…`;
  try {
    const params = new URLSearchParams({ latitude: String(w.latitude), longitude: String(w.longitude), current: 'temperature_2m,weather_code,is_day,relative_humidity_2m', timezone: 'auto' });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error('forecast failed');
    const data = await response.json();
    state.profile.weather = { ...w, timezone: data.timezone || w.timezone || 'auto', current: data.current || null, updatedAt: Date.now() };
    saveState();
    renderHeader();
    syncWeatherSettings();
  } catch (e) {
    if (status) status.textContent = `${w.city}・天氣暫時無法更新，稍後可再試。`;
    renderWeather();
  }
}

function syncHomeRackExpansion() {
  const main = document.getElementById('mainScroll');
  const app = document.getElementById('app');
  if (!main || !app) return;
  const isHome = document.getElementById('view-home')?.classList.contains('is-active');
  app.classList.toggle('home-racks-expanded', !!isHome && main.scrollTop > 28);
}
function renderHome() {
  syncHomeRackExpansion();
  ['hat', 'top', 'bottom', 'shoes'].forEach(slot => {
    const btn = document.querySelector(`.figure-slot[data-slot="${slot}"]`);
    if (!btn) return;
    const thumb = btn.querySelector('.figure-thumb');
    const itemId = state.today[slot];
    const item = itemId ? findItem(itemId) : null;
    const layout = (state.profile.outfitLayout && state.profile.outfitLayout[slot]) || OUTFIT_LAYOUT_DEFAULTS[slot];
    const isShorts = slot === 'bottom' && isShortsItem(item);
    const ratio = isShorts ? 1.15 : (HOME_SLOT_RATIOS[slot] || getCategoryAspectRatio(slot));
    if (item) {
      btn.classList.remove('is-transparent-slot');
      btn.classList.add('is-filled');
      btn.classList.toggle('has-photo', !!item.image);
      btn.classList.toggle('is-shorts', isShorts);
      const pos = (slot === 'top' || slot === 'hat') ? 'center bottom' : 'center top';
      const cleanImg = transparentCleanCache.get(item.image) || item.image;
      const bgStyle = cleanImg
        ? `background-image:url('${cleanImg}');background-repeat:no-repeat;background-position:${pos};background-size:contain;background-color:transparent;aspect-ratio:${ratio};`
        : `aspect-ratio:${ratio};background-color:transparent;`;
      thumb.setAttribute('style', bgStyle);
      thumb.style.transform = `translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
      thumb.style.transformOrigin = 'center center';
      thumb.innerHTML = thumbInner(item);
      btn.setAttribute('aria-label', item.name);

      if (item.image) {
        cleanTransparentImage(item.image, (cleanUrl, changed) => {
          if (changed) {
            item.image = cleanUrl;
            saveState();
          }
          thumb.style.backgroundImage = `url('${cleanUrl}')`;
          thumb.style.backgroundColor = 'transparent';
        });
      }

      if (item.image && (slot === 'top' || slot === 'bottom')) {
        getImageTrimBounds(item.image, bounds => {
          let extraY = 0;
          if (slot === 'top' && bounds.padBottom > 0.02) {
            extraY = Math.round(bounds.padBottom * 30);
          } else if (slot === 'bottom' && bounds.padTop > 0.02) {
            extraY = -Math.round(bounds.padTop * 30);
          }
          const baseScale = layout.scale / 100;
          thumb.style.transform = `translate(${layout.x}%, calc(${layout.y}% + ${extraY}px)) scale(${baseScale})`;
        });
      }
    } else {
      btn.classList.remove('is-filled', 'has-photo');
      if (slot === 'hat') {
        btn.classList.add('is-transparent-slot');
        thumb.setAttribute('style', `aspect-ratio:${ratio};background-color:transparent;`);
        thumb.style.transform = `translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
        thumb.innerHTML = '';
      } else {
        btn.classList.remove('is-transparent-slot');
        thumb.setAttribute('style', `aspect-ratio:${ratio};background-color:transparent;`);
        thumb.style.transform = `translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
        thumb.innerHTML = ICONS[slot] || '';
      }
      btn.setAttribute('aria-label', btn.getAttribute('data-label'));
    }
  });

  const boardScale = Math.min(140, Math.max(70, Number(state.profile?.figureBoardScale) || 100));
  document.documentElement.style.setProperty('--figure-board-scale', (boardScale / 100).toFixed(2));

  const boardEl = document.getElementById('figureBoard');
  if (boardEl) {
    let maxRatio = 0.82;
    const equipped = ['top', 'bottom', 'shoes', 'hat'].map(s => state.today[s] ? findItem(state.today[s]) : null).filter(Boolean);
    const hasPhotoItem = equipped.some(it => !!it.image);
    if (hasPhotoItem) {
      equipped.forEach(it => {
        if (it.image && trimBoundsCache.has(it.image)) {
          const b = trimBoundsCache.get(it.image);
          if (b && b.contentWidth) {
            maxRatio = Math.max(maxRatio, b.contentWidth);
          }
        }
      });
      const snugW = Math.round(Math.min(142, Math.max(116, 134 * maxRatio + 12)));
      boardEl.style.setProperty('--figure-board-width', snugW + 'px');
    } else {
      boardEl.style.removeProperty('--figure-board-width');
    }
  }

  const outerItem = state.today.outer ? findItem(state.today.outer) : null;
  const accItem = state.today.accessory ? findItem(state.today.accessory) : null;
  const hintParts = [];
  if (outerItem) hintParts.push(`外套：${outerItem.name}`);
  if (accItem) hintParts.push(`配件：${accItem.name}`);
  const extrasButton = document.getElementById('figureExtrasLink');
  if (extrasButton) {
    const extrasLabel = hintParts.length ? hintParts.join('、') : '選擇外套或配件';
    extrasButton.setAttribute('aria-label', extrasLabel);
    extrasButton.title = extrasLabel;
  }
  const outerBadge = document.getElementById('extrasOuterBadge');
  if (outerBadge) {
    outerBadge.hidden = !state.today.outer;
  }

  const rack = state.items.filter(i => i.status === 'resting');
  const basket = state.items.filter(i => i.status === 'dirty');
  const pendingConsumables = getPendingLaundryConsumables();
  renderChipList('tempRackList', 'tempRackEmpty', rack, { pinActiveTowel: false });
  renderChipList('basketList', 'basketEmpty', basket, { pendingConsumables, isLaundry: true });
  const daysSinceWash = Math.max(0, daysBetween(state.laundry.lastWashDate, todayStr()));
  const totalBasketCount = basket.length + pendingConsumables.length;
  document.getElementById('basketTitle').textContent = `洗衣籃・${daysSinceWash}天`;
  const basketBadge = document.getElementById('basketBadge');
  if (basketBadge) {
    basketBadge.textContent = totalBasketCount > 0 ? String(totalBasketCount) : '';
    basketBadge.style.display = totalBasketCount > 0 ? 'inline-flex' : 'none';
  }
  const rackCount = rack.length;
  const rackTitle = document.getElementById('rackTitle') || document.querySelector('#card-rack .rack-title');
  if (rackTitle) rackTitle.textContent = '暫存衣架';
  const rackBadge = document.getElementById('rackBadge');
  if (rackBadge) {
    rackBadge.textContent = rackCount > 0 ? String(rackCount) : '';
    rackBadge.style.display = rackCount > 0 ? 'inline-flex' : 'none';
  }
}
function renderChipList(listId, emptyId, items, opts) {
  const list = document.getElementById(listId);
  const empty = document.getElementById(emptyId);
  list.innerHTML = '';

  if (opts && opts.pinActiveTowel) {
    const towel = state.consumables.find(c => c.id === state.activeTowel);
    if (towel) {
      const chip = document.createElement('button');
      chip.className = 'rack-chip is-pinned';
      chip.type = 'button';
      const towelImg = consumableImage(towel);
      const thumbHtml = towelImg ? `<img src="${towelImg}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` : (ICONS[towel.icon] || '');
      chip.innerHTML = `<span class="rack-chip-thumb">${thumbHtml}</span><span class="rack-chip-text">${escapeHtml(towel.name)}・已用 ${daysUsed(towel)} 天</span>`;
      chip.addEventListener('click', e => { e.stopPropagation(); openConsumableDetail(towel.id); });
      list.appendChild(chip);
    }
  }

  if (opts && Array.isArray(opts.pendingConsumables)) {
    opts.pendingConsumables.forEach(c => {
      const chip = document.createElement('button');
      chip.className = 'rack-chip rack-chip-consumable';
      chip.type = 'button';
      chip.innerHTML = `<span class="rack-chip-thumb">${ICONS[c.icon] || ''}</span><span class="rack-chip-text">${escapeHtml(c.name)}・等待清洗中</span>`;
      chip.addEventListener('click', e => { e.stopPropagation(); openConsumableDetail(c.id); });
      list.appendChild(chip);
    });
  }

  if (!items.length && !list.children.length) {
    empty.hidden = false;
    empty.style.display = 'block';
    return;
  }
  empty.hidden = true;
  empty.style.display = 'none';
  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'rack-chip';
    chip.type = 'button';
    const thumb = item.image
      ? `<img class="rack-chip-thumb" src="${item.image}" alt="">`
      : `<span class="rack-chip-thumb">${categoryIcon(item.category)}</span>`;
    
    let textHtml = '';
    if (opts && opts.isLaundry) {
      const wornDates = (item.wearHistory || []).filter(d => !item.lastWashedDate || d > item.lastWashedDate);
      const daysWorn = wornDates.length > 0 ? new Set(wornDates).size : (item.wearCount || 1);
      textHtml = `${escapeHtml(item.name)}・已穿 ${daysWorn} 天`;
    } else {
      textHtml = `${escapeHtml(item.name)}（${item.wearCount || 0}次）`;
    }
    chip.innerHTML = `${thumb}<span class="rack-chip-text">${textHtml}</span>`;
    chip.addEventListener('click', e => { e.stopPropagation(); openItemDetail(item.id); });
    list.appendChild(chip);
  });
}
function openRackOverview() {
  const grid = document.getElementById('rackOverviewGrid');
  const empty = document.getElementById('rackOverviewEmpty');
  const items = state.items.filter(i => i.status === 'resting');
  grid.innerHTML = '';
  empty.hidden = items.length !== 0;

  const pinnedWrap = document.getElementById('rackOverviewPinnedTowel');
  if (pinnedWrap) {
    pinnedWrap.innerHTML = '';
    pinnedWrap.hidden = true;
  }

  items.forEach(item => grid.appendChild(buildItemCard(item, { rackMode: true, returnTo: 'modal-rack-overview' })));
  openModal('modal-rack-overview');
}

/* ---- Wardrobe tab ---- */
let uiWardrobeCat = 'all';
let uiWardrobeSort = 'recent';
let uiWardrobeFilters = { status: 'all', tags: [], colors: [], brands: [], invert: false };
let uiSearchQuery = '';
let uiSelectMode = false;
let uiSelectedIds = new Set();

function allTagsUsed() {
  const set = new Set();
  state.items.forEach(i => (i.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-Hant'));
}
function isFilterActive() {
  return uiWardrobeFilters.status !== 'all' ||
    uiWardrobeFilters.tags.length > 0 ||
    uiWardrobeFilters.colors.length > 0 ||
    uiWardrobeFilters.brands.length > 0 ||
    uiWardrobeFilters.invert;
}
function itemMatchesSearch(item, q) {
  if (!q) return true;
  const hay = [
    item.name,
    item.brand || '',
    item.color || '',
    item.colorFamily || '',
    item.price != null ? String(item.price) : '',
    fmtDate(item.purchaseDate || ''),
    fmtDate(item.lastWornDate || ''),
    (item.tags || []).join(' '),
    categoryLabel(item.category),
  ].join(' ').toLowerCase();
  return hay.includes(q.toLowerCase());
}

function renderCategoryChips() {
  const row = document.getElementById('categoryChips');
  row.innerHTML = '';
  const defs = [{ id: 'all', label: '全部' }]
    .concat(allCategoryIds().map(id => ({ id, label: categoryLabel(id) })))
    .concat([{ id: 'retired', label: '典藏' }]);
  defs.forEach(d => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (uiWardrobeCat === d.id ? ' is-active' : '');
    chip.textContent = d.label;
    chip.addEventListener('click', () => { uiWardrobeCat = d.id; renderCategoryChips(); renderWardrobe(); });
    row.appendChild(chip);
  });
  const addChip = document.createElement('button');
  addChip.type = 'button';
  addChip.className = 'chip chip-add';
  addChip.textContent = '+ 新增分類';
  addChip.addEventListener('click', () => openModal('modal-category'));
  row.appendChild(addChip);
}

function itemMatchesFilters(item) {
  const hasStatus = uiWardrobeFilters.status !== 'all';
  const hasTags = uiWardrobeFilters.tags.length > 0;
  const hasColors = uiWardrobeFilters.colors.length > 0;
  const hasBrands = uiWardrobeFilters.brands.length > 0;

  if (!hasStatus && !hasTags && !hasColors && !hasBrands) return true;

  const statusMatch = !hasStatus || item.status === uiWardrobeFilters.status;
  const tagMatch = !hasTags || uiWardrobeFilters.tags.every(t => (item.tags || []).includes(t));
  const colorMatch = !hasColors || (
    (item.colorFamily && uiWardrobeFilters.colors.includes(item.colorFamily)) ||
    (item.color && uiWardrobeFilters.colors.includes(item.color))
  );
  const brandMatch = !hasBrands || (
    item.brand && uiWardrobeFilters.brands.includes(item.brand)
  );

  const matched = statusMatch && tagMatch && colorMatch && brandMatch;
  if (uiWardrobeFilters.invert) {
    return !matched;
  }
  return matched;
}

function getVisibleWardrobeItems() {
  let items = state.items.filter(i => {
    if (uiWardrobeCat === 'all') { if (i.status === 'retired') return false; }
    else if (uiWardrobeCat === 'retired') { if (i.status !== 'retired') return false; }
    else { if (i.category !== uiWardrobeCat || i.status === 'retired') return false; }
    if (!itemMatchesFilters(i)) return false;
    if (!itemMatchesSearch(i, uiSearchQuery)) return false;
    return true;
  });
  return items.slice().sort((a, b) => {
    if (uiWardrobeSort === 'wearCount') return (b.wearCount||0) - (a.wearCount||0);
    if (uiWardrobeSort === 'lastWorn') return (b.lastWornDate||'').localeCompare(a.lastWornDate||'');
    if (uiWardrobeSort === 'name') return a.name.localeCompare(b.name, 'zh-Hant');
    return (b.createdAt||0) - (a.createdAt||0);
  });
}
function renderWardrobe() {
  const grid = document.getElementById('wardrobeGrid');
  const emptyHint = document.getElementById('wardrobeEmpty');
  const items = getVisibleWardrobeItems();
  const retiredView = uiWardrobeCat === 'retired';
  document.getElementById('view-wardrobe').classList.toggle('is-retired-view', retiredView);
  document.getElementById('mainScroll')?.classList.toggle('is-retired-scroll', retiredView && activeView === 'wardrobe');
  document.getElementById('app')?.classList.toggle('is-retired-view', retiredView && activeView === 'wardrobe');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    if (retiredView && activeView === 'wardrobe') {
      themeMeta.content = '#D8B45B';
    } else {
      const current = state.profile.weather?.current;
      const isNight = current && current.is_day != null ? Number(current.is_day) === 0 : (new Date().getHours() >= 18 || new Date().getHours() < 6);
      themeMeta.content = isNight ? '#232C48' : '#CFE0F5';
    }
  }
  const retiredBanner = document.getElementById('retiredBanner');
  if (retiredBanner) retiredBanner.hidden = !retiredView;
  document.getElementById('itemCount').textContent = retiredView ? `典藏・${items.length} 件` : `${items.length} 件`;
  document.getElementById('filterBadge').hidden = !isFilterActive();
  grid.innerHTML = '';
  emptyHint.hidden = items.length !== 0 || uiWardrobeCat !== 'all' || isFilterActive() || !!uiSearchQuery;
  items.forEach(item => grid.appendChild(buildItemCard(item)));
  document.getElementById('deleteCategoryWrap').classList.toggle('is-hidden', !uiWardrobeCat.startsWith('custom-'));
}
function toggleItemSelection(id, cardEl) {
  if (uiSelectedIds.has(id)) uiSelectedIds.delete(id); else uiSelectedIds.add(id);
  const isSelected = uiSelectedIds.has(id);
  const countEl = document.getElementById('selectCount');
  if (countEl) countEl.textContent = `已選 ${uiSelectedIds.size} 件`;
  const btnAll = document.getElementById('btnSelectAll');
  if (btnAll) {
    const visible = getVisibleWardrobeItems();
    const allSelected = visible.length > 0 && visible.every(i => uiSelectedIds.has(i.id));
    btnAll.textContent = allSelected ? '取消全選' : '全選';
  }
  const el = cardEl || document.querySelector(`.item-card[data-id="${id}"]`);
  if (el) {
    el.classList.toggle('is-selected', isSelected);
  }
}
function washHistoryEntry(entry) {
  if (typeof entry === 'string') return { date: entry, basketAt: null, extraWash: false };
  return { date: entry?.date || '', basketAt: entry?.basketAt || null, extraWash: !!entry?.extraWash };
}
function washBoostMarkup(item, opts) {
  if (!opts || (!opts.laundryMode && !opts.rackMode) || !['dirty', 'resting'].includes(item.status)) return '';
  const active = !!item.extraWash;
  return `<span class="wash-boost-toggle${active ? ' is-active' : ''}" data-wash-boost="${escapeHtml(item.id)}" role="button" tabindex="0" aria-pressed="${active}" title="${active ? '取消加強清洗' : '標記加強清洗'}"><span class="wash-boost-icon">${ICONS.washBoost}</span><span>${active ? '已標記加強清洗' : '加強清洗'}</span></span>`;
}
function buildItemCard(item, opts) {
  opts = opts || {};
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'item-card';
  card.dataset.id = item.id;
  card.dataset.category = item.category || '';
  const statusClass = item.status === 'dirty' ? 'is-dirty' : item.status === 'resting' ? 'is-resting' : '';
  const selected = uiSelectMode && uiSelectedIds.has(item.id);
  if (uiSelectMode) card.classList.add('is-selectable');
  if (selected) card.classList.add('is-selected');
  const activityMeta = item.status === 'resting' && item.restingSince
    ? `（${fmtDate(item.restingSince)} 開始）`
    : item.status === 'dirty' && item.basketAt
      ? `（${fmtDate(item.basketAt)} 入籃）`
      : '';

  let infoHtml = '';
  if (opts && opts.laundryMode) {
    const wornDates = (item.wearHistory || []).filter(d => !item.lastWashedDate || d > item.lastWashedDate);
    const daysWorn = wornDates.length > 0 ? new Set(wornDates).size : (item.wearCount || 1);
    const lastWashStr = item.lastWashedDate ? fmtDate(item.lastWashedDate) : (item.washHistory && item.washHistory[0]?.date ? fmtDate(item.washHistory[0].date) : '無紀錄');
    infoHtml = `
      ${item.brand ? `<p class="item-brand">${brandIconMarkup(item, 'tiny')}<span>${escapeHtml(item.brand)}</span></p>` : ''}
      <p class="item-name">${escapeHtml(item.name)}</p>
      <div class="laundry-item-meta">
        <span class="lim-days">已穿 ${daysWorn} 天</span>
        <span class="lim-icon">${ICONS.sparkles || ''}</span>
        <span class="lim-wash">上次洗：${lastWashStr}</span>
      </div>
      ${washBoostMarkup(item, opts)}
    `;
  } else {
    infoHtml = `
      ${item.brand ? `<p class="item-brand">${brandIconMarkup(item, 'tiny')}<span>${escapeHtml(item.brand)}</span></p>` : ''}
      <p class="item-name">${escapeHtml(item.name)}</p>
      <p class="item-wear">穿了 ${item.wearCount||0} 次${activityMeta}</p>
      ${washBoostMarkup(item, opts)}
    `;
  }

  card.innerHTML = `
    <div class="item-photo">${itemPhotoMarkup(item)}</div>
    ${uiSelectMode ? `<span class="item-card-check"></span>` : (item.status !== 'retired' ? `<span class="item-status-dot ${statusClass}"></span>` : '')}
    <div class="item-info">
      ${infoHtml}
    </div>`;

  let longPressTimer = null;
  let longPressFired = false;
  card.addEventListener('touchstart', () => {
    longPressFired = false;
    longPressTimer = setTimeout(() => {
      longPressFired = true;
      if (navigator.vibrate) navigator.vibrate(10);
      if (!uiSelectMode) openAddModal(item.id);
    }, 550);
  }, { passive: true });
  const cancelLongPress = () => clearTimeout(longPressTimer);
  card.addEventListener('touchmove', cancelLongPress, { passive: true });
  card.addEventListener('touchend', cancelLongPress);
  card.addEventListener('touchcancel', cancelLongPress);

  const boostToggle = card.querySelector('[data-wash-boost]');
  if (boostToggle) {
    const stopBoostEvent = e => {
      e.preventDefault();
      e.stopPropagation();
      toggleExtraWash(item.id);
    };
    boostToggle.addEventListener('click', stopBoostEvent);
    boostToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') stopBoostEvent(e); });
  }
  card.addEventListener('click', () => {
    if (longPressFired) { longPressFired = false; return; }
    if (opts.onClick) { opts.onClick(item); return; }
    if (uiSelectMode) toggleItemSelection(item.id, card);
    else {
      if (opts.returnTo) modalReturnTo = opts.returnTo;
      else if (opts.laundryMode) modalReturnTo = 'modal-laundry';
      else if (opts.rackMode) modalReturnTo = 'modal-rack-overview';
      openItemDetail(item.id);
    }
  });
  return card;
}

/* ---- History tab ---- */
let uiCalMonth = (() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; })();
let uiRankPeriod = 'all'; // 'all' | 'month' | '30d'
let uiRankCategory = 'all'; // 'all' | 'top' | 'bottom' | 'outer' | 'shoes' | 'hat' | 'accessory'

function allOotdEntries() {
  const today = todayStr();
  const entries = (state.ootdHistory || []).filter(e => e.date !== today).slice();
  if (ALL_SLOTS.some(s => state.today[s])) {
    entries.push({ ...state.today, date: today });
  }
  return entries;
}

function getAdjacentMonth(y, m, offset) {
  let ny = y, nm = m + offset;
  while (nm < 0) { nm += 12; ny--; }
  while (nm > 11) { nm -= 12; ny++; }
  return { y: ny, m: nm };
}

function renderMonthGrid(grid, y, m) {
  if (!grid) return;
  grid.innerHTML = '';
  const firstDay = new Date(y, m, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const entries = allOotdEntries();
  const byDate = {};
  entries.forEach(e => { if (e.date) (byDate[e.date] = byDate[e.date] || []).push(e); });
  const today = todayStr();
  const laundryDays = laundryHistoryDates();
  if (state.laundry?.lastWashDate) laundryDays.add(state.laundry.lastWashDate);
  const extraWashDays = laundryExtraWashDates();
  const towelDays = new Set(
    state.consumables.filter(c => isTowelId(c.id)).flatMap(c => (c.history || []).map(h => h.date))
  );

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-cell is-empty';
    grid.appendChild(empty);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cal-cell';
    if (dateStr === today) cell.classList.add('is-today');
    const dayEntries = byDate[dateStr];
    let thumbsHtml = '';
    if (dayEntries && dayEntries.length) {
      cell.classList.add('has-ootd');
      const entry = dayEntries[0];
      const bottomItem = entry.bottom ? findItem(entry.bottom) : null;
      const isShorts = isShortsItem(bottomItem);
      const thumbItems = [
        { item: entry.top ? findItem(entry.top) : null, className: 'cal-thumb-top' },
        { item: bottomItem, className: isShorts ? 'cal-thumb-bottom is-shorts' : 'cal-thumb-bottom' },
      ].filter(({ item }) => item);
      thumbsHtml = `<span class="cal-thumbs">${thumbItems.map(({ item, className }) => {
        const cleanImg = transparentCleanCache.get(item.image) || item.image;
        const pos = className.includes('cal-thumb-bottom') ? 'center top' : 'center bottom';
        const style = cleanImg ? `background-image:url('${cleanImg}');background-repeat:no-repeat;background-position:${pos};background-size:contain;background-color:transparent;` : 'background-color:transparent;';
        return `<span class="cal-thumb ${className}" style="${style}">${cleanImg ? '' : categoryIcon(item.category)}</span>`;
      }).join('')}</span>`;
    }
    let dotsHtml = '';
    if (laundryDays.has(dateStr)) dotsHtml += `<span class="cal-event-dot cal-dot-laundry"></span>`;
    if (extraWashDays.has(dateStr)) dotsHtml += `<span class="cal-event-dot cal-dot-laundry-boost" style="right:14px"></span>`;
    if (towelDays.has(dateStr)) {
      const towelRight = laundryDays.has(dateStr) ? (extraWashDays.has(dateStr) ? '24px' : '14px') : '';
      dotsHtml += `<span class="cal-event-dot cal-dot-towel" style="${towelRight ? `right:${towelRight}` : ''}"></span>`;
    }
    cell.innerHTML = `<span class="cal-num">${d}</span>${dotsHtml}${thumbsHtml}`;
    if (dayEntries && dayEntries.length) cell.addEventListener('click', () => openDayDetail(dateStr, dayEntries[0]));
    else cell.addEventListener('click', () => openBackfillModal(dateStr));
    grid.appendChild(cell);
  }
}

function renderHistory() {
  document.getElementById('calTitle').textContent = `${uiCalMonth.y} 年 ${uiCalMonth.m + 1} 月`;
  const prevMonth = getAdjacentMonth(uiCalMonth.y, uiCalMonth.m, -1);
  const nextMonth = getAdjacentMonth(uiCalMonth.y, uiCalMonth.m, 1);
  renderMonthGrid(document.getElementById('calGridPrev'), prevMonth.y, prevMonth.m);
  renderMonthGrid(document.getElementById('calGrid'), uiCalMonth.y, uiCalMonth.m);
  renderMonthGrid(document.getElementById('calGridNext'), nextMonth.y, nextMonth.m);
  renderCalStats();
  renderRank();
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
function formatDayWithWeekday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = WEEKDAYS[d.getDay()];
  const isToday = dateStr === todayStr();
  return `${m}月${day}日 (${w}${isToday ? ' · 今天' : ''})`;
}

function renderCalStats() {
  const y = uiCalMonth.y, m = uiCalMonth.m;
  const prefix = `${y}-${String(m+1).padStart(2,'0')}`;
  const entries = allOotdEntries().filter(e => e.date && e.date.startsWith(prefix));
  const daysLogged = new Set(entries.map(e => e.date)).size;
  const wearCount = {};
  let slotFillTotal = 0;
  entries.forEach(e => {
    ALL_SLOTS.forEach(s => { if (e[s]) { wearCount[e[s]] = (wearCount[e[s]]||0) + 1; slotFillTotal++; } });
  });
  let topId = null, topCount = 0;
  Object.entries(wearCount).forEach(([id, c]) => { if (c > topCount) { topCount = c; topId = id; } });
  const topItem = topId ? findItem(topId) : null;
  const activeItemsCount = state.items.filter(i => i.status !== 'retired').length;
  const wornThisMonth = new Set(entries.flatMap(e => ALL_SLOTS.map(s => e[s]).filter(Boolean))).size;
  const utilization = activeItemsCount ? Math.round(wornThisMonth / activeItemsCount * 100) : 0;
  const avgPerOutfit = daysLogged ? (slotFillTotal / daysLogged).toFixed(1) : '0';

  const stats = [
    { label: '本月穿搭天數', value: `${daysLogged}<small> 天</small>` },
    { label: '最常穿單品', value: topItem ? `${escapeHtml(topItem.name)}<small>（${topCount} 次）</small>` : '—' },
    { label: '衣櫥使用率', value: `${utilization}<small>%</small>` },
    { label: '平均每套件數', value: `${avgPerOutfit}<small> 件</small>` },
  ];
  document.getElementById('calStats').innerHTML = stats.map(s =>
    `<div class="cal-stat-card"><p class="cs-label">${s.label}</p><p class="cs-value">${s.value}</p></div>`
  ).join('');
}

function renderRank() {
  const list = document.getElementById('rankList');
  const statsWrap = document.getElementById('rankStats');
  const entries = allOotdEntries();
  const today = todayStr();
  const monthPrefix = `${uiCalMonth.y}-${String(uiCalMonth.m + 1).padStart(2, '0')}`;

  // Filter entries by period
  let periodEntries = entries;
  const customRangeRow = document.getElementById('rankCustomRangeRow');
  if (customRangeRow) customRangeRow.hidden = uiRankPeriod !== 'custom';

  if (uiRankPeriod === 'month') {
    periodEntries = entries.filter(e => e.date?.startsWith(monthPrefix));
  } else if (uiRankPeriod === '30d') {
    periodEntries = entries.filter(e => e.date && daysBetween(e.date, today) <= 30);
  } else if (uiRankPeriod === 'custom') {
    const sDate = document.getElementById('rankStartDate')?.value;
    const eDate = document.getElementById('rankEndDate')?.value;
    periodEntries = entries.filter(e => {
      if (!e.date) return false;
      if (sDate && e.date < sDate) return false;
      if (eDate && e.date > eDate) return false;
      return true;
    });
  }

  // Count wear per item in this period
  const periodWearCounts = {};
  periodEntries.forEach(e => {
    ALL_SLOTS.forEach(slot => {
      const itemId = e[slot];
      if (itemId) periodWearCounts[itemId] = (periodWearCounts[itemId] || 0) + 1;
    });
  });

  // Filter items by category
  let itemsToRank = state.items.filter(i => i.status !== 'retired');
  if (uiRankCategory !== 'all') {
    itemsToRank = itemsToRank.filter(i => i.category === uiRankCategory);
  }

  // Attach wear count and filter > 0
  const ranked = itemsToRank.map(item => ({
    item,
    count: uiRankPeriod === 'all' ? (item.totalWearCount || 0) : (periodWearCounts[item.id] || 0)
  }))
  .filter(x => x.count > 0)
  .sort((a, b) => b.count - a.count);

  // Sync active states for pills & tabs
  document.querySelectorAll('#rankPeriodPills .rank-period-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.period === uiRankPeriod);
  });
  document.querySelectorAll('#rankCategoryTabs .cat-tab').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.cat === uiRankCategory);
  });

  // Stats calculation
  const totalWearInPeriod = Object.values(periodWearCounts).reduce((a, b) => a + b, 0);
  const activeItemsCount = itemsToRank.length;
  const wornItemsInPeriod = ranked.length;
  const daysLogged = new Set(periodEntries.map(e => e.date)).size;

  const periodName = uiRankPeriod === 'month' ? '本月' : (uiRankPeriod === '30d' ? '近 30 天' : '歷史累積');
  const catName = uiRankCategory === 'all' ? '全單品' : categoryLabel(uiRankCategory);

  const stats = [
    { label: `${periodName}穿著次數`, value: `${uiRankPeriod === 'all' ? state.items.reduce((s, i) => s + (i.totalWearCount || 0), 0) : totalWearInPeriod} 次` },
    { label: `${periodName}穿搭天數`, value: `${daysLogged} 天` },
    { label: `${catName}上榜款數`, value: `${wornItemsInPeriod} 件` },
    { label: `${catName}穿搭率`, value: `${activeItemsCount ? Math.round(wornItemsInPeriod / activeItemsCount * 100) : 0}%` },
  ];
  if (statsWrap) statsWrap.innerHTML = stats.map(s => `<div class="rank-stat-card"><p>${s.label}</p><b>${s.value}</b></div>`).join('');

  list.innerHTML = '';
  if (!ranked.length) {
    list.innerHTML = `<p class="empty-hint" style="grid-column: 1 / -1; text-align: center; padding: 24px 0;">在「${periodName}」期間，${catName}還沒有穿搭紀錄</p>`;
    return;
  }
  ranked.slice(0, 30).forEach(({ item, count }, idx) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-photo">${itemPhotoMarkup(item)}</div>
      <span class="rank-badge">#${idx + 1}</span>
      <div class="item-info">
        <p class="item-name">${escapeHtml(item.name)}</p>
        <p class="item-wear">穿過 ${count} 次</p>
      </div>`;
    card.addEventListener('click', () => openItemDetail(item.id));
    list.appendChild(card);
  });
}

function openDayDetail(dateStr, entry) {
  document.getElementById('dayDetailTitle').textContent = `${formatDayWithWeekday(dateStr)} 的穿搭`;
  const body = document.getElementById('dayDetailBody');
  const isToday = dateStr === todayStr();
  const topItem = entry.top ? findItem(entry.top) : null;
  const bottomItem = entry.bottom ? findItem(entry.bottom) : null;
  const hatItem = entry.hat ? findItem(entry.hat) : null;
  const shoesItem = entry.shoes ? findItem(entry.shoes) : null;

  let figurePreviewHtml = '';
  if (topItem || bottomItem || hatItem || shoesItem) {
    const isShorts = isShortsItem(bottomItem);
    const bottomW = isShorts ? '82%' : '96%';
    const bottomRatio = isShorts ? '1.15' : '0.72';
    const topMarginBottom = isShorts ? '-24px' : '-20px';
    figurePreviewHtml = `
      <div class="day-detail-figure-preview" style="display:flex;justify-content:center;margin-bottom:14px;">
        <div class="figure-board" style="width:min(144px, 42%);padding:10px 8px;background:rgba(44,66,112,0.06);border:1px solid rgba(44,66,112,0.12);border-radius:22px;display:flex;flex-direction:column;align-items:center;gap:0;">
          ${hatItem ? `<div class="figure-slot figure-hat" style="width:82%;aspect-ratio:2.2;background:transparent;"><span class="figure-thumb" style="aspect-ratio:2.2;background-image:url('${hatItem.image || ''}');background-repeat:no-repeat;background-position:center;background-size:contain;display:flex;align-items:center;justify-content:center;">${hatItem.image ? '' : categoryIcon('hat')}</span></div>` : ''}
          ${topItem ? `<div class="figure-slot figure-top" style="width:100%;aspect-ratio:1.08;margin-bottom:${topMarginBottom};z-index:2;position:relative;background:transparent;"><span class="figure-thumb" style="aspect-ratio:1.08;background-image:url('${topItem.image || ''}');background-repeat:no-repeat;background-position:center bottom;background-size:contain;display:flex;align-items:center;justify-content:center;">${topItem.image ? '' : categoryIcon('top')}</span></div>` : ''}
          ${bottomItem ? `<div class="figure-slot figure-bottom ${isShorts ? 'is-shorts' : ''}" style="width:${bottomW};aspect-ratio:${bottomRatio};margin-top:0;z-index:1;position:relative;background:transparent;"><span class="figure-thumb" style="aspect-ratio:${bottomRatio};background-image:url('${bottomItem.image || ''}');background-repeat:no-repeat;background-position:center top;background-size:contain;display:flex;align-items:center;justify-content:center;">${bottomItem.image ? '' : categoryIcon('bottom')}</span></div>` : ''}
          ${shoesItem ? `<div class="figure-slot figure-shoes" style="width:96%;aspect-ratio:2.2;margin-top:2px;background:transparent;"><span class="figure-thumb" style="aspect-ratio:2.2;background-image:url('${shoesItem.image || ''}');background-repeat:no-repeat;background-position:center;background-size:contain;display:flex;align-items:center;justify-content:center;">${shoesItem.image ? '' : categoryIcon('shoes')}</span></div>` : ''}
        </div>
      </div>`;
  }

  const rows = ALL_SLOTS.filter(s => entry[s]).map(s => {
    const item = findItem(entry[s]);
    if (!item) return `<div class="day-detail-row"><p class="ddr-name">（已刪除的衣物）</p></div>`;
    const thumb = item.image ? `<img class="ddr-thumb" src="${item.image}" alt="">` : `<span class="ddr-thumb">${categoryIcon(item.category)}</span>`;
    return `<button type="button" class="day-detail-row" data-item-id="${item.id}">${thumb}
      <div><p class="ddr-cat">${categoryLabel(item.category)}</p><p class="ddr-name">${escapeHtml(item.name)}</p></div></button>`;
  });
  body.innerHTML = figurePreviewHtml + (rows.join('') || `<p class="empty-hint">這天沒有穿搭紀錄</p>`) + `
    <div class="settings-actions" style="margin-top:14px">
      <button class="btn-secondary" id="btnDayEdit">編輯這天</button>
      ${isToday ? '' : '<button class="btn-secondary btn-danger" id="btnDayDelete">刪除這天</button>'}
    </div>`;
  body.querySelectorAll('.day-detail-row[data-item-id]').forEach(row => {
    row.addEventListener('click', () => openItemDetail(row.dataset.itemId));
  });
  const editBtn = document.getElementById('btnDayEdit');
  if (editBtn) editBtn.addEventListener('click', () => openBackfillModal(dateStr));
  const delBtn = document.getElementById('btnDayDelete');
  if (delBtn) delBtn.addEventListener('click', () => {
    openConfirm('刪除這天的穿搭紀錄？', `${fmtDate(dateStr)} 的紀錄將被移除，此動作無法復原`, [
      { label: '取消', kind: 'secondary' },
      { label: '刪除', kind: 'danger', onClick: () => {
        if (isToday) {
          ALL_SLOTS.forEach(s => { if (state.today[s]) setTodaySlot(s, null); });
        }
        state.ootdHistory = state.ootdHistory.filter(e => e.date !== dateStr);
        saveState({ action: `刪除 ${formatDayWithWeekday(dateStr)} 穿搭` });
        renderHistory();
        renderHome();
        closeModal();
        toast('已刪除這天的穿搭紀錄');
      } },
    ]);
  });
  openModal('modal-day');
}


/* ---- Hairstyle ('更多' tab) ---- */
function renderHairstyleSection() {
  const summaryEl = document.getElementById('haircutCycleSummary');
  const gridEl = document.getElementById('haircutGalleryGrid');
  if (!summaryEl || !gridEl) return;

  const haircuts = (Array.isArray(state.haircuts) ? state.haircuts : []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (!haircuts.length) {
    summaryEl.innerHTML = `
      <div class="haircut-cycle-head">
        <span class="haircut-cycle-title">修剪週期追蹤</span>
        <span class="haircut-days-large" style="font-size:20px;">尚未記錄</span>
      </div>
      <p style="font-size:12px;color:rgba(255,255,255,0.7);margin:0">點擊右上角「+ 新增髮型」記錄您的剪髮與造型歷史。</p>
    `;
    gridEl.innerHTML = `<p class="empty-hint" style="grid-column:1/-1;text-align:center;padding:24px 0;color:var(--color-ink-faint)">還沒有髮型記錄，新增第一筆吧！</p>`;
    return;
  }

  const latest = haircuts[0];
  const days = Math.max(0, daysBetween(latest.date, todayStr()));
  const cycle = Number(latest.cycleDays) || 28;
  const progress = Math.min(100, Math.round((days / cycle) * 100));
  const nextDate = addDays(latest.date, cycle);
  const remaining = cycle - days;

  let subText = '';
  if (remaining > 0) {
    subText = `預計下次：${fmtDate(nextDate)}（還有 ${remaining} 天）`;
  } else if (remaining === 0) {
    subText = `今天已達到預計週期！建議預約修剪`;
  } else {
    subText = `已超過週期 ${Math.abs(remaining)} 天，建議預約修剪`;
  }

  summaryEl.innerHTML = `
    <div class="haircut-cycle-head">
      <div>
        <span class="haircut-cycle-title">距上次理髮</span>
        <div class="haircut-days-large">${days} <span style="font-size:15px;font-weight:600">天</span></div>
      </div>
      <div style="text-align:right">
        <span class="haircut-cycle-title">上次日期</span>
        <div style="font-size:14px;font-weight:700;color:#fff">${fmtDate(latest.date)}</div>
      </div>
    </div>
    <div class="haircut-progress-track">
      <div class="haircut-progress-bar" style="width:${progress}%;"></div>
    </div>
    <div class="haircut-cycle-sub">
      <span>週期：${cycle} 天</span>
      <span>${subText}</span>
    </div>
  `;

  gridEl.innerHTML = '';
  haircuts.forEach(h => {
    const card = document.createElement('div');
    card.className = 'haircut-card';
    card.innerHTML = `
      <div class="haircut-card-photo" style="${h.image ? `background-image:url('${h.image}')` : ''}">
        ${!h.image ? `<div class="haircut-card-photo-placeholder">${ICONS.scissors}</div>` : ''}
      </div>
      <div class="haircut-card-body">
        <div class="haircut-card-date">${fmtDate(h.date)}</div>
        <div class="haircut-card-style">${escapeHtml(h.style)}</div>
        ${(h.stylist || h.salon) ? `<div class="haircut-card-meta">${escapeHtml([h.stylist, h.salon].filter(Boolean).join(' · '))}</div>` : ''}
        ${h.length ? `<div class="haircut-card-meta" style="color:var(--color-denim-deep);font-weight:600">${escapeHtml(h.length)}</div>` : ''}
        ${h.notes ? `<div class="haircut-card-notes">${escapeHtml(h.notes)}</div>` : ''}
      </div>
    `;
    card.addEventListener('click', () => openHaircutModal(h.id));
    gridEl.appendChild(card);
  });
}

function openHaircutModal(editId = null) {
  editingHaircutId = editId;
  pendingHaircutPhoto = null;
  const form = document.getElementById('haircutForm');
  form.reset();

  const preview = document.getElementById('haircutPhotoPreview');
  preview.removeAttribute('style');
  preview.classList.remove('has-photo');
  preview.innerHTML = `<span data-icon="camera"></span><span>上傳髮型照片（正面/側面皆可）</span>`;
  applyStaticIcons();

  const title = document.getElementById('haircutModalTitle');
  const submitBtn = document.getElementById('btnHaircutSubmit');
  const extraActions = document.getElementById('haircutExtraActions');

  if (editId) {
    const h = (state.haircuts || []).find(x => x.id === editId);
    if (!h) return;
    title.textContent = '編輯髮型記錄';
    submitBtn.textContent = '儲存修改';
    extraActions.classList.remove('is-hidden');
    document.getElementById('fieldHaircutDate').value = h.date || todayStr();
    document.getElementById('fieldHaircutStyle').value = h.style || '';
    document.getElementById('fieldHaircutStylist').value = h.stylist || '';
    document.getElementById('fieldHaircutSalon').value = h.salon || '';
    document.getElementById('fieldHaircutLength').value = h.length || '';
    document.getElementById('fieldHaircutCycle').value = h.cycleDays || 28;
    document.getElementById('fieldHaircutNotes').value = h.notes || '';
    if (h.image) {
      pendingHaircutPhoto = h.image;
      preview.setAttribute('style', `background-image:url('${h.image}')`);
      preview.classList.add('has-photo');
      preview.innerHTML = '';
    }
  } else {
    title.textContent = '新增髮型記錄';
    submitBtn.textContent = '儲存髮型記錄';
    extraActions.classList.add('is-hidden');
    document.getElementById('fieldHaircutDate').value = todayStr();
    document.getElementById('fieldHaircutCycle').value = 28;
  }
  openModal('modal-haircut');
}

/* ---- Consumables ('更多' tab) ---- */
function renderConsumables() {
  const grid = document.getElementById('consumableGrid');
  grid.innerHTML = '';
  state.consumables.forEach(c => {
    const towel = isTowelId(c.id);
    const isActive = !towel || state.activeTowel === c.id;
    const used = daysUsed(c);
    const overdue = isActive && isOverdue(c);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'consumable-card' + (overdue ? ' is-overdue' : '') + (towel && !isActive ? ' is-standby' : '');
    const daysHtml = c.laundryPending ? `<p class="c-days c-waiting-wash">等待清洗中</p>` : (towel && !isActive) ? `<p class="c-days">備用中</p>` : `<p class="c-days">已用了 <b>${used}</b> 天</p>`;
    card.innerHTML = `
      <span class="c-icon">${consumableImage(c) ? `<img src="${consumableImage(c)}" alt="">` : (ICONS[c.icon]||'')}</span>
      <p class="c-name">${escapeHtml(c.name)}</p>
      ${daysHtml}
      <p class="c-cycle">週期 ${c.cycleDays === null ? '無限制' : c.cycleDays + ' 天'}</p>
      ${overdue && !c.laundryPending ? '<span class="c-flag">該換了</span>' : ''}
      ${c.laundryPending ? '<span class="c-standby-flag c-waiting-flag">等待清洗</span>' : ''}
      ${towel && !isActive && !c.laundryPending ? '<span class="c-standby-flag">備用</span>' : ''}`;
    card.addEventListener('click', () => openConsumableDetail(c.id));
    grid.appendChild(card);
  });
}
function openConsumableDetail(id) {
  const c = state.consumables.find(x => x.id === id);
  if (!c) return;
  const towel = isTowelId(id);
  const isActive = !towel || state.activeTowel === id;
  const used = daysUsed(c);
  const overdue = isActive && isOverdue(c);
  const body = document.getElementById('consumableDetailBody');
  const cycleLabel = c.cycleDays === null ? '無限制' : String(c.cycleDays);
  const lastReplacedLabel = c.history.length ? fmtDate(c.history[0].date) : `${fmtDate(c.startDate)}（尚未更換過）`;

  let statsHtml, actionLabel;
  if (c.laundryPending) {
    statsHtml = `<div class="detail-stats">
      <div class="detail-stat"><b>等待清洗</b><span>目前狀態</span></div>
      <div class="detail-stat"><b>${fmtDate(c.laundryAt || todayStr())}</b><span>放入洗衣籃</span></div>
      <div class="detail-stat"><b>${c.history.length}</b><span>歷史次數</span></div>
    </div>`;
    actionLabel = '已在洗衣籃等待清洗';
  } else if (towel && !isActive) {
    statsHtml = `<div class="detail-stats">
      <div class="detail-stat"><b>備用</b><span>目前狀態</span></div>
      <div class="detail-stat"><b>${cycleLabel}</b><span>週期天數</span></div>
      <div class="detail-stat"><b>${c.history.length}</b><span>歷史次數</span></div>
    </div>`;
    actionLabel = '現在開始使用這條';
  } else {
    statsHtml = `
      <div class="stepper-row">
        <span class="stepper-label">已用天數</span>
        <div class="stepper-control">
          <button type="button" class="stepper-btn" id="cUsedMinus">−</button>
          <span class="stepper-value" id="cUsedValue">${used}</span>
          <button type="button" class="stepper-btn" id="cUsedPlus">＋</button>
        </div>
      </div>
      <div class="stepper-row">
        <span class="stepper-label">建議週期</span>
        <div class="stepper-control">
          <button type="button" class="stepper-btn" id="cCycleMinus">−</button>
          <span class="stepper-value" id="cCycleValue">${cycleLabel}</span>
          <button type="button" class="stepper-btn" id="cCyclePlus">＋</button>
        </div>
      </div>`;
    actionLabel = isLaundryConsumable(c) ? '提前丟到洗衣籃' : (overdue ? '已更換，重新計算' : '提前更換／清洗');
  }
  const imgUrl = consumableImage(c);
  const photoHtml = imgUrl ? `<div class="consumable-detail-photo-wrap"><img src="${imgUrl}" alt="" class="consumable-detail-photo"></div>` : '';
  body.innerHTML = `
    <div class="modal-head"><h2>${escapeHtml(c.name)}</h2><button class="modal-close" data-close>${ICONS.close}</button></div>
    ${photoHtml}
    ${statsHtml}
    <button class="btn-primary" id="btnResetConsumable"${c.laundryPending ? ' disabled' : ''}>${actionLabel}</button>
    <p class="detail-meta">上次更換日期：${lastReplacedLabel}</p>
  `;
  body.querySelector('[data-close]').addEventListener('click', closeModal);
  body.querySelector('#btnResetConsumable').addEventListener('click', () => {
    if (isLaundryConsumable(c) && !c.laundryPending && !(towel && !isActive)) sendConsumableToLaundry(id);
    else { handleConsumableReset(id); closeModal(); }
  });

  const usedMinus = body.querySelector('#cUsedMinus'), usedPlus = body.querySelector('#cUsedPlus');
  if (usedMinus) usedMinus.addEventListener('click', () => {
    c.startDate = addDays(c.startDate, 1); // one day less "used"
    if (c.startDate > todayStr()) c.startDate = todayStr();
    saveState();
    openConsumableDetail(id);
    renderConsumables();
  });
  if (usedPlus) usedPlus.addEventListener('click', () => {
    c.startDate = addDays(c.startDate, -1); // one day more "used"
    saveState();
    openConsumableDetail(id);
    renderConsumables();
  });
  const cycleMinus = body.querySelector('#cCycleMinus'), cyclePlus = body.querySelector('#cCyclePlus');
  if (cycleMinus) cycleMinus.addEventListener('click', () => {
    c.cycleDays = c.cycleDays === null ? 7 : Math.max(1, c.cycleDays - 1);
    saveState();
    openConsumableDetail(id);
    renderConsumables();
  });
  if (cyclePlus) cyclePlus.addEventListener('click', () => {
    c.cycleDays = c.cycleDays === null ? 8 : c.cycleDays + 1;
    saveState();
    openConsumableDetail(id);
    renderConsumables();
  });
  openModal('modal-consumable');
}

/* ---- Notifications ---- */
function renderNotifications() {
  const notifs = getNotifications();
  const badge = document.getElementById('notifBadge');
  badge.hidden = notifs.length === 0;
  if (badge) {
    badge.textContent = notifs.length > 99 ? '99+' : String(notifs.length);
    badge.setAttribute('aria-label', `${notifs.length} 則未讀提醒`);
  }
  const list = document.getElementById('notifList');
  const empty = document.getElementById('notifEmpty');
  list.innerHTML = '';
  if (!notifs.length) { empty.hidden = false; return; }
  empty.hidden = true;
  notifs.forEach(n => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'notif-row';
    let thumbHtml;
    if (n.type === 'item') {
      thumbHtml = n.thumb.image ? `<img class="notif-thumb" src="${n.thumb.image}" alt="">` : `<span class="notif-thumb">${categoryIcon(n.thumb.category)}</span>`;
    } else {
      thumbHtml = `<span class="notif-thumb">${ICONS[n.icon] || ''}</span>`;
    }
    const actionLabel = n.type === 'item' ? '丟進洗衣籃' : n.type === 'laundry' ? '查看' : '處理';
    row.innerHTML = `${thumbHtml}<p class="notif-text">${escapeHtml(n.text)}</p><span class="notif-action">${actionLabel}</span>`;
    row.addEventListener('click', () => {
      if (n.type === 'item') {
        openConfirm('要丟進洗衣籃嗎？', n.text, [
          { label: '取消', kind: 'secondary' },
          { label: '丟進洗衣籃', kind: 'primary', onClick: () => sendToBasketNow(n.id) },
        ]);
      } else if (n.type === 'consumable') {
        openConfirm('確定要處理嗎？', n.text, [
          { label: '取消', kind: 'secondary' },
          { label: '確定', kind: 'primary', onClick: () => handleConsumableReset(n.id) },
        ]);
      } else if (n.type === 'laundry') {
        closeModal();
        openLaundryModal();
      }
    });
    list.appendChild(row);
  });
}


/* ============================================================
   WISHLIST / INSPIRATION
   ============================================================ */
function safeExternalUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch (e) {
    return '';
  }
}
function allWishlistTagsUsed() {
  const set = new Set();
  state.wishlist.forEach(item => (item.tags || []).forEach(tag => set.add(tag)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-Hant'));
}
let uiWishlistSort = 'recent';
let uiWishlistFilters = { category: 'all', tags: [] };
let uiWishlistSearchQuery = '';
let uiWishlistSelectMode = false;
let uiWishlistSelectedIds = new Set();
function wishlistFilterActive() { return uiWishlistFilters.category !== 'all' || uiWishlistFilters.tags.length > 0; }
function wishlistMatchesSearch(item, q) {
  if (!q) return true;
  return [item.name, categoryLabel(item.category), ...(item.tags || [])].join(' ').toLowerCase().includes(q.toLowerCase());
}
function getVisibleWishlistItems() {
  return state.wishlist.filter(item => {
    if (uiWishlistFilters.category !== 'all' && item.category !== uiWishlistFilters.category) return false;
    if (uiWishlistFilters.tags.length && !uiWishlistFilters.tags.every(t => (item.tags || []).includes(t))) return false;
    return wishlistMatchesSearch(item, uiWishlistSearchQuery);
  }).slice().sort((a, b) => {
    if (uiWishlistSort === 'name') return a.name.localeCompare(b.name, 'zh-Hant');
    if (uiWishlistSort === 'category') return categoryLabel(a.category).localeCompare(categoryLabel(b.category), 'zh-Hant');
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}
function updateWishlistSelectBar() {
  const count = document.getElementById('wishlistSelectCount');
  if (count) count.textContent = `已選 ${uiWishlistSelectedIds.size} 件`;
  document.getElementById('wishlistSelectBar')?.classList.toggle('is-hidden', !uiWishlistSelectMode);
  document.getElementById('view-inspiration')?.classList.toggle('wishlist-selecting', uiWishlistSelectMode);
}
function setWishlistSelectMode(on) {
  uiWishlistSelectMode = on;
  uiWishlistSelectedIds.clear();
  updateWishlistSelectBar();
  const btn = document.getElementById('btnWishlistSelectMode');
  if (btn) { btn.classList.toggle('is-active', on); btn.textContent = on ? '完成' : '選取'; }
  renderWishlist();
}
function renderWishlist() {
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('wishlistEmpty');
  if (!grid || !empty) return;
  const items = getVisibleWishlistItems();
  const filterBadge = document.getElementById('wishlistFilterBadge');
  if (filterBadge) filterBadge.hidden = !wishlistFilterActive();
  grid.innerHTML = '';
  empty.hidden = items.length !== 0;
  if (!items.length && (uiWishlistSearchQuery || wishlistFilterActive())) empty.textContent = '找不到符合條件的想買單品。';
  else empty.textContent = '還沒有想買的單品，先記下一件吧。';
  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'wishlist-card' + (uiWishlistSelectMode ? ' is-selectable' : '') + (uiWishlistSelectedIds.has(item.id) ? ' is-selected' : '');
    const photo = item.image
      ? `<div class="wishlist-photo" style="background-color:#fff;background-image:url('${item.image}');background-repeat:no-repeat;background-position:center;background-size:contain"></div>`
      : `<div class="wishlist-photo wishlist-photo-empty">${ICONS.shopping}</div>`;
    const tags = (item.tags || []).map(tag => `<span class="wishlist-tag">${escapeHtml(tag)}</span>`).join('');
    const url = safeExternalUrl(item.referenceUrl);
    const actions = uiWishlistSelectMode ? '' : `<div class="wishlist-card-actions"><button type="button" class="btn-secondary wishlist-edit-btn">編輯</button>${url ? `<a class="btn-secondary wishlist-link" href="${url}" target="_blank" rel="noopener"><span data-icon="link"></span>參考網址</a>` : ''}</div>`;
    card.innerHTML = `${photo}${uiWishlistSelectMode ? '<span class="wishlist-card-check"></span>' : ''}<div class="wishlist-card-body"><p class="wishlist-name">${escapeHtml(item.name)}</p><p class="wishlist-category">${categoryLabel(item.category)}</p><div class="wishlist-tags">${tags}</div>${actions}</div>`;
    card.addEventListener('click', e => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      if (uiWishlistSelectMode) {
        if (uiWishlistSelectedIds.has(item.id)) uiWishlistSelectedIds.delete(item.id); else uiWishlistSelectedIds.add(item.id);
        updateWishlistSelectBar();
        renderWishlist();
      } else openWishlistModal(item.id);
    });
    card.querySelector('.wishlist-edit-btn')?.addEventListener('click', () => openWishlistModal(item.id));
    grid.appendChild(card);
  });
  updateWishlistSelectBar();
  renderStyleGalleryPreview();
  applyStaticIcons();
}
let uiStyleGallerySelectMode = false;
let uiStyleGallerySelectedIds = new Set();
let styleGalleryDragId = null;
let styleGalleryPointerDrag = null;
function attachStyleGalleryPointerDrag(card) {
  card.addEventListener('pointerdown', e => {
    if (uiStyleGallerySelectMode || e.pointerType === 'mouse' || e.target.closest('button')) return;
    const drag = { id: card.dataset.id, overId: card.dataset.id, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, active: false, timer: null };
    drag.timer = window.setTimeout(() => {
      if (styleGalleryPointerDrag !== drag) return;
      drag.active = true;
      card.setPointerCapture?.(e.pointerId);
      card.classList.add('is-dragging');
    }, 280);
    styleGalleryPointerDrag = drag;
  });
  card.addEventListener('pointermove', e => {
    const drag = styleGalleryPointerDrag;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (!drag.active) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 12) {
        window.clearTimeout(drag.timer);
        styleGalleryPointerDrag = null;
      }
      return;
    }
    e.preventDefault();
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.style-gallery-manager-card');
    if (target && target.parentElement === card.parentElement && target.dataset.id !== card.dataset.id) {
      card.parentElement.querySelectorAll('.is-drag-over').forEach(el => el.classList.remove('is-drag-over'));
      target.classList.add('is-drag-over');
      drag.overId = target.dataset.id;
    }
  });
  const finish = e => {
    const drag = styleGalleryPointerDrag;
    if (!drag || drag.pointerId !== e.pointerId) return;
    window.clearTimeout(drag.timer);
    styleGalleryPointerDrag = null;
    card.classList.remove('is-dragging');
    card.parentElement?.querySelectorAll('.is-drag-over').forEach(el => el.classList.remove('is-drag-over'));
    if (drag.active && drag.overId !== drag.id) moveStyleGalleryPhoto(drag.id, drag.overId);
  };
  card.addEventListener('pointerup', finish);
  card.addEventListener('pointercancel', finish);
}

function styleGalleryPhotoById(id) {
  return state.styleGallery.find(photo => photo.id === id);
}
function updateStyleGallerySelectBar() {
  const count = document.getElementById('styleGallerySelectCount');
  if (count) count.textContent = `已選 ${uiStyleGallerySelectedIds.size} 張`;
  document.getElementById('styleGallerySelectBar')?.classList.toggle('is-hidden', !uiStyleGallerySelectMode);
}
function setStyleGallerySelectMode(on) {
  uiStyleGallerySelectMode = !!on;
  if (!uiStyleGallerySelectMode) uiStyleGallerySelectedIds.clear();
  const btn = document.getElementById('btnStyleGallerySelectMode');
  if (btn) {
    btn.classList.toggle('is-active', uiStyleGallerySelectMode);
    btn.textContent = uiStyleGallerySelectMode ? '完成' : '選取';
  }
  updateStyleGallerySelectBar();
  renderStyleGalleryManager();
}
function toggleStyleGallerySelection(id) {
  if (uiStyleGallerySelectedIds.has(id)) uiStyleGallerySelectedIds.delete(id);
  else uiStyleGallerySelectedIds.add(id);
  updateStyleGallerySelectBar();
  renderStyleGalleryManager();
}
function renderStyleGalleryPreview() {
  const preview = document.getElementById('styleGalleryPreview');
  const empty = document.getElementById('styleGalleryPreviewEmpty');
  if (!preview || !empty) return;
  const photos = Array.isArray(state.styleGallery) ? state.styleGallery : [];
  preview.innerHTML = photos.map(photo => `
    <button type="button" class="style-gallery-preview-card" data-gallery-id="${escapeHtml(photo.id)}" aria-label="開啟風格走廊照片">
      <img src="${photo.image}" alt="風格參考照片" loading="lazy">
    </button>
  `).join('');
  empty.hidden = photos.length > 0;
  preview.querySelectorAll('[data-gallery-id]').forEach(card => card.addEventListener('click', () => openStyleGalleryManager()));
}
function moveStyleGalleryPhoto(draggedId, targetId) {
  const from = state.styleGallery.findIndex(photo => photo.id === draggedId);
  const to = state.styleGallery.findIndex(photo => photo.id === targetId);
  if (from < 0 || to < 0 || from === to) return;
  const [moved] = state.styleGallery.splice(from, 1);
  state.styleGallery.splice(to, 0, moved);
  saveState();
  renderStyleGalleryManager();
  renderStyleGalleryPreview();
}
function shiftStyleGalleryPhoto(id, direction) {
  const index = state.styleGallery.findIndex(photo => photo.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= state.styleGallery.length) return;
  [state.styleGallery[index], state.styleGallery[target]] = [state.styleGallery[target], state.styleGallery[index]];
  saveState();
  renderStyleGalleryManager();
  renderStyleGalleryPreview();
}
function renderStyleGalleryManager() {
  const grid = document.getElementById('styleGalleryManagerGrid');
  const empty = document.getElementById('styleGalleryManagerEmpty');
  if (!grid || !empty) return;
  const photos = Array.isArray(state.styleGallery) ? state.styleGallery : [];
  uiStyleGallerySelectedIds = new Set([...uiStyleGallerySelectedIds].filter(id => photos.some(photo => photo.id === id)));
  document.getElementById('styleGalleryManagerCount').textContent = `${photos.length} 張照片`;
  empty.hidden = photos.length > 0;
  grid.innerHTML = '';
  photos.forEach((photo, index) => {
    const card = document.createElement('article');
    card.className = `style-gallery-manager-card${uiStyleGallerySelectedIds.has(photo.id) ? ' is-selected' : ''}`;
    card.draggable = !uiStyleGallerySelectMode;
    card.dataset.id = photo.id;
    card.innerHTML = `
      <div class="style-gallery-manager-photo"><img src="${photo.image}" alt="風格參考照片" draggable="false"><span class="style-gallery-drag-handle" title="拖曳排序">⋮⋮</span>${uiStyleGallerySelectMode ? '<span class="style-gallery-card-check"></span>' : ''}</div>
      <div class="style-gallery-manager-card-foot">
        <span class="style-gallery-photo-index">${index + 1}</span>
        <div class="style-gallery-card-actions">
          <button type="button" class="style-gallery-mini-btn" data-move="up" aria-label="往前移" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="style-gallery-mini-btn" data-move="down" aria-label="往後移" ${index === photos.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="style-gallery-mini-btn" data-share aria-label="分享這張照片"><span data-icon="share"></span></button>
          <button type="button" class="style-gallery-mini-btn is-danger" data-delete aria-label="刪除這張照片"><span data-icon="trash"></span></button>
        </div>
      </div>
    `;
    card.addEventListener('click', e => {
      if (!uiStyleGallerySelectMode || e.target.closest('button')) return;
      toggleStyleGallerySelection(photo.id);
    });
    card.addEventListener('dragstart', e => {
      if (uiStyleGallerySelectMode) { e.preventDefault(); return; }
      styleGalleryDragId = photo.id;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', photo.id);
      card.classList.add('is-dragging');
    });
    card.addEventListener('dragend', () => { styleGalleryDragId = null; card.classList.remove('is-dragging'); });
    card.addEventListener('dragover', e => { if (!uiStyleGallerySelectMode) { e.preventDefault(); card.classList.add('is-drag-over'); } });
    card.addEventListener('dragleave', () => card.classList.remove('is-drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('is-drag-over');
      const draggedId = e.dataTransfer.getData('text/plain') || styleGalleryDragId;
      if (draggedId) moveStyleGalleryPhoto(draggedId, photo.id);
      styleGalleryDragId = null;
    });
    card.querySelector('[data-move="up"]')?.addEventListener('click', e => { e.stopPropagation(); shiftStyleGalleryPhoto(photo.id, -1); });
    card.querySelector('[data-move="down"]')?.addEventListener('click', e => { e.stopPropagation(); shiftStyleGalleryPhoto(photo.id, 1); });
    card.querySelector('[data-share]')?.addEventListener('click', async e => { e.stopPropagation(); await shareStyleGalleryPhotos([photo.id]); });
    card.querySelector('[data-delete]')?.addEventListener('click', e => { e.stopPropagation(); confirmDeleteStyleGalleryPhoto(photo.id); });
    attachStyleGalleryPointerDrag(card);
    grid.appendChild(card);
  });
  updateStyleGallerySelectBar();
  applyStaticIcons();
}
function openStyleGalleryManager() {
  renderStyleGalleryManager();
  openModal('modal-style-gallery');
}
async function addStyleGalleryFiles(fileList) {
  const files = Array.from(fileList || []).filter(file => file && file.type && file.type.startsWith('image/'));
  if (!files.length) return;
  toast(`處理 ${files.length} 張風格照片中…`);
  const added = [];
  for (const file of files) {
    try {
      const image = await compressImageFile(file, 720, 0.82);
      added.push({ id: uid(), image, createdAt: Date.now() });
    } catch (err) {
      // Skip only the file that cannot be decoded; preserve successfully processed photos.
    }
  }
  if (added.length) {
    state.styleGallery.push(...added);
    saveState();
    renderStyleGalleryPreview();
    renderStyleGalleryManager();
    toast(`已加入 ${added.length} 張風格照片`);
  } else toast('風格照片處理失敗，請換一張試試');
}
async function shareStyleGalleryPhotos(ids) {
  const photos = ids.map(styleGalleryPhotoById).filter(Boolean);
  if (!photos.length) return;
  try {
    const files = [];
    for (let i = 0; i < photos.length; i++) {
      const response = await fetch(photos[i].image);
      const blob = await response.blob();
      const type = blob.type || 'image/jpeg';
      const ext = type.includes('png') ? 'png' : 'jpg';
      files.push(new File([blob], `風格走廊-${i + 1}.${ext}`, { type }));
    }
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files }))) {
      await navigator.share({ files, title: '風格走廊' });
      toast('已開啟分享');
      return;
    }
    photos.forEach((photo, index) => {
      const link = document.createElement('a');
      link.href = photo.image;
      link.download = `風格走廊-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
    toast('此裝置不支援直接分享，已準備下載照片');
  } catch (err) {
    if (err?.name !== 'AbortError') toast('分享未完成，請再試一次');
  }
}
function confirmDeleteStyleGalleryPhoto(id) {
  const photo = styleGalleryPhotoById(id);
  if (!photo) return;
  openConfirm('刪除這張風格照片？', '刪除後無法復原。', [
    { label: '取消', kind: 'secondary', returnTo: 'modal-style-gallery' },
    { label: '刪除', kind: 'danger', returnTo: 'modal-style-gallery', onClick: () => {
      state.styleGallery = state.styleGallery.filter(item => item.id !== id);
      uiStyleGallerySelectedIds.delete(id);
      saveState();
      renderStyleGalleryPreview();
      renderStyleGalleryManager();
      toast('已刪除風格照片');
    } },
  ]);
}
function renderWishlistCategoryChips() {
  const row = document.getElementById('wishlistCategoryChips');
  row.innerHTML = '';
  allCategoryIds().forEach(id => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (pendingWishlistCategory === id ? ' is-active' : '');
    chip.textContent = categoryLabel(id);
    chip.addEventListener('click', () => {
      pendingWishlistCategory = id;
      wishlistDirty = true;
      renderWishlistCategoryChips();
      document.getElementById('wishlistLengthToggleWrap').classList.toggle('is-hidden', !(id === 'top' || id === 'bottom'));
      autoSaveWishlistDraft();
    });
    row.appendChild(chip);
  });
  document.getElementById('wishlistLengthToggleWrap').classList.toggle('is-hidden', !(pendingWishlistCategory === 'top' || pendingWishlistCategory === 'bottom'));
}
function renderWishlistLengthToggle() {
  document.querySelectorAll('#wishlistLengthToggle .segment-btn').forEach(btn => btn.classList.toggle('is-active', pendingWishlistTags.includes(btn.dataset.len)));
}
function renderWishlistTagChips() {
  const row = document.getElementById('wishlistTagPickerChips');
  row.innerHTML = '';
  Array.from(new Set(allTagsUsed().concat(allWishlistTagsUsed(), pendingWishlistTags))).forEach(tag => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (pendingWishlistTags.includes(tag) ? ' is-active' : '');
    chip.textContent = tag;
    chip.addEventListener('click', () => {
      pendingWishlistTags = pendingWishlistTags.includes(tag) ? pendingWishlistTags.filter(x => x !== tag) : pendingWishlistTags.concat(tag);
      wishlistDirty = true;
      renderWishlistTagChips();
      renderWishlistLengthToggle();
      autoSaveWishlistDraft();
    });
    row.appendChild(chip);
  });
}
function autoSaveWishlistDraft() {
  if (!document.getElementById('wishlistName')) return;
  const draft = {
    name: document.getElementById('wishlistName').value.trim(),
    category: pendingWishlistCategory,
    tags: pendingWishlistTags.slice(),
    referenceUrl: document.getElementById('wishlistReferenceUrl').value.trim(),
    image: pendingWishlistPhoto,
  };
  if (editingWishlistId) {
    const item = state.wishlist.find(x => x.id === editingWishlistId);
    if (item) Object.assign(item, draft);
  } else {
    state.drafts.wishlist = draft;
  }
  saveState();
}
function openWishlistModal(editId = null) {
  editingWishlistId = editId;
  wishlistDirty = false;
  wishlistEditSnapshot = null;
  pendingWishlistPhoto = null;
  pendingWishlistCategory = 'top';
  pendingWishlistTags = [];
  const form = document.getElementById('wishlistForm');
  form.reset();
  const savedDraft = !editId && state.drafts && state.drafts.wishlist;
  const item = editId ? state.wishlist.find(x => x.id === editId) : null;
  wishlistEditSnapshot = item ? JSON.parse(JSON.stringify(item)) : null;
  const source = item || savedDraft;
  if (source) {
    pendingWishlistCategory = source.category || 'top';
    pendingWishlistTags = Array.isArray(source.tags) ? source.tags.slice() : [];
    pendingWishlistPhoto = source.image || null;
    document.getElementById('wishlistName').value = source.name || '';
    document.getElementById('wishlistReferenceUrl').value = source.referenceUrl || '';
  }
  setPhotoPreview(document.getElementById('wishlistPhotoPreviewWrap'), pendingWishlistPhoto, '加入參考圖片');
  document.getElementById('btnReadjustWishlistPhoto').classList.toggle('is-hidden', !pendingWishlistPhoto);
  document.getElementById('wishlistModalTitle').textContent = editId ? '編輯想買單品' : '新增想買單品';
  document.getElementById('wishlistSubmitBtn').textContent = editId ? '儲存修改' : '加入想買清單';
  document.getElementById('btnDeleteWishlist').classList.toggle('is-hidden', !editId);
  renderWishlistCategoryChips();
  renderWishlistTagChips();
  renderWishlistLengthToggle();
  applyStaticIcons();
  openModal('modal-wishlist');
}
function saveWishlistForm() {
  const name = document.getElementById('wishlistName').value.trim();
  if (!name) { toast('請輸入想買單品名稱'); return false; }
  const data = {
    name,
    category: pendingWishlistCategory,
    tags: pendingWishlistTags.slice(),
    referenceUrl: safeExternalUrl(document.getElementById('wishlistReferenceUrl').value),
    image: pendingWishlistPhoto,
  };
  if (editingWishlistId) {
    const item = state.wishlist.find(x => x.id === editingWishlistId);
    if (item) Object.assign(item, data);
    toast('已儲存想買單品');
  } else {
    state.wishlist.push({ id: uid(), ...data, createdAt: Date.now() });
    toast('已加入想買清單');
  }
  state.drafts.wishlist = null;
  wishlistDirty = false;
  saveState();
  renderWishlist();
  forceCloseModal({ skipPersist: true });
  return true;
}

/* ============================================================
   ITEM DETAIL / ADD-EDIT MODAL
   ============================================================ */
function openItemDetail(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  const body = document.getElementById('itemDetailBody');
  const statusLabel = { clean:'乾淨', resting:'暫存衣架', dirty:'待洗', retired:'典藏中' }[item.status] || '';
  const lengthLabel = (item.tags || []).find(t => LENGTH_TAGS.includes(t)) || '';
  const isGarment = item.category === 'top' || item.category === 'bottom';
  const hasBack = !!item.imageBack;
  const deodList = Array.isArray(item.deodorizeHistory) ? item.deodorizeHistory : [];
  const stainList = Array.isArray(item.stainHistory) ? item.stainHistory : [];
  const lastDeod = deodList[0] || null;

  body.innerHTML = `
    <div class="detail-photo-wrap" id="detailPhotoContainer">
      <div class="card-25d ${isGarment ? 'garment-25d' : ''}" id="card25d">
        <div class="card-face card-face-front" id="cardFaceFront">
          ${item.image ? `<img class="garment-cutout-img" id="frontCutoutImg" src="${item.image}" alt="">` : `<div class="detail-photo-empty-icon">${categoryIcon(item.category)}</div>`}
        </div>
        ${hasBack ? `
          <div class="card-face card-face-back" id="cardFaceBack">
            <img class="garment-cutout-img" id="backCutoutImg" src="${item.imageBack}" alt="">
          </div>
        ` : ''}
      </div>
      ${hasBack ? `
        <div class="card-flip-badge" id="cardFlipBadge"><span>正面</span> 1/2</div>
        <button class="detail-flip-btn" id="btnFlipPhoto">翻轉看背面</button>
      ` : ''}
      <button class="detail-edit-btn" id="btnEditItem"></button>
    </div>
    ${hasBack ? `
      <div class="card-swipe-hint">
        <span class="icon-inline">${ICONS.flip}</span>
        <span>左右滑動卡片可 3D 翻轉正反面</span>
      </div>
    ` : ''}
    <p class="detail-name">${escapeHtml(item.name)}</p>
    <div class="detail-attributes-row">
      ${(item.color || item.colorHex) ? `
        <span class="detail-color-circle" style="background-color:${item.colorHex || getColorHexByName(item.color) || '#888'};" title="${escapeHtml(item.color || '')}"></span>
      ` : ''}
      ${item.brand ? `<div class="detail-brand" style="margin:0">${brandIconMarkup(item, 'medium')}<span>${escapeHtml(item.brand)}</span></div>` : ''}
    </div>
    ${item.material ? `
      <div class="detail-material-row">
        <span class="material-tag"><span class="icon-inline">${ICONS.layers}</span><span>材質：${escapeHtml(item.material)}</span></span>
      </div>
    ` : ''}
    <p class="detail-tags">${categoryLabel(item.category)}${lengthLabel ? ' · ' + lengthLabel : ''}${item.tags && item.tags.length ? ' · ' + item.tags.filter(t => t !== lengthLabel).map(escapeHtml).join('、') : ''} · ${statusLabel}</p>
    ${item.extraWash && ['dirty', 'resting'].includes(item.status) ? '<p class="wash-boost-current">已標記：加強清洗</p>' : ''}
    <div class="detail-stats">
      <div class="detail-stat"><b>${item.wearCount||0}</b><span>本輪穿著</span></div>
      <div class="detail-stat"><b>${item.totalWearCount||0}</b><span>累計穿著</span></div>
      <div class="detail-stat"><b>${item.lastWornDate ? fmtDate(item.lastWornDate) : '—'}</b><span>最近穿著</span></div>
    </div>
    <div class="detail-actions" id="detailActionsPrimary"></div>

    <div class="care-section-title">
      <span>日常護理與保養</span>
      ${lastDeod ? `<span style="font-size:11px;font-weight:600;color:var(--color-ink-faint)">最近除臭：${fmtDate(lastDeod)}</span>` : ''}
    </div>
    <div class="care-quick-actions">
      <button type="button" class="btn-care btn-care-deodorize" id="btnQuickDeodorize">
        <span class="icon-inline">${ICONS.wind}</span>
        <span>今天有除臭</span>
      </button>
      <button type="button" class="btn-care btn-care-stain" id="btnQuickStain">
        <span class="icon-inline">${ICONS.sparkles}</span>
        <span>記錄去污漬</span>
      </button>
    </div>

    <div class="detail-meta">
      ${item.purchaseDate ? `購買日期：${fmtDate(item.purchaseDate)}<br>` : ''}
      ${item.price != null ? `價格：$${item.price}<br>` : ''}
      加入衣櫥：${new Date(item.createdAt).toLocaleDateString('zh-TW')}
    </div>
    ${deodList.length ? `
      <p class="wear-history-heading">除臭歷史（共 ${deodList.length} 次）</p>
      <div class="wear-history-list">${deodList.slice(0, 20).map(d => `<div class="wear-history-row wash-history-row"><span>${fmtDate(d)}</span><span class="care-history-tag">日常除臭</span></div>`).join('')}</div>
    ` : ''}
    ${stainList.length ? `
      <p class="wear-history-heading">除污漬紀錄（共 ${stainList.length} 次）</p>
      <div class="wear-history-list">${stainList.slice(0, 20).map(s => `<div class="wear-history-row wash-history-row"><span>${fmtDate(s.date)}</span><span class="care-history-tag care-history-tag-stain">${escapeHtml(s.note || '局部去漬')}</span></div>`).join('')}</div>
    ` : ''}
    ${item.wearHistory && item.wearHistory.length ? `
      <p class="wear-history-heading">穿著歷史（共 ${item.wearHistory.length} 次）</p>
      <div class="wear-history-list">${item.wearHistory.slice(0, 30).map(d => `<div class="wear-history-row">${fmtDate(d)}</div>`).join('')}</div>
    ` : ''}
    ${item.washHistory && item.washHistory.length ? `
      <p class="wear-history-heading">洗衣歷史（共 ${item.washHistory.length} 次）</p>
      <div class="wear-history-list">${item.washHistory.slice(0, 30).map(entry => { const record = washHistoryEntry(entry); return `<div class="wear-history-row wash-history-row"><span>${fmtDate(record.date)}</span>${record.extraWash ? '<span class="history-boost-badge">加強清洗</span>' : ''}</div>`; }).join('')}</div>
    ` : ''}

    <div class="detail-archive-wrap">
      <button type="button" class="btn-archive-strip" id="btnDetailArchive">
        <span class="icon-inline">${ICONS.retired}</span>
        <span>${item.status === 'retired' ? '自典藏恢復到衣櫥' : '移至典藏'}</span>
      </button>
    </div>
  `;
  body.querySelector('#btnEditItem').innerHTML = ICONS.edit;
  body.querySelector('#btnEditItem').addEventListener('click', () => {
    modalReturnTo = 'modal-item';
    openAddModal(item.id);
  });

  const photoContainer = body.querySelector('#detailPhotoContainer');
  if (photoContainer) {
    photoContainer.style.cursor = 'pointer';
    photoContainer.addEventListener('click', e => {
      if (e.target.closest('#btnEditItem') || e.target.closest('#btnFlipPhoto')) return;
      const isBack = hasBack && body.querySelector('#cardFlipBadge')?.textContent.includes('背面');
      openPhotoOptions(item, isBack ? 'back' : 'front');
    });
  }

  // 2.5D interactive flip physics
  if (hasBack) {
    const card = body.querySelector('#card25d');
    const badge = body.querySelector('#cardFlipBadge');
    const flipBtn = body.querySelector('#btnFlipPhoto');
    const frontImg = body.querySelector('#frontCutoutImg');
    const backImg = body.querySelector('#backCutoutImg');
    let isFlipped = false;
    let startX = 0;
    let dragging = false;
    let currentDeg = 0;
    let startDeg = 0;

    // Normalizing scale differences between front and back
    if (frontImg && backImg) {
      const adjustScale = () => {
        if (!frontImg.naturalWidth || !backImg.naturalWidth) return;
        const fw = frontImg.naturalWidth, fh = frontImg.naturalHeight;
        const bw = backImg.naturalWidth, bh = backImg.naturalHeight;
        const fRatio = fw / fh;
        const bRatio = bw / bh;
        if (Math.abs(fRatio - bRatio) > 0.04) {
          const scaleComp = Math.sqrt(fRatio / bRatio);
          backImg.style.transform = `scale(${Math.min(1.15, Math.max(0.85, scaleComp))})`;
        }
      };
      if (frontImg.complete && backImg.complete) adjustScale();
      else {
        frontImg.addEventListener('load', adjustScale);
        backImg.addEventListener('load', adjustScale);
      }
    }

    function updateFlipUI() {
      card.classList.toggle('is-flipped', isFlipped);
      card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
      currentDeg = isFlipped ? 180 : 0;
      if (badge) badge.innerHTML = isFlipped ? '<span>背面</span> 2/2' : '<span>正面</span> 1/2';
      if (flipBtn) flipBtn.textContent = isFlipped ? '翻轉看正面' : '翻轉看背面';
    }

    if (flipBtn) {
      flipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isFlipped = !isFlipped;
        updateFlipUI();
      });
    }

    // Touch & pointer gesture
    card.addEventListener('pointerdown', (e) => {
      if (e.target.closest('#btnEditItem') || e.target.closest('#btnFlipPhoto')) return;
      dragging = true;
      startX = e.clientX;
      startDeg = isFlipped ? 180 : 0;
      card.classList.add('is-dragging');
      if (card.setPointerCapture) {
        try { card.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });

    card.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      currentDeg = startDeg - (dx * 1.05);
      card.style.transform = `rotateY(${currentDeg}deg)`;
    });

    const finishDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('is-dragging');
      const dx = e.clientX - startX;
      const norm = ((currentDeg % 360) + 360) % 360;
      if (Math.abs(dx) > 18) {
        if (dx < -18) isFlipped = true;
        else if (dx > 18) isFlipped = false;
      } else {
        isFlipped = norm > 90 && norm < 270;
      }
      updateFlipUI();
    };

    card.addEventListener('pointerup', finishDrag);
    card.addEventListener('pointercancel', finishDrag);
  }

  // Bottom Archive Button & Confirmation Modal
  const btnArchive = body.querySelector('#btnDetailArchive');
  if (btnArchive) {
    btnArchive.addEventListener('click', () => {
      if (item.status === 'retired') {
        restoreItem(item.id);
        closeModal();
        toast('已自典藏恢復到衣櫥');
        return;
      }
      const modal = document.getElementById('modal-archive-confirm');
      if (!modal) return;
      const photo = document.getElementById('archiveConfirmPhoto');
      const placeholder = document.getElementById('archiveConfirmPhotoPlaceholder');
      const text = document.getElementById('archiveConfirmText');
      if (text) text.textContent = `確定將「${item.name}」移至典藏？`;
      if (item.image) {
        if (photo) { photo.src = item.image; photo.hidden = false; }
        if (placeholder) placeholder.hidden = true;
      } else {
        if (photo) photo.hidden = true;
        if (placeholder) {
          placeholder.hidden = false;
          placeholder.innerHTML = categoryIcon(item.category);
        }
      }
      const submitBtn = document.getElementById('btnArchiveConfirmSubmit');
      if (submitBtn) {
        submitBtn.onclick = () => {
          retireItem(item.id);
          closeModal();
          renderWardrobe();
          toast(`已將「${item.name}」移至典藏`);
        };
      }
      openModal('modal-archive-confirm');
    });
  }

  // Quick care actions
  const btnQuickDeodorize = body.querySelector('#btnQuickDeodorize');
  if (btnQuickDeodorize) {
    btnQuickDeodorize.addEventListener('click', () => {
      item.deodorizeHistory = Array.isArray(item.deodorizeHistory) ? item.deodorizeHistory : [];
      item.deodorizeHistory.unshift(todayStr());
      saveState();
      toast('已記錄今日除臭');
      openItemDetail(item.id);
    });
  }

  const btnQuickStain = body.querySelector('#btnQuickStain');
  if (btnQuickStain) {
    btnQuickStain.addEventListener('click', () => {
      activeStainItemId = item.id;
      document.getElementById('fieldStainDate').value = todayStr();
      document.getElementById('fieldStainNote').value = '';
      openModal('modal-stain');
    });
  }

  const actions = body.querySelector('#detailActionsPrimary');
  if (item.status === 'retired') {
    actions.innerHTML = `<button class="btn-secondary" id="a1">恢復到衣櫥</button>`;
    actions.querySelector('#a1').addEventListener('click', () => { restoreItem(item.id); closeModal(); });
  } else {
    let html = '';
    if (ALL_SLOTS.includes(item.category)) html += `<button class="btn-secondary" id="aWearToday">設為今日穿搭</button>`;
    if (['dirty', 'resting'].includes(item.status)) html += `<button class="btn-secondary" id="aBoost">${item.extraWash ? '取消加強清洗' : '標記加強清洗'}</button>`;
    if (item.status === 'dirty') html += `<button class="btn-secondary" id="aClean">已記錄清洗</button>`;
    if (item.status !== 'dirty') html += `<button class="btn-secondary" id="aBasket">丟進洗衣籃</button>`;
    if (item.status !== 'resting') html += `<button class="btn-secondary" id="aTempRack">移至暫存衣架</button>`;
    else html += `<button class="btn-secondary" id="aClean">放回衣櫥（乾淨）</button>`;
    actions.innerHTML = html;
    const aWearToday = actions.querySelector('#aWearToday');
    if (aWearToday) aWearToday.addEventListener('click', () => { setTodaySlot(item.category, item.id); closeModal(); toast(`已設為今日${categoryLabel(item.category)}`); });
    const aBoost = actions.querySelector('#aBoost');
    if (aBoost) aBoost.addEventListener('click', () => { toggleExtraWash(item.id); openItemDetail(item.id); });
    const aClean = actions.querySelector('#aClean');
    if (aClean) aClean.addEventListener('click', () => { markItemClean(item.id); closeModal(); });
    const aBasket = actions.querySelector('#aBasket');
    if (aBasket) aBasket.addEventListener('click', () => { sendToBasketNow(item.id); closeModal(); });
    const aTempRack = actions.querySelector('#aTempRack');
    if (aTempRack) aTempRack.addEventListener('click', () => { sendToTempRackNow(item.id); closeModal(); });
  }
  openModal('modal-item');
}

function openPhotoOptions(item, side = 'front') {
  const currentImg = side === 'back' ? item.imageBack : item.image;
  const actions = [];
  if (currentImg) {
    actions.push({
      label: '放大檢視照片',
      kind: 'primary',
      onClick: () => {
        openPhotoViewerModal(currentImg);
      }
    });
  }
  actions.push({
    label: currentImg ? '更換此面照片' : '新增照片',
    kind: currentImg ? 'secondary' : 'primary',
    onClick: () => {
      pickAndReplaceItemPhoto(item, side);
    }
  });
  actions.push({ label: '取消', kind: 'secondary' });
  openConfirm(
    `${item.name}（${side === 'back' ? '背面' : '正面'}）`,
    currentImg ? '您可以全螢幕放大檢視照片，或直接更換此單品照片。' : '選擇一張照片上傳。',
    actions
  );
}

function openPhotoViewerModal(imgUrl) {
  const modal = document.getElementById('photoViewerModal');
  const img = document.getElementById('photoViewerImg');
  if (!modal || !img) return;
  img.src = imgUrl;
  modal.classList.remove('is-hidden');
}

function pickAndReplaceItemPhoto(item, side = 'front') {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast('處理照片中…');
    try {
      const dataUrl = await compressImageFile(file, 800, 0.85);
      if (side === 'back') {
        item.imageBack = dataUrl;
      } else {
        item.image = dataUrl;
      }
      saveState({ action: `更換「${item.name}」照片` });
      openItemDetail(item.id);
      renderAll();
      toast('照片已更換');
    } catch (_) {
      toast('照片處理失敗，請換一張試試');
    }
  };
  input.click();
}

const COMMON_MATERIALS = ['純棉', '聚酯纖維', '亞麻', '羊毛', '蠶絲', '丹寧/牛仔', '天絲/莫代爾', '羽絨', '尼龍', '混紡'];
let pendingMaterial = '';
let activeStainItemId = null;
let editingHaircutId = null;
let pendingHaircutPhoto = null;

let pendingPhoto = null;
let pendingPhotoBack = null;
let pendingCategory = 'top';
let pendingTags = [];
let pendingColor = { hex: '', name: '', family: '' };
let editingItemId = null;
let backfillDraft = null;
let formDirty = false;
let modalReturnTo = null; // sheet id to return to instead of fully closing (e.g. number-grid -> settings)
let editingWishlistId = null;
let pendingWishlistPhoto = null;
let pendingWishlistCategory = 'top';
let pendingWishlistTags = [];
let wishlistDirty = false;
let wishlistEditSnapshot = null;
let unsavedContext = null;

function setPhotoPreview(wrap, src, emptyLabel) {
  if (src) {
    wrap.setAttribute('style', `background-image:url('${src}')`);
    wrap.classList.add('has-photo');
    wrap.innerHTML = '';
  } else {
    wrap.removeAttribute('style');
    wrap.classList.remove('has-photo');
    wrap.innerHTML = `<span data-icon="camera"></span><span>${emptyLabel}</span>`;
    applyStaticIcons();
  }
}
function autoSaveAddItemDraft() {
  const name = document.getElementById('fieldName')?.value.trim() || '';
  const material = (pendingMaterial || document.getElementById('fieldMaterialCustom')?.value || '').trim();
  const draft = {
    name,
    category: pendingCategory,
    tags: pendingTags.slice(),
    material,
    color: pendingColor.name || '',
    colorHex: pendingColor.hex || '',
    colorFamily: pendingColor.family || '',
    purchaseDate: document.getElementById('fieldPurchaseDate')?.value || '',
    price: document.getElementById('fieldPrice')?.value ? Number(document.getElementById('fieldPrice').value) : null,
    archiveDirect: !!document.getElementById('fieldArchiveDirect')?.checked,
    image: pendingPhoto,
    imageBack: pendingPhotoBack,
    brand: pendingBrandName.trim(),
    brandIcon: pendingBrandIcon || null,
  };
  if (editingItemId) {
    const item = findItem(editingItemId);
    if (item) {
      Object.assign(item, {
        name: draft.name || item.name,
        category: draft.category,
        tags: draft.tags,
        material: draft.material,
        color: draft.color,
        colorHex: draft.colorHex,
        colorFamily: draft.colorFamily,
        purchaseDate: draft.purchaseDate,
        price: draft.price,
        image: draft.image || item.image,
        imageBack: draft.imageBack || item.imageBack || null,
        brand: draft.brand,
        brandIcon: draft.brandIcon || null,
      });
      if (item.status !== 'dirty' && item.status !== 'retired') item.status = computeStatusAfterWear(item);
    }
  } else {
    state.drafts.addItem = draft;
  }
  saveState();
}
function readSettingsDraft() {
  const readPicker = id => {
    const el = document.getElementById(id);
    if (!el) return null;
    const v = el.dataset.value;
    return v === 'none' ? null : Number(v);
  };
  if (!document.getElementById('settingName')) return;
  state.profile.name = document.getElementById('settingName').value.trim();
  const keyInput = document.getElementById('settingGeminiApiKey');
  if (keyInput) {
    state.geminiApiKey = keyInput.value.trim();
    if (state.geminiApiKey) localStorage.setItem('gemini_api_key', state.geminiApiKey);
  }
  state.profile.washThresholds = {
    bottom: readPicker('pickThresholdBottom'),
    outer: readPicker('pickThresholdOuter'),
    shoes: readPicker('pickThresholdShoes'),
    hat: readPicker('pickThresholdHat'),
    accessory: readPicker('pickThresholdAccessory'),
  };
  const towelDays = readPicker('pickThresholdTowel');
  state.consumables.forEach(c => { if (isTowelId(c.id)) c.cycleDays = towelDays; });
}
function saveSettingsDraft() {
  readSettingsDraft();
  saveState();
  renderHeader();
}
function persistTransientForms() {
  const active = document.querySelector('.modal-sheet.is-active')?.id;
  if (active === 'modal-add') autoSaveAddItemDraft();
  if (active === 'modal-settings') saveSettingsDraft();
  if (active === 'modal-wishlist') autoSaveWishlistDraft();
}

function renderCategoryPickerChips() {
  const row = document.getElementById('categoryPickerChips');
  row.innerHTML = '';
  allCategoryIds().forEach(id => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (pendingCategory === id ? ' is-active' : '');
    chip.textContent = categoryLabel(id);
    chip.addEventListener('click', () => {
      pendingCategory = id;
      formDirty = true;
      renderCategoryPickerChips();
      document.getElementById('lengthToggleWrap').classList.toggle('is-hidden', !(id === 'top' || id === 'bottom'));
      autoSaveAddItemDraft();
    });
    row.appendChild(chip);
  });
  document.getElementById('lengthToggleWrap').classList.toggle('is-hidden', !(pendingCategory === 'top' || pendingCategory === 'bottom'));
}
function renderLengthToggle() {
  document.querySelectorAll('#lengthToggle .segment-btn').forEach(b => {
    b.classList.toggle('is-active', pendingTags.includes(b.getAttribute('data-len')));
  });
}
function renderTagPickerChips() {
  const row = document.getElementById('tagPickerChips');
  row.innerHTML = '';
  const tags = Array.from(new Set(allTagsUsed().concat(pendingTags)));
  tags.forEach(t => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (pendingTags.includes(t) ? ' is-active' : '');
    chip.textContent = t;
    chip.addEventListener('click', () => {
      pendingTags = pendingTags.includes(t) ? pendingTags.filter(x => x !== t) : pendingTags.concat(t);
      formDirty = true;
      renderTagPickerChips();
      renderLengthToggle();
      autoSaveAddItemDraft();
    });
    row.appendChild(chip);
  });
}

function renderMaterialPickerChips() {
  const row = document.getElementById('materialPickerChips');
  if (!row) return;
  row.innerHTML = '';
  COMMON_MATERIALS.forEach(mat => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (pendingMaterial === mat ? ' is-active' : '');
    chip.textContent = mat;
    chip.addEventListener('click', () => {
      if (pendingMaterial === mat) {
        pendingMaterial = '';
        const customInput = document.getElementById('fieldMaterialCustom');
        if (customInput) customInput.value = '';
      } else {
        pendingMaterial = mat;
        const customInput = document.getElementById('fieldMaterialCustom');
        if (customInput) customInput.value = mat;
      }
      formDirty = true;
      renderMaterialPickerChips();
      autoSaveAddItemDraft();
    });
    row.appendChild(chip);
  });
}

function renderColorForm() {
  const chipsWrap = document.getElementById('colorPresetChips');
  if (!chipsWrap) return;
  chipsWrap.innerHTML = '';
  TEN_COLORS.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-swatch-chip' + (pendingColor.hex === c.hex || pendingColor.name === c.name ? ' is-active' : '');
    btn.setAttribute('data-color', c.name);
    btn.setAttribute('data-hex', c.hex);
    btn.title = c.name;
    btn.style.backgroundColor = c.hex;
    btn.addEventListener('click', () => {
      if (pendingColor.hex === c.hex || pendingColor.name === c.name) {
        pendingColor = { hex: '', name: '', family: '' };
      } else {
        pendingColor = { hex: c.hex, name: c.name, family: c.name };
      }
      formDirty = true;
      syncColorFormUI();
      autoSaveAddItemDraft();
    });
    chipsWrap.appendChild(btn);
  });
  syncColorFormUI();
}

function syncColorFormUI() {
  const btnClear = document.getElementById('btnClearColor');
  if (btnClear) btnClear.hidden = !pendingColor.hex && !pendingColor.name;

  document.querySelectorAll('#colorPresetChips .color-swatch-chip').forEach(btn => {
    const name = btn.getAttribute('data-color');
    const hex = btn.getAttribute('data-hex');
    btn.classList.toggle('is-active', pendingColor.name === name || pendingColor.hex === hex);
  });
}

let outfitEditorSlot = 'top';
let outfitPointerDrag = null;
let outfitScaleSaveTimer = null;
const OUTFIT_EDITOR_SLOTS = ['hat', 'top', 'bottom', 'shoes'];
const OUTFIT_EDITOR_Y = { hat: 13, top: 35, bottom: 61, shoes: 86 };
const OUTFIT_EDITOR_WIDTH = { hat: 24, top: 30, bottom: 29, shoes: 25 };
function outfitEditorItem(slot) { return state.today[slot] ? findItem(state.today[slot]) : null; }
function outfitEditorPositionText(layout) {
  const x = Math.round(layout.x || 0), y = Math.round(layout.y || 0);
  if (!x && !y) return '中央';
  return `${x > 0 ? '+' : ''}${x}%、${y > 0 ? '+' : ''}${y}%`;
}
function updateOutfitEditorControls() {
  const layout = state.profile.outfitLayout[outfitEditorSlot] || OUTFIT_LAYOUT_DEFAULTS[outfitEditorSlot];
  const slider = document.getElementById('outfitScaleSlider');
  const value = document.getElementById('outfitScaleValue');
  const position = document.getElementById('outfitPositionValue');
  if (slider) slider.value = String(layout.scale);
  if (value) value.textContent = `${layout.scale}%`;
  if (position) position.textContent = outfitEditorPositionText(layout);
}
function applyOutfitEditorObjectStyle(el, slot) {
  const layout = state.profile.outfitLayout[slot] || OUTFIT_LAYOUT_DEFAULTS[slot];
  el.style.left = '50%';
  el.style.top = `${OUTFIT_EDITOR_Y[slot]}%`;
  el.style.width = `${OUTFIT_EDITOR_WIDTH[slot]}%`;
  el.style.transform = `translate(-50%, -50%) translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
}
function selectOutfitEditorSlot(slot) {
  outfitEditorSlot = slot;
  renderOutfitEditor();
}
function attachOutfitEditorDrag(el, slot) {
  el.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const stage = document.getElementById('outfitEditorStage');
    if (!stage) return;
    outfitEditorSlot = slot;
    const layout = state.profile.outfitLayout[slot];
    outfitPointerDrag = { slot, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, startXLayout: layout.x, startYLayout: layout.y, stage };
    el.setPointerCapture?.(e.pointerId);
    el.classList.add('is-dragging');
    e.preventDefault();
  });
  el.addEventListener('pointermove', e => {
    const drag = outfitPointerDrag;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const layout = state.profile.outfitLayout[drag.slot];
    const dx = (e.clientX - drag.startX) / Math.max(1, drag.stage.clientWidth) * 100;
    const dy = (e.clientY - drag.startY) / Math.max(1, drag.stage.clientHeight) * 100;
    layout.x = Math.min(28, Math.max(-28, Math.round(drag.startXLayout + dx)));
    layout.y = Math.min(28, Math.max(-28, Math.round(drag.startYLayout + dy)));
    applyOutfitEditorObjectStyle(el, drag.slot);
    updateOutfitEditorControls();
    e.preventDefault();
  });
  const finish = e => {
    const drag = outfitPointerDrag;
    if (!drag || drag.pointerId !== e.pointerId) return;
    outfitPointerDrag = null;
    el.classList.remove('is-dragging');
    saveState();
    renderHome();
    updateOutfitEditorControls();
  };
  el.addEventListener('pointerup', finish);
  el.addEventListener('pointercancel', finish);
}
let studioActiveSlot = 'top';
let studioPointerDrag = null;

function renderOutfitStudio() {
  const overlay = document.getElementById('pageOutfitStudio');
  if (!overlay || overlay.hidden) return;

  const current = state.profile.weather?.current;
  const isNight = current && current.is_day != null ? Number(current.is_day) === 0 : (new Date().getHours() >= 18 || new Date().getHours() < 6);
  overlay.classList.toggle('night-mode', isNight);

  document.querySelectorAll('#studioSlotTabs .outfit-editor-slot-tab').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.studioTab === studioActiveSlot);
  });

  ['hat', 'top', 'bottom', 'shoes'].forEach(slot => {
    const slotBtn = document.querySelector(`.studio-figure-slot[data-studio-slot="${slot}"]`);
    const thumb = document.getElementById(`studioThumb${slot.charAt(0).toUpperCase() + slot.slice(1)}`);
    if (!slotBtn || !thumb) return;

    slotBtn.classList.toggle('is-selected', studioActiveSlot === slot);
    const layout = (state.profile.outfitLayout && state.profile.outfitLayout[slot]) || OUTFIT_LAYOUT_DEFAULTS[slot];
    const itemId = state.today[slot];
    const item = itemId ? findItem(itemId) : null;
    const ratio = HOME_SLOT_RATIOS[slot] || getCategoryAspectRatio(slot);
    const pos = (slot === 'top' || slot === 'hat') ? 'center bottom' : 'center top';

    if (item && item.image) {
      const cleanImg = transparentCleanCache.get(item.image) || item.image;
      thumb.setAttribute('style', `background-image:url('${cleanImg}');background-repeat:no-repeat;background-position:${pos};background-size:contain;background-color:transparent;aspect-ratio:${ratio};`);
      thumb.innerHTML = '';
      cleanTransparentImage(item.image, (cleanUrl, changed) => {
        if (changed) {
          item.image = cleanUrl;
          saveState();
        }
        thumb.style.backgroundImage = `url('${cleanUrl}')`;
      });
    } else if (item) {
      thumb.setAttribute('style', `aspect-ratio:${ratio};background-color:transparent;`);
      thumb.innerHTML = thumbInner(item);
    } else {
      thumb.setAttribute('style', `aspect-ratio:${ratio};background-color:transparent;`);
      thumb.innerHTML = ICONS[slot] || '';
    }

    thumb.style.transform = `translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
  });

  const activeLayout = (state.profile.outfitLayout && state.profile.outfitLayout[studioActiveSlot]) || OUTFIT_LAYOUT_DEFAULTS[studioActiveSlot];
  const slider = document.getElementById('studioScaleSlider');
  const valOut = document.getElementById('studioScaleValue');
  const label = document.getElementById('studioScaleLabel');
  if (slider) slider.value = String(activeLayout.scale);
  if (valOut) valOut.textContent = `${activeLayout.scale}%`;
  if (label) label.textContent = `${categoryLabel(studioActiveSlot)}大小`;

  const posXSlider = document.getElementById('studioPosXSlider');
  const posXVal = document.getElementById('studioPosXValue');
  const posYSlider = document.getElementById('studioPosYSlider');
  const posYVal = document.getElementById('studioPosYValue');
  if (posXSlider) posXSlider.value = String(activeLayout.x || 0);
  if (posXVal) posXVal.textContent = `${activeLayout.x || 0}%`;
  if (posYSlider) posYSlider.value = String(activeLayout.y || 0);
  if (posYVal) posYVal.textContent = `${activeLayout.y || 0}%`;
}

function openOutfitStudio() {
  studioActiveSlot = state.today.top ? 'top' : 'hat';
  const overlay = document.getElementById('pageOutfitStudio');
  if (!overlay) return;
  overlay.hidden = false;
  renderOutfitStudio();
}

function closeOutfitStudio() {
  const overlay = document.getElementById('pageOutfitStudio');
  if (overlay) overlay.hidden = true;
  saveState({ action: '調整穿搭版面' });
  renderHome();
  toast('穿搭版面設定已儲存');
}

function selectStudioSlot(slot) {
  studioActiveSlot = slot;
  renderOutfitStudio();
}

function wireOutfitStudioEvents() {
  document.getElementById('btnStudioDone')?.addEventListener('click', closeOutfitStudio);

  document.querySelectorAll('#studioSlotTabs .outfit-editor-slot-tab').forEach(btn => {
    btn.addEventListener('click', () => selectStudioSlot(btn.dataset.studioTab));
  });

  document.querySelectorAll('.studio-figure-slot').forEach(btn => {
    const slot = btn.dataset.studioSlot;
    btn.addEventListener('click', e => {
      if (btn.classList.contains('is-dragging')) return;
      selectStudioSlot(slot);
      e.stopPropagation();
    });

    btn.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      selectStudioSlot(slot);
      const layout = state.profile.outfitLayout[slot] = state.profile.outfitLayout[slot] || { ...OUTFIT_LAYOUT_DEFAULTS[slot] };
      studioPointerDrag = {
        slot,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startXLayout: layout.x,
        startYLayout: layout.y,
        el: btn
      };
      btn.setPointerCapture?.(e.pointerId);
      btn.classList.add('is-dragging');
      e.preventDefault();
    });

    btn.addEventListener('pointermove', e => {
      const drag = studioPointerDrag;
      if (!drag || drag.pointerId !== e.pointerId || drag.slot !== slot) return;
      const layout = state.profile.outfitLayout[slot];
      const dx = ((e.clientX - drag.startX) / 140) * 100;
      const dy = ((e.clientY - drag.startY) / 140) * 100;
      layout.x = Math.min(35, Math.max(-35, Math.round(drag.startXLayout + dx)));
      layout.y = Math.min(35, Math.max(-35, Math.round(drag.startYLayout + dy)));
      const thumb = document.getElementById(`studioThumb${slot.charAt(0).toUpperCase() + slot.slice(1)}`);
      if (thumb) {
        thumb.style.transform = `translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
      }
      e.preventDefault();
    });

    const finishDrag = e => {
      const drag = studioPointerDrag;
      if (!drag || drag.pointerId !== e.pointerId) return;
      studioPointerDrag = null;
      btn.classList.remove('is-dragging');
      renderOutfitStudio();
    };
    btn.addEventListener('pointerup', finishDrag);
    btn.addEventListener('pointercancel', finishDrag);
  });

  document.getElementById('studioScaleSlider')?.addEventListener('input', e => {
    const layout = state.profile.outfitLayout[studioActiveSlot] = state.profile.outfitLayout[studioActiveSlot] || { ...OUTFIT_LAYOUT_DEFAULTS[studioActiveSlot] };
    layout.scale = Math.min(140, Math.max(70, Number(e.target.value) || 100));
    const valOut = document.getElementById('studioScaleValue');
    if (valOut) valOut.textContent = `${layout.scale}%`;
    const thumb = document.getElementById(`studioThumb${studioActiveSlot.charAt(0).toUpperCase() + studioActiveSlot.slice(1)}`);
    if (thumb) {
      thumb.style.transform = `translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
    }
  });

  document.getElementById('studioPosXSlider')?.addEventListener('input', e => {
    const layout = state.profile.outfitLayout[studioActiveSlot] = state.profile.outfitLayout[studioActiveSlot] || { ...OUTFIT_LAYOUT_DEFAULTS[studioActiveSlot] };
    layout.x = Math.min(35, Math.max(-35, Number(e.target.value) || 0));
    const valOut = document.getElementById('studioPosXValue');
    if (valOut) valOut.textContent = `${layout.x}%`;
    const thumb = document.getElementById(`studioThumb${studioActiveSlot.charAt(0).toUpperCase() + studioActiveSlot.slice(1)}`);
    if (thumb) {
      thumb.style.transform = `translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
    }
  });

  document.getElementById('studioPosYSlider')?.addEventListener('input', e => {
    const layout = state.profile.outfitLayout[studioActiveSlot] = state.profile.outfitLayout[studioActiveSlot] || { ...OUTFIT_LAYOUT_DEFAULTS[studioActiveSlot] };
    layout.y = Math.min(35, Math.max(-35, Number(e.target.value) || 0));
    const valOut = document.getElementById('studioPosYValue');
    if (valOut) valOut.textContent = `${layout.y}%`;
    const thumb = document.getElementById(`studioThumb${studioActiveSlot.charAt(0).toUpperCase() + studioActiveSlot.slice(1)}`);
    if (thumb) {
      thumb.style.transform = `translate(${layout.x}%, ${layout.y}%) scale(${layout.scale / 100})`;
    }
  });

  document.getElementById('btnStudioResetPos')?.addEventListener('click', () => {
    const layout = state.profile.outfitLayout[studioActiveSlot] = state.profile.outfitLayout[studioActiveSlot] || { ...OUTFIT_LAYOUT_DEFAULTS[studioActiveSlot] };
    layout.x = 0;
    layout.y = 0;
    renderOutfitStudio();
    toast(`已重設${categoryLabel(studioActiveSlot)}位置`);
  });

  document.getElementById('btnStudioResetScale')?.addEventListener('click', () => {
    const layout = state.profile.outfitLayout[studioActiveSlot] = state.profile.outfitLayout[studioActiveSlot] || { ...OUTFIT_LAYOUT_DEFAULTS[studioActiveSlot] };
    layout.scale = OUTFIT_LAYOUT_DEFAULTS[studioActiveSlot].scale;
    renderOutfitStudio();
    toast(`已重設${categoryLabel(studioActiveSlot)}大小`);
  });
}

function renderOutfitEditor() {
  openOutfitStudio();
}
function openOutfitEditor() {
  openOutfitStudio();
}

function openAddModal(editId = null) {
  editingItemId = editId;
  pendingPhoto = null;
  pendingPhotoBack = null;
  pendingMaterial = '';
  document.getElementById('fieldMaterialCustom').value = '';
  pendingBrandName = '';
  pendingBrandIcon = null;
  pendingColor = { hex: '', name: '', family: '' };
  pendingCategory = 'top';
  pendingTags = [];
  formDirty = false;
  const form = document.getElementById('addItemForm');
  form.reset();
  document.getElementById('photoPreviewWrap').removeAttribute('style');
  document.getElementById('photoPreviewWrap').classList.remove('has-photo');
  document.getElementById('photoPreviewWrap').innerHTML = `<span data-icon="camera"></span><span>上傳照片（可一次選2張，第2張當背面）</span>`;
  const hintWrap = document.getElementById('photoBackHintWrap');
  if (hintWrap) hintWrap.hidden = true;
  document.getElementById('btnReadjustPhoto').classList.add('is-hidden');
  syncBrandForm('', null);
  renderEstablishedBrandChips();
  applyStaticIcons();

  const editExtra = document.getElementById('editExtraActions');
  const archiveRow = document.getElementById('archiveCheckboxRow');
  document.getElementById('fieldArchiveDirect').checked = false;

  const savedDraft = !editId && state.drafts && state.drafts.addItem;
  if (savedDraft) {
    pendingCategory = savedDraft.category || 'top';
    pendingTags = Array.isArray(savedDraft.tags) ? savedDraft.tags.slice() : [];
    pendingMaterial = savedDraft.material || '';
    document.getElementById('fieldMaterialCustom').value = pendingMaterial;
    document.getElementById('fieldName').value = savedDraft.name || '';
    document.getElementById('fieldPurchaseDate').value = savedDraft.purchaseDate || '';
    document.getElementById('fieldPrice').value = savedDraft.price ?? '';
    document.getElementById('fieldArchiveDirect').checked = !!savedDraft.archiveDirect;
    pendingPhoto = savedDraft.image || null;
    pendingPhotoBack = savedDraft.imageBack || null;
    pendingColor = {
      hex: savedDraft.colorHex || '',
      name: savedDraft.color || '',
      family: savedDraft.colorFamily || (savedDraft.colorHex ? classifyColorFamily(savedDraft.colorHex) : '')
    };
    syncBrandForm(savedDraft.brand || '', savedDraft.brandIcon || null);
    setPhotoPreview(document.getElementById('photoPreviewWrap'), pendingPhoto, '上傳照片（可一次選2張，第2張當背面）');
    if (hintWrap) hintWrap.hidden = !pendingPhotoBack;
    document.getElementById('btnReadjustPhoto').classList.toggle('is-hidden', !pendingPhoto || !editId);
  }

  if (editId) {
    const item = findItem(editId);
    pendingCategory = item.category;
    pendingTags = (item.tags || []).slice();
    pendingMaterial = item.material || '';
    document.getElementById('fieldMaterialCustom').value = pendingMaterial;
    pendingColor = {
      hex: item.colorHex || '',
      name: item.color || '',
      family: item.colorFamily || (item.colorHex ? classifyColorFamily(item.colorHex) : '')
    };
    syncBrandForm(item.brand || '', item.brandIcon || null);
    document.getElementById('addModalTitle').textContent = '編輯單品';
    document.getElementById('addFormSubmitBtn').textContent = '儲存修改';
    document.getElementById('fieldName').value = item.name || '';
    document.getElementById('fieldBrand').value = item.brand || '';
    document.getElementById('fieldPurchaseDate').value = item.purchaseDate || '';
    document.getElementById('fieldPrice').value = item.price ?? '';
    if (item.image) {
      pendingPhoto = item.image;
      const wrap = document.getElementById('photoPreviewWrap');
      wrap.setAttribute('style', `background-image:url('${item.image}')`);
      wrap.classList.add('has-photo');
      wrap.innerHTML = '';
      document.getElementById('btnReadjustPhoto').classList.remove('is-hidden');
    }
    pendingPhotoBack = item.imageBack || null;
    if (hintWrap) hintWrap.hidden = !pendingPhotoBack;
    editExtra.classList.remove('is-hidden');
    archiveRow.classList.add('is-hidden');
  } else {
    document.getElementById('addModalTitle').textContent = '新增單品';
    document.getElementById('addFormSubmitBtn').textContent = '加入衣櫥';
    editExtra.classList.add('is-hidden');
    archiveRow.classList.remove('is-hidden');
  }
  renderCategoryPickerChips();
  renderLengthToggle();
  renderTagPickerChips();
  renderMaterialPickerChips();
  renderColorForm();
  formDirty = false; // the population above doesn't count as a user edit
  const addSheet = document.getElementById('modal-add');
  if (addSheet) addSheet.scrollTop = 0;
  openModal('modal-add');
  requestAnimationFrame(() => {
    if (addSheet) addSheet.scrollTop = 0;
  });
}

/* ============================================================
   MODAL PLUMBING (incl. swipe-to-dismiss)
   ============================================================ */
let modalStack = [];
function openModal(id, opts = {}) {
  const current = document.querySelector('.modal-sheet.is-active:not(.is-behind)') || document.querySelector('.modal-sheet.is-active');
  if (current && current.id !== id && !opts.fromStack) {
    persistTransientForms();
    modalStack.push({ id: current.id, returnTo: modalReturnTo, editingItemId });
    current.classList.add('is-behind');
  }
  document.querySelectorAll('.modal-sheet').forEach(s => {
    if (s.id !== id && !modalStack.some(m => m.id === s.id)) {
      s.classList.remove('is-active', 'is-shown', 'is-behind');
      s.style.transform = '';
      s.style.zIndex = '';
    }
  });
  const sheet = document.getElementById(id);
  if (!sheet) return;
  sheet.scrollTop = 0;
  sheet.classList.remove('is-behind');
  sheet.classList.add('is-active');
  sheet.style.zIndex = String(610 + modalStack.length * 10);
  document.getElementById('modalOverlay').classList.add('is-open');
  void sheet.offsetHeight;
  requestAnimationFrame(() => {
    sheet.classList.add('is-shown');
    sheet.scrollTop = 0;
  });
}
function forceCloseModal(options = {}) {
  if (!options.skipPersist) persistTransientForms();
  document.getElementById('modalOverlay').classList.remove('is-open');
  const sheet = document.querySelector('.modal-sheet.is-active:not(.is-behind)') || document.querySelector('.modal-sheet.is-active');
  if (sheet) {
    sheet.classList.remove('is-shown');
    const finish = () => {
      sheet.classList.remove('is-active', 'is-behind');
      sheet.style.zIndex = '';
      sheet.removeEventListener('transitionend', finish);
    };
    sheet.addEventListener('transitionend', finish);
    setTimeout(finish, 360);
  }
  document.querySelectorAll('.modal-sheet.is-behind').forEach(s => {
    s.classList.remove('is-active', 'is-shown', 'is-behind');
    s.style.zIndex = '';
  });
  modalStack = [];
  backfillDraft = null;
  formDirty = false;
  wishlistDirty = false;
  wishlistEditSnapshot = null;
  unsavedContext = null;
  modalReturnTo = null;
}
function openUnsavedPrompt(context) {
  unsavedContext = context;
  const isWishlist = context === 'wishlist';
  document.querySelector('#modal-unsaved h2').textContent = isWishlist ? '要儲存這件想買單品嗎？' : '要儲存變更嗎？';
  document.querySelector('#modal-unsaved .section-intro').textContent = isWishlist ? '這件想買單品的內容還沒儲存。' : '這個單品的內容還沒儲存。';
  document.getElementById('btnUnsavedDiscard').textContent = '放棄';
  document.getElementById('btnUnsavedSave').textContent = isWishlist ? '儲存到想買清單' : '儲存';
  openModal('modal-unsaved');
}
function closeModal() {
  const activeBeforePersist = document.querySelector('.modal-sheet.is-active:not(.is-behind)') || document.querySelector('.modal-sheet.is-active');
  if (activeBeforePersist?.id === 'modal-add' && formDirty) { openUnsavedPrompt('item'); return; }
  if (activeBeforePersist?.id === 'modal-wishlist' && wishlistDirty) { openUnsavedPrompt('wishlist'); return; }
  persistTransientForms();

  const activeSheet = document.querySelector('.modal-sheet.is-active:not(.is-behind)') || document.querySelector('.modal-sheet.is-active');
  if (!activeSheet) {
    forceCloseModal();
    return;
  }

  // If canceling out of editing an item, return straight to that item's detail sheet!
  if (activeSheet?.id === 'modal-add' && editingItemId) {
    const returnId = editingItemId;
    editingItemId = null;
    modalStack = modalStack.filter(m => m.id !== 'modal-add' && m.id !== 'modal-item');
    activeSheet.classList.remove('is-shown');
    setTimeout(() => { activeSheet.classList.remove('is-active'); }, 280);
    openItemDetail(returnId);
    return;
  }

  // if we're picking an item for a backfill draft, closing the picker returns to backfill
  if (backfillDraft && activeSheet?.id === 'modal-tryon') {
    renderBackfillModal();
    activeSheet.classList.remove('is-shown');
    setTimeout(() => { activeSheet.classList.remove('is-active'); }, 280);
    openModal('modal-backfill', { fromStack: true });
    return;
  }

  if (modalReturnTo && activeSheet && activeSheet.id !== modalReturnTo) {
    const target = modalReturnTo;
    modalReturnTo = null;
    activeSheet.classList.remove('is-shown');
    setTimeout(() => { activeSheet.classList.remove('is-active'); }, 280);
    if (target === 'modal-item' && editingItemId) {
      const returnId = editingItemId;
      editingItemId = null;
      openItemDetail(returnId);
    } else {
      openModal(target, { fromStack: true });
      if (target === 'modal-tryon' && tryonCurrentSlot) renderTryonGridFor(tryonCurrentSlot, tryonCurrentCategory);
    }
    return;
  }

  if (modalStack.length > 0) {
    const prev = modalStack.pop();
    if (prev && prev.id && prev.id !== activeSheet?.id) {
      activeSheet.classList.remove('is-shown');
      setTimeout(() => {
        activeSheet.classList.remove('is-active');
        activeSheet.style.zIndex = '';
      }, 300);

      const prevSheet = document.getElementById(prev.id);
      if (prevSheet) {
        prevSheet.classList.remove('is-behind');
        prevSheet.style.zIndex = String(610 + modalStack.length * 10);
        modalReturnTo = prev.returnTo || null;
        if (prev.id === 'modal-item' && prev.editingItemId) {
          renderItemDetail(prev.editingItemId);
        } else if (prev.id === 'modal-tryon' && tryonCurrentSlot) {
          renderTryonGridFor(tryonCurrentSlot, tryonCurrentCategory);
        }
      }
      return;
    }
  }

  forceCloseModal();
}
function openConfirm(title, body, actions) {
  document.getElementById('confirmTitle').textContent = title;
  const bodyEl = document.getElementById('confirmBody');
  if (typeof body === 'string' && body.includes('<')) {
    bodyEl.innerHTML = body;
  } else {
    bodyEl.textContent = body;
  }
  const wrap = document.getElementById('confirmActions');
  wrap.innerHTML = '';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = a.kind === 'primary' ? 'btn-primary' : a.kind === 'danger' ? 'btn-secondary btn-danger' : 'btn-secondary';
    btn.style.flex = '1 1 auto';
    if (a.kind === 'primary') btn.style.marginTop = '0';
    btn.textContent = a.label;
    btn.addEventListener('click', () => {
      if (a.onClick) a.onClick();
      if (!a.keepOpen) {
        forceCloseModal();
        if (a.returnTo) window.setTimeout(() => {
          if (a.returnTo === 'modal-laundry') openLaundryModal();
          else openModal(a.returnTo);
        }, 380);
      }
    });
    wrap.appendChild(btn);
  });
  openModal('modal-confirm');
}
function renderLaundryOverview() {
  const grid = document.getElementById('laundryOverviewGrid');
  const empty = document.getElementById('laundryOverviewEmpty');
  if (!grid || !empty) return;
  const items = state.items.filter(i => i.status === 'dirty');
  const pendingConsumables = getPendingLaundryConsumables();
  grid.innerHTML = '';
  empty.hidden = items.length !== 0 || pendingConsumables.length !== 0;
  items.forEach(item => grid.appendChild(buildItemCard(item, { laundryMode: true, returnTo: 'modal-laundry' })));
  const consumableGrid = document.getElementById('laundryConsumableGrid');
  if (consumableGrid) {
    consumableGrid.innerHTML = pendingConsumables.map(c => `<button type="button" class="laundry-consumable-row" data-consumable-id="${escapeHtml(c.id)}"><span class="laundry-consumable-icon">${ICONS[c.icon] || ''}</span><span class="laundry-consumable-name"><b>${escapeHtml(c.name)}</b><small>等待清洗中</small></span><span class="laundry-consumable-arrow">${ICONS.chevronRight || '›'}</span></button>`).join('');
    consumableGrid.querySelectorAll('[data-consumable-id]').forEach(row => row.addEventListener('click', () => {
      modalReturnTo = 'modal-laundry';
      openConsumableDetail(row.dataset.consumableId);
    }));
  }
}

function openLaundryDateChooser() {
  const defaultDate = addDays(todayStr(), -3); // e.g. 24 號!
  openConfirm(
    '調整洗衣日期',
    `<p style="margin-bottom:10px;font-size:13px;color:var(--color-ink-soft);line-height:1.4;">長按自訂洗衣完成日。請選擇這批衣物實際清洗的日期：</p>
     <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;" id="confirmQuickDates">
       <button type="button" class="chip" data-days="0">今天</button>
       <button type="button" class="chip" data-days="1">昨天</button>
       <button type="button" class="chip" data-days="2">前天</button>
       <button type="button" class="chip is-active" data-days="3">大前天 (${Number(defaultDate.slice(8))}號)</button>
     </div>
     <input type="date" id="customWashDateInput" max="${todayStr()}" value="${defaultDate}" style="width:100%;box-sizing:border-box;padding:9px 12px;font-size:14px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface-2);color:var(--color-ink);">`,
    [
      { label: '先不要', kind: 'secondary', returnTo: 'modal-laundry' },
      { label: '確認以此日期洗好', kind: 'primary', onClick: () => {
        const input = document.getElementById('customWashDateInput');
        const chosen = input?.value || defaultDate;
        completeLaundryDone(chosen);
      }}
    ]
  );
  setTimeout(() => {
    const chips = document.querySelectorAll('#confirmQuickDates .chip');
    const input = document.getElementById('customWashDateInput');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        const days = Number(chip.dataset.days);
        const d = addDays(todayStr(), -days);
        if (input) input.value = d;
      });
    });
    if (input) {
      input.addEventListener('change', () => {
        chips.forEach(c => {
          const days = Number(c.dataset.days);
          c.classList.toggle('is-active', addDays(todayStr(), -days) === input.value);
        });
      });
    }
  }, 60);
}

function wireLongPressLaundryDone() {
  const btn = document.getElementById('btnLaundryDone');
  if (!btn || btn._wiredLongPress) return;
  btn._wiredLongPress = true;

  let timer = null;
  let isLongPress = false;
  let startX = 0, startY = 0;

  function cancelTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    btn.classList.remove('is-pressing');
  }

  function triggerLongPress() {
    isLongPress = true;
    cancelTimer();
    if (navigator.vibrate) {
      try { navigator.vibrate(40); } catch (_) {}
    }
    openLaundryDateChooser();
  }

  btn.addEventListener('touchstart', e => {
    isLongPress = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    btn.classList.add('is-pressing');
    timer = setTimeout(triggerLongPress, 450);
  }, { passive: true });

  btn.addEventListener('touchmove', e => {
    if (!timer) return;
    const dx = Math.abs(e.touches[0].clientX - startX);
    const dy = Math.abs(e.touches[0].clientY - startY);
    if (dx > 10 || dy > 10) {
      cancelTimer();
    }
  }, { passive: true });

  btn.addEventListener('touchend', e => {
    if (isLongPress) {
      e.preventDefault();
      e.stopPropagation();
    }
    cancelTimer();
  });

  btn.addEventListener('touchcancel', cancelTimer);

  btn.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isLongPress = false;
    btn.classList.add('is-pressing');
    timer = setTimeout(triggerLongPress, 500);
  });

  btn.addEventListener('mouseup', () => {
    cancelTimer();
  });

  btn.addEventListener('mouseleave', cancelTimer);

  btn.addEventListener('click', e => {
    if (isLongPress) {
      e.preventDefault();
      e.stopPropagation();
      isLongPress = false;
      return;
    }
    if (markLaundryDone()) closeModal();
  });
}

function openLaundryModal() {
  renderLaundryOverview();
  const last = state.laundry.lastWashDate;
  const daysSince = Math.max(0, daysBetween(last, todayStr()));
  const next = nextWashDate();
  document.getElementById('laundryStats').innerHTML = `
    <div class="detail-stat"><b>${daysSince}</b><span>距上次洗衣天數</span></div>
    <div class="detail-stat"><b>${fmtDate(next)}</b><span>下次預計洗衣</span></div>
    <div class="detail-stat"><b>${state.laundry.cycleDays}</b><span>洗衣週期(天)</span></div>
  `;
  openModal('modal-laundry');
}

function openLaundryHistory() {
  const container = document.getElementById('laundryHistoryContent');
  if (!container) return;
  const history = state.laundry?.history || [];

  if (!history.length) {
    container.innerHTML = `<p class="empty-hint" style="margin-top:24px;text-align:center;">目前尚無歷史洗衣紀錄<br><span style="font-size:12px;opacity:0.7;">點選「洗好了」完成洗衣後，將在此完整累積洗衣履歷。</span></p>`;
    openModal('modal-laundry-history');
    return;
  }
  
  const sorted = [...history].sort((a, b) => {
    const da = typeof a === 'string' ? a : a?.date || '';
    const db = typeof b === 'string' ? b : b?.date || '';
    return db.localeCompare(da);
  });

  const html = sorted.map(entry => {
    const dateStr = typeof entry === 'string' ? entry : entry.date;
    const daysAgo = daysBetween(dateStr, todayStr());
    const agoText = daysAgo === 0 ? '今天' : daysAgo === 1 ? '昨天' : `${daysAgo} 天前`;
    
    const washedItems = state.items.filter(item => 
      Array.isArray(item.washHistory) && item.washHistory.some(w => w.date === dateStr)
    );
    const boostedIds = new Set(
      typeof entry === 'object' && Array.isArray(entry.extraWashItemIds) ? entry.extraWashItemIds : []
    );

    const washedConsumables = state.consumables.filter(c =>
      Array.isArray(c.history) && c.history.some(h => (h.washedDate || h.date) === dateStr)
    );

    let badgesHtml = '';
    if (washedItems.length) badgesHtml += `<span class="lhe-badge"><span data-icon="wardrobe"></span>衣物 ${washedItems.length} 件</span>`;
    if (boostedIds.size) badgesHtml += `<span class="lhe-badge lhe-badge-boost"><span data-icon="zap"></span>加強清洗 ${boostedIds.size} 件</span>`;
    if (washedConsumables.length) badgesHtml += `<span class="lhe-badge"><span data-icon="sparkles"></span>耗材 ${washedConsumables.length} 件</span>`;

    let itemsHtml = '';
    if (washedItems.length) {
      itemsHtml = `<div class="lhe-items-preview">${washedItems.slice(0, 10).map(item => {
        const bg = item.image ? `background-image:url('${item.image}')` : '';
        const title = item.name + (boostedIds.has(item.id) ? ' (加強清洗)' : '');
        return `<span class="lhe-thumb" style="${bg}" title="${escapeHtml(title)}">${item.image ? '' : categoryIcon(item.category)}</span>`;
      }).join('')}${washedItems.length > 10 ? `<span class="lhe-thumb" style="font-size:11px;font-weight:700;color:var(--color-ink-soft);">+${washedItems.length - 10}</span>` : ''}</div>`;
    }

    return `
      <div class="laundry-history-entry">
        <div class="lhe-head">
          <span class="lhe-date">${formatDayWithWeekday(dateStr)}</span>
          <div class="lhe-head-actions">
            <span class="lhe-ago">${agoText}</span>
            <button type="button" class="lhe-delete-btn" data-delete-laundry-date="${dateStr}" title="刪除此筆紀錄" aria-label="刪除此筆紀錄">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
        <div class="lhe-badges">${badgesHtml}</div>
        ${itemsHtml}
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  container.querySelectorAll('[data-delete-laundry-date]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const d = btn.dataset.deleteLaundryDate;
      openConfirm('刪除洗衣紀錄', `確定要刪除 ${formatDayWithWeekday(d)} 的洗衣紀錄嗎？`, [
        { label: '取消', kind: 'secondary', returnTo: 'modal-laundry-history' },
        { label: '確定刪除', kind: 'danger', onClick: () => {
          state.laundry.history = (state.laundry.history || []).filter(entry => (typeof entry === 'string' ? entry : entry?.date) !== d);
          syncLatestLaundryDate();
          saveState();
          renderAll();
          openLaundryHistory();
          toast(`已刪除 ${d} 洗衣紀錄`);
        }}
      ]);
    });
  });

  openModal('modal-laundry-history');
}

/* ---------------------------- Number-grid picker (settings) ---------------------------- */
function openNumberGridPicker(btn) {
  modalReturnTo = 'modal-settings';
  const current = btn.dataset.value === 'none' ? 'none' : (Number(btn.textContent) || 1);
  const isTowel = btn.dataset.cat === 'towel';
  document.getElementById('numberGridTitle').textContent = isTowel ? '選擇天數' : '選擇次數';
  const grid = document.getElementById('numberGrid');
  grid.innerHTML = '';
  const caption = document.getElementById('numberGridCaption');
  for (let n = 1; n <= 9; n++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    const isNoneCell = n === 9;
    cell.textContent = isNoneCell ? '無' : String(n);
    if ((isNoneCell && current === 'none') || (!isNoneCell && n === current)) cell.classList.add('is-active');
    cell.addEventListener('click', () => {
      if (isNoneCell) {
        btn.textContent = '無';
        btn.dataset.value = 'none';
      } else {
        btn.textContent = String(n);
        btn.dataset.value = String(n);
      }
      grid.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
      cell.classList.add('is-active');
      caption.classList.toggle('is-hidden', !(!isNoneCell && n > 5 && !isTowel));
      saveSettingsDraft();
      closeModal(); // returns to modal-settings via modalReturnTo, doesn't abandon the form
    });
    grid.appendChild(cell);
  }
  caption.classList.toggle('is-hidden', !(current !== 'none' && current > 5 && !isTowel));
  openModal('modal-number-grid');
}

/* ---------------------------- Calendar swipe ---------------------------- */
let isCalAnimating = false;
function animateCalendarMonthChange(direction, onComplete) {
  if (isCalAnimating) return;
  const track = document.getElementById('calTrack');
  if (!track) {
    if (direction === 'next') {
      uiCalMonth.m++;
      if (uiCalMonth.m > 11) { uiCalMonth.m = 0; uiCalMonth.y++; }
    } else {
      uiCalMonth.m--;
      if (uiCalMonth.m < 0) { uiCalMonth.m = 11; uiCalMonth.y--; }
    }
    renderHistory();
    if (onComplete) onComplete();
    return;
  }
  isCalAnimating = true;
  track.style.transition = 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)';
  const targetX = direction === 'next' ? '-66.666667%' : '0%';
  track.style.transform = `translateX(${targetX})`;
  setTimeout(() => {
    if (direction === 'next') {
      uiCalMonth.m++;
      if (uiCalMonth.m > 11) { uiCalMonth.m = 0; uiCalMonth.y++; }
    } else {
      uiCalMonth.m--;
      if (uiCalMonth.m < 0) { uiCalMonth.m = 11; uiCalMonth.y--; }
    }
    track.style.transition = 'none';
    track.style.transform = 'translateX(-33.333333%)';
    renderHistory();
    isCalAnimating = false;
    if (onComplete) onComplete();
  }, 290);
}

function wireCalendarSwipe() {
  const area = document.getElementById('calSwipeArea');
  const track = document.getElementById('calTrack');
  if (!area || !track) return;
  let startX = 0, startY = 0, currentX = 0, dragging = false, horizontal = false;

  area.addEventListener('touchstart', e => {
    if (isCalAnimating) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    currentX = startX;
    dragging = true;
    horizontal = false;
    track.style.transition = 'none';
  }, { passive: true });

  area.addEventListener('touchmove', e => {
    if (!dragging || isCalAnimating) return;
    currentX = e.touches[0].clientX;
    const dx = currentX - startX;
    const dy = e.touches[0].clientY - startY;
    if (!horizontal && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      horizontal = true;
    }
    if (horizontal) {
      track.style.transform = `translateX(calc(-33.333333% + ${dx}px))`;
    }
  }, { passive: true });

  area.addEventListener('touchend', e => {
    if (!dragging || isCalAnimating) return;
    dragging = false;
    if (horizontal) {
      const dx = currentX - startX;
      const threshold = 45;
      if (Math.abs(dx) > threshold) {
        animateCalendarMonthChange(dx < 0 ? 'next' : 'prev');
      } else {
        track.style.transition = 'transform 0.2s ease-out';
        track.style.transform = 'translateX(-33.333333%)';
        setTimeout(() => {
          track.style.transition = '';
        }, 210);
      }
    }
    horizontal = false;
  });
}

function enableSwipeToClose(sheet) {
  let startY = 0, currentY = 0, dragging = false;
  const threshold = 85;

  sheet.addEventListener('touchstart', e => {
    if (sheet.scrollTop > 1) return;
    dragging = true;
    startY = e.touches[0].clientY;
    currentY = startY;
    sheet.classList.add('is-dragging');
    sheet.style.transition = 'none';
  }, { passive: true });

  sheet.addEventListener('touchmove', e => {
    if (!dragging) return;
    currentY = e.touches[0].clientY;
    const dy = currentY - startY;
    if (dy > 0 && sheet.scrollTop <= 0) {
      if (e.cancelable) e.preventDefault();
      sheet.style.transform = `translateY(${dy}px)`;
    } else if (dy <= 0) {
      sheet.style.transform = 'translateY(0)';
    }
  }, { passive: false });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    sheet.classList.remove('is-dragging');
    const dy = currentY - startY;
    if (dy > threshold) {
      sheet.style.transition = 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)';
      sheet.style.transform = 'translateY(100%)';
      setTimeout(() => {
        closeModal();
        sheet.style.transform = '';
        sheet.style.transition = '';
      }, 220);
    } else {
      sheet.style.transition = 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
      sheet.style.transform = 'translateY(0)';
      setTimeout(() => {
        sheet.style.transform = '';
        sheet.style.transition = '';
      }, 200);
    }
    startY = 0;
    currentY = 0;
  };

  sheet.addEventListener('touchend', endDrag);
  sheet.addEventListener('touchcancel', endDrag);
}

/* ============================================================
   TRY-ON PICKER
   Single-slot mode: top/bottom/shoes/hat — one dedicated category.
   Combined mode: outer + accessory — reached by tapping blank space
   on the figure board; a small category switcher picks which one.
   When backfillDraft is set, selections write into the draft instead
   of today's live outfit (see the backfill feature below).
   ============================================================ */
function selectSlotItem(slot, itemId) {
  if (backfillDraft) {
    backfillDraft[slot] = itemId;
    renderBackfillModal();
    openModal('modal-backfill');
  } else {
    setTodaySlot(slot, itemId);
    closeModal();
  }
}
let tryonCurrentSlot = null, tryonCurrentCategory = null;
let tryonSearchQuery = '';
let tryonSort = 'recent';
function renderTryonGridFor(slot, category) {
  tryonCurrentSlot = slot;
  tryonCurrentCategory = category;
  const grid = document.getElementById('tryonPickerGrid');
  const empty = document.getElementById('tryonPickerEmpty');
  grid.innerHTML = '';
  let options = state.items.filter(i => i.category === category && i.status !== 'dirty' && i.status !== 'retired');
  options = options.filter(i => itemMatchesSearch(i, tryonSearchQuery));
  options = options.filter(i => itemMatchesFilters(i));
  options = options.slice().sort((a, b) => {
    if (tryonSort === 'wearCount') return (b.wearCount||0) - (a.wearCount||0);
    if (tryonSort === 'lastWorn') return (b.lastWornDate||'').localeCompare(a.lastWornDate||'');
    if (tryonSort === 'name') return a.name.localeCompare(b.name, 'zh-Hant');
    return (b.createdAt||0) - (a.createdAt||0);
  });
  document.getElementById('tryonFilterBadge').hidden = !isFilterActive();
  empty.hidden = options.length !== 0;

  const current = backfillDraft ? backfillDraft[slot] : state.today[slot];
  const clearWrap = document.getElementById('tryonClearWrap');
  clearWrap.innerHTML = '';
  if (current) {
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'chip';
    clearBtn.style.marginBottom = '10px';
    clearBtn.textContent = `不穿${categoryLabel(category)}`;
    clearBtn.addEventListener('click', () => selectSlotItem(slot, null));
    clearWrap.appendChild(clearBtn);
  }
  if (slot === 'hat') {
    const noneCard = document.createElement('button');
    noneCard.type = 'button';
    noneCard.className = 'item-card none-item-card' + (!current ? ' is-selected' : '');
    noneCard.innerHTML = `
      <div class="item-photo" style="background:transparent;border:1.5px dashed var(--color-line);display:flex;align-items:center;justify-content:center;">
        <span style="font-size:12px;font-weight:700;color:var(--color-ink-muted);">無（透明）</span>
      </div>
      <div class="item-info">
        <p class="item-name" style="text-align:center;font-size:12px;margin:2px 0;">不戴帽子</p>
      </div>
    `;
    noneCard.addEventListener('click', () => {
      selectSlotItem('hat', null);
      closeModal();
    });
    grid.appendChild(noneCard);
  }
  options.forEach(item => {
    const card = buildItemCard(item, { onClick: () => selectSlotItem(slot, item.id) });
    grid.appendChild(card);
  });
}
function resetTryonToolbar() {
  tryonSearchQuery = '';
  tryonSort = 'recent';
  document.getElementById('tryonSortSelect').value = 'recent';
  document.getElementById('tryonSearchInput').value = '';
  document.getElementById('tryonSearchRow').classList.add('is-hidden');
}
function openTryonPicker(slot) {
  document.getElementById('tryonCategoryChips').classList.add('is-hidden');
  document.getElementById('tryonTitle').textContent = `選擇${categoryLabel(slot)}`;
  resetTryonToolbar();
  renderTryonGridFor(slot, slot);
  openModal('modal-tryon');
}
function addExtrasClearAction() {
  const clearWrap = document.getElementById('tryonClearWrap');
  if (!clearWrap) return;
  clearWrap.innerHTML = '';
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'extras-clear-btn';
  clearButton.innerHTML = `${ICONS.close || ''}<span>清空今日穿搭</span>`;
  clearButton.addEventListener('click', () => {
    ALL_SLOTS.forEach(s => { if (state.today[s]) setTodaySlot(s, null); });
    closeModal();
    toast('已清空今日穿搭');
  });
  clearWrap.appendChild(clearButton);
}
function openExtrasPicker() {
  document.getElementById('tryonTitle').textContent = '選擇外套、配件或帽子';
  resetTryonToolbar();
  const chipsWrap = document.getElementById('tryonCategoryChips');
  chipsWrap.classList.remove('is-hidden');
  chipsWrap.innerHTML = '';
  ['outer', 'accessory', 'hat'].forEach((cat, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (i === 0 ? ' is-active' : '');
    chip.textContent = categoryLabel(cat);
    chip.addEventListener('click', () => {
      chipsWrap.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      renderTryonGridFor(cat, cat);
      addExtrasClearAction();
    });
    chipsWrap.appendChild(chip);
  });
  renderTryonGridFor('outer', 'outer');
  addExtrasClearAction();
  openModal('modal-tryon');
}

/* ============================================================
   BACKFILL A PAST DAY'S OOTD (from the 穿搭紀錄 tab's + button)
   Writes straight into ootdHistory; does not touch live wear counts,
   except it does bump totalWearCount so 常穿排行 stays consistent.
   ============================================================ */
function openBackfillModal(presetDate) {
  const date = presetDate || todayStr();
  const isToday = date === todayStr();
  let existing = state.ootdHistory.find(e => e.date === date);
  if (!existing && isToday && ALL_SLOTS.some(s => state.today[s])) {
    existing = state.today;
  }
  backfillDraft = { date };
  ALL_SLOTS.forEach(s => { backfillDraft[s] = existing ? (existing[s] || null) : null; });
  renderBackfillModal();
  openModal('modal-backfill');
}
function renderBackfillModal() {
  document.getElementById('backfillDate').value = backfillDraft.date;
  const title = document.getElementById('backfillModalTitle');
  if (title) title.textContent = `${formatDayWithWeekday(backfillDraft.date)} 穿搭`;
  const wrap = document.getElementById('backfillRows');
  wrap.innerHTML = '';
  ALL_SLOTS.forEach(slot => {
    const itemId = backfillDraft[slot];
    const item = itemId ? findItem(itemId) : null;
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'day-detail-row';
    const thumb = item
      ? (item.image ? `<img class="ddr-thumb" src="${item.image}" alt="">` : `<span class="ddr-thumb">${categoryIcon(item.category)}</span>`)
      : `<span class="ddr-thumb">${ICONS[slot] || ''}</span>`;
    row.innerHTML = `${thumb}<div><p class="ddr-cat">${categoryLabel(slot)}</p><p class="ddr-name">${item ? escapeHtml(item.name) : '點選加入'}</p></div>`;
    row.addEventListener('click', () => openTryonPicker(slot));
    wrap.appendChild(row);
  });
}

/* ============================================================
   FILTER MODAL
   ============================================================ */
let filterContext = 'wardrobe';
function refreshFilteredViews() {
  renderWardrobe();
  renderWishlist();
  if (tryonCurrentSlot) renderTryonGridFor(tryonCurrentSlot, tryonCurrentCategory);
}
function openFilterModal(context = 'wardrobe') {
  filterContext = context;
  const isWishlist = context === 'wishlist';
  document.getElementById('filterModalTitle').textContent = isWishlist ? '篩選想買單品' : '篩選';
  document.getElementById('filterStatusSection').classList.toggle('is-hidden', isWishlist);
  document.getElementById('filterCategorySection').classList.toggle('is-hidden', !isWishlist);
  document.getElementById('filterColorSection')?.classList.toggle('is-hidden', isWishlist);
  document.getElementById('filterBrandSection')?.classList.toggle('is-hidden', isWishlist);

  const invertBar = document.querySelector('.filter-invert-bar');
  if (invertBar) invertBar.classList.toggle('is-hidden', isWishlist);
  const btnInvert = document.getElementById('btnFilterInvert');
  const invertLabel = document.getElementById('filterInvertLabel');
  if (btnInvert) {
    btnInvert.classList.toggle('is-active', !!uiWardrobeFilters.invert);
    if (invertLabel) {
      invertLabel.textContent = uiWardrobeFilters.invert ? '反向排除模式：已開啟（反轉結果）' : '反向排除模式：關閉';
    }
    if (!btnInvert._hasInvertBound) {
      btnInvert._hasInvertBound = true;
      btnInvert.addEventListener('click', () => {
        uiWardrobeFilters.invert = !uiWardrobeFilters.invert;
        btnInvert.classList.toggle('is-active', !!uiWardrobeFilters.invert);
        if (invertLabel) {
          invertLabel.textContent = uiWardrobeFilters.invert ? '反向排除模式：已開啟（反轉結果）' : '反向排除模式：關閉';
        }
        refreshFilteredViews();
      });
    }
  }

  // Manage buttons
  const btnManageColors = document.getElementById('btnManageColors');
  if (btnManageColors && !btnManageColors._hasManageBound) {
    btnManageColors._hasManageBound = true;
    btnManageColors.addEventListener('click', () => openManagePropsModal('color'));
  }
  const btnManageBrands = document.getElementById('btnManageBrands');
  if (btnManageBrands && !btnManageBrands._hasManageBound) {
    btnManageBrands._hasManageBound = true;
    btnManageBrands.addEventListener('click', () => openManagePropsModal('brand'));
  }
  const btnManageTags = document.getElementById('btnManageTags');
  if (btnManageTags && !btnManageTags._hasManageBound) {
    btnManageTags._hasManageBound = true;
    btnManageTags.addEventListener('click', () => openManagePropsModal('tag'));
  }

  document.querySelectorAll('#filterStatusChips .chip').forEach(c => c.classList.toggle('is-active', c.getAttribute('data-status') === uiWardrobeFilters.status));
  const categoryRow = document.getElementById('filterCategoryChips');
  categoryRow.innerHTML = '';
  if (isWishlist) {
    [{ id: 'all', label: '全部' }].concat(allCategoryIds().map(id => ({ id, label: categoryLabel(id) }))).forEach(({ id, label }) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (uiWishlistFilters.category === id ? ' is-active' : '');
      chip.textContent = label;
      chip.addEventListener('click', () => { uiWishlistFilters.category = id; categoryRow.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active')); chip.classList.add('is-active'); refreshFilteredViews(); });
      categoryRow.appendChild(chip);
    });
  }

  // Wardrobe color families
  const colorRow = document.getElementById('filterColorChips');
  if (colorRow) {
    colorRow.innerHTML = '';
    COLOR_FAMILIES.forEach(fam => {
      const famName = typeof fam === 'string' ? fam : fam.name;
      const famHex = typeof fam === 'object' && fam.hex ? fam.hex : '#888';
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip chip-color' + (uiWardrobeFilters.colors.includes(famName) ? ' is-active' : '');
      chip.innerHTML = `<span class="color-dot" style="background-color:${famHex};"></span><span>${famName}</span>`;
      chip.addEventListener('click', () => {
        uiWardrobeFilters.colors = uiWardrobeFilters.colors.includes(famName)
          ? uiWardrobeFilters.colors.filter(c => c !== famName)
          : uiWardrobeFilters.colors.concat(famName);
        chip.classList.toggle('is-active');
        refreshFilteredViews();
      });
      colorRow.appendChild(chip);
    });
  }

  // Wardrobe brands
  const brandRow = document.getElementById('filterBrandChips');
  if (brandRow) {
    brandRow.innerHTML = '';
    const allBrands = Array.from(new Set(state.items.map(it => (it.brand || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-Hant'));
    if (allBrands.length === 0) {
      brandRow.innerHTML = '<span class="empty-hint-sm" style="color:var(--c-text-muted);font-size:12px;padding:4px 0;">尚無品牌資料</span>';
    } else {
      allBrands.forEach(b => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip' + (uiWardrobeFilters.brands.includes(b) ? ' is-active' : '');
        chip.textContent = b;
        chip.addEventListener('click', () => {
          uiWardrobeFilters.brands = uiWardrobeFilters.brands.includes(b)
            ? uiWardrobeFilters.brands.filter(x => x !== b)
            : uiWardrobeFilters.brands.concat(b);
          chip.classList.toggle('is-active');
          refreshFilteredViews();
        });
        brandRow.appendChild(chip);
      });
    }
  }

  const tagRow = document.getElementById('filterTagChips');
  tagRow.innerHTML = '';
  const selectedTags = isWishlist ? uiWishlistFilters.tags : uiWardrobeFilters.tags;
  (isWishlist ? allWishlistTagsUsed() : allTagsUsed()).forEach(t => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (selectedTags.includes(t) ? ' is-active' : '');
    chip.textContent = t;
    chip.addEventListener('click', () => {
      if (isWishlist) uiWishlistFilters.tags = uiWishlistFilters.tags.includes(t) ? uiWishlistFilters.tags.filter(x => x !== t) : uiWishlistFilters.tags.concat(t);
      else uiWardrobeFilters.tags = uiWardrobeFilters.tags.includes(t) ? uiWardrobeFilters.tags.filter(x => x !== t) : uiWardrobeFilters.tags.concat(t);
      chip.classList.toggle('is-active');
      refreshFilteredViews();
    });
    tagRow.appendChild(chip);
  });
  openModal('modal-filter');
}

function openManagePropsModal(propType) {
  const modal = document.getElementById('modal-manage-props');
  const title = document.getElementById('managePropsTitle');
  const body = document.getElementById('managePropsBody');
  if (!modal || !title || !body) return;

  const propNames = { color: '顏色', brand: '品牌', tag: '標籤' };
  title.textContent = `管理${propNames[propType] || '屬性'}`;
  body.innerHTML = '';

  let list = [];
  if (propType === 'color') {
    const colorMap = new Map();
    state.items.forEach(it => {
      if (it.color) {
        if (!colorMap.has(it.color)) {
          colorMap.set(it.color, { name: it.color, hex: it.colorHex || '#888', count: 1 });
        } else {
          colorMap.get(it.color).count++;
        }
      }
    });
    COLOR_FAMILIES.forEach(f => {
      if (!colorMap.has(f.name)) {
        colorMap.set(f.name, { name: f.name, hex: f.hex, count: 0 });
      }
    });
    list = Array.from(colorMap.values());
  } else if (propType === 'brand') {
    const brandMap = new Map();
    state.items.forEach(it => {
      const b = (it.brand || '').trim();
      if (b) {
        brandMap.set(b, (brandMap.get(b) || 0) + 1);
      }
    });
    list = Array.from(brandMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
  } else if (propType === 'tag') {
    const tagMap = new Map();
    state.items.forEach(it => {
      (it.tags || []).forEach(t => tagMap.set(t, (tagMap.get(t) || 0) + 1));
    });
    state.wishlist.forEach(it => {
      (it.tags || []).forEach(t => tagMap.set(t, (tagMap.get(t) || 0) + 1));
    });
    list = Array.from(tagMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
  }

  if (list.length === 0) {
    body.innerHTML = `<p class="empty-hint" style="padding:16px 0;">尚無可管理的${propNames[propType]}</p>`;
  } else {
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;flex-direction:column;gap:8px;max-height:60vh;overflow-y:auto;padding:2px;';

    list.forEach(item => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;background:var(--color-surface);border:1px solid var(--color-line);border-radius:10px;';

      let leftMarkup = '';
      if (propType === 'color') {
        leftMarkup = `<div style="display:flex;align-items:center;gap:8px;"><span class="color-dot" style="background-color:${item.hex};"></span><b>${escapeHtml(item.name)}</b><small style="color:var(--color-ink-faint);">(${item.count}件)</small></div>`;
      } else {
        leftMarkup = `<div style="display:flex;align-items:center;gap:8px;"><b>${escapeHtml(item.name)}</b><small style="color:var(--color-ink-faint);">(${item.count}件)</small></div>`;
      }

      row.innerHTML = `
        ${leftMarkup}
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" class="btn-secondary btn-edit-prop" style="padding:4px 10px;font-size:12px;">改名</button>
          <button type="button" class="btn-secondary btn-danger btn-del-prop" style="padding:4px 10px;font-size:12px;">刪除</button>
        </div>
      `;

      row.querySelector('.btn-edit-prop').addEventListener('click', () => {
        const next = prompt(`修改${propNames[propType]}名稱：`, item.name);
        if (!next || !next.trim() || next.trim() === item.name) return;
        const newName = next.trim();
        if (propType === 'color') {
          state.items.forEach(it => {
            if (it.color === item.name) it.color = newName;
            if (it.colorFamily === item.name) it.colorFamily = newName;
          });
        } else if (propType === 'brand') {
          state.items.forEach(it => {
            if (it.brand === item.name) it.brand = newName;
          });
        } else if (propType === 'tag') {
          state.items.forEach(it => {
            if (it.tags) it.tags = it.tags.map(t => t === item.name ? newName : t);
          });
          state.wishlist.forEach(it => {
            if (it.tags) it.tags = it.tags.map(t => t === item.name ? newName : t);
          });
        }
        saveState({ action: `修改${propNames[propType]}「${item.name}」為「${newName}」` });
        renderAll();
        openManagePropsModal(propType);
        toast(`已更新為「${newName}」`);
      });

      row.querySelector('.btn-del-prop').addEventListener('click', () => {
        if (!confirm(`確定要刪除${propNames[propType]}「${item.name}」嗎？相關單品將移除此${propNames[propType]}。`)) return;
        if (propType === 'color') {
          state.items.forEach(it => {
            if (it.color === item.name) { it.color = ''; it.colorHex = ''; it.colorFamily = ''; }
          });
        } else if (propType === 'brand') {
          state.items.forEach(it => {
            if (it.brand === item.name) { it.brand = ''; it.brandIcon = null; }
          });
        } else if (propType === 'tag') {
          state.items.forEach(it => {
            if (it.tags) it.tags = it.tags.filter(t => t !== item.name);
          });
          state.wishlist.forEach(it => {
            if (it.tags) it.tags = it.tags.filter(t => t !== item.name);
          });
        }
        saveState({ action: `刪除${propNames[propType]}「${item.name}」` });
        renderAll();
        openManagePropsModal(propType);
        toast(`已刪除「${item.name}」`);
      });

      container.appendChild(row);
    });

    body.appendChild(container);
  }

  openModal('modal-manage-props');
}

/* ============================================================
   EVENT WIRING
   ============================================================ */
function wireEvents() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      persistTransientForms();
      lastChangedView = btn.getAttribute('data-view');
      activateView(lastChangedView);
    });
  });

  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  document.querySelectorAll('.modal-sheet').forEach(enableSwipeToClose);

  const pvModal = document.getElementById('photoViewerModal');
  const pvClose = document.getElementById('btnPhotoViewerClose');
  if (pvClose) {
    pvClose.addEventListener('click', () => {
      pvModal?.classList.add('is-hidden');
    });
  }
  if (pvModal) {
    pvModal.addEventListener('click', e => {
      if (e.target === pvModal || e.target.closest('#btnPhotoViewerClose')) {
        pvModal.classList.add('is-hidden');
      }
    });
  }

  document.querySelectorAll('.figure-slot').forEach(btn => {
    btn.addEventListener('click', () => openTryonPicker(btn.getAttribute('data-slot')));
  });
  document.getElementById('figureExtrasLink').addEventListener('click', openExtrasPicker);
  const clearOotdButton = document.getElementById('btnClearOotd');
  if (clearOotdButton) clearOotdButton.addEventListener('click', () => {
    ALL_SLOTS.forEach(s => { if (state.today[s]) setTodaySlot(s, null); });
    toast('已清空今日穿搭');
  });
  document.getElementById('btnBackfill').addEventListener('click', () => openBackfillModal());
  document.getElementById('backfillDate').addEventListener('change', e => {
    if (!backfillDraft) return;
    backfillDraft.date = e.target.value || todayStr();
  });
  document.getElementById('btnSaveBackfill').addEventListener('click', () => {
    if (!backfillDraft) return;
    if (!ALL_SLOTS.some(s => backfillDraft[s])) {
      toast('至少選一件單品');
      return;
    }
    const isToday = backfillDraft.date === todayStr();
    const entry = { date: backfillDraft.date };
    ALL_SLOTS.forEach(s => {
      entry[s] = backfillDraft[s] || null;
    });

    // 1. Commit outfit to history immediately so user never loses entry
    if (isToday) {
      ALL_SLOTS.forEach(s => {
        setTodaySlot(s, entry[s]);
      });
    } else {
      ALL_SLOTS.forEach(s => {
        if (entry[s]) {
          const it = findItem(entry[s]);
          if (it) it.totalWearCount = (it.totalWearCount || 0) + 1;
        }
      });
      const existingIdx = state.ootdHistory.findIndex(e => e.date === entry.date);
      if (existingIdx >= 0) state.ootdHistory[existingIdx] = entry;
      else state.ootdHistory.push(entry);
    }

    saveState({ action: `更新 ${formatDayWithWeekday(entry.date)} 穿搭` });
    renderHistory();
    renderHome();

    // 2. Check if laundry/resting status needs prompt
    const lastWash = state.laundry?.lastWashDate || '';
    const shouldAsk = !isToday && (!lastWash || entry.date >= lastWash);
    const itemsToAsk = shouldAsk
      ? ALL_SLOTS.map(s => entry[s] ? findItem(entry[s]) : null).filter(it => it && it.status === 'clean')
      : [];

    if (itemsToAsk.length === 0) {
      backfillDraft = null;
      forceCloseModal({ skipPersist: true });
      toast('已儲存穿搭紀錄');
      return;
    }

    const askNextItem = index => {
      if (index >= itemsToAsk.length) {
        backfillDraft = null;
        forceCloseModal({ skipPersist: true });
        saveState({ action: `更新單品穿後狀態` });
        renderHistory();
        renderHome();
        toast('已儲存穿搭與單品狀態');
        return;
      }
      const item = itemsToAsk[index];
      const countLabel = itemsToAsk.length > 1 ? `（第 ${index + 1}/${itemsToAsk.length} 件）` : '';
      openConfirm(
        `「${item.name}」穿後狀態 ${countLabel}`,
        `這件單品於上次洗衣日（${lastWash ? fmtDate(lastWash) : '近期'}）之後的 ${formatDayWithWeekday(entry.date)} 穿著。要移到暫存衣架或洗衣籃嗎？`,
        [
          {
            label: '移至洗衣籃',
            kind: 'primary',
            keepOpen: true,
            onClick: () => {
              item.status = 'dirty';
              item.basketAt = entry.date;
              askNextItem(index + 1);
            }
          },
          {
            label: '移至暫存衣架',
            kind: 'secondary',
            keepOpen: true,
            onClick: () => {
              item.status = 'resting';
              item.restingSince = entry.date;
              askNextItem(index + 1);
            }
          },
          {
            label: '維持乾淨',
            kind: 'secondary',
            keepOpen: true,
            onClick: () => {
              askNextItem(index + 1);
            }
          }
        ]
      );
    };

    askNextItem(0);
  });

  document.getElementById('btnNotifications').addEventListener('click', () => { renderNotifications(); openModal('modal-notif'); });
  document.getElementById('mainScroll').addEventListener('scroll', syncHomeRackExpansion, { passive: true });
  function setPickerBtn(id, value) {
    const el = document.getElementById(id);
    if (value === null) { el.textContent = '無'; el.dataset.value = 'none'; }
    else { el.textContent = String(value); el.dataset.value = String(value); }
  }
  document.getElementById('btnSettings').addEventListener('click', () => {
    document.getElementById('settingName').value = state.profile.name || '';
    const keyEl = document.getElementById('settingGeminiApiKey');
    if (keyEl) keyEl.value = state.geminiApiKey || '';
    setPickerBtn('pickThresholdBottom', state.profile.washThresholds.bottom);
    setPickerBtn('pickThresholdOuter', state.profile.washThresholds.outer);
    setPickerBtn('pickThresholdShoes', state.profile.washThresholds.shoes);
    setPickerBtn('pickThresholdHat', state.profile.washThresholds.hat);
    setPickerBtn('pickThresholdAccessory', state.profile.washThresholds.accessory);
    const towel = state.consumables.find(c => isTowelId(c.id));
    setPickerBtn('pickThresholdTowel', towel ? towel.cycleDays : 7);
    document.getElementById('moreThresholdsWrap').classList.add('is-hidden');
    renderAvatar();
    const boardScaleSlider = document.getElementById('figureBoardScaleSlider');
    const boardScaleVal = document.getElementById('figureBoardScaleValue');
    if (boardScaleSlider) {
      const curVal = state.profile.figureBoardScale || 100;
      boardScaleSlider.value = String(curVal);
      if (boardScaleVal) boardScaleVal.textContent = `${curVal}%`;
    }
    renderCardImageScale();
    syncWeatherSettings();
    document.getElementById('weatherSearchResults').innerHTML = '';
    modalReturnTo = null;
    openModal('modal-settings');
  });
  const boardScaleSlider = document.getElementById('figureBoardScaleSlider');
  const boardScaleVal = document.getElementById('figureBoardScaleValue');
  if (boardScaleSlider) {
    boardScaleSlider.addEventListener('input', e => {
      const val = Math.min(140, Math.max(70, Number(e.target.value) || 100));
      state.profile.figureBoardScale = val;
      if (boardScaleVal) boardScaleVal.textContent = `${val}%`;
      document.documentElement.style.setProperty('--figure-board-scale', (val / 100).toFixed(2));
      clearTimeout(outfitScaleSaveTimer);
      outfitScaleSaveTimer = setTimeout(() => saveState(), 320);
    });
  }
  document.getElementById('btnOpenOutfitEditor').addEventListener('click', openOutfitStudio);
  wireOutfitStudioEvents();
  document.getElementById('btnCloseOutfitEditor').addEventListener('click', closeModal);
  document.getElementById('outfitScaleSlider').addEventListener('input', e => {
    const layout = state.profile.outfitLayout[outfitEditorSlot];
    layout.scale = Math.min(130, Math.max(70, Number(e.target.value) || 100));
    const targetEl = document.querySelector(`[data-outfit-editor-object="${outfitEditorSlot}"]`);
    if (targetEl) applyOutfitEditorObjectStyle(targetEl, outfitEditorSlot);
    updateOutfitEditorControls();
    renderHome();
    clearTimeout(outfitScaleSaveTimer);
    outfitScaleSaveTimer = setTimeout(() => saveState(), 320);
  });
  document.getElementById('btnResetOutfitPosition').addEventListener('click', () => {
    const layout = state.profile.outfitLayout[outfitEditorSlot];
    layout.x = 0;
    layout.y = 0;
    saveState();
    renderOutfitEditor();
    renderHome();
    toast(`已重設${categoryLabel(outfitEditorSlot)}位置`);
  });
  document.getElementById('btnExportData').addEventListener('click', async () => {
    // avoid blob: URLs entirely — in an installed iOS PWA, clicking a blob: link
    // can get recorded as a real navigation, and later gesture-navigating (e.g. the
    // right-edge back/forward swipe) to that now-revoked blob: URL throws
    // "WebKitBlobResource error 1". Web Share (or a data: URI) doesn't have that problem.
    const filename = `wardrobe-backup-${todayStr()}.json`;
    const jsonStr = JSON.stringify(state, null, 2);
    try {
      if (navigator.canShare && navigator.share) {
        const file = new File([jsonStr], filename, { type: 'application/json' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: filename });
          return;
        }
      }
    } catch (err) {
      // user cancelled the share sheet, or sharing isn't available — fall through
    }
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const a = document.createElement('a');
    a.href = dataUri;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  document.getElementById('btnImportData').addEventListener('click', () => document.getElementById('importFileInput').click());
  document.getElementById('importFileInput').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || !Array.isArray(parsed.items)) throw new Error('格式不正確');
      Object.keys(state).forEach(k => delete state[k]);
      Object.assign(state, defaultState(), parsed);
      normalizeLoadedState();
      saveState();
      renderAll();
      toast('匯入完成');
      closeModal();
    } catch (err) {
      toast('匯入失敗，請確認檔案是否為 Wardrobe Master 的備份檔');
    }
    e.target.value = '';
  });
  document.getElementById('btnImportSeedList').addEventListener('click', () => { importSeedItems(); closeModal(); });

  // wardrobe: sort + filter + search + select mode
  document.getElementById('sortSelect').addEventListener('change', e => { uiWardrobeSort = e.target.value; renderWardrobe(); });
  document.getElementById('btnAddItem').addEventListener('click', () => openAddModal(null));
  const retiredBanner = document.getElementById('retiredBanner');
  const openRetired = () => { uiWardrobeCat = 'retired'; uiSelectMode = false; uiSelectedIds.clear(); renderCategoryChips(); renderWardrobe(); document.getElementById('mainScroll').scrollTop = 0; };
  retiredBanner?.addEventListener('click', openRetired);
  retiredBanner?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRetired(); } });
  document.getElementById('btnFilter').addEventListener('click', () => { modalReturnTo = null; openFilterModal('wardrobe'); });
  document.getElementById('filterStatusChips').addEventListener('click', e => {
    const chip = e.target.closest('.chip'); if (!chip) return;
    if (filterContext !== 'wardrobe') return;
    uiWardrobeFilters.status = chip.getAttribute('data-status');
    document.querySelectorAll('#filterStatusChips .chip').forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    refreshFilteredViews();
  });
  document.getElementById('btnFilterClear').addEventListener('click', () => {
    if (filterContext === 'wishlist') uiWishlistFilters = { category: 'all', tags: [] };
    else uiWardrobeFilters = { status: 'all', tags: [], colors: [], brands: [], invert: false };
    openFilterModal(filterContext);
    refreshFilteredViews();
  });
  const btnFilterInvert = document.getElementById('btnFilterInvert');
  if (btnFilterInvert) {
    btnFilterInvert.addEventListener('click', () => {
      uiWardrobeFilters.invert = !uiWardrobeFilters.invert;
      btnFilterInvert.classList.toggle('is-active', uiWardrobeFilters.invert);
      const invertLabel = document.getElementById('filterInvertLabel');
      if (invertLabel) invertLabel.textContent = uiWardrobeFilters.invert ? '反向排除模式：已開啟（反轉結果）' : '反向排除模式：關閉';
      refreshFilteredViews();
    });
  }
  document.getElementById('btnFilterApply').addEventListener('click', closeModal);

  document.getElementById('btnSearch').addEventListener('click', () => {
    const row = document.getElementById('searchRow');
    row.classList.toggle('is-hidden');
    if (!row.classList.contains('is-hidden')) document.getElementById('searchInput').focus();
  });
  document.getElementById('searchInput').addEventListener('input', e => {
    uiSearchQuery = e.target.value.trim();
    renderWardrobe();
  });
  document.getElementById('btnSearchClear').addEventListener('click', () => {
    uiSearchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchRow').classList.add('is-hidden');
    renderWardrobe();
  });

  // try-on picker: sort + search
  document.getElementById('tryonSortSelect').addEventListener('change', e => {
    tryonSort = e.target.value;
    if (tryonCurrentSlot) renderTryonGridFor(tryonCurrentSlot, tryonCurrentCategory);
  });
  document.getElementById('btnTryonSearch').addEventListener('click', () => {
    const row = document.getElementById('tryonSearchRow');
    row.classList.toggle('is-hidden');
    if (!row.classList.contains('is-hidden')) document.getElementById('tryonSearchInput').focus();
  });
  document.getElementById('tryonSearchInput').addEventListener('input', e => {
    tryonSearchQuery = e.target.value.trim();
    if (tryonCurrentSlot) renderTryonGridFor(tryonCurrentSlot, tryonCurrentCategory);
  });
  document.getElementById('btnTryonSearchClear').addEventListener('click', () => {
    tryonSearchQuery = '';
    document.getElementById('tryonSearchInput').value = '';
    document.getElementById('tryonSearchRow').classList.add('is-hidden');
    if (tryonCurrentSlot) renderTryonGridFor(tryonCurrentSlot, tryonCurrentCategory);
  });
  document.getElementById('btnTryonFilter').addEventListener('click', () => {
    modalReturnTo = 'modal-tryon';
    openFilterModal();
  });

  function updateSelectBarUi() {
    const count = uiSelectedIds.size;
    const countEl = document.getElementById('selectCount');
    if (countEl) countEl.textContent = `已選 ${count} 件`;
    const btnAll = document.getElementById('btnSelectAll');
    if (btnAll) {
      const visible = getVisibleWardrobeItems();
      const allSelected = visible.length > 0 && visible.every(i => uiSelectedIds.has(i.id));
      btnAll.textContent = allSelected ? '取消全選' : '全選';
    }
  }

  function setSelectMode(on) {
    uiSelectMode = on;
    uiSelectedIds.clear();
    const btn = document.getElementById('btnSelectMode');
    if (btn) {
      btn.classList.toggle('is-active', on);
      btn.textContent = on ? '取消' : '選取';
    }
    document.getElementById('selectBar').classList.toggle('is-hidden', !on);
    document.getElementById('btnAddItem').classList.toggle('is-hidden', on);
    updateSelectBarUi();
    renderWardrobe();
  }
  document.getElementById('btnSelectMode').addEventListener('click', () => setSelectMode(!uiSelectMode));
  document.getElementById('btnSelectCancel')?.addEventListener('click', () => setSelectMode(false));
  document.getElementById('btnSelectAll').addEventListener('click', () => {
    const visible = getVisibleWardrobeItems();
    const allSelected = visible.length > 0 && visible.every(i => uiSelectedIds.has(i.id));
    if (allSelected) uiSelectedIds.clear();
    else visible.forEach(i => uiSelectedIds.add(i.id));
    updateSelectBarUi();
    renderWardrobe();
  });
  document.getElementById('btnSelectWash')?.addEventListener('click', () => {
    if (!uiSelectedIds.size) { toast('請先勾選單品'); return; }
    const count = uiSelectedIds.size;
    uiSelectedIds.forEach(id => {
      const it = findItem(id);
      if (it && it.status !== 'retired') {
        it.status = 'dirty';
        it.basketAt = todayStr();
        it.restingSince = null;
      }
    });
    saveState({ action: `將 ${count} 件單品送洗` });
    setSelectMode(false);
    renderAll();
    toast(`已將 ${count} 件單品丟進洗衣籃`);
  });
  document.getElementById('btnSelectTemp')?.addEventListener('click', () => {
    if (!uiSelectedIds.size) { toast('請先勾選單品'); return; }
    const count = uiSelectedIds.size;
    uiSelectedIds.forEach(id => {
      const it = findItem(id);
      if (it && it.status !== 'retired') {
        it.status = 'resting';
        it.restingSince = todayStr();
        it.basketAt = null;
      }
    });
    saveState({ action: `將 ${count} 件單品移至暫存衣架` });
    setSelectMode(false);
    renderAll();
    toast(`已將 ${count} 件單品移至暫存衣架`);
  });
  document.getElementById('btnSelectRetire').addEventListener('click', () => {
    if (!uiSelectedIds.size) { toast('請先勾選單品'); return; }
    const n = uiSelectedIds.size;
    openConfirm('移入典藏？', `已選 ${n} 件單品`, [
      { label: '取消', kind: 'secondary' },
      { label: '確定', kind: 'primary', onClick: () => {
        uiSelectedIds.forEach(id => { const it = findItem(id); if (it) it.status = 'retired'; });
        saveState({ action: `將 ${n} 件單品移入典藏` });
        setSelectMode(false);
        renderAll();
        toast(`已將 ${n} 件單品移入典藏`);
      } },
    ]);
  });
  document.getElementById('btnSelectDelete').addEventListener('click', () => {
    if (!uiSelectedIds.size) { toast('請先勾選單品'); return; }
    const n = uiSelectedIds.size;
    openConfirm('永久刪除？', `已選 ${n} 件單品，此動作無法復原`, [
      { label: '取消', kind: 'secondary' },
      { label: '刪除', kind: 'danger', onClick: () => {
        state.items = state.items.filter(i => !uiSelectedIds.has(i.id));
        saveState({ action: `刪除 ${n} 件單品` });
        setSelectMode(false);
        renderAll();
        toast(`已刪除 ${n} 件單品`);
      } },
    ]);
  });

  // wishlist / inspiration
  document.getElementById('btnAddWishlist').addEventListener('click', () => openWishlistModal());
  document.getElementById('btnWishlistFilter').addEventListener('click', () => { modalReturnTo = null; openFilterModal('wishlist'); });
  document.getElementById('wishlistSortSelect').addEventListener('change', e => { uiWishlistSort = e.target.value; renderWishlist(); });
  document.getElementById('btnWishlistSearch').addEventListener('click', () => { const row = document.getElementById('wishlistSearchRow'); row.classList.toggle('is-hidden'); if (!row.classList.contains('is-hidden')) document.getElementById('wishlistSearchInput').focus(); });
  document.getElementById('wishlistSearchInput').addEventListener('input', e => { uiWishlistSearchQuery = e.target.value.trim(); renderWishlist(); });
  document.getElementById('btnWishlistSearchClear').addEventListener('click', () => { uiWishlistSearchQuery = ''; document.getElementById('wishlistSearchInput').value = ''; document.getElementById('wishlistSearchRow').classList.add('is-hidden'); renderWishlist(); });
  document.getElementById('btnWishlistSelectMode').addEventListener('click', () => setWishlistSelectMode(!uiWishlistSelectMode));
  document.getElementById('btnWishlistSelectCancel').addEventListener('click', () => setWishlistSelectMode(false));
  document.getElementById('btnWishlistDeleteSelected').addEventListener('click', () => {
    if (!uiWishlistSelectedIds.size) return;
    openConfirm('刪除選取的想買單品？', `共 ${uiWishlistSelectedIds.size} 件，此動作無法復原`, [
      { label: '取消', kind: 'secondary' },
      { label: '刪除', kind: 'danger', onClick: () => { state.wishlist = state.wishlist.filter(item => !uiWishlistSelectedIds.has(item.id)); saveState(); setWishlistSelectMode(false); renderWishlist(); toast('已刪除選取的想買單品'); } },
    ]);
  });
  document.getElementById('wishlistForm').addEventListener('submit', e => { e.preventDefault(); saveWishlistForm(); });
  document.getElementById('wishlistCategoryChips').addEventListener('click', e => e.stopPropagation());
  document.getElementById('wishlistLengthToggle').addEventListener('click', e => {
    const btn = e.target.closest('.segment-btn');
    if (!btn) return;
    const value = btn.dataset.len;
    pendingWishlistTags = pendingWishlistTags.filter(tag => !LENGTH_TAGS.includes(tag));
    if (!pendingWishlistTags.includes(value)) pendingWishlistTags.push(value);
    wishlistDirty = true;
    renderWishlistTagChips();
    renderWishlistLengthToggle();
    autoSaveWishlistDraft();
  });
  document.getElementById('wishlistTagsCustom').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const value = e.target.value.trim();
    if (!value) return;
    if (!pendingWishlistTags.includes(value)) pendingWishlistTags.push(value);
    wishlistDirty = true;
    e.target.value = '';
    renderWishlistTagChips();
    autoSaveWishlistDraft();
  });
  ['wishlistName', 'wishlistReferenceUrl'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => { wishlistDirty = true; autoSaveWishlistDraft(); });
    el.addEventListener('change', () => { wishlistDirty = true; autoSaveWishlistDraft(); });
  });
  document.getElementById('wishlistPhotoInput').addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast('處理參考圖片中…');
    try {
      const compressed = await compressImageFile(file);
      pendingWishlistPhoto = compressed;
      wishlistDirty = true;
      setPhotoPreview(document.getElementById('wishlistPhotoPreviewWrap'), compressed, '加入參考圖片');
      document.getElementById('btnReadjustWishlistPhoto').classList.toggle('is-hidden', !editingWishlistId);
      autoSaveWishlistDraft();
    } catch (err) { toast('參考圖片處理失敗，請換一張試試'); }
    e.target.value = '';
  });
  document.getElementById('btnReadjustWishlistPhoto').addEventListener('click', () => {
    if (!pendingWishlistPhoto) return;
    openPhotoAdjust(pendingWishlistPhoto, pendingWishlistCategory, finalUrl => {
      pendingWishlistPhoto = finalUrl;
      wishlistDirty = true;
      setPhotoPreview(document.getElementById('wishlistPhotoPreviewWrap'), finalUrl, '加入參考圖片');
      autoSaveWishlistDraft();
    });
  });
  document.getElementById('btnDeleteWishlist').addEventListener('click', () => {
    if (!editingWishlistId) return;
    state.wishlist = state.wishlist.filter(item => item.id !== editingWishlistId);
    state.drafts.wishlist = null;
    saveState();
    renderWishlist();
    forceCloseModal();
    toast('已刪除想買單品');
  });

  // style corridor / reference photo gallery
  const styleGalleryInput = document.getElementById('styleGalleryInput');
  const triggerStyleGalleryInput = () => styleGalleryInput?.click();
  document.getElementById('btnOpenStyleGallery').addEventListener('click', openStyleGalleryManager);
  document.getElementById('styleGalleryPreviewEmpty').addEventListener('click', openStyleGalleryManager);
  document.getElementById('btnAddStyleGallery').addEventListener('click', triggerStyleGalleryInput);
  document.getElementById('btnStyleGalleryAdd').addEventListener('click', triggerStyleGalleryInput);
  styleGalleryInput.addEventListener('change', async e => {
    await addStyleGalleryFiles(e.target.files);
    e.target.value = '';
  });
  document.getElementById('btnStyleGallerySelectMode').addEventListener('click', () => setStyleGallerySelectMode(!uiStyleGallerySelectMode));
  document.getElementById('btnStyleGallerySelectCancel').addEventListener('click', () => setStyleGallerySelectMode(false));
  document.getElementById('btnStyleGallerySelectAll').addEventListener('click', () => {
    uiStyleGallerySelectedIds = new Set(state.styleGallery.map(photo => photo.id));
    updateStyleGallerySelectBar();
    renderStyleGalleryManager();
  });
  document.getElementById('btnStyleGalleryShareSelected').addEventListener('click', async () => {
    await shareStyleGalleryPhotos([...uiStyleGallerySelectedIds]);
  });
  document.getElementById('btnStyleGalleryDeleteSelected').addEventListener('click', () => {
    const ids = [...uiStyleGallerySelectedIds];
    if (!ids.length) { toast('請先選取照片'); return; }
    openConfirm('刪除選取的風格照片？', `共 ${ids.length} 張，刪除後無法復原。`, [
      { label: '取消', kind: 'secondary', returnTo: 'modal-style-gallery' },
      { label: '刪除', kind: 'danger', returnTo: 'modal-style-gallery', onClick: () => {
        state.styleGallery = state.styleGallery.filter(photo => !uiStyleGallerySelectedIds.has(photo.id));
        uiStyleGallerySelectedIds.clear();
        saveState();
        renderStyleGalleryPreview();
        renderStyleGalleryManager();
        toast('已刪除選取照片');
      } },
    ]);
  });
  window.addEventListener('pagehide', persistTransientForms);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') persistTransientForms(); });

  // custom category
  document.getElementById('categoryForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('fieldCategoryName');
    const label = input.value.trim();
    if (!label) return;
    state.customCategories.push({ id: 'custom-' + uid(), label });
    saveState();
    renderCategoryChips();
    renderCategoryPickerChips();
    input.value = '';
    toast(`已新增分類「${label}」`);
    closeModal();
  });
  document.getElementById('btnDeleteCategory').addEventListener('click', () => {
    const catId = uiWardrobeCat;
    const cat = state.customCategories.find(c => c.id === catId);
    if (!cat) return;
    const affected = state.items.filter(i => i.category === catId).length;
    openConfirm(`刪除「${cat.label}」分類？`, affected ? `裡面 ${affected} 件單品會移到「配件」分類，此動作無法復原` : '此動作無法復原', [
      { label: '取消', kind: 'secondary' },
      { label: '刪除', kind: 'danger', onClick: () => {
        state.items.forEach(i => { if (i.category === catId) i.category = 'accessory'; });
        state.customCategories = state.customCategories.filter(c => c.id !== catId);
        uiWardrobeCat = 'all';
        saveState();
        renderCategoryChips();
        renderCategoryPickerChips();
        renderWardrobe();
        toast(`已刪除「${cat.label}」分類`);
      } },
    ]);
  });

  // history: segment + calendar nav
  document.getElementById('historySegment').addEventListener('click', e => {
    const btn = e.target.closest('.segment-btn');
    if (!btn) return;
    document.querySelectorAll('#historySegment .segment-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const seg = btn.getAttribute('data-seg');
    document.getElementById('panel-calendar').hidden = seg !== 'calendar';
    document.getElementById('panel-rank').hidden = seg !== 'rank';
  });
  document.getElementById('rankPeriodPills')?.addEventListener('click', e => {
    const btn = e.target.closest('.rank-period-btn');
    if (!btn) return;
    uiRankPeriod = btn.dataset.period;
    if (uiRankPeriod === 'custom') {
      const sInput = document.getElementById('rankStartDate');
      const eInput = document.getElementById('rankEndDate');
      if (sInput && !sInput.value) sInput.value = addDays(todayStr(), -30);
      if (eInput && !eInput.value) eInput.value = todayStr();
    }
    renderRank();
  });
  document.getElementById('rankStartDate')?.addEventListener('change', () => {
    if (uiRankPeriod === 'custom') renderRank();
  });
  document.getElementById('rankEndDate')?.addEventListener('change', () => {
    if (uiRankPeriod === 'custom') renderRank();
  });
  document.getElementById('rankCategoryTabs')?.addEventListener('click', e => {
    const btn = e.target.closest('.cat-tab');
    if (!btn) return;
    uiRankCategory = btn.dataset.cat;
    renderRank();
  });
  document.getElementById('calPrev').addEventListener('click', () => {
    animateCalendarMonthChange('prev');
  });
  document.getElementById('calNext').addEventListener('click', () => {
    animateCalendarMonthChange('next');
  });

  // brand search (public Simple Icons catalog; a missing icon never blocks saving)
  document.getElementById('btnBrandSearch').addEventListener('click', searchBrandIcons);
  document.getElementById('fieldBrand').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); searchBrandIcons(); } });
  document.getElementById('fieldBrand').addEventListener('input', e => {
    const typed = e.target.value.trim();
    if (typed !== pendingBrandName) pendingBrandIcon = null;
    pendingBrandName = typed;
    formDirty = true;
    renderBrandSelectedPreview();
    autoSaveAddItemDraft();
  });
  document.getElementById('brandSearchResults').addEventListener('click', e => {
    const result = e.target.closest('.brand-search-result');
    if (!result) return;
    const match = e.currentTarget._matches?.[Number(result.dataset.brandIndex)];
    if (!match) return;
    pendingBrandName = match.name;
    pendingBrandIcon = `${SIMPLE_ICONS_CDN_URL}${encodeURIComponent(match.slug)}`;
    document.getElementById('fieldBrand').value = pendingBrandName;
    document.getElementById('brandSearchResults').innerHTML = '';
    document.getElementById('brandSearchStatus').textContent = '已選擇品牌圖示；儲存後會顯示在單品資訊。';
    formDirty = true;
    renderBrandSelectedPreview();
    autoSaveAddItemDraft();
  });

  // photo upload (label already opens the native picker — no extra .click() here, that double-trigger was the bug)
  document.getElementById('photoInput').addEventListener('change', async e => {
    let files = Array.from(e.target.files || []);
    if (!files.length) return;
    // When selecting 2 photos, file pickers (especially iOS) provide them in reverse order.
    // Reverse so 1st selected is Front and 2nd selected is Back.
    if (files.length === 2) {
      files = [files[1], files[0]];
    }
    toast('處理照片中…');
    try {
      const frontCompressed = await compressImageFile(files[0]);
      pendingPhoto = frontCompressed;
      autoSaveAddItemDraft();
      const hintWrap = document.getElementById('photoBackHintWrap');
      if (files[1]) {
        pendingPhotoBack = await compressImageFile(files[1]);
        if (hintWrap) hintWrap.hidden = false;
      } else {
        pendingPhotoBack = null;
        if (hintWrap) hintWrap.hidden = true;
      }
      formDirty = true;
      const wrap = document.getElementById('photoPreviewWrap');
      wrap.setAttribute('style', `background-color:transparent;background-image:url('${pendingPhoto}')`);
      wrap.classList.add('has-photo');
      wrap.innerHTML = '';
      document.getElementById('btnReadjustPhoto').classList.toggle('is-hidden', !editingItemId);
      autoSaveAddItemDraft();
    } catch (err) {
      toast('照片處理失敗，請換一張試試');
    }
  });

  document.getElementById('btnSwapPhotos')?.addEventListener('click', () => {
    if (!pendingPhoto && !pendingPhotoBack) return;
    const tmp = pendingPhoto;
    pendingPhoto = pendingPhotoBack;
    pendingPhotoBack = tmp;
    const wrap = document.getElementById('photoPreviewWrap');
    if (pendingPhoto) {
      wrap.setAttribute('style', `background-color:transparent;background-image:url('${pendingPhoto}')`);
      wrap.classList.add('has-photo');
      wrap.innerHTML = '';
    } else {
      wrap.removeAttribute('style');
      wrap.classList.remove('has-photo');
      wrap.innerHTML = `<span data-icon="camera"></span><span>上傳照片（可一次選2張，第2張當背面）</span>`;
      applyStaticIcons();
    }
    const hintWrap = document.getElementById('photoBackHintWrap');
    if (hintWrap) hintWrap.hidden = !pendingPhotoBack;
    formDirty = true;
    autoSaveAddItemDraft();
    toast('已交換正反面照片');
  });
  document.getElementById('btnReadjustPhoto').addEventListener('click', () => {
    if (!pendingPhoto) return;
    openPhotoAdjust(pendingPhoto, pendingCategory, finalUrl => {
      pendingPhoto = finalUrl;
      autoSaveAddItemDraft();
      const wrap = document.getElementById('photoPreviewWrap');
      wrap.setAttribute('style', `background-image:url('${pendingPhoto}')`);
      formDirty = true;
    });
  });

  // length toggle — writes directly into the tag list (長/短 are just tags now)
  document.getElementById('lengthToggle').addEventListener('click', e => {
    const btn = e.target.closest('.segment-btn');
    if (!btn) return;
    const val = btn.getAttribute('data-len');
    const isActive = pendingTags.includes(val);
    pendingTags = pendingTags.filter(t => !LENGTH_TAGS.includes(t));
    if (!isActive) pendingTags.push(val);
    formDirty = true;
    renderLengthToggle();
    renderTagPickerChips();
    autoSaveAddItemDraft();
  });

  // custom tag text input
  document.getElementById('fieldTagsCustom').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const val = e.target.value.trim();
    if (!val) return;
    if (!pendingTags.includes(val)) pendingTags.push(val);
    formDirty = true;
    e.target.value = '';
    renderTagPickerChips();
    autoSaveAddItemDraft();
  });

  ['fieldName', 'fieldPurchaseDate', 'fieldPrice', 'fieldArchiveDirect', 'fieldMaterialCustom'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => { formDirty = true; autoSaveAddItemDraft(); });
    el.addEventListener('change', () => { formDirty = true; autoSaveAddItemDraft(); });
  });
  document.getElementById('fieldMaterialCustom')?.addEventListener('input', e => {
    pendingMaterial = e.target.value.trim();
    formDirty = true;
    renderMaterialPickerChips();
    autoSaveAddItemDraft();
  });

  // Color picker and custom color name events
  const pickerInput = document.getElementById('fieldColorPicker');
  if (pickerInput) {
    pickerInput.addEventListener('input', e => {
      const hex = e.target.value.toUpperCase();
      const fam = classifyColorFamily(hex);
      pendingColor.hex = hex;
      pendingColor.family = fam;
      if (!pendingColor.name || COLOR_FAMILIES.includes(pendingColor.name)) {
        pendingColor.name = fam;
      }
      formDirty = true;
      syncColorFormUI();
      autoSaveAddItemDraft();
    });
  }

  const colorNameInput = document.getElementById('fieldColorName');
  if (colorNameInput) {
    colorNameInput.addEventListener('input', e => {
      const val = e.target.value.trim();
      pendingColor.name = val;
      if (!pendingColor.family && val) {
        const match = COLOR_FAMILIES.find(f => val.includes(f));
        if (match) pendingColor.family = match;
      }
      formDirty = true;
      syncColorFormUI();
      autoSaveAddItemDraft();
    });
  }

  const btnClearColor = document.getElementById('btnClearColor');
  if (btnClearColor) {
    btnClearColor.addEventListener('click', () => {
      pendingColor = { hex: '', name: '', family: '' };
      formDirty = true;
      syncColorFormUI();
      autoSaveAddItemDraft();
    });
  }

  // add / edit item form
  function saveItemForm() {
    const name = document.getElementById('fieldName').value.trim();
    if (!name) { toast('請輸入名稱'); return false; }
    const category = pendingCategory;
    const tags = pendingTags.slice();
    const material = (pendingMaterial || document.getElementById('fieldMaterialCustom')?.value || '').trim();
    const purchaseDate = document.getElementById('fieldPurchaseDate').value;
    const priceVal = document.getElementById('fieldPrice').value;
    const price = priceVal ? Number(priceVal) : null;
    const archiveDirect = document.getElementById('fieldArchiveDirect').checked;
    const brand = document.getElementById('fieldBrand').value.trim();
    pendingBrandName = brand;
    const brandIcon = brand ? (pendingBrandIcon || null) : null;
    const color = pendingColor.name || '';
    const colorHex = pendingColor.hex || '';
    const colorFamily = pendingColor.family || (colorHex ? classifyColorFamily(colorHex) : '');

    if (editingItemId) {
      const item = findItem(editingItemId);
      Object.assign(item, {
        name, category, tags, material, purchaseDate, price,
        color, colorHex, colorFamily,
        image: pendingPhoto || item.image,
        imageBack: pendingPhotoBack,
        brand, brandIcon
      });
      toast('已儲存修改');
    } else {
      state.items.push({
        id: uid(), name, category, tags, material, purchaseDate, price,
        color, colorHex, colorFamily,
        image: pendingPhoto, imageBack: pendingPhotoBack, brand, brandIcon,
        wearCount: 0, totalWearCount: 0, status: archiveDirect ? 'retired' : 'clean',
        lastWornDate: null, wornToday: false, wearHistory: [], createdAt: Date.now(),
        deodorizeHistory: [], stainHistory: [],
      });
      toast(archiveDirect ? '已加入典藏' : '已加入衣櫥');
    }
    state.drafts.addItem = null;
    saveState();
    renderAll();
    formDirty = false;
    if (editingItemId) {
      const returnId = editingItemId;
      editingItemId = null;
      modalStack = modalStack.filter(m => m.id !== 'modal-add' && m.id !== 'modal-item');
      openItemDetail(returnId);
    } else {
      forceCloseModal({ skipPersist: true });
    }
    return true;
  }
  document.getElementById('addItemForm').addEventListener('submit', e => {
    e.preventDefault();
    saveItemForm();
  });

  // stain form submit
  document.getElementById('stainForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (!activeStainItemId) return;
    const item = findItem(activeStainItemId);
    if (!item) return;
    const date = document.getElementById('fieldStainDate').value || todayStr();
    const note = document.getElementById('fieldStainNote').value.trim() || '局部去漬';
    item.stainHistory = Array.isArray(item.stainHistory) ? item.stainHistory : [];
    item.stainHistory.unshift({ date, note });
    saveState();
    toast('已記錄除污漬護理');
    forceCloseModal({ skipPersist: true });
    openItemDetail(item.id);
  });

  // haircut tracker events
  document.getElementById('btnOpenAddHaircut')?.addEventListener('click', () => openHaircutModal());

  document.getElementById('haircutPhotoInput')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast('處理髮型照片中…');
    try {
      pendingHaircutPhoto = await compressImageFile(file, 800, 0.85);
      const preview = document.getElementById('haircutPhotoPreview');
      preview.setAttribute('style', `background-image:url('${pendingHaircutPhoto}')`);
      preview.classList.add('has-photo');
      preview.innerHTML = '';
    } catch (_) {
      toast('照片處理失敗，請換一張試試');
    }
  });

  document.getElementById('haircutForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const date = document.getElementById('fieldHaircutDate').value || todayStr();
    const style = document.getElementById('fieldHaircutStyle').value.trim();
    if (!style) { toast('請輸入髮型名稱'); return; }
    const stylist = document.getElementById('fieldHaircutStylist').value.trim();
    const salon = document.getElementById('fieldHaircutSalon').value.trim();
    const length = document.getElementById('fieldHaircutLength').value.trim();
    const cycleDays = Number(document.getElementById('fieldHaircutCycle').value) || 28;
    const notes = document.getElementById('fieldHaircutNotes').value.trim();

    state.haircuts = Array.isArray(state.haircuts) ? state.haircuts : [];
    if (editingHaircutId) {
      const h = state.haircuts.find(x => x.id === editingHaircutId);
      if (h) {
        Object.assign(h, { date, style, stylist, salon, length, cycleDays, notes, image: pendingHaircutPhoto || h.image || null });
        toast('已更新髮型記錄');
      }
    } else {
      state.haircuts.unshift({
        id: uid(), date, style, stylist, salon, length, cycleDays, notes,
        image: pendingHaircutPhoto || null, createdAt: Date.now()
      });
      toast('已新增髮型記錄');
    }
    saveState();
    renderHairstyleSection();
    forceCloseModal({ skipPersist: true });
  });

  document.getElementById('btnDeleteHaircut')?.addEventListener('click', () => {
    if (!editingHaircutId) return;
    if (confirm('確定要刪除這筆髮型記錄嗎？')) {
      state.haircuts = (state.haircuts || []).filter(x => x.id !== editingHaircutId);
      saveState();
      renderHairstyleSection();
      forceCloseModal({ skipPersist: true });
      toast('已刪除髮型記錄');
    }
  });

  document.getElementById('btnUnsavedDiscard').addEventListener('click', () => {
    if (unsavedContext === 'wishlist') {
      if (editingWishlistId && wishlistEditSnapshot) {
        const item = state.wishlist.find(x => x.id === editingWishlistId);
        if (item) Object.assign(item, JSON.parse(JSON.stringify(wishlistEditSnapshot)));
      } else {
        state.drafts.wishlist = null;
      }
    } else state.drafts.addItem = null;
    saveState();
    unsavedContext = null;
    forceCloseModal({ skipPersist: true });
  });
  document.getElementById('btnUnsavedSave').addEventListener('click', () => {
    const context = unsavedContext;
    unsavedContext = null;
    const saved = context === 'wishlist' ? saveWishlistForm() : saveItemForm();
    if (saved === false) {
      if (context === 'wishlist') openModal('modal-wishlist');
      else openModal('modal-add');
    }
  });

  document.getElementById('btnRetireItem').addEventListener('click', () => {
    if (editingItemId) { formDirty = false; retireItem(editingItemId); closeModal(); }
  });
  document.getElementById('btnDeleteItem').addEventListener('click', () => {
    if (editingItemId && confirm('確定要永久刪除這件單品嗎？此動作無法復原。')) {
      formDirty = false;
      deleteItemPermanently(editingItemId);
      closeModal();
    }
  });

  // laundry day (whole-basket cadence)
  document.getElementById('card-basket').addEventListener('click', openLaundryModal);
  document.getElementById('card-basket').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLaundryModal(); } });
  document.getElementById('btnBasketInfo')?.addEventListener('click', e => {
    e.stopPropagation();
    openLaundryHistory();
  });
  document.getElementById('btnLaundryHistoryInfo')?.addEventListener('click', openLaundryHistory);
  document.getElementById('card-rack').addEventListener('click', openRackOverview);
  document.getElementById('card-rack').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRackOverview(); } });
  wireLongPressLaundryDone();
  document.getElementById('btnLaundryPostpone').addEventListener('click', () => { postponeLaundry(); closeModal(); });

  // calendar: swipe between months + jump-to-date + tap title to return to today
  wireCalendarSwipe();
  document.getElementById('calTitle').addEventListener('click', () => {
    const d = new Date();
    uiCalMonth = { y: d.getFullYear(), m: d.getMonth() };
    renderHistory();
  });
  document.getElementById('calJumpBtn').addEventListener('click', () => {
    document.getElementById('jumpDateInput').value = todayStr();
    openModal('modal-jump');
  });
  document.getElementById('btnJumpGo').addEventListener('click', () => {
    const val = document.getElementById('jumpDateInput').value;
    if (!val) return;
    const d = new Date(val + 'T00:00:00');
    uiCalMonth = { y: d.getFullYear(), m: d.getMonth() };
    renderHistory();
    closeModal();
    const entries = allOotdEntries();
    const entry = entries.find(e => e.date === val);
    if (entry) openDayDetail(val, entry);
  });

  // settings: number-grid picker for wash thresholds (+ towel cycle days)
  document.querySelectorAll('.threshold-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => openNumberGridPicker(btn));
  });
  document.getElementById('btnMoreThresholds').addEventListener('click', () => {
    document.getElementById('moreThresholdsWrap').classList.toggle('is-hidden');
    saveSettingsDraft();
  });
  ['settingName'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', saveSettingsDraft);
    el.addEventListener('change', saveSettingsDraft);
  });
  document.getElementById('cardImageScale').addEventListener('input', e => { state.profile.cardImageScale = Number(e.target.value); renderCardImageScale(); saveState(); renderWardrobe(); });
  document.getElementById('avatarInput').addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { state.profile.avatar = await compressImageFile(file, 320, 0.86); saveState(); renderAvatar(); toast('頭像已更新'); }
    catch (err) { toast('頭像處理失敗，請換一張圖片'); }
    e.target.value = '';
  });
  document.getElementById('btnClearAvatar').addEventListener('click', () => { state.profile.avatar = ''; saveState(); renderAvatar(); toast('已移除自訂頭像'); });
  // Weather settings modal entrance
  document.getElementById('btnOpenWeatherSettings')?.addEventListener('click', () => {
    syncWeatherSettings();
    openModal('modal-weather-settings');
  });

  // Weather Carousel Nav
  document.getElementById('btnWeatherPrev')?.addEventListener('click', () => {
    currentPreviewSceneIndex = (currentPreviewSceneIndex - 1 + WEATHER_PREVIEW_SCENES.length) % WEATHER_PREVIEW_SCENES.length;
    updateWeatherPreview();
  });
  document.getElementById('btnWeatherNext')?.addEventListener('click', () => {
    currentPreviewSceneIndex = (currentPreviewSceneIndex + 1) % WEATHER_PREVIEW_SCENES.length;
    updateWeatherPreview();
  });

  function applyWeatherSimulation(simKey) {
    if (simKey === 'real') {
      state.weatherSimulation = null;
      refreshWeather(true);
      toast('已恢復真實天氣');
      renderHeader();
      renderWeather();
      return;
    }
    const SIM_CONFIGS = {
      clear_day: { weather_code: 0, is_day: 1, temperature_2m: 26, label: '晴朗・白天', city: '情境模擬' },
      clear_night: { weather_code: 0, is_day: 0, temperature_2m: 20, label: '晴朗・夜晚', city: '情境模擬' },
      cloudy_day: { weather_code: 3, is_day: 1, temperature_2m: 22, label: '陰天・白天', city: '情境模擬' },
      cloudy_night: { weather_code: 3, is_day: 0, temperature_2m: 19, label: '陰天・夜晚', city: '情境模擬' },
      rain_day: { weather_code: 61, is_day: 1, temperature_2m: 21, label: '小雨・白天', city: '情境模擬' },
      rain_night: { weather_code: 61, is_day: 0, temperature_2m: 18, label: '小雨・夜晚', city: '情境模擬' },
      heavy_day: { weather_code: 65, is_day: 1, temperature_2m: 19, label: '大雨・白天', city: '情境模擬' },
      heavy_night: { weather_code: 65, is_day: 0, temperature_2m: 17, label: '大雨・夜晚', city: '情境模擬' },
      sun_shower: { weather_code: 80, is_day: 1, temperature_2m: 24, label: '晴時多雲偶陣雨', city: '情境模擬' },
    };
    const cfg = SIM_CONFIGS[simKey];
    if (!cfg) return;
    state.weatherSimulation = simKey;
    if (!state.profile.weather) state.profile.weather = {};
    const curCity = state.profile.weather.city || '桃園市中壢區';
    const curArea = state.profile.weather.area || '桃園市中壢區';
    state.profile.weather.city = curCity;
    state.profile.weather.area = curArea;
    state.profile.weather.current = { weather_code: cfg.weather_code, is_day: cfg.is_day, temperature_2m: cfg.temperature_2m };
    state.profile.weather.updatedAt = Date.now();
    saveState({ action: `切換天氣情境至「${cfg.label}」` });
    renderHeader();
    renderWeather();
    syncWeatherSettings();
    toast(`已套用天氣情境：${cfg.label}`);
  }

  document.getElementById('btnApplyPreviewScene')?.addEventListener('click', () => {
    const scene = WEATHER_PREVIEW_SCENES[currentPreviewSceneIndex];
    if (!scene) return;
    applyWeatherSimulation(scene.id);
    updateWeatherPreview();
  });

  document.getElementById('btnResetRealWeather')?.addEventListener('click', () => {
    state.weatherSimulation = null;
    refreshWeather(true);
    toast('已恢復跟隨真實天氣');
    currentPreviewSceneIndex = 0;
    updateWeatherPreview();
  });

  // Use Current Location (GPS)
  document.getElementById('btnUseCurrentLocation')?.addEventListener('click', () => {
    const btn = document.getElementById('btnUseCurrentLocation');
    const statusEl = document.getElementById('weatherStatus');
    if (!navigator.geolocation) {
      toast('此裝置或瀏覽器不支援 GPS 定位');
      return;
    }
    btn.disabled = true;
    const oldText = btn.innerHTML;
    btn.innerHTML = `<span class="icon-inline">${ICONS.mapPin}</span> 正在取得 GPS 定位…`;
    if (statusEl) statusEl.textContent = '正在連線 GPS 衛星…';

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        if (statusEl) statusEl.textContent = '已取得經緯度，正在解析行政區…';
        let cityName = '目前位置';
        let areaLabel = '';

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh-TW`, {
            headers: { 'User-Agent': 'WardrobeMasterApp/1.0' }
          });
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const city = addr.city || addr.county || addr.state || '';
            const town = addr.town || addr.suburb || addr.district || '';
            if (city || town) {
              areaLabel = `${city}${town}`;
              cityName = town || city || '目前位置';
            }
          }
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
        }

        if (!areaLabel) areaLabel = cityName;

        state.profile.weather = Object.assign(state.profile.weather || {}, {
          city: cityName,
          area: areaLabel,
          latitude: lat,
          longitude: lon,
          timezone: 'auto',
          current: null,
          updatedAt: 0,
        });
        saveState({ action: `設定天氣地點為「${areaLabel}」` });
        btn.innerHTML = oldText;
        btn.disabled = false;
        toast(`已定位至「${areaLabel}」`);
        await refreshWeather(true);
        updateWeatherPreview();
      },
      (err) => {
        btn.innerHTML = oldText;
        btn.disabled = false;
        let msg = '無法取得定位權限';
        if (err.code === 1) msg = '請允許位置權限以取得目前天氣';
        else if (err.code === 2) msg = '位置訊號不可用';
        else if (err.code === 3) msg = '定位逾時';
        toast(msg);
        if (statusEl) statusEl.textContent = msg + '，可手動搜尋城市。';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });

  document.getElementById('btnWeatherSearch')?.addEventListener('click', searchWeatherCities);
  document.getElementById('weatherCityInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); searchWeatherCities(); } });
  document.getElementById('weatherSearchResults')?.addEventListener('click', e => {
    const btn = e.target.closest('.weather-result');
    if (!btn) return;
    const loc = e.currentTarget._locations?.[Number(btn.dataset.weatherIndex)];
    selectWeatherLocation(loc);
  });
  document.getElementById('btnWeatherRefresh')?.addEventListener('click', () => {
    state.weatherSimulation = null;
    refreshWeather(true);
    toast('已同步最新氣象資料');
    updateWeatherPreview();
  });

  // Weather fine-tunings
  document.getElementById('weatherTempOffset')?.addEventListener('input', e => {
    const val = Number(e.target.value);
    const out = document.getElementById('weatherTempOffsetValue');
    if (out) out.textContent = (val > 0 ? `+${val}` : `${val}`) + '°C';
    if (!state.profile.weather) state.profile.weather = {};
    state.profile.weather.tempOffset = val;
    renderWeather();
    updateWeatherPreview();
  });
  document.getElementById('weatherTempOffset')?.addEventListener('change', () => {
    saveState();
  });
  document.getElementById('btnTempUnitC')?.addEventListener('click', () => {
    if (!state.profile.weather) state.profile.weather = {};
    state.profile.weather.tempUnit = 'C';
    saveState();
    syncWeatherSettings();
    renderWeather();
  });
  document.getElementById('btnTempUnitF')?.addEventListener('click', () => {
    if (!state.profile.weather) state.profile.weather = {};
    state.profile.weather.tempUnit = 'F';
    saveState();
    syncWeatherSettings();
    renderWeather();
  });

  document.getElementById('btnUndo').addEventListener('click', undoState);
  document.getElementById('btnRedo').addEventListener('click', redoState);

  document.getElementById('settingsForm').addEventListener('submit', e => {
    e.preventDefault();
    const readPicker = id => {
      const v = document.getElementById(id).dataset.value;
      return v === 'none' ? null : Number(v);
    };
    state.profile.name = document.getElementById('settingName').value.trim();
    state.profile.washThresholds = {
      bottom: readPicker('pickThresholdBottom'),
      outer: readPicker('pickThresholdOuter'),
      shoes: readPicker('pickThresholdShoes'),
      hat: readPicker('pickThresholdHat'),
      accessory: readPicker('pickThresholdAccessory'),
    };
    const towelDays = readPicker('pickThresholdTowel');
    state.consumables.forEach(c => { if (isTowelId(c.id)) c.cycleDays = towelDays; });
    saveSettingsDraft();
    renderAll();
    renderAvatar();
    renderCardImageScale();
    toast('設定已儲存');
    modalReturnTo = null;
    forceCloseModal();
  });
  document.getElementById('btnSettingsHeaderSave')?.addEventListener('click', () => {
    document.getElementById('settingsForm')?.requestSubmit();
  });

  setupInspirationCarousel();
  setupSandboxInteractions();
}

/* ============================================================
   INSPIRATION CAROUSEL & SANDBOX MODE
   ============================================================ */
function setupInspirationCarousel() {
  const track = document.getElementById('inspireCarouselTrack');
  const dots = document.querySelectorAll('#inspireCarouselDots .dot');
  if (!track || !dots.length) return;

  const updateDots = () => {
    const scrollLeft = track.scrollLeft;
    const width = track.clientWidth || 1;
    const activeIdx = Math.round(scrollLeft / width);
    dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === activeIdx));
  };

  if (!track._hasCarouselBound) {
    track._hasCarouselBound = true;
    track.addEventListener('scroll', updateDots, { passive: true });
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
      });
    });
  }

  const heroSandbox = document.getElementById('btnOpenSandboxHero');
  if (heroSandbox && !heroSandbox._hasSandboxHeroBound) {
    heroSandbox._hasSandboxHeroBound = true;
    heroSandbox.addEventListener('click', () => openSandboxMode());
  }
}

let selectedSandboxItemId = null;
let sandboxMaxZIndex = 10;
let sandboxUndoStack = [];
let sandboxRedoStack = [];

function pushSandboxHistory() {
  sandboxUndoStack.push(cloneState(state.sandboxItems));
  if (sandboxUndoStack.length > 40) sandboxUndoStack.shift();
  sandboxRedoStack = [];
  updateSandboxHistoryControls();
}

function updateSandboxHistoryControls() {
  const btnUndo = document.getElementById('btnSandboxUndo');
  const btnRedo = document.getElementById('btnSandboxRedo');
  if (btnUndo) btnUndo.disabled = sandboxUndoStack.length === 0;
  if (btnRedo) btnRedo.disabled = sandboxRedoStack.length === 0;
}

function sandboxUndo() {
  if (sandboxUndoStack.length === 0) return;
  sandboxRedoStack.push(cloneState(state.sandboxItems));
  state.sandboxItems = sandboxUndoStack.pop();
  if (selectedSandboxItemId && !state.sandboxItems.some(it => it.id === selectedSandboxItemId)) {
    selectedSandboxItemId = null;
  }
  renderSandboxCanvas();
  saveState();
  updateSandboxHistoryControls();
  toast('已復原');
}

function sandboxRedo() {
  if (sandboxRedoStack.length === 0) return;
  sandboxUndoStack.push(cloneState(state.sandboxItems));
  state.sandboxItems = sandboxRedoStack.pop();
  if (selectedSandboxItemId && !state.sandboxItems.some(it => it.id === selectedSandboxItemId)) {
    selectedSandboxItemId = null;
  }
  renderSandboxCanvas();
  saveState();
  updateSandboxHistoryControls();
  toast('已重做');
}

function openSandboxMode() {
  selectedSandboxItemId = null;
  sandboxUndoStack = [];
  sandboxRedoStack = [];
  const page = document.getElementById('page-sandbox');
  if (page) {
    page.classList.add('is-active');
  }
  updateSandboxHeaderName();
  updateSandboxHistoryControls();
  renderSandboxCanvas();
  applyStaticIcons();
}

function closeSandboxMode() {
  const page = document.getElementById('page-sandbox');
  if (page) {
    page.classList.remove('is-active');
  }
  selectedSandboxItemId = null;
  hideSandboxToolbar();
  saveState();
}

function selectSandboxItem(id) {
  selectedSandboxItemId = id;
  const canvas = document.getElementById('sandboxCanvas');
  if (canvas) {
    canvas.querySelectorAll('.sandbox-item').forEach(el => {
      el.classList.toggle('is-selected', el.dataset.id === id);
    });
  }
  if (id) {
    updateSandboxToolbar();
  } else {
    hideSandboxToolbar();
  }
}

function hideSandboxToolbar() {
  const toolbar = document.getElementById('sandboxItemToolbar');
  if (toolbar) toolbar.classList.add('is-hidden');
}

function renderSandboxCanvas() {
  const canvas = document.getElementById('sandboxCanvas');
  const hint = document.getElementById('sandboxEmptyHint');
  const toolbar = document.getElementById('sandboxItemToolbar');
  if (!canvas) return;

  if (!Array.isArray(state.sandboxItems)) state.sandboxItems = [];

  // Clean existing rendered items
  canvas.querySelectorAll('.sandbox-item').forEach(el => el.remove());

  if (state.sandboxItems.length === 0) {
    if (hint) hint.hidden = false;
    if (toolbar) toolbar.classList.add('is-hidden');
    return;
  }

  if (hint) hint.hidden = true;

  state.sandboxItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'sandbox-item' +
      (item.id === selectedSandboxItemId ? ' is-selected' : '') +
      (item.locked ? ' is-locked' : '');
    el.id = `sandbox-item-${item.id}`;
    el.dataset.id = item.id;
    el.style.left = `${item.x}px`;
    el.style.top = `${item.y}px`;
    el.style.zIndex = item.zIndex || 1;
    el.style.transform = `scale(${item.scale || 1})`;

    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name || '單品';
      img.draggable = false;
      el.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'sandbox-item-placeholder';
      ph.innerHTML = `<span class="rack-chip-thumb">${categoryIcon(item.category || 'top')}</span><span>${escapeHtml(item.name || '單品')}</span>`;
      el.appendChild(ph);
    }

    canvas.appendChild(el);
  });

  if (selectedSandboxItemId) {
    updateSandboxToolbar();
  } else {
    hideSandboxToolbar();
  }
}

function updateSandboxToolbar() {
  const toolbar = document.getElementById('sandboxItemToolbar');
  if (!toolbar) return;
  if (!selectedSandboxItemId) {
    toolbar.classList.add('is-hidden');
    return;
  }
  const itemEl = document.getElementById(`sandbox-item-${selectedSandboxItemId}`);
  const viewport = document.getElementById('sandboxCanvasViewport');
  if (!itemEl || !viewport) {
    toolbar.classList.add('is-hidden');
    return;
  }

  const currentItem = state.sandboxItems.find(it => it.id === selectedSandboxItemId);
  const lockLabel = document.getElementById('sandboxLockLabel');
  if (lockLabel && currentItem) {
    lockLabel.textContent = currentItem.locked ? '解鎖' : '鎖定';
  }

  const itemRect = itemEl.getBoundingClientRect();
  const vpRect = viewport.getBoundingClientRect();

  // Position beside the item: default to right side of top edge
  let top = itemRect.top - vpRect.top - 4;
  let left = itemRect.right - vpRect.left + 8;

  // If too close to right edge of viewport, position above or left
  if (left + 116 > vpRect.width) {
    left = Math.max(8, itemRect.left - vpRect.left);
    top = Math.max(8, itemRect.top - vpRect.top - 34);
  }

  // Clamping within viewport
  top = Math.max(8, Math.min(vpRect.height - 36, top));
  left = Math.max(8, Math.min(vpRect.width - 116, left));

  toolbar.style.top = `${Math.round(top)}px`;
  toolbar.style.left = `${Math.round(left)}px`;
  toolbar.classList.remove('is-hidden');
}

function setupSandboxInteractions() {
  const canvas = document.getElementById('sandboxCanvas');
  const viewport = document.getElementById('sandboxCanvasViewport');
  if (!canvas || !viewport || canvas._hasSandboxInteractions) return;
  canvas._hasSandboxInteractions = true;

  // Touch gesture state
  let touchMode = 'none'; // 'drag' | 'pinch' | 'none'
  let activeDragItem = null;
  let touchStartX = 0, touchStartY = 0;
  let itemStartX = 0, itemStartY = 0;

  let pinchInitialDist = 0;
  let pinchInitialScale = 1;
  let pinchTargetItem = null;
  let preGestureSnapshot = null;

  // 1. TOUCH EVENTS (Mobile Safari / iOS / Android)
  viewport.addEventListener('touchstart', e => {
    // 2-finger touch -> Pinch Zoom Mode strictly (only if not already dragging)
    if (e.touches.length === 2 && touchMode !== 'drag') {
      touchMode = 'pinch';
      hideSandboxToolbar();
      activeDragItem = null; // Cancel drag immediately

      const item0 = e.touches[0].target.closest('.sandbox-item');
      const item1 = e.touches[1].target.closest('.sandbox-item');
      const targetEl = item0 || item1 || (selectedSandboxItemId ? document.getElementById(`sandbox-item-${selectedSandboxItemId}`) : null);

      if (targetEl) {
        const id = targetEl.dataset.id;
        selectSandboxItem(id);
        pinchTargetItem = state.sandboxItems.find(it => it.id === id);
        if (pinchTargetItem) {
          if (pinchTargetItem.locked) {
            pinchTargetItem = null;
            touchMode = 'none';
            e.preventDefault();
            return;
          }
          preGestureSnapshot = cloneState(state.sandboxItems);
          pinchInitialScale = pinchTargetItem.scale || 1;
          pinchInitialDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        }
      } else {
        pinchTargetItem = null;
      }
      e.preventDefault();
      return;
    }

    // 1-finger touch -> Drag / Selection Mode strictly
    if (e.touches.length === 1) {
      const itemEl = e.target.closest('.sandbox-item');
      if (itemEl) {
        const id = itemEl.dataset.id;
        const targetItem = state.sandboxItems.find(it => it.id === id);
        if (targetItem) {
          selectSandboxItem(id);
          if (targetItem.locked) {
            touchMode = 'none';
            activeDragItem = null;
            e.preventDefault();
            return;
          }
          touchMode = 'drag';
          activeDragItem = targetItem;
          preGestureSnapshot = cloneState(state.sandboxItems);
          sandboxMaxZIndex++;
          activeDragItem.zIndex = sandboxMaxZIndex;
          itemEl.style.zIndex = sandboxMaxZIndex;
          itemEl.classList.add('is-dragging');
          hideSandboxToolbar(); // Hide during drag!

          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          itemStartX = activeDragItem.x;
          itemStartY = activeDragItem.y;
        }
        e.preventDefault();
      } else if (!e.target.closest('#sandboxItemToolbar')) {
        // Tapped empty canvas
        touchMode = 'none';
        activeDragItem = null;
        selectSandboxItem(null);
      }
    }
  }, { passive: false });

  viewport.addEventListener('touchmove', e => {
    // Two fingers -> strictly pinch zoom, NO drag
    if (touchMode === 'pinch' && e.touches.length === 2) {
      if (pinchTargetItem && pinchInitialDist > 10 && !pinchTargetItem.locked) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / pinchInitialDist;
        const newScale = Math.min(3.5, Math.max(0.3, pinchInitialScale * factor));
        pinchTargetItem.scale = Number(newScale.toFixed(2));
        const el = document.getElementById(`sandbox-item-${pinchTargetItem.id}`);
        if (el) {
          el.style.transform = `scale(${pinchTargetItem.scale})`;
        }
      }
      e.preventDefault();
      return;
    }

    // Single finger -> strictly drag, strictly keep scale constant
    if (touchMode === 'drag' && activeDragItem && !activeDragItem.locked) {
      if (e.touches.length > 1) {
        e.preventDefault();
        return;
      }
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;

      activeDragItem.x = Math.round(itemStartX + dx);
      activeDragItem.y = Math.round(itemStartY + dy);
      const el = document.getElementById(`sandbox-item-${activeDragItem.id}`);
      if (el) {
        el.style.left = `${activeDragItem.x}px`;
        el.style.top = `${activeDragItem.y}px`;
        el.style.transform = `scale(${activeDragItem.scale || 1})`;
      }
      e.preventDefault();
    }
  }, { passive: false });

  const handleTouchEnd = e => {
    if (e.touches.length === 0) {
      if (activeDragItem) {
        const el = document.getElementById(`sandbox-item-${activeDragItem.id}`);
        if (el) el.classList.remove('is-dragging');
      }
      if (touchMode === 'drag' || touchMode === 'pinch') {
        if (preGestureSnapshot && JSON.stringify(preGestureSnapshot) !== JSON.stringify(state.sandboxItems)) {
          sandboxUndoStack.push(preGestureSnapshot);
          if (sandboxUndoStack.length > 40) sandboxUndoStack.shift();
          sandboxRedoStack = [];
          updateSandboxHistoryControls();
        }
        saveState();
      }
      preGestureSnapshot = null;
      touchMode = 'none';
      activeDragItem = null;
      pinchTargetItem = null;

      // When drag/pinch ends, show mini toolbar beside the selected item
      if (selectedSandboxItemId) {
        updateSandboxToolbar();
      }
    } else if (e.touches.length === 1) {
      // Transitioned from 2 fingers to 1 finger -> do NOT resume drag
      touchMode = 'none';
      activeDragItem = null;
      pinchTargetItem = null;
    }
  };

  viewport.addEventListener('touchend', handleTouchEnd);
  viewport.addEventListener('touchcancel', handleTouchEnd);

  // 2. DESKTOP / MOUSE EVENTS
  let isMouseDown = false;
  viewport.addEventListener('mousedown', e => {
    const itemEl = e.target.closest('.sandbox-item');
    if (itemEl) {
      const id = itemEl.dataset.id;
      const targetItem = state.sandboxItems.find(it => it.id === id);
      if (targetItem) {
        selectSandboxItem(id);
        if (targetItem.locked) {
          activeDragItem = null;
          isMouseDown = false;
          return;
        }
        activeDragItem = targetItem;
        preGestureSnapshot = cloneState(state.sandboxItems);
        isMouseDown = true;
        sandboxMaxZIndex++;
        activeDragItem.zIndex = sandboxMaxZIndex;
        itemEl.style.zIndex = sandboxMaxZIndex;
        itemEl.classList.add('is-dragging');
        hideSandboxToolbar();

        touchStartX = e.clientX;
        touchStartY = e.clientY;
        itemStartX = activeDragItem.x;
        itemStartY = activeDragItem.y;
      }
    } else if (!e.target.closest('#sandboxItemToolbar')) {
      selectSandboxItem(null);
    }
  });

  window.addEventListener('mousemove', e => {
    if (!isMouseDown || !activeDragItem || activeDragItem.locked) return;
    const dx = e.clientX - touchStartX;
    const dy = e.clientY - touchStartY;
    activeDragItem.x = Math.round(itemStartX + dx);
    activeDragItem.y = Math.round(itemStartY + dy);
    const el = document.getElementById(`sandbox-item-${activeDragItem.id}`);
    if (el) {
      el.style.left = `${activeDragItem.x}px`;
      el.style.top = `${activeDragItem.y}px`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isMouseDown) {
      if (activeDragItem) {
        const el = document.getElementById(`sandbox-item-${activeDragItem.id}`);
        if (el) el.classList.remove('is-dragging');
      }
      isMouseDown = false;
      if (preGestureSnapshot && JSON.stringify(preGestureSnapshot) !== JSON.stringify(state.sandboxItems)) {
        sandboxUndoStack.push(preGestureSnapshot);
        if (sandboxUndoStack.length > 40) sandboxUndoStack.shift();
        sandboxRedoStack = [];
        updateSandboxHistoryControls();
      }
      preGestureSnapshot = null;
      activeDragItem = null;
      saveState();
      if (selectedSandboxItemId) {
        updateSandboxToolbar();
      }
    }
  });

  // Desktop mouse wheel to zoom selected item
  viewport.addEventListener('wheel', e => {
    if (!selectedSandboxItemId) return;
    const item = state.sandboxItems.find(it => it.id === selectedSandboxItemId);
    if (!item || item.locked) return;
    e.preventDefault();
    pushSandboxHistory();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const currentScale = item.scale || 1;
    item.scale = Number(Math.min(3.5, Math.max(0.3, currentScale + delta)).toFixed(2));
    const el = document.getElementById(`sandbox-item-${item.id}`);
    if (el) {
      el.style.transform = `scale(${item.scale})`;
    }
    updateSandboxToolbar();
    saveState();
  }, { passive: false });

  // Topbar Undo & Redo buttons
  const btnUndo = document.getElementById('btnSandboxUndo');
  if (btnUndo) {
    btnUndo.onclick = () => sandboxUndo();
  }
  const btnRedo = document.getElementById('btnSandboxRedo');
  if (btnRedo) {
    btnRedo.onclick = () => sandboxRedo();
  }

  // Duplicate button
  const btnDup = document.getElementById('btnSandboxDuplicate');
  if (btnDup) {
    btnDup.onclick = e => {
      e.stopPropagation();
      if (!selectedSandboxItemId) return;
      const src = state.sandboxItems.find(it => it.id === selectedSandboxItemId);
      if (!src) return;
      pushSandboxHistory();
      sandboxMaxZIndex++;
      const clone = {
        ...src,
        id: uid(),
        x: src.x + 20,
        y: src.y + 20,
        zIndex: sandboxMaxZIndex
      };
      state.sandboxItems.push(clone);
      selectedSandboxItemId = clone.id;
      saveState();
      renderSandboxCanvas();
      toast('已複製單品');
    };
  }

  // Layer Up button
  const btnLayerUp = document.getElementById('btnSandboxLayerUp');
  if (btnLayerUp) {
    btnLayerUp.onclick = e => {
      e.stopPropagation();
      if (!selectedSandboxItemId) return;
      const src = state.sandboxItems.find(it => it.id === selectedSandboxItemId);
      if (!src) return;
      pushSandboxHistory();
      sandboxMaxZIndex++;
      src.zIndex = sandboxMaxZIndex;
      const el = document.getElementById(`sandbox-item-${src.id}`);
      if (el) el.style.zIndex = src.zIndex;
      saveState();
      toast('已上移圖層');
    };
  }

  // Layer Down button
  const btnLayerDown = document.getElementById('btnSandboxLayerDown');
  if (btnLayerDown) {
    btnLayerDown.onclick = e => {
      e.stopPropagation();
      if (!selectedSandboxItemId) return;
      const src = state.sandboxItems.find(it => it.id === selectedSandboxItemId);
      if (!src) return;
      pushSandboxHistory();
      const minZ = Math.min(...state.sandboxItems.map(it => it.zIndex || 1));
      src.zIndex = Math.max(1, minZ - 1);
      const el = document.getElementById(`sandbox-item-${src.id}`);
      if (el) el.style.zIndex = src.zIndex;
      saveState();
      toast('已下移圖層');
    };
  }

  // Lock / Unlock button
  const btnLock = document.getElementById('btnSandboxLock');
  if (btnLock) {
    btnLock.onclick = e => {
      e.stopPropagation();
      if (!selectedSandboxItemId) return;
      const src = state.sandboxItems.find(it => it.id === selectedSandboxItemId);
      if (!src) return;
      pushSandboxHistory();
      src.locked = !src.locked;
      const lockLabel = document.getElementById('sandboxLockLabel');
      if (lockLabel) lockLabel.textContent = src.locked ? '解鎖' : '鎖定';
      const el = document.getElementById(`sandbox-item-${src.id}`);
      if (el) el.classList.toggle('is-locked', !!src.locked);
      saveState();
      toast(src.locked ? '已鎖定單品' : '已解除鎖定');
    };
  }

  // Delete button
  const btnDel = document.getElementById('btnSandboxDelete');
  if (btnDel) {
    btnDel.onclick = e => {
      e.stopPropagation();
      if (!selectedSandboxItemId) return;
      pushSandboxHistory();
      state.sandboxItems = state.sandboxItems.filter(it => it.id !== selectedSandboxItemId);
      selectedSandboxItemId = null;
      hideSandboxToolbar();
      saveState();
      renderSandboxCanvas();
      toast('已刪除單品');
    };
  }

  // Back button
  const btnBack = document.getElementById('btnSandboxBack');
  if (btnBack) {
    btnBack.onclick = () => closeSandboxMode();
  }

  // Clear canvas
  const btnClear = document.getElementById('btnSandboxClear');
  if (btnClear) {
    btnClear.onclick = () => {
      if (!state.sandboxItems || state.sandboxItems.length === 0) return;
      if (confirm('確定清空沙盒畫布上的所有單品嗎？')) {
        pushSandboxHistory();
        state.sandboxItems = [];
        selectedSandboxItemId = null;
        hideSandboxToolbar();
        saveState();
        renderSandboxCanvas();
        toast('畫布已清空');
      }
    };
  }

  // Save canvas
  const btnSave = document.getElementById('btnSandboxSave');
  if (btnSave) {
    btnSave.onclick = () => {
      const sb = getCurrentSandbox();
      sb.items = cloneState(state.sandboxItems);
      saveState({ action: `儲存「${sb.name}」` });
      toast(`「${sb.name}」穿搭已儲存`);
      closeSandboxMode();
    };
  }

  // Switcher & Multi-sandbox manager
  const btnSwitcher = document.getElementById('btnSandboxSwitcher');
  if (btnSwitcher) {
    btnSwitcher.onclick = () => {
      renderSandboxManagerModal();
      openModal('modal-sandbox-manager');
    };
  }

  const btnCreateSb = document.getElementById('btnCreateNewSandbox');
  if (btnCreateSb) {
    btnCreateSb.onclick = () => createNewSandbox();
  }

  // Add buttons
  const btnAddWardrobe = document.getElementById('btnSandboxAddWardrobe');
  if (btnAddWardrobe) {
    btnAddWardrobe.onclick = () => openSandboxPicker('wardrobe');
  }

  const btnAddWishlist = document.getElementById('btnSandboxAddWishlist');
  if (btnAddWishlist) {
    btnAddWishlist.onclick = () => openSandboxPicker('wishlist');
  }

  const customPhotoInput = document.getElementById('sandboxCustomPhotoInput');
  if (customPhotoInput) {
    customPhotoInput.onchange = e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        addCustomImageToSandbox(ev.target.result);
      };
      reader.readAsDataURL(file);
      customPhotoInput.value = '';
    };
  }
}

function updateSandboxHeaderName() {
  const nameEl = document.getElementById('sandboxCurrentName');
  if (nameEl) {
    const sb = getCurrentSandbox();
    nameEl.textContent = sb.name || '穿搭沙盒';
  }
}

function switchSandbox(id) {
  const target = state.sandboxes.find(s => s.id === id);
  if (!target) return;
  state.currentSandboxId = target.id;
  if (!Array.isArray(target.items)) target.items = [];
  state.sandboxItems = target.items;
  selectedSandboxItemId = null;
  hideSandboxToolbar();
  renderSandboxCanvas();
  updateSandboxHeaderName();
  closeModal();
  toast(`已切換至「${target.name}」`);
}

function renderSandboxManagerModal() {
  const listEl = document.getElementById('sandboxManagerList');
  if (!listEl) return;
  listEl.innerHTML = '';
  const current = getCurrentSandbox();

  state.sandboxes.forEach(sb => {
    const isCurrent = sb.id === current.id;
    const row = document.createElement('div');
    row.style.cssText = `display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:12px;border:1.5px solid ${isCurrent ? 'var(--color-denim)' : 'var(--color-line)'};background:${isCurrent ? 'rgba(78,110,242,0.06)' : 'var(--color-surface)'};`;

    row.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:2px;cursor:pointer;flex:1;">
        <div style="display:flex;align-items:center;gap:6px;">
          <b style="font-size:14px;color:var(--color-ink);">${escapeHtml(sb.name)}</b>
          ${isCurrent ? '<span style="font-size:11px;background:var(--color-denim);color:#fff;padding:1px 6px;border-radius:10px;">目前使用</span>' : ''}
        </div>
        <small style="color:var(--color-ink-soft);">${(sb.items || []).length} 件單品</small>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        ${!isCurrent ? `<button type="button" class="btn-secondary btn-switch-sb" style="padding:5px 10px;font-size:12px;">切換</button>` : ''}
        <button type="button" class="btn-secondary btn-rename-sb" style="padding:5px 8px;font-size:12px;">改名</button>
        ${state.sandboxes.length > 1 ? `<button type="button" class="btn-secondary btn-danger btn-del-sb" style="padding:5px 8px;font-size:12px;">刪除</button>` : ''}
      </div>
    `;

    row.querySelector('.btn-switch-sb')?.addEventListener('click', (e) => {
      e.stopPropagation();
      switchSandbox(sb.id);
    });
    row.querySelector('div[style*="cursor:pointer"]')?.addEventListener('click', () => {
      if (!isCurrent) switchSandbox(sb.id);
    });

    row.querySelector('.btn-rename-sb')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = prompt('重新命名沙盒：', sb.name);
      if (!next || !next.trim() || next.trim() === sb.name) return;
      sb.name = next.trim();
      saveState({ action: `重新命名沙盒為「${sb.name}」` });
      updateSandboxHeaderName();
      renderSandboxManagerModal();
      toast(`已更名為「${sb.name}」`);
    });

    row.querySelector('.btn-del-sb')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!confirm(`確定要刪除「${sb.name}」及其畫布單品嗎？`)) return;
      state.sandboxes = state.sandboxes.filter(s => s.id !== sb.id);
      if (state.currentSandboxId === sb.id) {
        state.currentSandboxId = state.sandboxes[0]?.id || 'sb_default';
        state.sandboxItems = getCurrentSandbox().items;
      }
      saveState({ action: `刪除沙盒「${sb.name}」` });
      renderSandboxCanvas();
      updateSandboxHeaderName();
      renderSandboxManagerModal();
      toast(`已刪除「${sb.name}」`);
    });

    listEl.appendChild(row);
  });
}

function createNewSandbox() {
  const num = state.sandboxes.length + 1;
  const newName = `沙盒 ${num}`;
  const newSb = {
    id: uid(),
    name: newName,
    items: [],
    createdAt: Date.now()
  };
  state.sandboxes.push(newSb);
  state.currentSandboxId = newSb.id;
  state.sandboxItems = newSb.items;
  selectedSandboxItemId = null;
  saveState({ action: `新增「${newName}」` });
  renderSandboxCanvas();
  updateSandboxHeaderName();
  closeModal();
  toast(`已建立並切換至「${newName}」`);
}

let sandboxPickerFilter = 'all';
let sandboxPickerQuery = '';

function openSandboxPicker(type) {
  const isWishlist = type === 'wishlist';
  const title = document.getElementById('sandboxPickerTitle');
  const chips = document.getElementById('sandboxPickerCategoryChips');
  const searchInput = document.getElementById('sandboxPickerSearchInput');
  const grid = document.getElementById('sandboxPickerGrid');
  if (!grid) return;

  if (title) title.textContent = isWishlist ? '加入想買單品至沙盒' : '加入衣櫥單品至沙盒';
  sandboxPickerFilter = 'all';
  sandboxPickerQuery = '';
  if (searchInput) searchInput.value = '';

  if (chips) {
    chips.innerHTML = '';
    const cats = [{ id: 'all', label: '全部' }].concat(
      allCategoryIds().map(id => ({ id, label: categoryLabel(id) }))
    );
    cats.forEach(c => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (c.id === sandboxPickerFilter ? ' is-active' : '');
      chip.textContent = c.label;
      chip.addEventListener('click', () => {
        chips.querySelectorAll('.chip').forEach(ch => ch.classList.remove('is-active'));
        chip.classList.add('is-active');
        sandboxPickerFilter = c.id;
        renderSandboxPickerItems(type);
      });
      chips.appendChild(chip);
    });
  }

  if (searchInput && !searchInput._hasSandboxSearchBound) {
    searchInput._hasSandboxSearchBound = true;
    searchInput.addEventListener('input', e => {
      sandboxPickerQuery = e.target.value.trim().toLowerCase();
      renderSandboxPickerItems(type);
    });
  }

  renderSandboxPickerItems(type);
  openModal('modal-sandbox-picker');
}

function renderSandboxPickerItems(type) {
  const isWishlist = type === 'wishlist';
  const grid = document.getElementById('sandboxPickerGrid');
  const empty = document.getElementById('sandboxPickerEmpty');
  if (!grid) return;
  grid.innerHTML = '';

  let items = isWishlist
    ? (Array.isArray(state.wishlist) ? state.wishlist.slice() : [])
    : state.items.filter(i => i.status !== 'retired');

  if (sandboxPickerFilter !== 'all') {
    items = items.filter(it => it.category === sandboxPickerFilter);
  }

  if (sandboxPickerQuery) {
    items = items.filter(it => {
      const name = (it.name || '').toLowerCase();
      const brand = (it.brand || '').toLowerCase();
      const tags = (it.tags || []).join(' ').toLowerCase();
      return name.includes(sandboxPickerQuery) || brand.includes(sandboxPickerQuery) || tags.includes(sandboxPickerQuery);
    });
  }

  if (empty) empty.hidden = items.length !== 0;

  items.forEach(it => {
    let card;
    if (isWishlist) {
      card = document.createElement('button');
      card.type = 'button';
      card.className = 'item-card';
      const thumb = it.image
        ? `<div class="item-card-photo" style="background-image:url('${it.image}');background-size:contain;background-position:center;background-repeat:no-repeat;width:100%;height:100%;"></div>`
        : `<div class="item-card-photo" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><span class="rack-chip-thumb">${categoryIcon(it.category || 'top')}</span></div>`;
      card.innerHTML = `
        <div class="item-photo">${thumb}</div>
        <div class="item-info">
          ${it.brand ? `<p class="item-brand"><span>${escapeHtml(it.brand)}</span></p>` : ''}
          <p class="item-name">${escapeHtml(it.name)}</p>
          <p class="item-wear" style="color:var(--color-denim);">${categoryLabel(it.category || 'top')}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        addItemToSandbox({
          type: 'wishlist',
          refId: it.id,
          name: it.name,
          image: it.image || null,
          category: it.category || 'top'
        });
        closeModal();
        toast(`已將「${it.name}」加入沙盒`);
      });
    } else {
      card = buildItemCard(it, {
        onClick: () => {
          addItemToSandbox({
            type: 'wardrobe',
            refId: it.id,
            name: it.name,
            image: it.image || null,
            category: it.category || 'top'
          });
          closeModal();
          toast(`已將「${it.name}」加入沙盒`);
        }
      });
    }
    grid.appendChild(card);
  });
}

function addItemToSandbox({ type, refId, name, image, category }) {
  if (!Array.isArray(state.sandboxItems)) state.sandboxItems = [];
  pushSandboxHistory();
  sandboxMaxZIndex++;
  const viewport = document.getElementById('sandboxCanvasViewport');
  const cx = viewport ? Math.max(40, (viewport.clientWidth / 2) - 60) : 100;
  const cy = viewport ? Math.max(40, (viewport.clientHeight / 2) - 70) : 150;
  const jitter = (state.sandboxItems.length % 6) * 16;

  const newItem = {
    id: uid(),
    type,
    refId: refId || null,
    name: name || '單品',
    image: image || null,
    category: category || 'top',
    x: Math.round(cx + jitter),
    y: Math.round(cy + jitter),
    scale: 1,
    rotation: 0,
    zIndex: sandboxMaxZIndex
  };

  state.sandboxItems.push(newItem);
  selectedSandboxItemId = newItem.id;
  saveState();
  renderSandboxCanvas();
}

function addCustomImageToSandbox(base64) {
  addItemToSandbox({
    type: 'custom',
    refId: null,
    name: '自訂照片',
    image: base64,
    category: 'custom'
  });
  toast('已加入自訂照片至沙盒');
}

/* ============================================================
   GEMINI AI STUDIO & PHOTO RETOUCH
   ============================================================ */
let aiOriginalPhoto = null;
let aiProcessedPhoto = null;

function studioCutoutCanvas(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;

        const samplePoints = [
          [4, 4], [w - 5, 4], [4, h - 5], [w - 5, h - 5],
          [Math.floor(w / 2), 4], [Math.floor(w / 2), h - 5],
          [4, Math.floor(h / 2)], [w - 5, Math.floor(h / 2)],
        ];
        let bgR = 0, bgG = 0, bgB = 0;
        samplePoints.forEach(([x, y]) => {
          const idx = (y * w + x) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR /= samplePoints.length;
        bgG /= samplePoints.length;
        bgB /= samplePoints.length;

        const tolerance = 46;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
          if (dist < tolerance) {
            data[i + 3] = 0;
          } else if (dist < tolerance + 18) {
            const ratio = (dist - tolerance) / 18;
            data[i + 3] = Math.round(data[i + 3] * ratio);
          }
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function enhanceLightingCanvas(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i], g = data[i + 1], b = data[i + 2];

          // Lift shadow
          if (r < 110) r = Math.min(255, r * 1.15);
          if (g < 110) g = Math.min(255, g * 1.15);
          if (b < 110) b = Math.min(255, b * 1.15);

          // Contrast curve
          r = ((r - 128) * 1.10) + 128;
          g = ((g - 128) * 1.10) + 128;
          b = ((b - 128) * 1.10) + 128;

          // Saturation
          const avg = (r + g + b) / 3;
          r = avg + (r - avg) * 1.14;
          g = avg + (g - avg) * 1.14;
          b = avg + (b - avg) * 1.14;

          data[i] = Math.max(0, Math.min(255, Math.round(r)));
          data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
          data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function callGeminiVision(dataUrl, apiKey) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('圖片格式無效');
  const mimeType = match[1];
  const base64Data = match[2];

  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastErr = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: base64Data } },
              {
                text: '你是一個專業的衣物分析師。請分析這張衣物照片，並只輸出 JSON 格式（嚴格不要包含 markdown 標籤或程式碼區塊符號，不要輸出其他文字）：\n' +
                      '{\n' +
                      '  "name": "適當且生活化的繁體中文品名，例如：純白重磅短袖T恤、深藍微破直筒牛仔褲",\n' +
                      '  "category": "必須是以下六種之一：top、bottom、outer、shoes、hat、accessory",\n' +
                      '  "material": "衣服材質標籤，例如：純棉、棉麻、牛仔丹寧、羊毛、聚酯纖維、防風機能布",\n' +
                      '  "tags": ["2至4個標籤，例如：休閒, 重磅, 寬版, 短"],\n' +
                      '  "brand": "若有可清楚辨識的品牌LOGO請填寫（例如 UNIQLO、Nike、GU、ZARA），若無請填空字串",\n' +
                      '  "length": "若為上衣或褲子請填長或短，若非則填空字串"\n' +
                      '}'
              }
            ]
          }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API 回應錯誤 (${res.status}): ${errText}`);
      }
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function wireGeminiAiStudio() {
  const modalId = 'modal-gemini-ai';
  const previewImg = document.getElementById('aiProcessedPreviewImg');
  const loadingOverlay = document.getElementById('aiLoadingOverlay');
  const loadingText = document.getElementById('aiLoadingText');
  const keyBanner = document.getElementById('aiKeyBanner');
  const inlineKeyInput = document.getElementById('inlineGeminiKey');

  function openGeminiStudio() {
    if (!pendingPhoto) {
      toast('請先上傳衣物照片');
      document.getElementById('photoInput').click();
      return;
    }
    aiOriginalPhoto = pendingPhoto;
    aiProcessedPhoto = pendingPhoto;
    previewImg.src = aiProcessedPhoto;
    document.getElementById('btnShowProcessed').classList.add('is-active');
    document.getElementById('btnShowOriginal').classList.remove('is-active');
    if (!state.geminiApiKey) {
      keyBanner.classList.remove('is-hidden');
    } else {
      keyBanner.classList.add('is-hidden');
    }
    modalReturnTo = 'modal-add';
    openModal(modalId);
  }

  const openBtn = document.getElementById('btnOpenAiRetouch');
  if (openBtn) openBtn.addEventListener('click', openGeminiStudio);

  const quickCutoutBtn = document.getElementById('btnQuickStudioCutout');
  if (quickCutoutBtn) {
    quickCutoutBtn.addEventListener('click', async () => {
      if (!pendingPhoto) {
        toast('請先上傳衣物照片');
        document.getElementById('photoInput').click();
        return;
      }
      toast('正在進行白底棚拍處理…');
      try {
        const cutout = await studioCutoutCanvas(pendingPhoto);
        pendingPhoto = cutout;
        const wrap = document.getElementById('photoPreviewWrap');
        wrap.setAttribute('style', `background-color:#fff;background-image:url('${pendingPhoto}')`);
        wrap.classList.add('has-photo');
        wrap.innerHTML = '';
        autoSaveAddItemDraft();
        formDirty = true;
        toast('已完成白底棚拍');
      } catch (e) {
        toast('修圖失敗，請重試');
      }
    });
  }

  const saveKeyBtn = document.getElementById('btnSaveInlineKey');
  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
      const val = inlineKeyInput.value.trim();
      if (val) {
        state.geminiApiKey = val;
        localStorage.setItem('gemini_api_key', val);
        saveState();
        keyBanner.classList.add('is-hidden');
        toast('已儲存 Gemini API Key');
      }
    });
  }

  const toggleProcessed = document.getElementById('btnShowProcessed');
  const toggleOriginal = document.getElementById('btnShowOriginal');
  if (toggleProcessed && toggleOriginal) {
    toggleProcessed.addEventListener('click', () => {
      toggleProcessed.classList.add('is-active');
      toggleOriginal.classList.remove('is-active');
      previewImg.src = aiProcessedPhoto;
    });

    toggleOriginal.addEventListener('click', () => {
      toggleOriginal.classList.add('is-active');
      toggleProcessed.classList.remove('is-active');
      previewImg.src = aiOriginalPhoto;
    });
  }

  const studioCutoutBtn = document.getElementById('btnAiStudioCutout');
  if (studioCutoutBtn) {
    studioCutoutBtn.addEventListener('click', async () => {
      loadingText.textContent = '智慧白底棚拍處理中…';
      loadingOverlay.classList.remove('is-hidden');
      try {
        const result = await studioCutoutCanvas(aiOriginalPhoto);
        aiProcessedPhoto = result;
        previewImg.src = aiProcessedPhoto;
        toggleProcessed.classList.add('is-active');
        toggleOriginal.classList.remove('is-active');
        toast('智慧白底棚拍完成');
      } catch (err) {
        toast('修圖處理失敗');
      } finally {
        loadingOverlay.classList.add('is-hidden');
      }
    });
  }

  const enhanceLightingBtn = document.getElementById('btnAiEnhanceLighting');
  if (enhanceLightingBtn) {
    enhanceLightingBtn.addEventListener('click', async () => {
      loadingText.textContent = '光影與色彩校正中…';
      loadingOverlay.classList.remove('is-hidden');
      try {
        const result = await enhanceLightingCanvas(aiProcessedPhoto || aiOriginalPhoto);
        aiProcessedPhoto = result;
        previewImg.src = aiProcessedPhoto;
        toggleProcessed.classList.add('is-active');
        toggleOriginal.classList.remove('is-active');
        toast('光影與色彩已增強');
      } catch (err) {
        toast('處理失敗');
      } finally {
        loadingOverlay.classList.add('is-hidden');
      }
    });
  }

  const autoDetectBtn = document.getElementById('btnAiAutoDetect');
  if (autoDetectBtn) {
    autoDetectBtn.addEventListener('click', async () => {
      if (!state.geminiApiKey) {
        keyBanner.classList.remove('is-hidden');
        inlineKeyInput.focus();
        toast('請先填寫 Gemini API Key 才能使用自動辨識');
        return;
      }
      loadingText.textContent = 'Gemini 正在分析衣物品名、分類與材質…';
      loadingOverlay.classList.remove('is-hidden');
      try {
        const info = await callGeminiVision(aiOriginalPhoto, state.geminiApiKey);
        if (info.name) document.getElementById('fieldName').value = info.name;
        if (info.category && FIXED_CATEGORIES.includes(info.category)) {
          pendingCategory = info.category;
          renderCategoryPickerChips();
          renderLengthToggle();
        }
        if (info.material) {
          pendingMaterial = info.material;
          document.getElementById('fieldMaterialCustom').value = pendingMaterial;
          renderMaterialPickerChips();
        }
        if (Array.isArray(info.tags) && info.tags.length) {
          pendingTags = Array.from(new Set(pendingTags.concat(info.tags.map(t => String(t).trim()))));
          renderTagPickerChips();
        }
        if (info.length && (pendingCategory === 'top' || pendingCategory === 'bottom')) {
          if (!pendingTags.includes(info.length)) {
            pendingTags = pendingTags.filter(t => !LENGTH_TAGS.includes(t)).concat([info.length]);
            renderLengthToggle();
            renderTagPickerChips();
          }
        }
        if (info.brand) {
          document.getElementById('fieldBrand').value = info.brand;
          syncBrandForm(info.brand, null);
        }
        formDirty = true;
        autoSaveAddItemDraft();
        toast(`Gemini 已辨識：${info.name || '已自動填入資料'}`);
      } catch (err) {
        toast('Gemini 辨識失敗，請檢查 API Key 或網路連線');
      } finally {
        loadingOverlay.classList.add('is-hidden');
      }
    });
  }

  const applyBtn = document.getElementById('btnApplyAiPhoto');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      if (aiProcessedPhoto) {
        pendingPhoto = aiProcessedPhoto;
        const wrap = document.getElementById('photoPreviewWrap');
        wrap.setAttribute('style', `background-color:#fff;background-image:url('${pendingPhoto}')`);
        wrap.classList.add('has-photo');
        wrap.innerHTML = '';
        autoSaveAddItemDraft();
        formDirty = true;
        toast('已套用修圖照片');
      }
      closeModal();
    });
  }
}

/* ============================================================
   INIT
   ============================================================ */
async function init() {
  await loadStateAsync();
  applyStaticIcons();
  wireEvents();
  wirePhotoAdjust();
  wireGeminiAiStudio();
  renderCategoryChips();
  ensureNewDay();
  historySnapshot = cloneState(state);
  historyReady = true;
  activateView('home');
  renderAll();
  updateHistoryControls();
  refreshWeather(false);
  setInterval(() => { ensureNewDay(); renderAll(); }, 5 * 60 * 1000);

  window.addEventListener('pagehide', () => persistStateToDB());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persistStateToDB();
  });

  // small minimum splash time so it reads as an intentional launch moment
  // rather than an imperceptible flash, then fade it out and drop it from the DOM
  const splash = document.getElementById('splashScreen');
  setTimeout(() => {
    splash.classList.add('splash-fade-out');
    setTimeout(() => splash.remove(), 400);
  }, 350);

  // Viewport scroll lock for iOS PWA standalone mode
  function lockViewportScroll() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    const app = document.getElementById('app');
    if (app && app.style.height) app.style.height = '';
  }
  window.addEventListener('resize', lockViewportScroll);
  window.addEventListener('orientationchange', lockViewportScroll);
  window.addEventListener('scroll', () => {
    if (window.scrollY !== 0 || window.scrollX !== 0) {
      window.scrollTo(0, 0);
    }
  }, { passive: true });
  lockViewportScroll();

  const btnForceRefresh = document.getElementById('btnForceRefresh');
  if (btnForceRefresh) {
    btnForceRefresh.addEventListener('click', async () => {
      btnForceRefresh.textContent = '正在重新整理...';
      if ('serviceWorker' in navigator) {
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const reg of regs) await reg.unregister();
        } catch (e) {}
      }
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          for (const key of keys) await caches.delete(key);
        } catch (e) {}
      }
      window.location.href = window.location.pathname + '?v=' + Date.now();
    });
  }

  // Self-healing: if device is still running stale cached styles where tab-bar wasn't fixed
  const tb = document.querySelector('.tab-bar');
  if (tb && window.getComputedStyle(tb).position !== 'fixed') {
    if ('caches' in window) {
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }

  if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js?v=20260929a').then(reg => {
        reg.update().catch(() => {});
      }).catch(() => {});
    });
  }
}
document.addEventListener('DOMContentLoaded', init);

