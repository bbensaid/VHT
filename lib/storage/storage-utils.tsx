/**
 * Utility functions for managing document storage
 */

// Define consistent storage keys
export const STORAGE_KEYS = {
  DOCUMENT_STATE: "vt-healthcare-document-state",
  PDF_DATA: "vt-healthcare-pdf-data",
  PDF_FILE: "vt-healthcare-pdf-file",
  DOCUMENT_TEXT: "vt-healthcare-document-text",
  DOCUMENT_NAME: "vt-healthcare-document-name",
  DOCUMENT_PAGE: "vt-healthcare-document-page",
  DOCUMENT_SCALE: "vt-healthcare-document-scale",
  DOCUMENT_TYPE: "vt-healthcare-document-type",

  // Legacy keys (for cleanup)
  LEGACY_DOCUMENT_STATE: "vt-document-state",
  LEGACY_PDF_DATA: "vt-pdf-data",
  LEGACY_PDF_FILE: "vt-pdf-file",
};

/**
 * Clear all document-related storage items
 */
export function clearDocumentStorage() {
  // Clear current storage keys
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });

  // Dispatch a storage event to notify components
  window.dispatchEvent(new Event("storage"));
}

/**
 * Save document state to localStorage
 */
export function saveDocumentState(state: any) {
  try {
    // Save to combined state object
    localStorage.setItem(
      STORAGE_KEYS.DOCUMENT_STATE,
      JSON.stringify({
        ...state,
        timestamp: new Date().toISOString(),
      })
    );

    // Save to individual keys for backward compatibility
    if (state.documentText) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENT_TEXT, state.documentText);
    }

    if (state.documentName) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENT_NAME, state.documentName);
    }

    if (state.currentPage) {
      localStorage.setItem(
        STORAGE_KEYS.DOCUMENT_PAGE,
        state.currentPage.toString()
      );
    }

    if (state.scale) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENT_SCALE, state.scale.toString());
    }

    // Dispatch a storage event to notify components
    window.dispatchEvent(new Event("storage"));

    return true;
  } catch (error) {
    console.error("Error saving document state:", error);
    return false;
  }
}

/**
 * Load document state from localStorage
 */
export function loadDocumentState() {
  try {
    // First try the combined state object
    const stateStr = localStorage.getItem(STORAGE_KEYS.DOCUMENT_STATE);

    if (stateStr) {
      return JSON.parse(stateStr);
    }

    // If not found, try the individual keys
    const docName = localStorage.getItem(STORAGE_KEYS.DOCUMENT_NAME);

    if (docName) {
      return {
        documentName: docName,
        documentText: localStorage.getItem(STORAGE_KEYS.DOCUMENT_TEXT) || "",
        currentPage: Number.parseInt(
          localStorage.getItem(STORAGE_KEYS.DOCUMENT_PAGE) || "1",
          10
        ),
        scale: Number.parseFloat(
          localStorage.getItem(STORAGE_KEYS.DOCUMENT_SCALE) || "1.0"
        ),
        documentType: localStorage.getItem(STORAGE_KEYS.DOCUMENT_TYPE) || "pdf",
      };
    }

    // Try legacy keys as a last resort
    const legacyStateStr = localStorage.getItem(
      STORAGE_KEYS.LEGACY_DOCUMENT_STATE
    );

    if (legacyStateStr) {
      const legacyState = JSON.parse(legacyStateStr);

      // Migrate legacy state to new format
      saveDocumentState(legacyState);

      return legacyState;
    }

    return null;
  } catch (error) {
    console.error("Error loading document state:", error);
    return null;
  }
}
