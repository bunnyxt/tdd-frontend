// Change the epoch when the published default changes to expire old overrides.
export const legacyDefault = 'v1';
const overrideKey = 'tdd.legacy-backend.validation-1';
const routes = ['member', 'sprint_daily', 'sprint_daily_record', 'sprint_video',
  'sprint_video_record', 'bapi_aid_bvid', 'bapi_view'];
let override = null;
try {
  const saved = localStorage.getItem(overrideKey);
  if (saved === 'v1' || saved === 'v2') override = saved;
} catch (e) { /* Storage may be unavailable; use the published default. */ }
export const legacyOverride = override;
export const legacyMode = override || legacyDefault;

export function setLegacyOverride(mode) {
  if (mode !== 'default' && mode !== 'v1' && mode !== 'v2') throw new Error('Invalid backend');
  if (mode === 'default') localStorage.removeItem(overrideKey);
  else localStorage.setItem(overrideKey, mode);
  window.location.reload();
}

export async function legacyRequest(path) {
  const [route] = path.split('?');
  if (!routes.includes(route)) throw new Error('Unknown compatibility route');
  const suffix = path.slice(route.length);
  const url = legacyMode === 'v2'
    ? 'https://api.bunnyxt.com/tdd/v2/legacy/' + route + suffix
    : 'https://api.bunnyxt.com/tdd/' + route + '.php' + suffix;
  // Preserve the original fetch credential policy; never retry against another backend.
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const json = await response.json();
  if (!route.startsWith('bapi_') && (json.status !== 200 || !Array.isArray(json.data))) {
    throw new Error('Invalid compatibility response');
  }
  return json;
}

export const legacyPage = {
  data: () => ({ legacyError: '' }),
  methods: {
    $legacy(path) {
      return legacyRequest(path).catch(error => {
        this.legacyError = '数据加载失败，请刷新页面重试。';
        throw error;
      });
    },
  },
};
