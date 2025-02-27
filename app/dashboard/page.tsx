"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Download, Share2, Loader2, CreditCard } from "lucide-react";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required.",
  }),
  model: z.string().default("stable-diffusion-v1-5"),
  size: z.string().default("1024x1024"),
});

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [generatedImage, setGeneratedImage] = useState<{
    id: string;
    url: string;
    prompt: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      model: "Flux Schnell",
      size: "1024x1024",
    },
  });

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch("/api/credits");
        const data = await response.json();
        
        if (response.ok) {
          setCredits(data.credits);
        }
      } catch (error) {
        console.error("Failed to fetch credits:", error);
      } finally {
        setIsLoadingCredits(false);
      }
    }

    fetchCredits();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: values.prompt,
          model: values.model,
          size: values.size,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      // Update credits after successful generation
      const creditsResponse = await fetch("/api/credits");
      const creditsData = await creditsResponse.json();
      if (creditsResponse.ok) {
        setCredits(creditsData.credits);
      }

      setGeneratedImage(data.image);
      toast({
        title: "Image generated!",
        description: "Your image has been successfully generated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fluxhq-${generatedImage.id}.png`;
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

  const shareImage = () => {
    if (!generatedImage) return;
    
    if (navigator.share) {
      navigator.share({
        title: "My AI-generated image",
        text: `Check out this AI image I created with FluxHQ: "${generatedImage.prompt}"`,
        url: generatedImage.url,
      }).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      navigator.clipboard.writeText(generatedImage.url).then(() => {
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
          <h1 className="text-3xl font-bold">Generate Images</h1>
          <p className="text-muted-foreground">
            Create stunning AI-generated images with a simple prompt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="font-medium">Your Credits:</span>
          {isLoadingCredits ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : (
            <Badge variant="outline" className="text-sm font-semibold">
              {credits} credits
            </Badge>
          )}
          <Button 
            variant="link" 
            className="text-sm px-0"
            onClick={() => router.push("/dashboard/credits")}
          >
            Get more credits
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Create an Image</CardTitle>
              <CardDescription>
                Describe what you want to see, and our AI will generate it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A stunning landscape with mountains and a lake at sunset..."
                            className="min-h-[120px]"
                            disabled={isGenerating}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be detailed and specific for better results.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <Select
                            disabled={isGenerating}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Flux Schnell">
                              Flux Schnell
                              </SelectItem>
                              <SelectItem value="Flux Dev">
                              Flux Dev
                              </SelectItem>
                              <SelectItem value="Flux Pro">
                              Flux Pro
                              </SelectItem>
                              <SelectItem value="Flux Pro Ultra">
                              Flux Pro Ultra
                              </SelectItem>
                              <SelectItem value="flux-pixel">
                              Flux Pixel
                              </SelectItem>
                              <SelectItem value="flux-realism">
                              Flux Realism
                              </SelectItem>
                              <SelectItem value="Flux Pro Ultra Raw">
                              Flux Pro Ultra Raw
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <Select
                            disabled={isGenerating}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1024x1024">1024×1024</SelectItem>
                              <SelectItem value="1024x1792">1024×1792</SelectItem>
                              <SelectItem value="1792x1024">1792×1024</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isGenerating || credits === 0}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                  
                  {credits === 0 && (
                    <p className="text-sm text-destructive text-center mt-2">
                      You need credits to generate images.{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        onClick={() => router.push("/dashboard/credits")}
                      >
                        Get more credits
                      </Button>
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
              <CardDescription>
                Your AI-generated image will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Creating your masterpiece...
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                    <img
                      src={generatedImage.url}
                      alt={generatedImage.prompt}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {generatedImage.prompt}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Your generated image will appear here.
                  </p>
                </div>
              )}
            </CardContent>
            {generatedImage && (
              <CardFooter className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadImage}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareImage}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}