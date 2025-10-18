import prisma from "@/lib/database/prisma";
import type { Keyword } from "@prisma/client";

// Initial sample keywords
const initialKeywords = [
  {
    term: "green mountain care board",
    definition:
      "An independent group created by the Vermont Legislature in 2011 to oversee the development of health care policy in Vermont.",
  },
  {
    term: "medicaid",
    definition:
      "A joint federal and state program that helps with medical costs for some people with limited income and resources.",
  },
  {
    term: "healthcare",
    definition:
      "The organized provision of medical care to individuals or a community.",
  },
  {
    term: "reform",
    definition: "To make changes in something in order to improve it.",
  },
  {
    term: "payment models",
    definition: "Methods of paying healthcare providers for services rendered.",
  },
  {
    term: "all-payer model",
    definition:
      "A healthcare payment model that involves all payers (Medicare, Medicaid, commercial) using the same approach to pay providers.",
  },
  {
    term: "blueprint for health",
    definition:
      "Vermont's state-led initiative that works to integrate care across the healthcare spectrum.",
  },
  {
    term: "rural healthcare",
    definition:
      "Healthcare services provided in rural areas, often facing unique challenges of access and resources.",
  },
  {
    term: "telehealth",
    definition:
      "The delivery of health care, health education, and health information services via remote technologies.",
  },
];

/**
 * Service for managing healthcare keywords
 */
export class KeywordService {
  /**
   * Get all keywords
   */
  static async getKeywords(): Promise<Keyword[]> {
    const count = await prisma.keyword.count();

    // Seed initial data if the database is empty
    if (count === 0) {
      await prisma.keyword.createMany({
        data: initialKeywords,
      });
    }

    return prisma.keyword.findMany({
      orderBy: { term: "asc" },
    });
  }

  /**
   * Add a new keyword or update an existing one
   */
  static async addKeyword(term: string, definition: string): Promise<Keyword> {
    // Check if keyword exists
    const existingKeyword = await prisma.keyword.findFirst({
      where: { term: { equals: term, mode: "insensitive" } },
    });

    if (existingKeyword) {
      // Update existing keyword
      return prisma.keyword.update({
        where: { id: existingKeyword.id },
        data: { definition },
      });
    } else {
      // Add new keyword
      return prisma.keyword.create({
        data: { term, definition },
      });
    }
  }

  /**
   * Remove a keyword by ID
   */
  static async removeKeyword(id: string): Promise<void> {
    console.log("KeywordService: Removing keyword with ID:", id);
    try {
      await prisma.keyword.delete({
        where: { id },
      });
      console.log("KeywordService: Keyword deleted successfully");
    } catch (error) {
      console.error("KeywordService: Error deleting keyword:", error);
      throw error;
    }
  }

  /**
   * Get a keyword by ID
   */
  static async getKeywordById(id: string): Promise<Keyword | null> {
    return prisma.keyword.findUnique({
      where: { id },
    });
  }

  /**
   * Import keywords from array
   */
  static async importKeywords(
    keywords: { term: string; definition: string }[]
  ): Promise<Keyword[]> {
    // Use a transaction to handle the import
    return prisma.$transaction(async (tx) => {
      const results: Keyword[] = [];

      for (const { term, definition } of keywords) {
        // Try to find an existing keyword with the same term
        const existing = await tx.keyword.findFirst({
          where: { term: { equals: term, mode: "insensitive" } },
        });

        if (existing) {
          // Update if exists
          const updated = await tx.keyword.update({
            where: { id: existing.id },
            data: { definition },
          });
          results.push(updated);
        } else {
          // Create if doesn't exist
          const created = await tx.keyword.create({
            data: { term, definition },
          });
          results.push(created);
        }
      }

      return results;
    });
  }
}
