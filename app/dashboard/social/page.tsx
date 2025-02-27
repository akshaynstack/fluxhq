"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ExternalLink,
  Clock,
  Loader2,
  ThumbsUp,
  Youtube,
  Bell,
  CreditCard,
} from "lucide-react";

interface ActionAvailability {
  available: boolean;
  nextAvailable: string | null;
}

const socialActions = [
  {
    id: "youtube",
    name: "Watch Tutorial Video",
    description: "Learn how to create amazing AI images with our tutorial.",
    url: "https://youtube.com/watch?v=imagify-tutorial",
    credits: 2,
    action: "REWARD_VIDEO",
    icon: Youtube
  },
  {
    id: "subscribe",
    name: "Subscribe to Newsletter",
    description: "Get the latest AI image generation tips and updates.",
    url: "https://imagify.com/newsletter",
    credits: 5,
    action: "REWARD_SUBSCRIBE",
    icon: Bell
  },
  {
    id: "like",
    name: "Like Our Social Post",
    description: "Support us by liking our latest post on social media.",
    url: "https://twitter.com/imagify/status/latest",
    credits: 1,
    action: "REWARD_LIKE",
    icon: ThumbsUp
  }
];

export default function SocialPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [credits, setCredits] = useState<number | null>(null);
  const [actionAvailability, setActionAvailability] = useState<Record<string, ActionAvailability>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPerforming, setIsPerforming] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch("/api/credits");
        const data = await response.json();
        
        if (response.ok) {
          setCredits(data.credits);
          setActionAvailability(data.actionAvailability || {});
        } else {
          throw new Error(data.error || "Failed to fetch credits");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your credit information.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCredits();
  }, [toast]);

  const performAction = async (actionId: string) => {
    const action = socialActions.find(a => a.id === actionId);
    if (!action) return;
    
    setIsPerforming(actionId);
    
    try {
      // First, open the link in a new tab
      window.open(action.url, '_blank');
      
      // Then, award credits
      const response = await fetch("/api/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action.action,
          details: `Performed action: ${action.name}`,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - action already performed today
          const nextAvailable = new Date(data.nextAvailable);
          throw new Error(`You've already performed this action today. Try again ${formatDistanceToNow(nextAvailable, { addSuffix: true })}`);
        }
        throw new Error(data.error || "Failed to earn credits");
      }
      
      setCredits(data.credits);
      
      // Refresh availability
      const txResponse = await fetch("/api/credits");
      const txData = await txResponse.json();
      if (txResponse.ok) {
        setActionAvailability(txData.actionAvailability || {});
      }
      
      toast({
        title: "Credits earned!",
        description: `You earned ${data.added} credits for ${action.name.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to earn credits",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsPerforming(null);
    }
  };

  const isActionAvailable = (action: string) => {
    return actionAvailability[action]?.available !== false;
  };

  const getActionTimeRemaining = (action: string) => {
    const nextAvailable = actionAvailability[action]?.nextAvailable;
    if (!nextAvailable) return null;
    
    return formatDistanceToNow(new Date(nextAvailable), { addSuffix: true });
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Social Rewards</h1>
          <p className="text-muted-foreground">
            Earn credits by engaging with our content on social media and other platforms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="font-medium">Your Credits:</span>
          {isLoading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : (
            <span className="font-semibold">{credits} credits</span>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading social actions...</p>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Earn credits by engaging with our content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Watch tutorials, subscribe to our newsletter, or like our posts</li>
                    <li>Each action can be performed once per day</li>
                    <li>Different actions award different amounts of credits</li>
                    <li>Use earned credits to generate AI images</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialActions.map((action) => (
                <Card key={action.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{action.name}</CardTitle>
                        <CardDescription className="mt-1">{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center text-sm mb-4">
                      <CreditCard className="h-4 w-4 mr-1 text-primary" />
                      <span>Earn {action.credits} credits</span>
                    </div>
                    
                    {!isActionAvailable(action.action) && (
                      <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Available {getActionTimeRemaining(action.action)}</span>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => performAction(action.id)}
                      disabled={isPerforming === action.id || !isActionAvailable(action.action)}
                      className="w-full gap-2"
                    >
                      {isPerforming === action.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : !isActionAvailable(action.action) ? (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          Already Claimed Today
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          {action.id === "youtube" ? "Watch & Earn" : 
                           action.id === "subscribe" ? "Subscribe & Earn" : 
                           "Like & Earn"}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
