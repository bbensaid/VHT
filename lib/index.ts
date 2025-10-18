// Barrel exports for lib utilities
// This provides a single entry point for all utility functions

// Database
export { default as prisma } from "./database/prisma";

// UI utilities
export { cn } from "./ui/utils";

// Storage utilities
export * from "./storage/document-state";
export * from "./storage/storage-utils";
