export const monitoringSources = [
  { id: 'sloth-bytes', name: 'Sloth Bytes', language: 'EN', feedUrl: 'https://rss.beehiiv.com/feeds/wnEIOSd99q.xml', websiteUrl: 'https://www.slothbytes.dev/archive' },
  { id: 'fireship', name: 'Fireship', language: 'EN', feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA', websiteUrl: 'https://www.youtube.com/@Fireship' },
  { id: 'coding-sloth', name: 'The Coding Sloth', language: 'EN', feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxVPH8W2ayMey1-b0SY8rBQ', websiteUrl: 'https://www.youtube.com/@TheCodingSloth' },
  { id: 'devto-ai', name: 'Dev.to - ai', language: 'EN', feedUrl: 'https://dev.to/feed/tag/ai', websiteUrl: 'https://dev.to/t/ai' },
  { id: 'medium-software-engineering', name: 'Medium - software-engineering', language: 'EN', feedUrl: 'https://medium.com/feed/tag/software-engineering', websiteUrl: 'https://medium.com/tag/software-engineering' },
  { id: 'simon-willison', name: 'Simon Willison', language: 'EN', feedUrl: 'https://simonwillison.net/atom/everything/', websiteUrl: 'https://simonwillison.net/' },
  { id: 'grafikart', name: 'Grafikart', language: 'FR', feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCj_iGliGCkLcHSZ8eqVNPDQ', websiteUrl: 'https://www.youtube.com/@grafikart' },
  { id: 'journal-du-hacker', name: 'Journal du Hacker', language: 'FR', feedUrl: 'https://www.journalduhacker.net/rss', websiteUrl: 'https://www.journalduhacker.net/' },
] as const;

export type MonitoringSource = typeof monitoringSources[number];
export type MonitoringSourceId = MonitoringSource['id'];
export type MonitoringLanguage = MonitoringSource['language'];
