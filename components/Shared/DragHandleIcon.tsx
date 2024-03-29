import classNames from "classnames";
import { HTMLAttributes, SVGAttributes } from "react";

export default function DragHandle(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 16 48 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <title>drag-handle-solid</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="invisible_box" data-name="invisible box">
            <rect width="48" height="48" fill="none"></rect>
          </g>
          <g id="icons_Q2" data-name="icons Q2">
            <g>
              <path d="M46,20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2H2a2,2,0,0,1,2-2H44a2,2,0,0,1,2,2Z"></path>
              <path d="M46,28a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2H2a2,2,0,0,1,2-2H44a2,2,0,0,1,2,2Z"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
