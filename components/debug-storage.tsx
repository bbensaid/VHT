"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DebugStorage() {
  const [storageData, setStorageData] = useState<Record<string, string>>({});

  // Update storage data display
  const refreshStorageData = () => {
    const data: Record<string, string> = {};

    // Get all sessionStorage items
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        data[key] = value
          ? key === "vt-pdf-data"
            ? value.substring(0, 50) + "... [truncated]"
            : value
          : "null";
      }
    }

    setStorageData(data);
  };

  // Initial load
  useEffect(() => {
    refreshStorageData();

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      refreshStorageData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Clear all sessionStorage
  const clearAllStorage = () => {
    sessionStorage.clear();
    refreshStorageData();
    alert("All sessionStorage items cleared!");
    // Force reload the page to reset all components
    window.location.reload();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>SessionStorage Debug</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={refreshStorageData}>
              Refresh
            </Button>
            <Button size="sm" variant="destructive" onClick={clearAllStorage}>
              Clear All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
          <pre className="text-xs">
            {Object.keys(storageData).length > 0
              ? JSON.stringify(storageData, null, 2)
              : "No sessionStorage items found"}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
