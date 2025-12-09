import dotenv from 'dotenv';
import { Keyv } from 'keyv';
import { KeyvTigris } from '@tigrisdata/keyv-tigris';

import { createOidcServer } from 'mcp-oidc-provider/express';
import { getIdentityProviderClientFromEnv } from './idp.js';

dotenv.config();

const OIDC_PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 4001;
const OIDC_BASE_URL = process.env['OIDC_BASE_URL'] ?? `http://localhost:${OIDC_PORT}`;
const SECRET = process.env['SESSION_SECRET'] ?? 'dev-secret-change-me';
const JWKS = process.env['JWKS'] ? JSON.parse(process.env['JWKS']) : undefined;

const store = new Keyv({ store: new KeyvTigris() });

const oidcServer = createOidcServer({
  idpClient: getIdentityProviderClientFromEnv(OIDC_BASE_URL),
  store,
  secret: SECRET,
  baseUrl: OIDC_BASE_URL,
  port: OIDC_PORT,
  isProduction: process.env['NODE_ENV'] === 'production',
  jwks: JWKS,
  onListen: (baseUrl) => {
    console.log(`OIDC Server running at ${baseUrl}`);
    console.log(`  Authorization: ${baseUrl}/authorize`);
    console.log(`  Token: ${baseUrl}/token`);
    console.log(`  Registration: ${baseUrl}/register`);
    console.log(`  JWKS: ${baseUrl}/jwks`);
  },
});

await oidcServer.start();
