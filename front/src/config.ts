import {
  BACKEND_URL,
  PROD_BACKEND_URL,
  WS_URL,
  PROD_WS_URL
} from '@/const';

export function getBackendUrl() {
  return process.env.NODE_ENV === 'production' ? PROD_BACKEND_URL : BACKEND_URL;
}

export function getWsUrl() {
  return process.env.NODE_ENV === 'production' ? PROD_WS_URL : WS_URL;
}
