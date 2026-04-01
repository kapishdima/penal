export interface ServiceInfo {
  domain: string;
  color: string;
}

export const SERVICE_MAP: Record<string, ServiceInfo> = {
  netflix: { domain: "netflix.com", color: "#E50914" },
  spotify: { domain: "spotify.com", color: "#1DB954" },
  youtube: { domain: "youtube.com", color: "#FF0000" },
  "youtube premium": { domain: "youtube.com", color: "#FF0000" },
  "youtube music": { domain: "music.youtube.com", color: "#FF0000" },
  apple: { domain: "apple.com", color: "#A2AAAD" },
  "apple music": { domain: "music.apple.com", color: "#FA243C" },
  "apple tv": { domain: "tv.apple.com", color: "#000000" },
  "icloud": { domain: "icloud.com", color: "#3693F3" },
  "apple one": { domain: "apple.com", color: "#A2AAAD" },
  discord: { domain: "discord.com", color: "#5865F2" },
  "discord nitro": { domain: "discord.com", color: "#5865F2" },
  slack: { domain: "slack.com", color: "#4A154B" },
  notion: { domain: "notion.so", color: "#000000" },
  figma: { domain: "figma.com", color: "#F24E1E" },
  github: { domain: "github.com", color: "#24292F" },
  "github copilot": { domain: "github.com", color: "#24292F" },
  chatgpt: { domain: "chat.openai.com", color: "#10A37F" },
  "openai": { domain: "openai.com", color: "#10A37F" },
  claude: { domain: "claude.ai", color: "#D97757" },
  twitch: { domain: "twitch.tv", color: "#9146FF" },
  steam: { domain: "store.steampowered.com", color: "#1B2838" },
  adobe: { domain: "adobe.com", color: "#FF0000" },
  dropbox: { domain: "dropbox.com", color: "#0061FF" },
  telegram: { domain: "telegram.org", color: "#26A5E4" },
  "telegram premium": { domain: "telegram.org", color: "#26A5E4" },
  whatsapp: { domain: "whatsapp.com", color: "#25D366" },
  google: { domain: "google.com", color: "#4285F4" },
  "google one": { domain: "one.google.com", color: "#4285F4" },
  amazon: { domain: "amazon.com", color: "#FF9900" },
  "amazon prime": { domain: "amazon.com", color: "#00A8E1" },
  "prime video": { domain: "primevideo.com", color: "#00A8E1" },
  hbo: { domain: "hbomax.com", color: "#B31EE2" },
  "hbo max": { domain: "hbomax.com", color: "#B31EE2" },
  disney: { domain: "disneyplus.com", color: "#113CCF" },
  "disney+": { domain: "disneyplus.com", color: "#113CCF" },
  hulu: { domain: "hulu.com", color: "#1CE783" },
  zoom: { domain: "zoom.us", color: "#2D8CFF" },
  linear: { domain: "linear.app", color: "#5E6AD2" },
  vercel: { domain: "vercel.com", color: "#000000" },
  "1password": { domain: "1password.com", color: "#0094F5" },
  bitwarden: { domain: "bitwarden.com", color: "#175DDC" },
  nordvpn: { domain: "nordvpn.com", color: "#4687FF" },
  expressvpn: { domain: "expressvpn.com", color: "#DA3940" },
  grammarly: { domain: "grammarly.com", color: "#15C39A" },
  midjourney: { domain: "midjourney.com", color: "#000000" },
  cursor: { domain: "cursor.com", color: "#000000" },
};

export function getServiceInfo(name: string): ServiceInfo | null {
  const lower = name.toLowerCase().trim();
  return SERVICE_MAP[lower] ?? null;
}

export function getFaviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}
