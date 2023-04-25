import styles from "./index.module.css";
import * as Color from "color";

type CursorProps = {
  x: number;
  y: number;
  name: string;
  color: string[];
};

export default function Cursor({ x, y, name, color }: CursorProps) {
  const textColor = Color(color[0]).isDark() ? "#ffffff" : "#000000";

  return (
    // Offset the padding and border and height of elements around the main content
    // So, the (0, 0) of the main content is 25px from the left and 84 px from the top
    <div
      className={styles.cursor}
      style={{ transform: `translate(${x - 25}px, ${y - 84}px)` }}
    >
      <div className={styles.nameWrapper}>
        <svg
          className={styles.cursorSvg}
          width="32"
          height="44"
          viewBox="0 0 24 36"
          fill="none"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="500%" y2="0%">
              <stop offset="0%" stopColor={color[0]} />
              <stop offset="100%" stopColor={color[1]} />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient)"
            d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
          />
        </svg>
        <div
          className={styles.namePill}
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${color[0]}, ${color[1]})`,
            color: textColor,
          }}
        >
          <div className={styles.namePillName}>{name}</div>
        </div>
      </div>
    </div>
  );
}
