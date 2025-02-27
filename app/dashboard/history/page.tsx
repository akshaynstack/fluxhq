"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Download, Share2, Loader2, ImageIcon } from "lucide-react";

interface Image {
  id: string;
  url: string;
  prompt: string;
  size: string;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch("/api/images");
        const data = await response.json();
        
        if (response.ok) {
          setImages(data.images);
        } else {
          throw new Error(data.error || "Failed to fetch images");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your image history.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [toast]);

  const downloadImage = async (image: Image) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fluxhq-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
      });
    }
  };

  const shareImage = (image: Image) => {
    if (navigator.share) {
      navigator.share({
        title: "My AI-generated image",
        text: `Check out this AI image I created with FluxHQ: "${image.prompt}"`,
        url: image.url,
      }).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      navigator.clipboard.writeText(image.url).then(() => {
        toast({
          title: "URL copied!",
          description: "Image URL has been copied to clipboard.",
        });
      });
    }
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Image History</h1>
          <p className="text-muted-foreground">
            View all your previously generated images.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading your images...</p>
          </div>
        ) : images.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You haven't generated any images yet.</p>
            <Button onClick={() => router.push("/dashboard")}>
              Generate Your First Image
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm line-clamp-2 mb-2">{image.prompt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{image.size}</span>
                    <span>{format(new Date(image.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="p-4 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadImage(image)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareImage(image)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}