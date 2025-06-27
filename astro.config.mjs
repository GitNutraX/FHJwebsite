import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify"; // Import the Netlify adapter

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: netlify(), // Add the adapter here
});