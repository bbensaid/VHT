"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type DocumentContextType = {
  documentText: string;
  documentName: string;
  currentPage: number;
  scale: number;
  isDocumentActive: boolean;
  pdfData: string | null;
  setDocumentText: (text: string) => void;
  setDocumentName: (name: string) => void;
  setCurrentPage: (page: number) => void;
  setScale: (scale: number) => void;
  setPdfData: (data: string | null) => void;
  closeDocument: () => void;
};

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

// Make sure the storage keys match exactly what's in the debug output
const STORAGE_KEYS = {
  DOCUMENT_TEXT: "vt-document-text",
  DOCUMENT_NAME: "vt-document-name",
  DOCUMENT_PAGE: "vt-document-page",
  DOCUMENT_SCALE: "vt-document-scale",
  DOCUMENT_ACTIVE: "vt-document-active",
  PDF_DATA: "vt-pdf-data",
};

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documentText, setDocumentTextState] = useState<string>("");
  const [documentName, setDocumentNameState] = useState<string>("");
  const [currentPage, setCurrentPageState] = useState<number>(1);
  const [scale, setScaleState] = useState<number>(1.0);
  const [isDocumentActive, setIsDocumentActiveState] = useState<boolean>(false);
  const [pdfData, setPdfDataState] = useState<string | null>(null);

  // Initialize from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedDocumentText = sessionStorage.getItem(
        STORAGE_KEYS.DOCUMENT_TEXT
      );
      const storedDocumentName = sessionStorage.getItem(
        STORAGE_KEYS.DOCUMENT_NAME
      );
      const storedCurrentPage = sessionStorage.getItem(
        STORAGE_KEYS.DOCUMENT_PAGE
      );
      const storedScale = sessionStorage.getItem(STORAGE_KEYS.DOCUMENT_SCALE);
      const storedIsActive = sessionStorage.getItem(
        STORAGE_KEYS.DOCUMENT_ACTIVE
      );
      const storedPdfData = sessionStorage.getItem(STORAGE_KEYS.PDF_DATA);

      if (storedDocumentText) {
        setDocumentTextState(storedDocumentText);
      }

      if (storedDocumentName) {
        setDocumentNameState(storedDocumentName);
      }

      if (storedCurrentPage) {
        setCurrentPageState(Number.parseInt(storedCurrentPage, 10));
      }

      if (storedScale) {
        setScaleState(Number.parseFloat(storedScale));
      }

      if (storedIsActive === "true") {
        setIsDocumentActiveState(true);
      }

      if (storedPdfData) {
        setPdfDataState(storedPdfData);
      }

      console.log("Document context initialized from sessionStorage", {
        hasText: !!storedDocumentText,
        hasName: !!storedDocumentName,
        hasPage: !!storedCurrentPage,
        hasScale: !!storedScale,
        isActive: storedIsActive === "true",
        hasPdfData: !!storedPdfData,
      });
    } catch (error) {
      console.error("Error restoring document state:", error);
    }
  }, []);

  // Save to sessionStorage when state changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (documentText) {
        sessionStorage.setItem(STORAGE_KEYS.DOCUMENT_TEXT, documentText);
      }

      if (documentName) {
        sessionStorage.setItem(STORAGE_KEYS.DOCUMENT_NAME, documentName);
      }

      sessionStorage.setItem(
        STORAGE_KEYS.DOCUMENT_PAGE,
        currentPage.toString()
      );
      sessionStorage.setItem(STORAGE_KEYS.DOCUMENT_SCALE, scale.toString());
      sessionStorage.setItem(
        STORAGE_KEYS.DOCUMENT_ACTIVE,
        isDocumentActive.toString()
      );

      if (pdfData) {
        sessionStorage.setItem(STORAGE_KEYS.PDF_DATA, pdfData);
      }

      // Log for debugging
      console.log("Document state saved to sessionStorage", {
        documentName,
        currentPage,
        isActive: isDocumentActive,
        hasText: !!documentText,
        hasPdfData: !!pdfData,
      });
    } catch (error) {
      console.error("Error saving document state:", error);
    }
  }, [
    documentText,
    documentName,
    currentPage,
    scale,
    isDocumentActive,
    pdfData,
  ]);

  const setDocumentText = (text: string) => {
    setDocumentTextState(text);
    if (text) {
      setIsDocumentActiveState(true);
    }
  };

  const setDocumentName = (name: string) => {
    setDocumentNameState(name);
  };

  const setCurrentPage = (page: number) => {
    setCurrentPageState(page);
  };

  const setScale = (newScale: number) => {
    setScaleState(newScale);
  };

  const setPdfData = (data: string | null) => {
    setPdfDataState(data);
  };

  const closeDocument = () => {
    // Reset state
    setDocumentTextState("");
    setDocumentNameState("");
    setCurrentPageState(1);
    setScaleState(1.0);
    setIsDocumentActiveState(false);
    setPdfDataState(null);

    // Clear storage
    sessionStorage.removeItem(STORAGE_KEYS.DOCUMENT_TEXT);
    sessionStorage.removeItem(STORAGE_KEYS.DOCUMENT_NAME);
    sessionStorage.removeItem(STORAGE_KEYS.DOCUMENT_PAGE);
    sessionStorage.removeItem(STORAGE_KEYS.DOCUMENT_SCALE);
    sessionStorage.removeItem(STORAGE_KEYS.DOCUMENT_ACTIVE);
    sessionStorage.removeItem(STORAGE_KEYS.PDF_DATA);
  };

  return (
    <DocumentContext.Provider
      value={{
        documentText,
        documentName,
        currentPage,
        scale,
        isDocumentActive,
        pdfData,
        setDocumentText,
        setDocumentName,
        setCurrentPage,
        setScale,
        setPdfData,
        closeDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
}
