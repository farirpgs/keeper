export function getISRHeaders(props: {
  profile:
    | "default"
    | "seconds"
    | "minutes"
    | "hours"
    | "days"
    | "weeks"
    | "max";
}) {
  const oneSecond = 1;
  const oneMinute = 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneWeek = oneDay * 7;
  const oneMonth = oneDay * 30;
  const oneYear = oneDay * 365;

  const cacheProfiles = {
    // Default profile, suitable for content that doesn't need frequent updates
    default: { stale: 5 * oneMinute, revalidate: 15 * oneMinute },
    // For rapidly changing content requiring near real-time updates
    seconds: { stale: 0, revalidate: oneSecond },
    // For content that updates frequently within an hour
    minutes: { stale: 5 * oneMinute, revalidate: oneMinute },
    // For content that updates daily but can be slightly stale
    hours: { stale: 5 * oneMinute, revalidate: oneHour },
    // For content that updates weekly but can be a day old
    days: { stale: 5 * oneMinute, revalidate: oneDay },
    // For content that updates monthly but can be a week old
    weeks: { stale: 5 * oneMinute, revalidate: oneWeek },
    // For very stable content that rarely needs updating
    max: { stale: 5 * oneMinute, revalidate: 30 * oneDay },
  } satisfies Record<
    typeof props.profile,
    { stale: number; revalidate: number }
  >;

  return {
    // Tell the browser to always check the freshness of the cache
    "Cache-Control": "public, max-age=0, must-revalidate",
    // Tell Netlify's CDN to treat it as fresh for 5 minutes, then for up to a week return a stale version
    // while it revalidates. Use Durable Cache to minimize the need for serverless function calls.
    "Netlify-CDN-Cache-Control": `public, durable, s-maxage=${cacheProfiles[props.profile].stale}, stale-while-revalidate=${cacheProfiles[props.profile].revalidate}, max-age=${cacheProfiles[props.profile].stale}, stale-while-revalidate=${cacheProfiles[props.profile].revalidate}`,
  };
}
