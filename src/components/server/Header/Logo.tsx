import logoSrc from "./logo.png";
export const LogoSrc = logoSrc;

export function NameLogo(props: {
  className?: string;
  style?: React.CSSProperties;

  color?: string;
}) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 4000 848"
        version="1.1"
        {...props}
        style={{
          fill: "red",
          stroke: "transparent",
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinejoin: "round",
          strokeMiterlimit: 2,
          ...props.style,
        }}
      >
        <g transform="matrix(1,0,0,1,-38327,-8406)">
          <g
            id="storied-name-black"
            transform="matrix(1,0,0,0.21195,38327,8406)"
          >
            <clipPath id="_clip1">
              <rect x="0" y="0" width="4000" height="4000" />
            </clipPath>
            <g clipPath="url(#_clip1)">
              <g transform="matrix(42.5167,0,0,200.6,-332646,-639191)">
                <g>
                  <path
                    d="M7823.89,3186.4L7830.35,3186.4L7830.35,3191.01L7834.12,3186.4L7841.92,3186.4L7834.9,3195.52L7842.28,3206.34L7834.6,3206.34L7830.35,3200.18L7830.35,3206.34L7823.89,3206.34L7823.89,3186.4Z"
                    style={{
                      fill: props.color || "currentColor",
                      fillRule: "nonzero",
                    }}
                  />
                  <path
                    d="M7842.88,3186.4L7854.63,3186.4L7854.63,3191.63L7849.24,3191.63L7849.24,3193.85L7854.54,3193.85L7854.54,3198.81L7849.24,3198.81L7849.24,3201.11L7854.84,3201.11L7854.84,3206.34L7842.88,3206.34L7842.88,3186.4Z"
                    style={{
                      fill: props.color || "currentColor",
                      fillRule: "nonzero",
                    }}
                  />
                  <path
                    d="M7856.63,3186.4L7868.38,3186.4L7868.38,3191.63L7863,3191.63L7863,3193.85L7868.29,3193.85L7868.29,3198.81L7863,3198.81L7863,3201.11L7868.59,3201.11L7868.59,3206.34L7856.63,3206.34L7856.63,3186.4Z"
                    style={{
                      fill: props.color || "currentColor",
                      fillRule: "nonzero",
                    }}
                  />
                  <path
                    d="M7885.9,3194C7885.9,3195.37 7885.66,3196.54 7885.18,3197.51C7884.7,3198.47 7884.05,3199.26 7883.22,3199.86C7882.39,3200.45 7881.43,3200.89 7880.32,3201.17C7879.22,3201.45 7878.02,3201.59 7876.75,3201.59L7876.75,3206.34L7870.38,3206.34L7870.38,3186.4L7876.75,3186.4C7878.02,3186.4 7879.22,3186.54 7880.32,3186.82C7881.43,3187.1 7882.39,3187.54 7883.22,3188.14C7884.05,3188.73 7884.7,3189.52 7885.18,3190.48C7885.66,3191.45 7885.9,3192.62 7885.9,3194ZM7876.75,3196.21L7877.02,3196.21C7877.85,3196.21 7878.46,3196.01 7878.83,3195.62C7879.2,3195.24 7879.38,3194.69 7879.38,3194C7879.38,3193.3 7879.2,3192.76 7878.83,3192.37C7878.46,3191.98 7877.85,3191.78 7877.02,3191.78L7876.75,3191.78L7876.75,3196.21Z"
                    style={{
                      fill: props.color || "currentColor",
                      fillRule: "nonzero",
                    }}
                  />
                  <path
                    d="M7887.39,3186.4L7899.14,3186.4L7899.14,3191.63L7893.76,3191.63L7893.76,3193.85L7899.05,3193.85L7899.05,3198.81L7893.76,3198.81L7893.76,3201.11L7899.35,3201.11L7899.35,3206.34L7887.39,3206.34L7887.39,3186.4Z"
                    style={{
                      fill: props.color || "currentColor",
                      fillRule: "nonzero",
                    }}
                  />
                  <path
                    d="M7901.14,3186.4L7908.02,3186.4C7909.29,3186.4 7910.48,3186.57 7911.56,3186.91C7912.65,3187.25 7913.59,3187.75 7914.39,3188.41C7915.18,3189.06 7915.81,3189.88 7916.26,3190.84C7916.7,3191.81 7916.93,3192.92 7916.93,3194.18C7916.93,3195.17 7916.79,3196.02 7916.51,3196.72C7916.23,3197.41 7915.92,3197.99 7915.58,3198.45C7915.18,3198.97 7914.74,3199.41 7914.24,3199.77L7917.97,3206.34L7910.5,3206.34L7907.51,3201.29L7907.51,3206.34L7901.14,3206.34L7901.14,3186.4ZM7907.51,3196.21L7907.84,3196.21C7908.6,3196.21 7909.24,3196.04 7909.77,3195.7C7910.3,3195.36 7910.56,3194.79 7910.56,3194C7910.56,3193.2 7910.3,3192.63 7909.77,3192.29C7909.24,3191.95 7908.6,3191.78 7907.84,3191.78L7907.51,3191.78L7907.51,3196.21Z"
                    style={{
                      fill: props.color || "currentColor",
                      fillRule: "nonzero",
                    }}
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}