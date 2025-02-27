"use client";

import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Loader2,
  Youtube,
  ThumbsUp,
  Link as LinkIcon,
  Bell,
  Clock,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  details: string;
  createdAt: string;
}

interface ActionAvailability {
  available: boolean;
  nextAvailable: string | null;
}

export default function CreditsPage() {
  const { toast } = useToast();
  const [credits, setCredits] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [actionAvailability, setActionAvailability] = useState<Record<string, ActionAvailability>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEarning, setIsEarning] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch("/api/credits");
        const data = await response.json();
        
        if (response.ok) {
          setCredits(data.credits);
          setTransactions(data.transactions);
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

  const earnCredits = async (action: string) => {
    setIsEarning(action);
    
    try {
      const response = await fetch("/api/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          details: getActionDetails(action),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - action already performed today
          const nextAvailable = new Date(data.nextAvailable);
          throw new Error(`You can only perform this action once per day. Available again ${formatDistanceToNow(nextAvailable, { addSuffix: true })}`);
        }
        throw new Error(data.error || "Failed to earn credits");
      }
      
      setCredits(data.credits);
      
      // Refresh transactions and availability
      const txResponse = await fetch("/api/credits");
      const txData = await txResponse.json();
      if (txResponse.ok) {
        setTransactions(txData.transactions);
        setActionAvailability(txData.actionAvailability || {});
      }
      
      toast({
        title: "Credits earned!",
        description: `You earned ${data.added} credits.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to earn credits",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsEarning(null);
    }
  };

  const getActionDetails = (action: string) => {
    switch (action) {
      case "REWARD_VIDEO":
        return "Watched tutorial video";
      case "REWARD_SUBSCRIBE":
        return "Subscribed to newsletter";
      case "REWARD_LIKE":
        return "Liked social media post";
      case "REWARD_PARTNER":
        return "Visited partner website";
      default:
        return action;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "REWARD_VIDEO":
        return <Youtube className="h-4 w-4" />;
      case "REWARD_SUBSCRIBE":
        return <Bell className="h-4 w-4" />;
      case "REWARD_LIKE":
        return <ThumbsUp className="h-4 w-4" />;
      case "REWARD_PARTNER":
        return <LinkIcon className="h-4 w-4" />;
      case "GENERATION":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
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
          <h1 className="text-3xl font-bold">Credits</h1>
          <p className="text-muted-foreground">
            Manage your credits and earn more to generate images.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading your credit information...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Your Balance</CardTitle>
                <CardDescription>
                  Current credit balance and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
                    <CreditCard className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold mb-2">{credits}</h2>
                  <p className="text-muted-foreground">Available Credits</p>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-center p-6">
                <Button onClick={() => window.open("https://fluxhq.com/pricing", "_blank")}>
                  Purchase More Credits
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Earn Free Credits</CardTitle>
                <CardDescription>
                  Complete these actions to earn more credits (limit once per day per action)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Youtube className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">Watch Tutorial</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Watch our tutorial video to earn 2 credits.
                          </p>
                          {!isActionAvailable("REWARD_VIDEO") ? (
                            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Available {getActionTimeRemaining("REWARD_VIDEO")}</span>
                            </div>
                          ) : null}
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => earnCredits("REWARD_VIDEO")}
                            disabled={isEarning === "REWARD_VIDEO" || !isActionAvailable("REWARD_VIDEO")}
                          >
                            {isEarning === "REWARD_VIDEO" ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : !isActionAvailable("REWARD_VIDEO") ? (
                              "Already Claimed Today"
                            ) : (
                              "Watch & Earn"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">Subscribe</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to our newsletter for 5 credits.
                          </p>
                          {!isActionAvailable("REWARD_SUBSCRIBE") ? (
                            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Available {getActionTimeRemaining("REWARD_SUBSCRIBE")}</span>
                            </div>
                          ) : null}
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => earnCredits("REWARD_SUBSCRIBE")}
                            disabled={isEarning === "REWARD_SUBSCRIBE" || !isActionAvailable("REWARD_SUBSCRIBE")}
                          >
                            {isEarning === "REWARD_SUBSCRIBE" ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : !isActionAvailable("REWARD_SUBSCRIBE") ? (
                              "Already Claimed Today"
                            ) : (
                              "Subscribe & Earn"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <ThumbsUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">Like & Share</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Like our social media post for 1 credit.
                          </p>
                          {!isActionAvailable("REWARD_LIKE") ? (
                            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Available {getActionTimeRemaining("REWARD_LIKE")}</span>
                            </div>
                          ) : null}
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => earnCredits("REWARD_LIKE")}
                            disabled={isEarning === "REWARD_LIKE" || !isActionAvailable("REWARD_LIKE")}
                          >
                            {isEarning === "REWARD_LIKE" ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : !isActionAvailable("REWARD_LIKE") ? (
                              "Already Claimed Today"
                            ) : (
                              "Like & Earn"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <LinkIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">Visit Partner</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Visit our partner website for 3 credits.
                          </p>
                          {!isActionAvailable("REWARD_PARTNER") ? (
                            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Available {getActionTimeRemaining("REWARD_PARTNER")}</span>
                            </div>
                          ) : null}
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => earnCredits("REWARD_PARTNER")}
                            disabled={isEarning === "REWARD_PARTNER" || !isActionAvailable("REWARD_PARTNER")}
                          >
                            {isEarning === "REWARD_PARTNER" ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : !isActionAvailable("REWARD_PARTNER") ? (
                              "Already Claimed Today"
                            ) : (
                              "Visit & Earn"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Recent credit transactions and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No transactions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.amount > 0 ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                          }`}>
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.details}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(transaction.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                        <Badge variant={transaction.amount > 0 ? "outline" : "destructive"} className="ml-auto">
                          {transaction.amount > 0 ? "+" : ""}{transaction.amount} credits
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}