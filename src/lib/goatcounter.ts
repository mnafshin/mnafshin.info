// GoatCounter site code. Override with PUBLIC_GOATCOUNTER_CODE at build time.
// The dashboard at https://<code>.goatcounter.com must have
// "Allow adding visitor counts on your website" enabled, or the on-page
// count stays hidden.
export const GOATCOUNTER_CODE =
  import.meta.env.PUBLIC_GOATCOUNTER_CODE || 'mnafshin';

export const GOATCOUNTER_SCRIPT = 'https://gc.zgo.at/count.js';

export function goatCounterEndpoint(code = GOATCOUNTER_CODE) {
  return `https://${code}.goatcounter.com/count`;
}
