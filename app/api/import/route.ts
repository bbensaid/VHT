import { type NextRequest, NextResponse } from "next/server";
import { KeywordService } from "@/services/keyword-service";
import Papa from "papaparse";
import * as ExcelJS from "exceljs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(
      `Processing file: ${file.name} (${file.type}, ${file.size} bytes)`
    );

    // Check file type
    const isCSV = file.name.toLowerCase().endsWith(".csv");
    const isExcel =
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls");

    if (!isCSV && !isExcel) {
      return NextResponse.json(
        {
          error: "Unsupported file format. Please upload a CSV or Excel file.",
        },
        { status: 400 }
      );
    }

    let keywords: { term: string; definition: string }[] = [];

    // Process based on file type
    if (isCSV) {
      // Handle CSV files with PapaParse
      const fileContent = await file.text();

      const parseResult = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.toLowerCase().trim(),
      });

      if (parseResult.errors && parseResult.errors.length > 0) {
        console.error("CSV parse errors:", parseResult.errors);
        return NextResponse.json(
          {
            error: "Failed to parse CSV file",
            details: parseResult.errors[0].message,
          },
          { status: 400 }
        );
      }

      // Map CSV records to keywords
      keywords = mapRecordsToKeywords(
        parseResult.data as Record<string, any>[]
      );
    } else {
      // Handle Excel files with ExcelJS
      try {
        const buffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        // Get the first worksheet
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
          return NextResponse.json(
            { error: "Excel file contains no worksheets" },
            { status: 400 }
          );
        }

        // Extract headers and data
        const records: Record<string, any>[] = [];
        const headers: string[] = [];

        // Get headers from first row
        worksheet.getRow(1).eachCell((cell, colNumber) => {
          if (cell.value) {
            const headerValue = cell.value.toString().toLowerCase().trim();
            headers[colNumber] = headerValue;
          }
        });

        // Process data rows
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            // Skip header row
            const record: Record<string, any> = {};
            row.eachCell((cell, colNumber) => {
              if (headers[colNumber]) {
                record[headers[colNumber]] = cell.value
                  ? cell.value.toString()
                  : "";
              }
            });
            if (Object.keys(record).length > 0) {
              records.push(record);
            }
          }
        });

        // Map Excel records to keywords
        keywords = mapRecordsToKeywords(records);
      } catch (excelError) {
        console.error("Excel processing error:", excelError);
        return NextResponse.json(
          {
            error: "Failed to process Excel file",
            details:
              excelError instanceof Error
                ? excelError.message
                : String(excelError),
          },
          { status: 400 }
        );
      }
    }

    // Validate keywords
    const validKeywords = keywords.filter(
      (k) =>
        k.term &&
        k.term.trim() !== "" &&
        k.definition &&
        k.definition.trim() !== ""
    );

    if (validKeywords.length === 0) {
      return NextResponse.json(
        {
          error:
            "No valid keywords found in the file. Each keyword must have a term and definition.",
        },
        { status: 400 }
      );
    }

    console.log(`Found ${validKeywords.length} valid keywords to import`);

    // Import keywords using the service
    const importedKeywords = await KeywordService.importKeywords(validKeywords);

    return NextResponse.json({
      success: true,
      count: importedKeywords.length,
      message: `Successfully imported ${importedKeywords.length} keywords`,
    });
  } catch (error) {
    console.error("Error processing file import:", error);
    return NextResponse.json(
      {
        error: "Failed to process file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Maps records from various formats to keyword objects
 */
function mapRecordsToKeywords(
  records: Record<string, any>[]
): { term: string; definition: string }[] {
  return records.map((record) => {
    // Try different possible column names for term
    let term = "";
    for (const possibleKey of ["term", "keyword", "name", "title", "key"]) {
      if (record[possibleKey] !== undefined && record[possibleKey] !== null) {
        term = String(record[possibleKey]).trim();
        break;
      }
    }

    // Try different possible column names for definition
    let definition = "";
    for (const possibleKey of [
      "definition",
      "description",
      "content",
      "value",
      "desc",
      "meaning",
    ]) {
      if (record[possibleKey] !== undefined && record[possibleKey] !== null) {
        definition = String(record[possibleKey]).trim();
        break;
      }
    }

    return { term, definition };
  });
}
