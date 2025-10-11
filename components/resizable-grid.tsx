"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";

export function ResizableGrid({ children }: { children: React.ReactNode[] }) {
  const [gridLayout, setGridLayout] = useState({
    topRowHeight: 50, // percentage for top row
    bottomRowHeight: 50, // percentage for bottom row
    topLeftWidth: 50, // percentage for top row
    bottomLeftWidth: 50, // percentage for bottom row
  });

  const [panelVisibility, setPanelVisibility] = useState({
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  });

  const [maximizedPanel, setMaximizedPanel] = useState<string | null>(null);

  // Calculate effective dimensions based on visibility
  const topRowHasVisible = panelVisibility.topLeft || panelVisibility.topRight;
  const bottomRowHasVisible = panelVisibility.bottomLeft || panelVisibility.bottomRight;

  const effectiveTopRowHeight = topRowHasVisible && bottomRowHasVisible ? gridLayout.topRowHeight : topRowHasVisible ? 100 : 0;
  const effectiveBottomRowHeight = topRowHasVisible && bottomRowHasVisible ? gridLayout.bottomRowHeight : bottomRowHasVisible ? 100 : 0;

  const effectiveTopLeftWidth = panelVisibility.topRight ? gridLayout.topLeftWidth : 100;
  const effectiveTopRightWidth = panelVisibility.topLeft ? 100 - gridLayout.topLeftWidth : 100;

  const effectiveBottomLeftWidth = panelVisibility.bottomRight ? gridLayout.bottomLeftWidth : 100;
  const effectiveBottomRightWidth = panelVisibility.bottomLeft ? 100 - gridLayout.bottomLeftWidth : 100;

  const handleMaximize = (panel: string) => {
    if (maximizedPanel === panel) {
      // Restore all panels
      setPanelVisibility({
        topLeft: true,
        topRight: true,
        bottomLeft: true,
        bottomRight: true,
      });
      setMaximizedPanel(null);
      setGridLayout({
        topRowHeight: 50,
        bottomRowHeight: 50,
        topLeftWidth: 50,
        bottomLeftWidth: 50,
      });
    } else {
      // Maximize this panel
      setPanelVisibility({
        topLeft: panel === 'topLeft',
        topRight: panel === 'topRight',
        bottomLeft: panel === 'bottomLeft',
        bottomRight: panel === 'bottomRight',
      });
      setMaximizedPanel(panel);
      setGridLayout({
        topRowHeight: 100,
        bottomRowHeight: 0,
        topLeftWidth: 100,
        bottomLeftWidth: 100,
      });
    }
  };

  // Removed auto-layout adjustment - users can manually resize after hiding panels

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingHorizontal = useRef(false);
  const isDraggingVertical = useRef(false);
  const resizingPanel = useRef<string | null>(null);
  const resizingRow = useRef<string | null>(null);

    const handleHorizontalResize = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingHorizontal.current) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newX = clientX - containerRect.left;
    const newWidth = Math.max(0, Math.min(containerRect.width, newX));

    const percentage = (newWidth / containerRect.width) * 100;

    setGridLayout(prev => {
      if (resizingRow.current === 'top') {
        return { ...prev, topLeftWidth: percentage };
      } else if (resizingRow.current === 'bottom') {
        return { ...prev, bottomLeftWidth: percentage };
      }
      return prev;
    });
  }, []);

  const handleVerticalResize = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingVertical.current || !containerRef.current || !resizingPanel.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let clientY: number;

    if ("touches" in e) {
      clientY = e.touches[0].clientY;
    } else {
      clientY = e.clientY;
    }

    const newTopHeight = ((clientY - rect.top) / rect.height) * 100;

    // Allow full range 0%-100% resizing
    const minHeight = 0;
    const maxHeight = 100;

    if (newTopHeight >= minHeight && newTopHeight <= maxHeight) {
      setGridLayout((prev) => {
        const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newTopHeight));
        if (resizingPanel.current === 'left' || resizingPanel.current === 'right') {
          return {
            ...prev,
            topRowHeight: clampedHeight,
            bottomRowHeight: 100 - clampedHeight,
          };
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleHorizontalResize(e);
      handleVerticalResize(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleHorizontalResize(e);
      handleVerticalResize(e);
    };

    const handleEnd = () => {
      isDraggingHorizontal.current = false;
      isDraggingVertical.current = false;
      resizingPanel.current = null;
      document.body.style.userSelect = '';
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [panelVisibility, handleHorizontalResize, handleVerticalResize]);

  // Reset grid layout to default when all panels become visible
  useEffect(() => {
    const allVisible = panelVisibility.topLeft && panelVisibility.topRight && 
                      panelVisibility.bottomLeft && panelVisibility.bottomRight;
    if (allVisible) {
      setGridLayout({
        topRowHeight: 50,
        bottomRowHeight: 50,
        topLeftWidth: 50,
        bottomLeftWidth: 50,
      });
    }
  }, [panelVisibility]);

  return (
    <div className="h-full">
      <div className="flex gap-4 mb-4 p-2 bg-muted rounded-lg">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="topLeft"
            checked={panelVisibility.topLeft}
            onChange={(e) =>
              setPanelVisibility((prev) => ({
                ...prev,
                topLeft: e.target.checked,
              }))
            }
          />
          <label htmlFor="topLeft">Document Viewer</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="topRight"
            checked={panelVisibility.topRight}
            onChange={(e) =>
              setPanelVisibility((prev) => ({
                ...prev,
                topRight: e.target.checked,
              }))
            }
          />
          <label htmlFor="topRight">Keyword Highlights</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="bottomLeft"
            checked={panelVisibility.bottomLeft}
            onChange={(e) =>
              setPanelVisibility((prev) => ({
                ...prev,
                bottomLeft: e.target.checked,
              }))
            }
          />
          <label htmlFor="bottomLeft">News Headlines</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="bottomRight"
            checked={panelVisibility.bottomRight}
            onChange={(e) =>
              setPanelVisibility((prev) => ({
                ...prev,
                bottomRight: e.target.checked,
              }))
            }
          />
          <label htmlFor="bottomRight">News Article</label>
        </div>
        <button
          onClick={() => {
            setGridLayout({
              topRowHeight: 50,
              bottomRowHeight: 50,
              topLeftWidth: 50,
              bottomLeftWidth: 50,
            });
            setPanelVisibility({
              topLeft: true,
              topRight: true,
              bottomLeft: true,
              bottomRight: true,
            });
            setMaximizedPanel(null);
          }}
          className="px-3 py-1 bg-muted hover:bg-muted/80 rounded text-sm"
        >
          Reset Layout
        </button>
      </div>
      <div ref={containerRef} className="w-full h-full relative">
        {panelVisibility.topLeft && (
          <div
            className="absolute top-0 left-0 overflow-hidden rounded-lg border bg-background shadow"
            style={{
              width: `${effectiveTopLeftWidth}%`,
              height: `${effectiveTopRowHeight}%`,
            }}
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = 15; // Increased threshold for better detection
              if (Math.abs(e.clientX - rect.right) < threshold) {
                isDraggingHorizontal.current = true;
                resizingRow.current = 'top'; // Resizing top row horizontally
              }
              if (Math.abs(e.clientY - rect.bottom) < threshold) {
                isDraggingVertical.current = true;
                resizingPanel.current = 'left'; // Resizing left column
              }
              if (isDraggingHorizontal.current || isDraggingVertical.current) {
                document.body.style.userSelect = 'none';
              }
            }}
            onTouchStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = 10;
              const touch = e.touches[0];
              if (Math.abs(touch.clientX - rect.right) < threshold) {
                isDraggingHorizontal.current = true;
              }
              if (Math.abs(touch.clientY - rect.bottom) < threshold) {
                isDraggingVertical.current = true;
              }
            }}
          >
            <div className="absolute top-2 right-2 z-50 flex gap-1">
              <button
                onClick={() => handleMaximize('topLeft')}
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                {maximizedPanel === 'topLeft' ? '−' : '+'}
              </button>
              <button
                onClick={() => {
                  setGridLayout({
                    topRowHeight: 50,
                    bottomRowHeight: 50,
                    topLeftWidth: 50,
                    bottomLeftWidth: 50,
                  });
                  setPanelVisibility({
                    topLeft: true,
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                  });
                  setMaximizedPanel(null);
                }}
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                −
              </button>
              <button
                onClick={() =>
                  setPanelVisibility((prev) => ({ ...prev, topLeft: false }))
                }
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                ✕
              </button>
            </div>
            {children[0]}
          </div>
        )}
        {panelVisibility.topRight && (
          <div
            className="absolute top-0 right-0 overflow-hidden rounded-lg border bg-background shadow"
            style={{
              width: `${effectiveTopRightWidth}%`,
              height: `${effectiveTopRowHeight}%`,
            }}
            onMouseDown={(e) => {
              document.body.style.userSelect = 'none'; // Prevent text selection immediately
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = 15;
              if (Math.abs(e.clientX - rect.left) < threshold) {
                isDraggingHorizontal.current = true;
                resizingRow.current = 'top'; // Resizing top row horizontally
              }
              if (Math.abs(e.clientY - rect.bottom) < threshold) {
                isDraggingVertical.current = true;
                resizingPanel.current = 'right'; // Resizing right column
              }
              if (isDraggingHorizontal.current || isDraggingVertical.current) {
                // Already set above
              }
            }}
            onTouchStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = 15;
              const touch = e.touches[0];
              if (Math.abs(touch.clientX - rect.left) < threshold) {
                isDraggingHorizontal.current = true;
              }
              if (Math.abs(touch.clientY - rect.bottom) < threshold) {
                isDraggingVertical.current = true;
              }
            }}
          >
            <div className="absolute top-2 right-2 z-50 flex gap-1">
              <button
                onClick={() => handleMaximize('topRight')}
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                {maximizedPanel === 'topRight' ? '−' : '+'}
              </button>
              <button
                onClick={() => {
                  setGridLayout({
                    topRowHeight: 50,
                    bottomRowHeight: 50,
                    topLeftWidth: 50,
                    bottomLeftWidth: 50,
                  });
                  setPanelVisibility({
                    topLeft: true,
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                  });
                  setMaximizedPanel(null);
                }}
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                −
              </button>
              <button
                onClick={() =>
                  setPanelVisibility((prev) => ({ ...prev, topRight: false }))
                }
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                ✕
              </button>
            </div>
            {children[1]}
          </div>
        )}
        {panelVisibility.bottomLeft && (
          <div
            className="absolute bottom-0 left-0 overflow-hidden rounded-lg border bg-background shadow"
            style={{
              width: `${effectiveBottomLeftWidth}%`,
              height: `${effectiveBottomRowHeight}%`,
            }}
            onMouseDown={(e) => {
              document.body.style.userSelect = 'none'; // Prevent text selection immediately
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = 15;
              if (Math.abs(e.clientX - rect.right) < threshold) {
                isDraggingHorizontal.current = true;
                resizingRow.current = 'bottom'; // Resizing bottom row horizontally
              }
              if (Math.abs(e.clientY - rect.top) < threshold) {
                isDraggingVertical.current = true;
                resizingPanel.current = 'left'; // Resizing left column
              }
              if (isDraggingHorizontal.current || isDraggingVertical.current) {
                // Already set above
              }
            }}
            onTouchStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = 15;
              const touch = e.touches[0];
              if (Math.abs(touch.clientX - rect.right) < threshold) {
                isDraggingHorizontal.current = true;
              }
              if (Math.abs(touch.clientY - rect.top) < threshold) {
                isDraggingVertical.current = true;
              }
            }}
          >
            <div className="absolute top-2 right-2 z-50 flex gap-1">
              <button
                onClick={() => handleMaximize('bottomLeft')}
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                {maximizedPanel === 'bottomLeft' ? '−' : '+'}
              </button>
              <button
                onClick={() => {
                  setGridLayout({
                    topRowHeight: 50,
                    bottomRowHeight: 50,
                    topLeftWidth: 50,
                    bottomLeftWidth: 50,
                  });
                  setPanelVisibility({
                    topLeft: true,
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                  });
                  setMaximizedPanel(null);
                }}
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                −
              </button>
              <button
                onClick={() =>
                  setPanelVisibility((prev) => ({ ...prev, bottomLeft: false }))
                }
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                ✕
              </button>
            </div>
            {children[2]}
          </div>
        )}
        {panelVisibility.bottomRight && (
          <div
            className="absolute bottom-0 right-0 overflow-hidden rounded-lg border bg-background shadow"
            style={{
              width: `${effectiveBottomRightWidth}%`,
              height: `${effectiveBottomRowHeight}%`,
            }}
            onMouseDown={(e) => {
              document.body.style.userSelect = 'none'; // Prevent text selection immediately
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = 15;
              if (Math.abs(e.clientX - rect.left) < threshold) {
                isDraggingHorizontal.current = true;
                resizingRow.current = 'bottom'; // Resizing bottom row horizontally
              }
              if (Math.abs(e.clientY - rect.top) < threshold) {
                isDraggingVertical.current = true;
                resizingPanel.current = 'right'; // Resizing right column
              }
              if (isDraggingHorizontal.current || isDraggingVertical.current) {
                // Already set above
              }
            }}
            onTouchStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = 15;
              const touch = e.touches[0];
              if (Math.abs(touch.clientX - rect.left) < threshold) {
                isDraggingHorizontal.current = true;
              }
              if (Math.abs(touch.clientY - rect.top) < threshold) {
                isDraggingVertical.current = true;
              }
            }}
          >
            <div className="absolute top-2 right-2 z-50 flex gap-1">
              <button
                onClick={() => handleMaximize('bottomRight')}
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                {maximizedPanel === 'bottomRight' ? '−' : '+'}
              </button>
              <button
                onClick={() => {
                  setGridLayout({
                    topRowHeight: 50,
                    bottomRowHeight: 50,
                    topLeftWidth: 50,
                    bottomLeftWidth: 50,
                  });
                  setPanelVisibility({
                    topLeft: true,
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                  });
                  setMaximizedPanel(null);
                }}
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                −
              </button>
              <button
                onClick={() =>
                  setPanelVisibility((prev) => ({
                    ...prev,
                    bottomRight: false,
                  }))
                }
                className="bg-background/80 p-1 rounded hover:bg-background text-xs"
              >
                ✕
              </button>
            </div>
            {children[3]}
          </div>
        )}
      </div>
    </div>
  );
}
