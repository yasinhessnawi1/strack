"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

/**
 * Slider constants
 */
const MIN_RANGE = 50; // px – minimum gap between the two handles
const ROTATION_DEG = -2.76; // matches CSS transform
const THETA = ROTATION_DEG * (Math.PI / 180);
const COS_THETA = Math.cos(THETA);
const SIN_THETA = Math.sin(THETA);

/** Utility */
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * The visible heading that houses the range‑slider.
 */
export default function DynamicTextSlider() {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  // Re‑measure whenever fonts load or the viewport resizes
  useEffect(() => {
    const measure = () => {
        if (measureRef.current) {
            setTextWidth(measureRef.current.clientWidth);
        }
    };
    // Initial measurement with a small delay to ensure rendering
    setTimeout(measure, 100);
    
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="w-full py-20 bg-background text-foreground flex flex-col items-center justify-center text-center p-4 font-sans border-b border-border/50">
      <div className="max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <h1 className="font-bold tracking-tighter text-4xl text-foreground md:text-6xl">
            How
            </h1>
            
            {/* Hidden copy for width‑measurement. */}
            <span
            ref={measureRef}
            className="absolute -left-[9999px] px-4 whitespace-nowrap font-bold tracking-tighter text-5xl md:text-7xl"
            >
            STrack
            </span>
            
            {/* Range‑slider container */}
            <div className="flex justify-center">
            <OpenSourceSlider width={textWidth} />
            </div>

            <h1 className="font-bold tracking-tighter text-4xl text-foreground md:text-6xl">
            Works
            </h1>
        </div>

        {/* Subheading */}
        <p className="mt-8 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
          Start tracking your subscriptions in three simple steps. No manual entry required (unless we fail ofcourse).
        </p>
      </div>
    </div>
  );
}

/**
 * A two‑handle slider that is itself rotated.
 */
function OpenSourceSlider({ width: initialWidth, height = 90, handleSize = 28 }: { width: number; height?: number; handleSize?: number; onChange?: (val: any) => void }) {
  const width = initialWidth > 0 ? initialWidth + 40 : 200; // Default width fallback
  
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(width);
  const [draggingHandle, setDraggingHandle] = useState<"left" | "right" | null>(null);
  const [dynamicRotation, setDynamicRotation] = useState(ROTATION_DEG);

  const leftRef = useRef(left);
  const rightRef = useRef(right);
  const dragRef = useRef<{ handle: "left" | "right"; startX: number; startY: number; initialLeft: number; initialRight: number } | null>(null);

  useEffect(() => {
    leftRef.current = left;
    rightRef.current = right;
  }, [left, right]);
  
  useEffect(() => {
    if (width > 0) {
      const handleMidpoint = (left + right) / 2;
      const sliderCenter = width / 2;
      const deviationFactor = (handleMidpoint - sliderCenter) / sliderCenter;
      const maxAdditionalTilt = 3; 
      const newRotation = ROTATION_DEG + (deviationFactor * maxAdditionalTilt);
      setDynamicRotation(newRotation);
    }
    // Update right on width change
    setRight(width);
  }, [left, right, width]);

  const startDrag = (handle: "left" | "right", e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: leftRef.current,
      initialRight: rightRef.current,
    };
    setDraggingHandle(handle);
  };

  const moveDrag = useCallback(
    (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { handle, startX, startY, initialLeft, initialRight } = dragRef.current;
      const dX = e.clientX - startX;
      const dY = e.clientY - startY;
      const projected = dX * COS_THETA + dY * SIN_THETA;
      if (handle === "left") {
        const newLeft = clamp(initialLeft + projected, 0, rightRef.current - MIN_RANGE);
        setLeft(newLeft);
      } else {
        const newRight = clamp(initialRight + projected, leftRef.current + MIN_RANGE, width);
        setRight(newRight);
      }
    },
    [width]
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDraggingHandle(null);
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [moveDrag, endDrag]);

  return (
    <div
      className="relative select-none transition-transform duration-300 ease-out"
      style={{ width, height, transform: `rotate(${dynamicRotation}deg)` }}
    >
      <div className="absolute inset-0 rounded-2xl border border-violet-500 pointer-events-none z-20" />
      
      {/* Background Layer: "it" */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
            <span className="font-bold tracking-tighter text-5xl text-foreground md:text-7xl opacity-50">
            it
            </span>
        </div>

      {(["left", "right"] as const).map((handle) => {
        const x = handle === "left" ? left : right - handleSize;
        const scaleClass = draggingHandle === handle ? "scale-125" : "hover:scale-110";

        return (
          <button
            key={handle}
            type="button"
            aria-label={handle === "left" ? "Adjust start" : "Adjust end"}
            onPointerDown={(e) => startDrag(handle, e)}
            className={`z-30 absolute top-0 h-full w-7 rounded-full bg-background border border-violet-500 flex items-center justify-center cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-violet-400 transition-transform duration-150 ease-in-out opacity-100 ${scaleClass}`}
            style={{ left: x, touchAction: "none" }}
          >
            <span className="w-1 h-8 rounded-full bg-violet-500" />
          </button>
        );
      })}
      
      {/* Foreground Layer: "STrack" is clipped */}
      <div
        className="flex z-10 items-center justify-center w-full h-full px-4 overflow-hidden pointer-events-none font-bold tracking-tighter text-5xl text-foreground md:text-7xl bg-background absolute inset-0"
        style={{ clipPath: `inset(0 ${width - right}px 0 ${left}px round 1rem)` }}
      >
        STrack
      </div>
    </div>
  );
}
