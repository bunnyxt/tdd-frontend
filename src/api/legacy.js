// Compatibility requests use the Spring backend.
const routes = ['member', 'sprint_daily', 'sprint_daily_record', 'sprint_video',
  'sprint_video_record', 'bapi_aid_bvid', 'bapi_view'];

export async function legacyRequest(path) {
  const [route] = path.split('?');
  if (!routes.includes(route)) throw new Error('Unknown compatibility route');
  const suffix = path.slice(route.length);
  const url = 'https://api.bunnyxt.com/tdd/v2/legacy/' + route + suffix;
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
