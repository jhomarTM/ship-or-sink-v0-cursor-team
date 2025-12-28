"use client";

import { use } from "react";
import Link from "next/link";
import { useBook, useBookStatus } from "@/lib/queries";
import { ChapterReader } from "@/components/chapter-reader";
import { ProcessingStatus } from "@/components/processing-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useBook(id);
  useBookStatus(id, data?.book.status !== "completed");

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <nav className="flex items-center justify-between p-6 max-w-5xl mx-auto border-b border-border">
          <Link href="/" className="text-xl font-bold text-primary">
            Visualize Books
          </Link>
        </nav>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="space-y-8">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen">
        <nav className="flex items-center justify-between p-6 max-w-5xl mx-auto border-b border-border">
          <Link href="/" className="text-xl font-bold text-primary">
            Visualize Books
          </Link>
        </nav>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Book not found</h1>
              <p className="text-muted-foreground mb-6">
                The book you&apos;re looking for doesn&apos;t exist or was deleted.
              </p>
              <Button asChild>
                <Link href="/library">Go to Library</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { book, chapters } = data;
  const isProcessing = book.status === "pending" || book.status === "processing";

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between p-6 max-w-5xl mx-auto border-b border-border">
        <Link href="/" className="text-xl font-bold text-primary">
          Visualize Books
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/library">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </Button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-muted-foreground">
            {book.totalChapters > 0
              ? `${book.totalChapters} chapter${book.totalChapters !== 1 ? "s" : ""}`
              : "Processing..."}
          </p>
        </div>

        {isProcessing && <ProcessingStatus bookId={id} />}

        {chapters.length > 0 ? (
          <ChapterReader chapters={chapters} />
        ) : (
          !isProcessing && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No chapters found in this book.</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </main>
  );
}
