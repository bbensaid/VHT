"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";

export function ResizableGrid({ children }: { children: React.ReactNode[] }) {
  const [gridLayout, setGridLayout] = useState({
    topLeftHeight: 50, // percentage for top-left panel
    topRightHeight: 50, // percentage for top-right panel
    bottomLeftHeight: 50, // percentage for bottom-left panel
    bottomRightHeight: 50, // percentage for bottom-right panel
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
  const [cursor, setCursor] = useState<string>('default');

  // Handle cursor changes for resize indicators
  const handleMouseMove = useCallback((e: React.MouseEvent, panel: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const threshold = 15;

    // Check if mouse is near horizontal resize border (left/right edges)
    const nearLeftBorder = Math.abs(e.clientX - rect.left) < threshold;
    const nearRightBorder = Math.abs(e.clientX - rect.right) < threshold;

    // Check if mouse is near vertical resize border (top/bottom edges)
    const nearTopBorder = Math.abs(e.clientY - rect.top) < threshold;
    const nearBottomBorder = Math.abs(e.clientY - rect.bottom) < threshold;

    // Determine cursor based on panel position and border proximity
    if (panel === 'topLeft') {
      if (nearRightBorder) {
        setCursor('ew-resize'); // Horizontal resize
      } else if (nearBottomBorder) {
        setCursor('ns-resize'); // Vertical resize
      } else {
        setCursor('default');
      }
    } else if (panel === 'topRight') {
      if (nearLeftBorder) {
        setCursor('ew-resize'); // Horizontal resize
      } else if (nearBottomBorder) {
        setCursor('ns-resize'); // Vertical resize
      } else {
        setCursor('default');
      }
    } else if (panel === 'bottomLeft') {
      if (nearRightBorder) {
        setCursor('ew-resize'); // Horizontal resize
      } else if (nearTopBorder) {
        setCursor('ns-resize'); // Vertical resize
      } else {
        setCursor('default');
      }
    } else if (panel === 'bottomRight') {
      if (nearLeftBorder) {
        setCursor('ew-resize'); // Horizontal resize
      } else if (nearTopBorder) {
        setCursor('ns-resize'); // Vertical resize
      } else {
        setCursor('default');
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursor('default');
  }, []);

  // Calculate effective dimensions based on visibility
  const leftColumnHasVisible = panelVisibility.topLeft || panelVisibility.bottomLeft;
  const rightColumnHasVisible = panelVisibility.topRight || panelVisibility.bottomRight;

  // Calculate how many panels are visible in each column
  const leftColumnVisibleCount = (panelVisibility.topLeft ? 1 : 0) + (panelVisibility.bottomLeft ? 1 : 0);
  const rightColumnVisibleCount = (panelVisibility.topRight ? 1 : 0) + (panelVisibility.bottomRight ? 1 : 0);

  // Calculate effective heights based on column visibility
  let effectiveTopLeftHeight: number;
  let effectiveTopRightHeight: number;
  let effectiveBottomLeftHeight: number;
  let effectiveBottomRightHeight: number;

  if (leftColumnHasVisible && rightColumnHasVisible) {
    // Both columns visible - use stored heights
    effectiveTopLeftHeight = gridLayout.topLeftHeight;
    effectiveTopRightHeight = gridLayout.topRightHeight;
    effectiveBottomLeftHeight = gridLayout.bottomLeftHeight;
    effectiveBottomRightHeight = gridLayout.bottomRightHeight;
  } else if (leftColumnHasVisible) {
    // Only left column visible - distribute height among left panels
    const heightPerPanel = 100 / leftColumnVisibleCount;
    effectiveTopLeftHeight = panelVisibility.topLeft ? heightPerPanel : 0;
    effectiveBottomLeftHeight = panelVisibility.bottomLeft ? heightPerPanel : 0;
    effectiveTopRightHeight = 0;
    effectiveBottomRightHeight = 0;
  } else if (rightColumnHasVisible) {
    // Only right column visible - distribute height among right panels
    const heightPerPanel = 100 / rightColumnVisibleCount;
    effectiveTopLeftHeight = 0;
    effectiveBottomLeftHeight = 0;
    effectiveTopRightHeight = panelVisibility.topRight ? heightPerPanel : 0;
    effectiveBottomRightHeight = panelVisibility.bottomRight ? heightPerPanel : 0;
  } else {
    // No panels visible
    effectiveTopLeftHeight = 0;
    effectiveTopRightHeight = 0;
    effectiveBottomLeftHeight = 0;
    effectiveBottomRightHeight = 0;
  }

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
        topLeftHeight: 50,
        topRightHeight: 50,
        bottomLeftHeight: 50,
        bottomRightHeight: 50,
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
        topLeftHeight: panel === 'topLeft' ? 100 : 0,
        topRightHeight: panel === 'topRight' ? 100 : 0,
        bottomLeftHeight: panel === 'bottomLeft' ? 100 : 0,
        bottomRightHeight: panel === 'bottomRight' ? 100 : 0,
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
        if (resizingPanel.current === 'left') {
          // Resizing left column (top-left and bottom-left panels)
          const totalLeftHeight = prev.topLeftHeight + prev.bottomLeftHeight;
          const newTopLeftHeight = clampedHeight;
          const newBottomLeftHeight = Math.max(0, totalLeftHeight - clampedHeight);
          return {
            ...prev,
            topLeftHeight: newTopLeftHeight,
            bottomLeftHeight: newBottomLeftHeight,
          };
        } else if (resizingPanel.current === 'right') {
          // Resizing right column (top-right and bottom-right panels)
          const totalRightHeight = prev.topRightHeight + prev.bottomRightHeight;
          const newTopRightHeight = clampedHeight;
          const newBottomRightHeight = Math.max(0, totalRightHeight - clampedHeight);
          return {
            ...prev,
            topRightHeight: newTopRightHeight,
            bottomRightHeight: newBottomRightHeight,
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
        topLeftHeight: 50,
        topRightHeight: 50,
        bottomLeftHeight: 50,
        bottomRightHeight: 50,
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
              topLeftHeight: 50,
              topRightHeight: 50,
              bottomLeftHeight: 50,
              bottomRightHeight: 50,
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
      <div ref={containerRef} className="w-full h-full relative" style={{ cursor }}>
        {panelVisibility.topLeft && (
          <div
            className="absolute left-0 overflow-hidden rounded-lg border bg-background shadow"
            style={{
              top: '0%',
              width: `${effectiveTopLeftWidth}%`,
              height: `${effectiveTopLeftHeight}%`,
            }}
            onMouseMove={(e) => handleMouseMove(e, 'topLeft')}
            onMouseLeave={handleMouseLeave}
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
                  setGridLayout((prev) => ({
                    ...prev,
                    topLeftHeight: 50,
                    bottomLeftHeight: 50,
                  }));
                  setPanelVisibility((prev) => ({ ...prev, topLeft: true }));
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
            className="absolute right-0 overflow-hidden rounded-lg border bg-background shadow"
            style={{
              top: '0%',
              width: `${effectiveTopRightWidth}%`,
              height: `${effectiveTopRightHeight}%`,
            }}
            onMouseMove={(e) => handleMouseMove(e, 'topRight')}
            onMouseLeave={handleMouseLeave}
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
                  setGridLayout((prev) => ({
                    ...prev,
                    topRightHeight: 50,
                    bottomRightHeight: 50,
                  }));
                  setPanelVisibility((prev) => ({ ...prev, topRight: true }));
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
            className="absolute left-0 overflow-hidden rounded-lg border bg-background shadow"
            style={{
              top: `${effectiveTopLeftHeight}%`,
              width: `${effectiveBottomLeftWidth}%`,
              height: `${effectiveBottomLeftHeight}%`,
            }}
            onMouseMove={(e) => handleMouseMove(e, 'bottomLeft')}
            onMouseLeave={handleMouseLeave}
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
                  setGridLayout((prev) => ({
                    ...prev,
                    topLeftHeight: 50,
                    bottomLeftHeight: 50,
                  }));
                  setPanelVisibility((prev) => ({ ...prev, bottomLeft: true }));
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
            className="absolute right-0 overflow-hidden rounded-lg border bg-background shadow"
            style={{
              top: `${effectiveTopRightHeight}%`,
              width: `${effectiveBottomRightWidth}%`,
              height: `${effectiveBottomRightHeight}%`,
            }}
            onMouseMove={(e) => handleMouseMove(e, 'bottomRight')}
            onMouseLeave={handleMouseLeave}
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
                  setGridLayout((prev) => ({
                    ...prev,
                    topRightHeight: 50,
                    bottomRightHeight: 50,
                  }));
                  setPanelVisibility((prev) => ({ ...prev, bottomRight: true }));
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
