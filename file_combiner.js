import fs from "fs/promises";
import path from "path";

// Configuration
const outputFileName = "combined_output.txt";

// ONLY these directories and files will be processed
const includeList = [
  // Examples:
  // "src",                  // Include the entire src directory
  // "config/settings.json", // Include a specific file
  // "docs/api",             // Include a specific subdirectory
  "app",
  "components",
  "contexts",
  "hooks",
  "lib",
  "prisma",
  "public",
  "services",
  "styles",
];

// These directories will be excluded even if they are within included directories
const excludeList = [
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "components/ui",
  "ui",

  // Add any other directories you want to exclude
];

// List of text-based file extensions to include
const textFileExtensions = [
  // Code files
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".html",

  ".txt",
  ".csv",
  ".log",
  ".sql",
];

async function combineFiles(folderPath) {
  try {
    // Create or clear the output file
    await fs.writeFile(outputFileName, "");

    console.log(`Starting to combine files from: ${folderPath}`);

    if (includeList.length === 0) {
      console.log(
        "WARNING: Include list is empty. No files will be processed."
      );
      console.log(
        "Add directories or files to the includeList array in the script."
      );
      return;
    }

    console.log(
      `ONLY including these directories/files: ${includeList.join(", ")}`
    );
    console.log(`Excluding these directories: ${excludeList.join(", ")}`);

    // Process the root directory
    await processDirectory(folderPath);

    console.log(`\nAll files combined successfully into: ${outputFileName}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function isExcluded(itemPath) {
  // Get the directory name
  const dirName = path.basename(itemPath);

  // Check if this directory is in the exclude list
  if (excludeList.includes(dirName)) {
    console.log(`Excluding (in exclude list): ${itemPath}`);
    return true;
  }

  // Not in the exclude list
  return false;
}

async function shouldProcess(itemPath) {
  // First check if it's excluded
  if (await isExcluded(itemPath)) {
    return false;
  }

  // Get the relative path from the current working directory
  const relativePath = path.relative(process.cwd(), itemPath);

  // Check if this path or any of its parent directories are in the include list
  for (const includePath of includeList) {
    // Case 1: This exact path is in the include list
    if (relativePath === includePath) {
      console.log(`Including (exact match): ${itemPath}`);
      return true;
    }

    // Case 2: This path is a subdirectory/file of an included directory
    if (relativePath.startsWith(includePath + path.sep)) {
      console.log(`Including (child of included directory): ${itemPath}`);
      return true;
    }

    // Case 3: This path is a parent directory of an included path
    if (includePath.startsWith(relativePath + path.sep)) {
      console.log(`Including (parent of included path): ${itemPath}`);
      return true;
    }
  }

  // Not in the include list, so skip it
  return false;
}

async function processDirectory(directoryPath) {
  try {
    // For the root directory, always process it
    const isRootDir = directoryPath === process.cwd() || directoryPath === ".";

    // For non-root directories, check if we should process them
    if (!isRootDir && !(await shouldProcess(directoryPath))) {
      console.log(
        `Skipping directory (not in include list or excluded): ${directoryPath}`
      );
      return;
    }

    // Read all files and directories in the current directory
    const items = await fs.readdir(directoryPath);

    for (const item of items) {
      const itemPath = path.join(directoryPath, item);
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        // If it's a directory, process it recursively (unless excluded)
        if (!(await isExcluded(itemPath))) {
          await processDirectory(itemPath);
        }
      } else {
        // If it's a file, check if it's in the include list and a text file
        if (await shouldProcess(itemPath)) {
          await appendFileContent(itemPath);
        } else {
          console.log(
            `Skipping file (not in include list or excluded): ${itemPath}`
          );
        }
      }
    }
  } catch (error) {
    console.error(
      `Error processing directory ${directoryPath}:`,
      error.message
    );
  }
}

async function appendFileContent(filePath) {
  try {
    // Skip the output file itself to avoid infinite growth
    if (path.basename(filePath) === outputFileName) {
      return;
    }

    // Check if the file is a text file based on its extension
    const extension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    // Include files with extensions in our list or files without extensions that might be config files
    const isTextFile =
      textFileExtensions.includes(extension) ||
      (extension === "" && !fileName.includes("."));

    if (!isTextFile) {
      console.log(`Skipping non-text file: ${filePath}`);
      return;
    }

    // Read the file content
    let content;
    try {
      content = await fs.readFile(filePath, "utf8");

      // Additional check: if the file contains null bytes, it's likely binary
      if (content.includes("\0")) {
        console.log(`Skipping binary file (contains null bytes): ${filePath}`);
        return;
      }
    } catch (readError) {
      console.log(`Skipping unreadable file: ${filePath}`);
      return;
    }

    // Create the header with the file path
    const header = `\n\n==== ${filePath} ====\n\n`;

    // Append the header and content to the output file
    await fs.appendFile(outputFileName, header + content);
    console.log(`Added: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

// Get the folder path from command line arguments
const folderPath = process.argv[2] || ".";

combineFiles(folderPath);
