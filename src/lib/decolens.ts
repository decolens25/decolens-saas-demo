import { DecoLensClient } from '@decolens/decolens-sdk';

export const decolensApi = new DecoLensClient(import.meta.env.VITE_DECOLENS_API_KEY);