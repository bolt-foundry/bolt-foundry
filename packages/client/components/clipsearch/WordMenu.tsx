import { React } from "deps.ts";
import { useRef } from "react";

type Props = {
  wordStartTime: number;
  wordEndTime: number;
  clipStartTime: number;
  clipEndTime: number;
  updateStartAndEndTime: (startTime?: number, endTime?: number) => void;
};

export function WordMenu(
  {
    wordStartTime,
    wordEndTime,
    clipStartTime,
    clipEndTime,
    updateStartAndEndTime,
  },
) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const showStart = wordStartTime < clipEndTime;
  const showEnd = wordEndTime > clipStartTime;
  return (
    <div className="word-menu" ref={menuRef}>
      {showStart && (
        <div
          onClick={() => {
            updateStartAndEndTime(wordStartTime, null);
          }} //TODO
          className="word-menu-item"
        >
          <div className="word-menu-text">Start here</div>
        </div>
      )}
      {showEnd && (
        <div
          onClick={() => {
            updateStartAndEndTime(null, wordEndTime);
          }} // TODO
          className="word-menu-item"
        >
          <div className="word-menu-text">End here</div>
        </div>
      )}
    </div>
  );
}
