import { useState } from "react";
import Header from "@/components/Header";
import PollCard from "@/components/PollCard";
import CreatePoll from "@/components/CreatePoll";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    question: "Which blockchain should we integrate next for our DeFi protocol?",
    options: [
      { id: "1a", text: "Arbitrum", votes: 45 },
      { id: "1b", text: "Polygon", votes: 32 },
      { id: "1c", text: "Optimism", votes: 28 },
      { id: "1d", text: "Base", votes: 19 }
    ],
    isActive: false,
    totalVotes: 124,
    timeLeft: "Closed",
    creator: "0x742d35Cc6ab"
  },
  {
    id: "2", 
    question: "What's the most important feature for privacy-focused social media?",
    options: [
      { id: "2a", text: "End-to-end encryption" },
      { id: "2b", text: "Anonymous posting" },
      { id: "2c", text: "Decentralized moderation" },
      { id: "2d", text: "Zero-knowledge proofs" }
    ],
    isActive: true,
    totalVotes: 67,
    timeLeft: "18h left",
    creator: "0x9f2b5eA8c1d"
  },
  {
    id: "3",
    question: "Best programming language for Web3 development in 2024?",
    options: [
      { id: "3a", text: "Solidity" },
      { id: "3b", text: "Rust" },  
      { id: "3c", text: "Move" },
      { id: "3d", text: "Cairo" }
    ],
    isActive: true,
    totalVotes: 89,
    timeLeft: "2d left",
    creator: "0x1a4f7c9e8b2"
  }
];

const Index = () => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"active" | "closed">("active");

  const activePolls = mockPolls.filter(poll => poll.isActive);
  const closedPolls = mockPolls.filter(poll => !poll.isActive);
  const displayPolls = selectedTab === "active" ? activePolls : closedPolls;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Anonymous Polling Powered by FHE
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vote without revealing preferences until polls close. No herd behavior, just authentic opinions.
            </p>
          </div>

          {/* Create Poll Section */}
          {showCreatePoll && (
            <div className="mb-8">
              <CreatePoll />
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreatePoll(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant={selectedTab === "active" ? "default" : "outline"}
                onClick={() => setSelectedTab("active")}
                className="bg-primary/20 border-primary/30 hover:bg-primary/30"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Active Polls ({activePolls.length})
              </Button>
              <Button
                variant={selectedTab === "closed" ? "default" : "outline"}
                onClick={() => setSelectedTab("closed")}
                className="bg-secondary/20 border-secondary/30"
              >
                Closed Polls ({closedPolls.length})
              </Button>
            </div>
            
            {!showCreatePoll && (
              <Button 
                onClick={() => setShowCreatePoll(true)}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </Button>
            )}
          </div>

          {/* Polls Feed */}
          <div className="space-y-6">
            {displayPolls.length > 0 ? (
              displayPolls.map((poll) => (
                <PollCard 
                  key={poll.id} 
                  poll={poll}
                  hasVoted={Math.random() > 0.5}
                  selectedOption={Math.random() > 0.7 ? poll.options[0].id : undefined}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">No {selectedTab} polls found</p>
                  <p className="text-sm">
                    {selectedTab === "active" 
                      ? "Create the first encrypted poll to get started!" 
                      : "Closed polls will appear here once voting ends."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
