"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  ZoomIn,
  ZoomOut,
  MessageSquare,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { DebugStorage } from "@/components/debug-storage";
import dynamic from "next/dynamic";
import { storeDocumentText } from "@/lib/storage/document-state";

// Define a global type for the PDF.js library
declare global {
  interface Window {
    pdfjsLib: typeof import("pdfjs-dist");
  }
}

type TextItem = import("pdfjs-dist/types/src/display/api").TextItem;

// Use dynamic import with ssr: false to prevent hydration mismatch
const DocumentViewerContent = dynamic(
  () =>
    Promise.resolve(({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    )),
  { ssr: false }
);

export function DocumentViewer() {
  const { toast } = useToast();

  // Document state
  const [documentName, setDocumentName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isDocumentActive, setIsDocumentActive] = useState<boolean>(false);

  // UI state
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfDocument, setPdfDocument] = useState<
    import("pdfjs-dist").PDFDocumentProxy | null
  >(null);
  const [showDebug, setShowDebug] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const restorationAttemptedRef = useRef<boolean>(false);

  // Update the hasSavedDocument function to check for browser environment
  const hasSavedDocument = () => {
    if (typeof window === "undefined") return false;

    const pdfData = sessionStorage.getItem("vt-pdf-data");
    const docName = sessionStorage.getItem("vt-document-name");
    const isActive = sessionStorage.getItem("vt-document-active");
    return !!(pdfData && docName && isActive === "true");
  };

  // Function to render the current PDF page
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!canvasRef.current || !pdfDocument) return;
      setError(null);

      try {
        console.log(`Rendering page ${pageNum}`);

        // Get the page
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        // Set canvas dimensions
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Render the page
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Extract text from the current page
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item): item is TextItem => "str" in item)
          .map((item) => item.str)
          .join(" ");

        // Store text using the utility function
        storeDocumentText(pageText);

        console.log(`Page ${pageNum} rendered successfully`);
      } catch (error) {
        console.error("Error rendering PDF page:", error);
        setError("Failed to render PDF page. Please try again.");
      }
    },
    [pdfDocument, scale]
  );

  // Load PDF from file
  const loadPdfFromFile = async (file: File) => {
    if (!window.pdfjsLib) {
      console.warn("PDF.js library not loaded yet");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Loading PDF file: ${file.name}`);

      // Clean up previous object URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      // Create a new object URL
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;

      // Load the PDF
      const loadingTask = window.pdfjsLib.getDocument(objectUrl);
      const pdf = await loadingTask.promise;

      setPdfDocument(pdf);
      setTotalPages(pdf.numPages);
      setDocumentName(file.name);
      setIsDocumentActive(true);

      // Save to sessionStorage
      sessionStorage.setItem("vt-document-name", file.name);
      sessionStorage.setItem("vt-document-active", "true");
      sessionStorage.setItem("vt-document-page", "1");
      sessionStorage.setItem("vt-document-scale", "1");

      console.log(`PDF loaded successfully: ${pdf.numPages} pages`);

      // Store the file in sessionStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const base64 = e.target?.result as string;
          sessionStorage.setItem("vt-pdf-data", base64);
          console.log("PDF data stored in sessionStorage");
        } catch (error) {
          console.error("Error storing PDF data:", error);
          toast({
            title: "Warning",
            description:
              "Could not save PDF for persistence due to size limitations.",
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);

      // Render the first page
      setCurrentPage(1);

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setError(
        `Failed to load PDF: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setIsLoading(false);
    }
  };

  // Load PDF.js library
  useEffect(() => {
    if (typeof window !== "undefined" && !window.pdfjsLib) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
      script.async = true;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
        setPdfLoaded(true);
        console.log("PDF.js library loaded");
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else if (typeof window !== "undefined" && window.pdfjsLib) {
      setPdfLoaded(true);
    }
  }, []);

  // Restore PDF from sessionStorage
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !pdfLoaded ||
      restorationAttemptedRef.current
    )
      return;

    const restorePdf = async () => {
      try {
        restorationAttemptedRef.current = true;

        // Check if we have a saved PDF
        const pdfData = sessionStorage.getItem("vt-pdf-data");
        const docName = sessionStorage.getItem("vt-document-name");
        const pageStr = sessionStorage.getItem("vt-document-page");
        const scaleStr = sessionStorage.getItem("vt-document-scale");
        const isActive = sessionStorage.getItem("vt-document-active");

        if (!pdfData || !docName || isActive !== "true") {
          console.log("No saved PDF data found or document not active");
          return;
        }

        console.log("Found saved PDF data, attempting to restore");
        setIsLoading(true);

        try {
          // Convert base64 to blob
          const byteString = atob(pdfData.split(",")[1]);
          const mimeString = pdfData.split(",")[0].split(":")[1].split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const blob = new Blob([ab], { type: mimeString });

          // Create object URL
          const objectUrl = URL.createObjectURL(blob);
          objectUrlRef.current = objectUrl;

          // Load the PDF
          const loadingTask = window.pdfjsLib.getDocument(objectUrl);
          const pdf = await loadingTask.promise;

          // Update state
          setPdfDocument(pdf);
          setTotalPages(pdf.numPages);
          setDocumentName(docName);
          setIsDocumentActive(true);

          // Restore page and scale
          if (pageStr) {
            const page = Number.parseInt(pageStr, 10);
            setCurrentPage(page);
          }

          if (scaleStr) {
            const scaleVal = Number.parseFloat(scaleStr);
            setScale(scaleVal);
          }

          console.log("PDF restored successfully");

          setIsLoading(false);
        } catch (error) {
          console.error("Error converting PDF data:", error);
          setError("Failed to restore PDF. Please try uploading again.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error restoring PDF:", error);
        setError("Failed to restore PDF. Please try uploading again.");
        setIsLoading(false);
      }
    };

    restorePdf();
  }, [pdfLoaded]);

  // Render page when current page or scale changes
  useEffect(() => {
    if (pdfDocument && currentPage > 0 && currentPage <= totalPages) {
      renderPage(currentPage);
      sessionStorage.setItem("vt-document-page", currentPage.toString());
    }
  }, [currentPage, scale, pdfDocument, totalPages, renderPage]);

  // Update scale in sessionStorage when it changes
  useEffect(() => {
    if (isDocumentActive && typeof window !== "undefined") {
      sessionStorage.setItem("vt-document-scale", scale.toString());
    }
  }, [scale, isDocumentActive]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await loadPdfFromFile(file);
    } catch (error) {
      console.error("Error processing PDF file:", error);
      setError(
        `Failed to process PDF file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const zoomIn = () => setScale(Math.min(scale + 0.2, 3.0));
  const zoomOut = () => setScale(Math.max(scale - 0.2, 0.5));
  const resetZoom = () => setScale(1.0);

  const retryLoading = async () => {
    if (typeof window === "undefined") return;

    restorationAttemptedRef.current = false;

    // Check if we have a saved PDF
    const pdfData = sessionStorage.getItem("vt-pdf-data");
    const docName = sessionStorage.getItem("vt-document-name");

    if (!pdfData || !docName) {
      setError("No saved PDF data found. Please upload a new PDF.");
      return;
    }

    try {
      setIsLoading(true);

      // Convert base64 to blob
      const byteString = atob(pdfData.split(",")[1]);
      const mimeString = pdfData.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });

      // Create object URL
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;

      // Load the PDF
      const loadingTask = window.pdfjsLib.getDocument(objectUrl);
      const pdf = await loadingTask.promise;

      // Update state
      setPdfDocument(pdf);
      setTotalPages(pdf.numPages);
      setDocumentName(docName);
      setIsDocumentActive(true);

      // Restore page and scale
      const pageStr = sessionStorage.getItem("vt-document-page");
      if (pageStr) {
        const page = Number.parseInt(pageStr, 10);
        setCurrentPage(page);
      }

      const scaleStr = sessionStorage.getItem("vt-document-scale");
      if (scaleStr) {
        const scaleVal = Number.parseFloat(scaleStr);
        setScale(scaleVal);
      }

      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error retrying PDF load:", error);
      setError("Failed to reload PDF. Please try uploading again.");
      setIsLoading(false);
    }
  };

  const handleCloseDocument = () => {
    // Clean up resources
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    // Reset state
    setPdfDocument(null);
    setTotalPages(0);
    setDocumentName("");
    setCurrentPage(1);
    setScale(1.0);
    setIsDocumentActive(false);

    // Clear storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("vt-pdf-data");
      sessionStorage.removeItem("vt-document-text");
      sessionStorage.removeItem("vt-document-name");
      sessionStorage.removeItem("vt-document-page");
      sessionStorage.removeItem("vt-document-scale");
      sessionStorage.removeItem("vt-document-active");
    }

    toast({
      title: "Document closed",
      description: "Document has been closed and removed from storage",
    });
  };

  return (
    <DocumentViewerContent>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center p-2 border-b">
          <h3 className="font-medium absolute left-2">
            {documentName ? `Document: ${documentName}` : "Document Viewer"}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? "Hide Debug" : "Show Debug"}
            </Button>
            {pdfDocument && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/comments?document=${encodeURIComponent(
                    documentName
                  )}&page=${currentPage}`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comments
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
                aria-label="Upload PDF document"
              />
            </Button>
            {documentName && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCloseDocument}
              >
                <X className="h-4 w-4 mr-2" />
                Close Document
              </Button>
            )}
          </div>
        </div>

        {showDebug && (
          <div className="p-4 border-b">
            <DebugStorage />
          </div>
        )}

        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center bg-muted/30 overflow-auto relative"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">
                Processing document...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 p-6 max-w-md text-center">
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <p className="font-semibold mb-2">Error loading PDF</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button variant="outline" onClick={retryLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : pdfDocument ? (
            <div className="w-full h-full flex flex-col items-center">
              <div className="flex-1 w-full flex items-center justify-center overflow-auto p-2">
                <canvas
                  ref={canvasRef}
                  className="shadow-lg"
                  aria-label={`PDF page ${currentPage} of ${totalPages}`}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center p-6">
              <FileText className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-xl font-medium">No Document Loaded</h3>
              <p className="text-muted-foreground mb-2">
                Upload a PDF document to begin analyzing Vermont healthcare
                reform documents
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                    aria-label="Upload PDF document"
                  />
                </Button>
                {typeof window !== "undefined" && hasSavedDocument() && (
                  <Button variant="outline" onClick={retryLoading}>
                    <FileText className="h-4 w-4 mr-2" />
                    Restore Previous Document
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {pdfDocument && totalPages > 0 && (
          <div className="p-2 flex items-center justify-between gap-2 w-full border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm">{Math.round(scale * 100)}%</span>
              <Button
                variant="outline"
                size="icon"
                onClick={zoomIn}
                disabled={scale >= 3.0}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={resetZoom}
                aria-label="Reset zoom"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DocumentViewerContent>
  );
}
