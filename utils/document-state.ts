/**
 * Utility functions for managing document state across components
 */

// Store document text in a way that's accessible to all components
export function storeDocumentText(text: string) {
  if (typeof window === "undefined") return;

  // Store in multiple locations to ensure it's accessible
  try {
    // SessionStorage (primary)
    sessionStorage.setItem("vt-document-text", text);

    // LocalStorage (backup)
    localStorage.setItem("vt-healthcare-document-text", text);

    // Update document state
    const documentState = JSON.parse(
      localStorage.getItem("vt-healthcare-document-state") || "{}"
    );
    documentState.documentText = text;
    localStorage.setItem(
      "vt-healthcare-document-state",
      JSON.stringify(documentState)
    );

    // Dispatch events to notify components
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("documentTextUpdated", { detail: { text } })
    );

    console.log(`Document text stored (${text.length} chars)`);
  } catch (error) {
    console.error("Error storing document text:", error);
  }
}

// Get document text from any available source
export function getDocumentText(): string {
  if (typeof window === "undefined") return "";

  try {
    // Try multiple sources
    const sessionText = sessionStorage.getItem("vt-document-text");
    if (sessionText) return sessionText;

    const localText = localStorage.getItem("vt-healthcare-document-text");
    if (localText) return localText;

    const stateText = JSON.parse(
      localStorage.getItem("vt-healthcare-document-state") || "{}"
    )?.documentText;
    if (stateText) return stateText;

    return "";
  } catch (error) {
    console.error("Error retrieving document text:", error);
    return "";
  }
}
