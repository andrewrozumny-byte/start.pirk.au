import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseCSV, parseXLSX } from "@/lib/csv-import";

// POST /api/surgeons/import
// Accepts FormData with a "file" field (CSV or XLSX)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded. Please provide a CSV or XLSX file." },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const isXLSX =
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls");
    const isCSV = fileName.endsWith(".csv");

    if (!isXLSX && !isCSV) {
      return NextResponse.json(
        {
          error:
            "Unsupported file format. Please upload a CSV (.csv) or Excel (.xlsx) file.",
        },
        { status: 400 }
      );
    }

    // Parse the file
    let result;
    if (isXLSX) {
      const buffer = Buffer.from(await file.arrayBuffer());
      result = parseXLSX(buffer);
    } else {
      const text = await file.text();
      result = parseCSV(text);
    }

    if (result.valid.length === 0) {
      return NextResponse.json(
        {
          imported: 0,
          errors: result.errors.length > 0
            ? result.errors
            : [{ row: 0, field: "file", message: "No valid surgeon records found in the file" }],
        },
        { status: 200 }
      );
    }

    // Insert all valid surgeons in a transaction
    let imported = 0;
    const insertErrors: { row: number; field: string; message: string }[] = [
      ...result.errors,
    ];

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < result.valid.length; i++) {
        try {
          await tx.surgeon.create({ data: result.valid[i] });
          imported++;
        } catch (err) {
          insertErrors.push({
            row: i + 1,
            field: "database",
            message: `Failed to insert: ${err instanceof Error ? err.message : String(err)}`,
          });
        }
      }
    });

    return NextResponse.json({
      imported,
      errors: insertErrors,
    });
  } catch (error) {
    console.error("POST /api/surgeons/import error:", error);
    return NextResponse.json(
      {
        error: "Failed to process import",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
