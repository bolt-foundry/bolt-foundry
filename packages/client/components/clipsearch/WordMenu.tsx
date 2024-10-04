import { React } from "deps.ts";
import { useRef } from "react";

export function WordMenu(
  { wordStartTime, wordEndTime, clipStartTime, clipEndTime },
) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const showStart = wordStartTime < clipEndTime;
  const showEnd = wordEndTime > clipStartTime;
  return (
    <div className="word-menu" ref={menuRef}>
      {showStart && (
        <div
          onClick={() => {}} //TODO
          className="word-menu-item"
        >
          <div className="word-menu-text">Start here</div>
        </div>
      )}
      {showEnd && (
        <div
          onClick={() => {}} // TODO
          className="word-menu-item"
        >
          <div className="word-menu-text">End here</div>
        </div>
      )}
    </div>
  );
}
