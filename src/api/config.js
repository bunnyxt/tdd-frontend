// Both request paths must be configured for the selected build environment.
export const apiBaseURL = process.env.VUE_APP_API_BASE_URL;
export const legacyBaseURL = process.env.VUE_APP_LEGACY_API_BASE_URL;

if (!apiBaseURL || !legacyBaseURL) {
  throw new Error('Configure VUE_APP_API_BASE_URL and VUE_APP_LEGACY_API_BASE_URL');
}
