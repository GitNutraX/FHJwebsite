import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify"; // Import the Netlify adapter

export default defineConfig({
  integrations: [tailwind()],
  output: 'hybrid',
  adapter: netlify(), // Add the adapter here
});