// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import db from '@astrojs/db';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';


// https://astro.build/config
export default defineConfig({
  integrations: [db(), react(), icon()],

  vite: {
    plugins: [tailwindcss()]
  },
  output: 'server',
  session: {
    cookie: {
      name: "my-session-cookie",
      sameSite: "lax",
      secure: true,
    },
    driver: "memory",
    ttl: 3600, // Set a default expiration period of 1 hour (3600 seconds)
  },
});