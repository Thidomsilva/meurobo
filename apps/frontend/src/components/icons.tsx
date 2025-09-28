import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 2.12a2 2 0 0 1 3.46 0" />
      <path d="M12 4v10.5" />
      <path d="M7 19.5c.3-1 .5-2.5.5-3.5a5.5 5.5 0 1 1 11 0c0 1-.2 2.5-.5 3.5" />
      <path d="M8.99 15.01h.01" />
      <path d="M11.5 16.51h.01" />
      <path d="M11.5 12.51h.01" />
      <path d="M14 14h.01" />
    </svg>
  ),
};
