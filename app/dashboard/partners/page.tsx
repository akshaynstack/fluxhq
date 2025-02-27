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
  LinkIcon,
  CreditCard,
} from "lucide-react";

interface ActionAvailability {
  available: boolean;
  nextAvailable: string | null;
}

const partnerLinks = [
  {
    id: "partner1",
    name: "Design Tools Pro",
    description: "Get exclusive design resources and templates.",
    url: "https://designtoolspro.com?ref=imagify",
    credits: 3,
    action: "REWARD_PARTNER"
  },
  {
    id: "partner2",
    name: "CreativeMarket",
    description: "Discover premium graphics, fonts, and themes.",
    url: "https://creativemarket.com?ref=imagify",
    credits: 3,
    action: "REWARD_PARTNER"
  },
  {
    id: "partner3",
    name: "AITutorials",
    description: "Learn advanced AI techniques and workflows.",
    url: "https://aitutorials.com?ref=imagify",
    credits: 3,
    action: "REWARD_PARTNER"
  },
  {
    id: "partner4",
    name: "PromptCraft",
    description: "Master the art of writing effective AI prompts.",
    url: "https://promptcraft.com?ref=imagify",
    credits: 3,
    action: "REWARD_PARTNER"
  }
];

export default function PartnersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [credits, setCredits] = useState<number | null>(null);
  const [actionAvailability, setActionAvailability] = useState<Record<string, ActionAvailability>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isVisiting, setIsVisiting] = useState<string | null>(null);

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

  const visitPartner = async (partnerId: string, partnerName: string) => {
    const partner = partnerLinks.find(p => p.id === partnerId);
    if (!partner) return;
    
    setIsVisiting(partnerId);
    
    try {
      // First, open the partner link in a new tab
      window.open(partner.url, '_blank');
      
      // Then, award credits
      const response = await fetch("/api/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: partner.action,
          details: `Visited partner: ${partnerName}`,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - action already performed today
          const nextAvailable = new Date(data.nextAvailable);
          throw new Error(`You've already earned credits from a partner today. Try again ${formatDistanceToNow(nextAvailable, { addSuffix: true })}`);
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
        description: `You earned ${data.added} credits for visiting ${partnerName}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to earn credits",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsVisiting(null);
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
          <h1 className="text-3xl font-bold">Partner Websites</h1>
          <p className="text-muted-foreground">
            Visit our partner websites to earn credits and discover valuable resources.
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
            <p className="text-muted-foreground">Loading partner information...</p>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Earn credits by visiting our partner websites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Visit any partner website to earn 3 credits</li>
                    <li>You can earn partner credits once per day</li>
                    <li>Explore valuable resources from our trusted partners</li>
                    <li>Use earned credits to generate AI images</li>
                  </ul>
                </div>
                {!isActionAvailable("REWARD_PARTNER") && (
                  <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-lg">
                    <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>You've already earned partner credits today. You can earn more {getActionTimeRemaining("REWARD_PARTNER")}.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnerLinks.map((partner) => (
                <Card key={partner.id}>
                  <CardHeader>
                    <CardTitle>{partner.name}</CardTitle>
                    <CardDescription>{partner.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <CreditCard className="h-4 w-4 mr-1 text-primary" />
                        <span>Earn {partner.credits} credits</span>
                      </div>
                      <Button 
                        onClick={() => visitPartner(partner.id, partner.name)}
                        disabled={isVisiting === partner.id || !isActionAvailable("REWARD_PARTNER")}
                        className="gap-2"
                      >
                        {isVisiting === partner.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Visiting...
                          </>
                        ) : !isActionAvailable("REWARD_PARTNER") ? (
                          <>
                            <ExternalLink className="h-4 w-4" />
                            Already Claimed Today
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-4 w-4" />
                            Visit & Earn
                          </>
                        )}
                      </Button>
                    </div>
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