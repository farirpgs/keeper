import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://3169f6f4e1c7e125267cf97b22e1f062@o332302.ingest.us.sentry.io/4509136604364800",
  integrations: [],
});

window.Sentry = Sentry;
