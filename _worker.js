// _worker.js
// This is a minimal Cloudflare Pages Functions/Worker file.
// It is required by wrangler.toml when using `main = "./_worker.js"`.
// This basic 'fetch' handler ensures Wrangler sees a registered event handler,
// preventing the "No event handlers were registered" error and allowing the deployment to succeed.

export default {
  async fetch(request, env, ctx) {
    // For a static site, Cloudflare Pages serves your static assets automatically.
    // This worker's 'fetch' handler would typically only be invoked for routes
    // that are NOT static assets (e.g., /api/ routes if you added Pages Functions).
    // Returning fetch(request) ensures requests are passed through to the Pages
    // static asset server or other default Pages behaviors.
    return await fetch(request);
  },
};// _worker.js (Empty or minimal placeholder)
// This file is required by Cloudflare Pages when using a wrangler.toml
// with `main = "./_worker.js"`.
// It serves as the entry point for Pages Functions, even if none are defined.
