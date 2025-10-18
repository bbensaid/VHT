import prisma from "@/lib/database/prisma";
import type { Comment } from "@prisma/client";

// Initial sample comments
const initialComments = [
  {
    content: "This section on payment reform is particularly interesting.",
    documentName: "Vermont Healthcare Reform Act 2023",
    documentPage: 12,
    author: "Jane Smith",
  },
  {
    content:
      "The implications for rural healthcare providers should be examined more closely.",
    documentName: "Vermont Healthcare Reform Act 2023",
    documentPage: 15,
    author: "John Doe",
  },
];

/**
 * Service for managing document comments
 */
export class CommentService {
  /**
   * Get comments, optionally filtered by document name and page
   */
  static async getComments(
    documentName?: string,
    documentPage?: number
  ): Promise<Comment[]> {
    const count = await prisma.comment.count();

    // Seed initial data if the database is empty
    if (count === 0) {
      await prisma.comment.createMany({
        data: initialComments,
      });
    }

    // Build the query based on filters
    const where: any = {};

    if (documentName) {
      where.documentName = documentName;

      if (documentPage !== undefined) {
        where.documentPage = documentPage;
      }
    }

    return prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Add a new comment
   */
  static async addComment(
    content: string,
    documentName: string,
    documentPage: number,
    author: string
  ): Promise<Comment> {
    return prisma.comment.create({
      data: {
        content,
        documentName,
        documentPage,
        author,
      },
    });
  }

  /**
   * Remove a comment by ID
   */
  static async removeComment(id: string): Promise<void> {
    await prisma.comment.delete({
      where: { id },
    });
  }

  /**
   * Get a comment by ID
   */
  static async getCommentById(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { id },
    });
  }
}
