import { cn } from "@examplary/ui";
import { useState, type MouseEvent } from "react";

export type Point = { x: number; y: number };
export type Area = { shape: "circle" | "rect"; coords: number[] };

// Answers store each point as an "x,y" string
export const parsePoints = (value: unknown): Point[] =>
  ((value as string[]) || []).map((point) => {
    const [x, y] = point.split(",").map(Number);
    return { x, y };
  });

export const formatPoints = (points: Point[]) =>
  points.map(({ x, y }) => `${x},${y}`);

// Points and areas are in the image's coordinate space: `width` by `height`
// from the settings, or the image's own size when those are not set
export const PointImage = ({
  settings,
  points = [],
  areas = [],
  onClick,
  onAreaClick,
  onPointClick,
}: {
  settings: { image?: string; width?: number; height?: number };
  points?: Point[];
  areas?: Area[];
  onClick?: (point: Point, width: number) => void;
  onAreaClick?: (index: number) => void;
  onPointClick?: (index: number) => void;
}) => {
  const [naturalSize, setNaturalSize] = useState<Point>();
  const width = settings.width || naturalSize?.x;
  const height = settings.height || naturalSize?.y;
  if (!settings.image) return null;

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    if (!onClick || !width || !height) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onClick(
      {
        x: Math.round(((event.clientX - rect.left) / rect.width) * width),
        y: Math.round(((event.clientY - rect.top) / rect.height) * height),
      },
      width,
    );
  };

  const markerSize = (width ?? 0) / 60;

  return (
    <div className="relative inline-block max-w-full">
      <img
        src={settings.image}
        className="block max-w-full h-auto"
        style={{ width: width }}
        onLoad={(event) =>
          setNaturalSize({
            x: event.currentTarget.naturalWidth,
            y: event.currentTarget.naturalHeight,
          })
        }
        alt=""
      />
      {width && height && (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className={cn(
            "absolute inset-0 size-full",
            onClick && "cursor-crosshair",
          )}
          onClick={handleClick}
        >
          {areas.map(({ shape, coords: [a, b, c, d] }, index) => (
            <g
              key={index}
              className={cn(
                "fill-green-500/30 stroke-green-700",
                onAreaClick && "cursor-pointer",
              )}
              strokeWidth={markerSize / 4}
              onClick={(event) => {
                if (!onAreaClick) return;
                event.stopPropagation();
                onAreaClick(index);
              }}
            >
              {shape === "circle" ? (
                <circle cx={a} cy={b} r={c} />
              ) : (
                <rect x={a} y={b} width={c - a} height={d - b} />
              )}
            </g>
          ))}
          {points.map(({ x, y }, index) => (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={markerSize}
              className={cn(
                "fill-black stroke-white",
                onPointClick && "cursor-pointer",
              )}
              strokeWidth={markerSize / 3}
              onClick={(event) => {
                if (!onPointClick) return;
                event.stopPropagation();
                onPointClick(index);
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
};
