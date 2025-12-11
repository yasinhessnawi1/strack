import { KnownService } from './types';

/**
 * Comprehensive database of known subscription services
 * Used for quick lookups and fallback data when scraping/AI fails
 */
export const KNOWN_SERVICES: Record<string, KnownService> = {
  // Streaming Services
  'netflix.com': {
    name: 'Netflix',
    domain: 'netflix.com',
    aliases: ['netflix', 'net flix'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
    pricingUrl: 'https://www.netflix.com/signup/planform',
    manageUrl: 'https://www.netflix.com/YourAccount',
    cancelUrl: 'https://www.netflix.com/cancelplan',
    typicalPrices: [
      { plan: 'Standard with ads', cost: 6.99, billingCycle: 'monthly' },
      { plan: 'Standard', cost: 15.49, billingCycle: 'monthly' },
      { plan: 'Premium', cost: 22.99, billingCycle: 'monthly' },
    ],
  },
  'spotify.com': {
    name: 'Spotify',
    domain: 'spotify.com',
    aliases: ['spotify', 'spotify premium', 'spotify music'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.scdn.co/i/_global/favicon.png',
    pricingUrl: 'https://www.spotify.com/premium',
    manageUrl: 'https://www.spotify.com/account',
    cancelUrl: 'https://support.spotify.com/article/cancel-premium/',
    typicalPrices: [
      { plan: 'Individual', cost: 11.99, billingCycle: 'monthly' },
      { plan: 'Duo', cost: 16.99, billingCycle: 'monthly' },
      { plan: 'Family', cost: 19.99, billingCycle: 'monthly' },
      { plan: 'Student', cost: 5.99, billingCycle: 'monthly' },
    ],
  },
  'disneyplus.com': {
    name: 'Disney+',
    domain: 'disneyplus.com',
    aliases: ['disney+', 'disney plus', 'disneyplus'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://static-assets.bamgrid.com/product/disneyplus/favicons/favicon-32x32.png',
    pricingUrl: 'https://www.disneyplus.com/welcome',
    manageUrl: 'https://www.disneyplus.com/account',
    cancelUrl: 'https://www.disneyplus.com/account/subscription',
    typicalPrices: [
      { plan: 'Basic (with ads)', cost: 7.99, billingCycle: 'monthly' },
      { plan: 'Premium', cost: 13.99, billingCycle: 'monthly' },
      { plan: 'Premium', cost: 139.99, billingCycle: 'yearly' },
    ],
  },
  'hbomax.com': {
    name: 'Max (HBO)',
    domain: 'max.com',
    aliases: ['hbo max', 'hbomax', 'max', 'hbo'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.max.com/favicon.ico',
    pricingUrl: 'https://www.max.com',
    manageUrl: 'https://www.max.com/account',
    typicalPrices: [
      { plan: 'With Ads', cost: 9.99, billingCycle: 'monthly' },
      { plan: 'Ad-Free', cost: 15.99, billingCycle: 'monthly' },
      { plan: 'Ultimate Ad-Free', cost: 19.99, billingCycle: 'monthly' },
    ],
  },
  'max.com': {
    name: 'Max (HBO)',
    domain: 'max.com',
    aliases: ['hbo max', 'hbomax', 'max', 'hbo'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.max.com/favicon.ico',
    pricingUrl: 'https://www.max.com',
    manageUrl: 'https://www.max.com/account',
    typicalPrices: [
      { plan: 'With Ads', cost: 9.99, billingCycle: 'monthly' },
      { plan: 'Ad-Free', cost: 15.99, billingCycle: 'monthly' },
      { plan: 'Ultimate Ad-Free', cost: 19.99, billingCycle: 'monthly' },
    ],
  },
  'hulu.com': {
    name: 'Hulu',
    domain: 'hulu.com',
    aliases: ['hulu'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.hulu.com/favicon.ico',
    pricingUrl: 'https://www.hulu.com/welcome',
    manageUrl: 'https://secure.hulu.com/account',
    cancelUrl: 'https://secure.hulu.com/account/cancel',
    typicalPrices: [
      { plan: 'Hulu (With Ads)', cost: 7.99, billingCycle: 'monthly' },
      { plan: 'Hulu (No Ads)', cost: 17.99, billingCycle: 'monthly' },
      { plan: 'Hulu + Live TV', cost: 76.99, billingCycle: 'monthly' },
    ],
  },
  'amazon.com': {
    name: 'Amazon Prime',
    domain: 'amazon.com',
    aliases: ['amazon prime', 'prime', 'amazon'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'yearly',
    category: 'streaming',
    logoUrl: 'https://www.amazon.com/favicon.ico',
    pricingUrl: 'https://www.amazon.com/prime',
    manageUrl: 'https://www.amazon.com/gp/primecentral',
    cancelUrl: 'https://www.amazon.com/gp/primecentral',
    typicalPrices: [
      { plan: 'Monthly', cost: 14.99, billingCycle: 'monthly' },
      { plan: 'Yearly', cost: 139, billingCycle: 'yearly' },
      { plan: 'Student Monthly', cost: 7.49, billingCycle: 'monthly' },
    ],
  },
  'primevideo.com': {
    name: 'Amazon Prime Video',
    domain: 'primevideo.com',
    aliases: ['prime video', 'amazon video'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.primevideo.com/favicon.ico',
    pricingUrl: 'https://www.primevideo.com',
    manageUrl: 'https://www.primevideo.com/settings',
    typicalPrices: [
      { plan: 'Monthly', cost: 8.99, billingCycle: 'monthly' },
    ],
  },
  'youtube.com': {
    name: 'YouTube Premium',
    domain: 'youtube.com',
    aliases: ['youtube', 'youtube premium', 'yt premium', 'youtube music'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.youtube.com/favicon.ico',
    pricingUrl: 'https://www.youtube.com/premium',
    manageUrl: 'https://www.youtube.com/paid_memberships',
    typicalPrices: [
      { plan: 'Individual', cost: 13.99, billingCycle: 'monthly' },
      { plan: 'Family', cost: 22.99, billingCycle: 'monthly' },
      { plan: 'Student', cost: 7.99, billingCycle: 'monthly' },
    ],
  },
  'apple.com': {
    name: 'Apple One',
    domain: 'apple.com',
    aliases: ['apple one', 'apple music', 'apple tv+', 'icloud'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.apple.com/favicon.ico',
    pricingUrl: 'https://www.apple.com/apple-one/',
    manageUrl: 'https://support.apple.com/apple-account',
    typicalPrices: [
      { plan: 'Individual', cost: 19.95, billingCycle: 'monthly' },
      { plan: 'Family', cost: 25.95, billingCycle: 'monthly' },
      { plan: 'Premier', cost: 37.95, billingCycle: 'monthly' },
    ],
  },
  'tv.apple.com': {
    name: 'Apple TV+',
    domain: 'tv.apple.com',
    aliases: ['apple tv', 'apple tv plus'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://tv.apple.com/favicon.ico',
    pricingUrl: 'https://tv.apple.com',
    typicalPrices: [
      { plan: 'Monthly', cost: 9.99, billingCycle: 'monthly' },
      { plan: 'Yearly', cost: 99, billingCycle: 'yearly' },
    ],
  },
  'music.apple.com': {
    name: 'Apple Music',
    domain: 'music.apple.com',
    aliases: ['apple music'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://music.apple.com/favicon.ico',
    typicalPrices: [
      { plan: 'Individual', cost: 10.99, billingCycle: 'monthly' },
      { plan: 'Family', cost: 16.99, billingCycle: 'monthly' },
      { plan: 'Student', cost: 5.99, billingCycle: 'monthly' },
    ],
  },
  'crunchyroll.com': {
    name: 'Crunchyroll',
    domain: 'crunchyroll.com',
    aliases: ['crunchyroll', 'crunchy roll'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.crunchyroll.com/favicon.ico',
    pricingUrl: 'https://www.crunchyroll.com/premium',
    manageUrl: 'https://www.crunchyroll.com/account',
    typicalPrices: [
      { plan: 'Fan', cost: 7.99, billingCycle: 'monthly' },
      { plan: 'Mega Fan', cost: 9.99, billingCycle: 'monthly' },
      { plan: 'Ultimate Fan', cost: 14.99, billingCycle: 'monthly' },
    ],
  },
  'paramountplus.com': {
    name: 'Paramount+',
    domain: 'paramountplus.com',
    aliases: ['paramount+', 'paramount plus', 'cbs all access'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.paramountplus.com/favicon.ico',
    typicalPrices: [
      { plan: 'Essential', cost: 5.99, billingCycle: 'monthly' },
      { plan: 'With Showtime', cost: 11.99, billingCycle: 'monthly' },
    ],
  },
  'peacocktv.com': {
    name: 'Peacock',
    domain: 'peacocktv.com',
    aliases: ['peacock', 'peacock tv'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'streaming',
    logoUrl: 'https://www.peacocktv.com/favicon.ico',
    typicalPrices: [
      { plan: 'Premium', cost: 5.99, billingCycle: 'monthly' },
      { plan: 'Premium Plus', cost: 11.99, billingCycle: 'monthly' },
    ],
  },

  // Software & Development
  'github.com': {
    name: 'GitHub',
    domain: 'github.com',
    aliases: ['github', 'github pro', 'github team'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://github.githubassets.com/favicons/favicon.svg',
    pricingUrl: 'https://github.com/pricing',
    manageUrl: 'https://github.com/settings/billing',
    typicalPrices: [
      { plan: 'Pro', cost: 4, billingCycle: 'monthly' },
      { plan: 'Team', cost: 4, billingCycle: 'monthly' },
      { plan: 'Enterprise', cost: 21, billingCycle: 'monthly' },
    ],
  },
  'gitlab.com': {
    name: 'GitLab',
    domain: 'gitlab.com',
    aliases: ['gitlab'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://gitlab.com/favicon.ico',
    pricingUrl: 'https://about.gitlab.com/pricing/',
    manageUrl: 'https://gitlab.com/-/profile/billing',
    typicalPrices: [
      { plan: 'Premium', cost: 29, billingCycle: 'monthly' },
      { plan: 'Ultimate', cost: 99, billingCycle: 'monthly' },
    ],
  },
  'jetbrains.com': {
    name: 'JetBrains',
    domain: 'jetbrains.com',
    aliases: ['jetbrains', 'intellij', 'webstorm', 'pycharm', 'phpstorm', 'rider'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'yearly',
    category: 'software',
    logoUrl: 'https://www.jetbrains.com/favicon.ico',
    pricingUrl: 'https://www.jetbrains.com/store/',
    manageUrl: 'https://account.jetbrains.com/licenses',
    typicalPrices: [
      { plan: 'All Products Pack', cost: 249, billingCycle: 'yearly' },
      { plan: 'Individual IDE', cost: 149, billingCycle: 'yearly' },
    ],
  },
  'adobe.com': {
    name: 'Adobe Creative Cloud',
    domain: 'adobe.com',
    aliases: ['adobe', 'creative cloud', 'photoshop', 'illustrator', 'premiere'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://www.adobe.com/favicon.ico',
    pricingUrl: 'https://www.adobe.com/creativecloud/plans.html',
    manageUrl: 'https://account.adobe.com/plans',
    cancelUrl: 'https://account.adobe.com/plans',
    typicalPrices: [
      { plan: 'Photography', cost: 9.99, billingCycle: 'monthly' },
      { plan: 'Single App', cost: 22.99, billingCycle: 'monthly' },
      { plan: 'All Apps', cost: 59.99, billingCycle: 'monthly' },
    ],
  },
  'figma.com': {
    name: 'Figma',
    domain: 'figma.com',
    aliases: ['figma'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://static.figma.com/app/icon/1/favicon.png',
    pricingUrl: 'https://www.figma.com/pricing/',
    manageUrl: 'https://www.figma.com/settings',
    typicalPrices: [
      { plan: 'Professional', cost: 15, billingCycle: 'monthly' },
      { plan: 'Organization', cost: 45, billingCycle: 'monthly' },
    ],
  },
  'canva.com': {
    name: 'Canva',
    domain: 'canva.com',
    aliases: ['canva', 'canva pro'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://www.canva.com/favicon.ico',
    pricingUrl: 'https://www.canva.com/pricing/',
    manageUrl: 'https://www.canva.com/settings/billing',
    typicalPrices: [
      { plan: 'Pro', cost: 12.99, billingCycle: 'monthly' },
      { plan: 'Teams', cost: 14.99, billingCycle: 'monthly' },
    ],
  },

  // Productivity
  'notion.so': {
    name: 'Notion',
    domain: 'notion.so',
    aliases: ['notion'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://www.notion.so/images/favicon.ico',
    pricingUrl: 'https://www.notion.so/pricing',
    manageUrl: 'https://www.notion.so/my-account',
    typicalPrices: [
      { plan: 'Plus', cost: 10, billingCycle: 'monthly' },
      { plan: 'Business', cost: 18, billingCycle: 'monthly' },
    ],
  },
  'slack.com': {
    name: 'Slack',
    domain: 'slack.com',
    aliases: ['slack'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack.png',
    pricingUrl: 'https://slack.com/pricing',
    manageUrl: 'https://slack.com/account/settings',
    typicalPrices: [
      { plan: 'Pro', cost: 8.75, billingCycle: 'monthly' },
      { plan: 'Business+', cost: 15, billingCycle: 'monthly' },
    ],
  },
  'zoom.us': {
    name: 'Zoom',
    domain: 'zoom.us',
    aliases: ['zoom'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://st1.zoom.us/zoom.ico',
    pricingUrl: 'https://zoom.us/pricing',
    manageUrl: 'https://zoom.us/account',
    typicalPrices: [
      { plan: 'Pro', cost: 15.99, billingCycle: 'monthly' },
      { plan: 'Business', cost: 21.99, billingCycle: 'monthly' },
    ],
  },
  'microsoft.com': {
    name: 'Microsoft 365',
    domain: 'microsoft.com',
    aliases: ['microsoft 365', 'office 365', 'microsoft office', 'ms 365'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'yearly',
    category: 'productivity',
    logoUrl: 'https://www.microsoft.com/favicon.ico',
    pricingUrl: 'https://www.microsoft.com/microsoft-365/buy/compare-all-microsoft-365-products',
    manageUrl: 'https://account.microsoft.com/services',
    typicalPrices: [
      { plan: 'Personal', cost: 69.99, billingCycle: 'yearly' },
      { plan: 'Family', cost: 99.99, billingCycle: 'yearly' },
      { plan: 'Business Basic', cost: 6, billingCycle: 'monthly' },
    ],
  },
  'trello.com': {
    name: 'Trello',
    domain: 'trello.com',
    aliases: ['trello'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://trello.com/favicon.ico',
    pricingUrl: 'https://trello.com/pricing',
    manageUrl: 'https://trello.com/your/account',
    typicalPrices: [
      { plan: 'Standard', cost: 5, billingCycle: 'monthly' },
      { plan: 'Premium', cost: 10, billingCycle: 'monthly' },
      { plan: 'Enterprise', cost: 17.5, billingCycle: 'monthly' },
    ],
  },
  'asana.com': {
    name: 'Asana',
    domain: 'asana.com',
    aliases: ['asana'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://asana.com/favicon.ico',
    pricingUrl: 'https://asana.com/pricing',
    manageUrl: 'https://app.asana.com/0/account_settings',
    typicalPrices: [
      { plan: 'Starter', cost: 10.99, billingCycle: 'monthly' },
      { plan: 'Advanced', cost: 24.99, billingCycle: 'monthly' },
    ],
  },
  'monday.com': {
    name: 'Monday.com',
    domain: 'monday.com',
    aliases: ['monday', 'monday.com'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://monday.com/favicon.ico',
    pricingUrl: 'https://monday.com/pricing',
    typicalPrices: [
      { plan: 'Basic', cost: 9, billingCycle: 'monthly' },
      { plan: 'Standard', cost: 12, billingCycle: 'monthly' },
      { plan: 'Pro', cost: 19, billingCycle: 'monthly' },
    ],
  },
  'clickup.com': {
    name: 'ClickUp',
    domain: 'clickup.com',
    aliases: ['clickup', 'click up'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://clickup.com/favicon.ico',
    pricingUrl: 'https://clickup.com/pricing',
    typicalPrices: [
      { plan: 'Unlimited', cost: 7, billingCycle: 'monthly' },
      { plan: 'Business', cost: 12, billingCycle: 'monthly' },
    ],
  },
  'evernote.com': {
    name: 'Evernote',
    domain: 'evernote.com',
    aliases: ['evernote'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://evernote.com/favicon.ico',
    pricingUrl: 'https://evernote.com/compare-plans',
    manageUrl: 'https://www.evernote.com/Settings.action',
    typicalPrices: [
      { plan: 'Personal', cost: 14.99, billingCycle: 'monthly' },
      { plan: 'Professional', cost: 17.99, billingCycle: 'monthly' },
    ],
  },
  'todoist.com': {
    name: 'Todoist',
    domain: 'todoist.com',
    aliases: ['todoist'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'productivity',
    logoUrl: 'https://todoist.com/favicon.ico',
    pricingUrl: 'https://todoist.com/pricing',
    typicalPrices: [
      { plan: 'Pro', cost: 4, billingCycle: 'monthly' },
      { plan: 'Business', cost: 6, billingCycle: 'monthly' },
    ],
  },

  // Cloud Storage
  'dropbox.com': {
    name: 'Dropbox',
    domain: 'dropbox.com',
    aliases: ['dropbox'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'cloud',
    logoUrl: 'https://www.dropbox.com/static/images/favicon.ico',
    pricingUrl: 'https://www.dropbox.com/plans',
    manageUrl: 'https://www.dropbox.com/account/plan',
    typicalPrices: [
      { plan: 'Plus', cost: 11.99, billingCycle: 'monthly' },
      { plan: 'Essentials', cost: 22, billingCycle: 'monthly' },
      { plan: 'Business', cost: 20, billingCycle: 'monthly' },
    ],
  },
  'drive.google.com': {
    name: 'Google One',
    domain: 'one.google.com',
    aliases: ['google drive', 'google one', 'google storage'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'cloud',
    logoUrl: 'https://www.google.com/drive/static/images/drive/favicon.ico',
    pricingUrl: 'https://one.google.com/about/plans',
    manageUrl: 'https://one.google.com/storage',
    typicalPrices: [
      { plan: '100 GB', cost: 1.99, billingCycle: 'monthly' },
      { plan: '200 GB', cost: 2.99, billingCycle: 'monthly' },
      { plan: '2 TB', cost: 9.99, billingCycle: 'monthly' },
    ],
  },
  'one.google.com': {
    name: 'Google One',
    domain: 'one.google.com',
    aliases: ['google drive', 'google one', 'google storage'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'cloud',
    logoUrl: 'https://www.google.com/drive/static/images/drive/favicon.ico',
    pricingUrl: 'https://one.google.com/about/plans',
    manageUrl: 'https://one.google.com/storage',
    typicalPrices: [
      { plan: '100 GB', cost: 1.99, billingCycle: 'monthly' },
      { plan: '200 GB', cost: 2.99, billingCycle: 'monthly' },
      { plan: '2 TB', cost: 9.99, billingCycle: 'monthly' },
    ],
  },
  'icloud.com': {
    name: 'iCloud+',
    domain: 'icloud.com',
    aliases: ['icloud', 'icloud+', 'apple icloud'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'cloud',
    logoUrl: 'https://www.icloud.com/favicon.ico',
    manageUrl: 'https://www.icloud.com/settings/',
    typicalPrices: [
      { plan: '50 GB', cost: 0.99, billingCycle: 'monthly' },
      { plan: '200 GB', cost: 2.99, billingCycle: 'monthly' },
      { plan: '2 TB', cost: 9.99, billingCycle: 'monthly' },
    ],
  },

  // AI & Developer Tools
  'openai.com': {
    name: 'ChatGPT Plus',
    domain: 'openai.com',
    aliases: ['chatgpt', 'chatgpt plus', 'openai', 'gpt'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://openai.com/favicon.ico',
    pricingUrl: 'https://openai.com/chatgpt/pricing',
    manageUrl: 'https://chat.openai.com/settings/subscription',
    typicalPrices: [
      { plan: 'Plus', cost: 20, billingCycle: 'monthly' },
      { plan: 'Pro', cost: 200, billingCycle: 'monthly' },
    ],
  },
  'chat.openai.com': {
    name: 'ChatGPT Plus',
    domain: 'chat.openai.com',
    aliases: ['chatgpt', 'chatgpt plus'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://chat.openai.com/favicon.ico',
    pricingUrl: 'https://openai.com/chatgpt/pricing',
    manageUrl: 'https://chat.openai.com/settings/subscription',
    typicalPrices: [
      { plan: 'Plus', cost: 20, billingCycle: 'monthly' },
      { plan: 'Pro', cost: 200, billingCycle: 'monthly' },
    ],
  },
  'claude.ai': {
    name: 'Claude Pro',
    domain: 'claude.ai',
    aliases: ['claude', 'claude pro', 'anthropic'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://claude.ai/favicon.ico',
    pricingUrl: 'https://claude.ai/pricing',
    manageUrl: 'https://claude.ai/settings',
    typicalPrices: [
      { plan: 'Pro', cost: 20, billingCycle: 'monthly' },
    ],
  },
  'midjourney.com': {
    name: 'Midjourney',
    domain: 'midjourney.com',
    aliases: ['midjourney', 'mj'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://www.midjourney.com/favicon.ico',
    pricingUrl: 'https://www.midjourney.com/pricing',
    typicalPrices: [
      { plan: 'Basic', cost: 10, billingCycle: 'monthly' },
      { plan: 'Standard', cost: 30, billingCycle: 'monthly' },
      { plan: 'Pro', cost: 60, billingCycle: 'monthly' },
    ],
  },
  'copilot.github.com': {
    name: 'GitHub Copilot',
    domain: 'github.com',
    aliases: ['github copilot', 'copilot'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://github.githubassets.com/favicons/favicon.svg',
    pricingUrl: 'https://github.com/features/copilot',
    manageUrl: 'https://github.com/settings/copilot',
    typicalPrices: [
      { plan: 'Individual', cost: 10, billingCycle: 'monthly' },
      { plan: 'Business', cost: 19, billingCycle: 'monthly' },
    ],
  },
  'cursor.com': {
    name: 'Cursor',
    domain: 'cursor.com',
    aliases: ['cursor', 'cursor ai'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://www.cursor.com/favicon.ico',
    pricingUrl: 'https://www.cursor.com/pricing',
    typicalPrices: [
      { plan: 'Pro', cost: 20, billingCycle: 'monthly' },
      { plan: 'Business', cost: 40, billingCycle: 'monthly' },
    ],
  },
  'vercel.com': {
    name: 'Vercel',
    domain: 'vercel.com',
    aliases: ['vercel'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'cloud',
    logoUrl: 'https://vercel.com/favicon.ico',
    pricingUrl: 'https://vercel.com/pricing',
    manageUrl: 'https://vercel.com/account',
    typicalPrices: [
      { plan: 'Pro', cost: 20, billingCycle: 'monthly' },
      { plan: 'Enterprise', cost: 0, billingCycle: 'monthly' },
    ],
  },
  'netlify.com': {
    name: 'Netlify',
    domain: 'netlify.com',
    aliases: ['netlify'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'cloud',
    logoUrl: 'https://www.netlify.com/favicon.ico',
    pricingUrl: 'https://www.netlify.com/pricing',
    manageUrl: 'https://app.netlify.com/account',
    typicalPrices: [
      { plan: 'Pro', cost: 19, billingCycle: 'monthly' },
      { plan: 'Business', cost: 99, billingCycle: 'monthly' },
    ],
  },

  // VPN & Security
  'nordvpn.com': {
    name: 'NordVPN',
    domain: 'nordvpn.com',
    aliases: ['nordvpn', 'nord vpn'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'yearly',
    category: 'software',
    logoUrl: 'https://nordvpn.com/favicon.ico',
    pricingUrl: 'https://nordvpn.com/pricing/',
    manageUrl: 'https://my.nordaccount.com/',
    typicalPrices: [
      { plan: 'Basic', cost: 3.29, billingCycle: 'monthly' },
      { plan: 'Plus', cost: 3.99, billingCycle: 'monthly' },
      { plan: 'Complete', cost: 5.29, billingCycle: 'monthly' },
    ],
  },
  'expressvpn.com': {
    name: 'ExpressVPN',
    domain: 'expressvpn.com',
    aliases: ['expressvpn', 'express vpn'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'yearly',
    category: 'software',
    logoUrl: 'https://www.expressvpn.com/favicon.ico',
    pricingUrl: 'https://www.expressvpn.com/order',
    manageUrl: 'https://www.expressvpn.com/account',
    typicalPrices: [
      { plan: 'Monthly', cost: 12.95, billingCycle: 'monthly' },
      { plan: '6 Months', cost: 9.99, billingCycle: 'monthly' },
      { plan: '12 Months', cost: 8.32, billingCycle: 'monthly' },
    ],
  },
  '1password.com': {
    name: '1Password',
    domain: '1password.com',
    aliases: ['1password', 'one password'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://1password.com/favicon.ico',
    pricingUrl: 'https://1password.com/pricing/',
    manageUrl: 'https://my.1password.com/profile',
    typicalPrices: [
      { plan: 'Individual', cost: 2.99, billingCycle: 'monthly' },
      { plan: 'Families', cost: 4.99, billingCycle: 'monthly' },
      { plan: 'Teams', cost: 7.99, billingCycle: 'monthly' },
    ],
  },
  'lastpass.com': {
    name: 'LastPass',
    domain: 'lastpass.com',
    aliases: ['lastpass', 'last pass'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'software',
    logoUrl: 'https://lastpass.com/favicon.ico',
    pricingUrl: 'https://www.lastpass.com/pricing',
    manageUrl: 'https://lastpass.com/my.php',
    typicalPrices: [
      { plan: 'Premium', cost: 3, billingCycle: 'monthly' },
      { plan: 'Families', cost: 4, billingCycle: 'monthly' },
    ],
  },
  'bitwarden.com': {
    name: 'Bitwarden',
    domain: 'bitwarden.com',
    aliases: ['bitwarden', 'bit warden'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'yearly',
    category: 'software',
    logoUrl: 'https://bitwarden.com/favicon.ico',
    pricingUrl: 'https://bitwarden.com/pricing/',
    manageUrl: 'https://vault.bitwarden.com/#/settings/subscription',
    typicalPrices: [
      { plan: 'Premium', cost: 10, billingCycle: 'yearly' },
      { plan: 'Families', cost: 40, billingCycle: 'yearly' },
    ],
  },

  // Fitness & Health
  'strava.com': {
    name: 'Strava',
    domain: 'strava.com',
    aliases: ['strava'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'health',
    logoUrl: 'https://www.strava.com/favicon.ico',
    pricingUrl: 'https://www.strava.com/subscribe',
    manageUrl: 'https://www.strava.com/account',
    typicalPrices: [
      { plan: 'Monthly', cost: 11.99, billingCycle: 'monthly' },
      { plan: 'Yearly', cost: 79.99, billingCycle: 'yearly' },
    ],
  },
  'peloton.com': {
    name: 'Peloton',
    domain: 'peloton.com',
    aliases: ['peloton'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'health',
    logoUrl: 'https://www.onepeloton.com/favicon.ico',
    typicalPrices: [
      { plan: 'App', cost: 12.99, billingCycle: 'monthly' },
      { plan: 'All-Access', cost: 44, billingCycle: 'monthly' },
    ],
  },
  'calm.com': {
    name: 'Calm',
    domain: 'calm.com',
    aliases: ['calm'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'yearly',
    category: 'health',
    logoUrl: 'https://www.calm.com/favicon.ico',
    pricingUrl: 'https://www.calm.com/subscribe',
    manageUrl: 'https://www.calm.com/account',
    typicalPrices: [
      { plan: 'Yearly', cost: 69.99, billingCycle: 'yearly' },
      { plan: 'Lifetime', cost: 399.99, billingCycle: 'yearly' },
    ],
  },
  'headspace.com': {
    name: 'Headspace',
    domain: 'headspace.com',
    aliases: ['headspace'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'health',
    logoUrl: 'https://www.headspace.com/favicon.ico',
    pricingUrl: 'https://www.headspace.com/subscriptions',
    manageUrl: 'https://www.headspace.com/settings',
    typicalPrices: [
      { plan: 'Monthly', cost: 12.99, billingCycle: 'monthly' },
      { plan: 'Yearly', cost: 69.99, billingCycle: 'yearly' },
    ],
  },

  // News & Media
  'nytimes.com': {
    name: 'The New York Times',
    domain: 'nytimes.com',
    aliases: ['nyt', 'new york times', 'nytimes'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'news',
    logoUrl: 'https://www.nytimes.com/favicon.ico',
    pricingUrl: 'https://www.nytimes.com/subscription',
    manageUrl: 'https://myaccount.nytimes.com/',
    typicalPrices: [
      { plan: 'Basic Digital', cost: 4, billingCycle: 'weekly' },
      { plan: 'All Access', cost: 25, billingCycle: 'monthly' },
    ],
  },
  'medium.com': {
    name: 'Medium',
    domain: 'medium.com',
    aliases: ['medium'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'news',
    logoUrl: 'https://medium.com/favicon.ico',
    pricingUrl: 'https://medium.com/membership',
    manageUrl: 'https://medium.com/me/settings',
    typicalPrices: [
      { plan: 'Monthly', cost: 5, billingCycle: 'monthly' },
      { plan: 'Yearly', cost: 50, billingCycle: 'yearly' },
    ],
  },
  'substack.com': {
    name: 'Substack',
    domain: 'substack.com',
    aliases: ['substack'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'news',
    logoUrl: 'https://substack.com/favicon.ico',
    typicalPrices: [
      { plan: 'Variable', cost: 5, billingCycle: 'monthly' },
    ],
  },

  // Gaming
  'xbox.com': {
    name: 'Xbox Game Pass',
    domain: 'xbox.com',
    aliases: ['xbox', 'xbox game pass', 'game pass'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'entertainment',
    logoUrl: 'https://www.xbox.com/favicon.ico',
    pricingUrl: 'https://www.xbox.com/xbox-game-pass',
    manageUrl: 'https://account.microsoft.com/services',
    typicalPrices: [
      { plan: 'Core', cost: 9.99, billingCycle: 'monthly' },
      { plan: 'Standard', cost: 14.99, billingCycle: 'monthly' },
      { plan: 'Ultimate', cost: 19.99, billingCycle: 'monthly' },
    ],
  },
  'playstation.com': {
    name: 'PlayStation Plus',
    domain: 'playstation.com',
    aliases: ['playstation', 'ps plus', 'playstation plus', 'psn'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'entertainment',
    logoUrl: 'https://www.playstation.com/favicon.ico',
    pricingUrl: 'https://www.playstation.com/ps-plus/',
    manageUrl: 'https://www.playstation.com/acct/management',
    typicalPrices: [
      { plan: 'Essential', cost: 9.99, billingCycle: 'monthly' },
      { plan: 'Extra', cost: 14.99, billingCycle: 'monthly' },
      { plan: 'Premium', cost: 17.99, billingCycle: 'monthly' },
    ],
  },
  'store.steampowered.com': {
    name: 'Steam',
    domain: 'steampowered.com',
    aliases: ['steam'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'entertainment',
    logoUrl: 'https://store.steampowered.com/favicon.ico',
    manageUrl: 'https://store.steampowered.com/account/',
  },

  // Education
  'skillshare.com': {
    name: 'Skillshare',
    domain: 'skillshare.com',
    aliases: ['skillshare'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'yearly',
    category: 'education',
    logoUrl: 'https://www.skillshare.com/favicon.ico',
    pricingUrl: 'https://www.skillshare.com/membership',
    typicalPrices: [
      { plan: 'Annual', cost: 168, billingCycle: 'yearly' },
    ],
  },
  'coursera.org': {
    name: 'Coursera',
    domain: 'coursera.org',
    aliases: ['coursera'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'education',
    logoUrl: 'https://www.coursera.org/favicon.ico',
    pricingUrl: 'https://www.coursera.org/plus',
    typicalPrices: [
      { plan: 'Plus Monthly', cost: 59, billingCycle: 'monthly' },
      { plan: 'Plus Annual', cost: 399, billingCycle: 'yearly' },
    ],
  },
  'udemy.com': {
    name: 'Udemy',
    domain: 'udemy.com',
    aliases: ['udemy'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'education',
    logoUrl: 'https://www.udemy.com/favicon.ico',
    pricingUrl: 'https://www.udemy.com/pricing/',
    typicalPrices: [
      { plan: 'Personal Plan', cost: 16.58, billingCycle: 'monthly' },
    ],
  },
  'linkedin.com': {
    name: 'LinkedIn Premium',
    domain: 'linkedin.com',
    aliases: ['linkedin', 'linkedin premium', 'linkedin learning'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'education',
    logoUrl: 'https://www.linkedin.com/favicon.ico',
    pricingUrl: 'https://www.linkedin.com/premium/products',
    manageUrl: 'https://www.linkedin.com/mypreferences/d/manage-subscription',
    typicalPrices: [
      { plan: 'Career', cost: 29.99, billingCycle: 'monthly' },
      { plan: 'Business', cost: 59.99, billingCycle: 'monthly' },
    ],
  },
  'duolingo.com': {
    name: 'Duolingo',
    domain: 'duolingo.com',
    aliases: ['duolingo', 'duolingo plus', 'duolingo super'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'education',
    logoUrl: 'https://www.duolingo.com/favicon.ico',
    pricingUrl: 'https://www.duolingo.com/super',
    typicalPrices: [
      { plan: 'Super', cost: 12.99, billingCycle: 'monthly' },
      { plan: 'Family', cost: 9.99, billingCycle: 'monthly' },
    ],
  },
  'grammarly.com': {
    name: 'Grammarly',
    domain: 'grammarly.com',
    aliases: ['grammarly'],
    defaultCurrency: 'USD',
    defaultBillingCycle: 'monthly',
    category: 'education',
    logoUrl: 'https://www.grammarly.com/favicon.ico',
    pricingUrl: 'https://www.grammarly.com/plans',
    manageUrl: 'https://account.grammarly.com/subscription',
    typicalPrices: [
      { plan: 'Premium', cost: 12, billingCycle: 'monthly' },
      { plan: 'Business', cost: 15, billingCycle: 'monthly' },
    ],
  },
};

/**
 * Get all service aliases for fuzzy matching
 */
export function getAllServiceAliases(): Map<string, string> {
  const aliasMap = new Map<string, string>();

  for (const [domain, service] of Object.entries(KNOWN_SERVICES)) {
    // Add the domain itself
    aliasMap.set(domain.toLowerCase(), domain);
    aliasMap.set(service.name.toLowerCase(), domain);

    // Add all aliases
    for (const alias of service.aliases) {
      aliasMap.set(alias.toLowerCase(), domain);
    }
  }

  return aliasMap;
}

/**
 * Find a known service by domain or alias
 */
export function findKnownService(input: string): KnownService | null {
  const normalizedInput = input.toLowerCase().trim();

  // Direct domain match
  if (KNOWN_SERVICES[normalizedInput]) {
    return KNOWN_SERVICES[normalizedInput];
  }

  // Check all services
  for (const service of Object.values(KNOWN_SERVICES)) {
    // Match by domain
    if (service.domain.toLowerCase() === normalizedInput) {
      return service;
    }

    // Match by name
    if (service.name.toLowerCase() === normalizedInput) {
      return service;
    }

    // Match by aliases
    for (const alias of service.aliases) {
      if (alias.toLowerCase() === normalizedInput) {
        return service;
      }

      // Partial match for aliases
      if (
        normalizedInput.includes(alias.toLowerCase()) ||
        alias.toLowerCase().includes(normalizedInput)
      ) {
        return service;
      }
    }
  }

  return null;
}

/**
 * Find a known service by URL
 */
export function findKnownServiceByUrl(url: string): KnownService | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');

    // Direct domain match
    if (KNOWN_SERVICES[hostname]) {
      return KNOWN_SERVICES[hostname];
    }

    // Check if any known domain is contained in the hostname
    for (const [domain, service] of Object.entries(KNOWN_SERVICES)) {
      if (hostname.includes(domain) || domain.includes(hostname)) {
        return service;
      }
    }

    return null;
  } catch {
    return null;
  }
}
