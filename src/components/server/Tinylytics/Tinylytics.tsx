export function Tinylytics() {
  return (
    <div
      className="mb-6 flex w-full justify-center px-4 md:px-0"
    >
      <div
        aria-label="Page analytics and like"
        className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-3.5 py-2 shadow-lg"
      >
        <span
          className="views-chip inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-3 py-1.5 text-xs leading-none text-neutral-800 dark:text-neutral-200"
        >
          <span className="tinylytics_hits tabular-nums">–</span>
        </span>
        <button
          className="tinylytics_kudos tabular-nums cursor-pointer relative inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1.5 text-white text-xs leading-none font-medium shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
          type="button"
          aria-label="Like this page"
        >
          -
        </button>
      </div>
    </div>
  );
}