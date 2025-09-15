import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePollContract } from "@/hooks/usePollContract";
import { useAccount } from "wagmi";
import { toast } from "sonner";

interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  totalVotes: number;
  timeLeft: string;
  creator: string;
}

interface PollCardProps {
  poll: Poll;
  hasVoted?: boolean;
  selectedOption?: string;
}

const PollCard = ({ poll, hasVoted = false, selectedOption }: PollCardProps) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { castVote } = usePollContract();

  const handleVote = async (optionId: string) => {
    if (hasVoted || !isConnected) {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
      }
      return;
    }

    setIsVoting(true);
    
    try {
      // Find the option index
      const optionIndex = poll.options.findIndex(option => option.id === optionId);
      if (optionIndex === -1) {
        throw new Error("Invalid option");
      }

      // In a real implementation, you would encrypt the option index using FHE
      // For now, we'll use a placeholder
      const encryptedOptionIndex = new Uint8Array(32); // Placeholder for encrypted data
      const inputProof = new Uint8Array(32); // Placeholder for proof
      
      const result = await castVote.writeContractAsync({
        address: import.meta.env.VITE_POLL_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
        abi: [
          {
            "inputs": [
              {"internalType": "uint256", "name": "_pollId", "type": "uint256"},
              {"internalType": "bytes", "name": "_optionIndex", "type": "bytes"},
              {"internalType": "bytes", "name": "_inputProof", "type": "bytes"}
            ],
            "name": "castVote",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'castVote',
        args: [BigInt(poll.id), encryptedOptionIndex, inputProof]
      });
      
      toast.success("Vote cast successfully!");
      console.log("Vote cast:", result);
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error("Failed to cast vote");
    } finally {
      setIsVoting(false);
    }
  };

  const getVotePercentage = (votes: number) => {
    return poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0;
  };

  return (
    <Card className="bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {poll.question}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{poll.totalVotes} votes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{poll.timeLeft}</span>
              </div>
              <span className="text-xs">by {poll.creator}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {poll.isActive ? (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                <Lock className="h-3 w-3 mr-1" />
                Encrypting
              </Badge>
            ) : (
              <Badge variant="outline" className="border-crypto-cyan/30 text-crypto-cyan">
                <CheckCircle className="h-3 w-3 mr-1" />
                Revealed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {poll.options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "relative group cursor-pointer",
              hasVoted && "cursor-default"
            )}
            onMouseEnter={() => !hasVoted && setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleVote(option.id)}
          >
            <Button
              variant={selectedOption === option.id ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left h-auto p-4 transition-all duration-300",
                hoveredOption === option.id && !hasVoted && !isVoting && "border-primary shadow-glow/50",
                selectedOption === option.id && "bg-primary/20 border-primary",
                isVoting && "opacity-50 cursor-not-allowed"
              )}
              disabled={hasVoted || isVoting}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">{option.text}</span>
                {!poll.isActive && option.votes !== undefined && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {option.votes} votes
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      {getVotePercentage(option.votes)}%
                    </span>
                  </div>
                )}
              </div>
            </Button>
            
            {!poll.isActive && option.votes !== undefined && (
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-primary rounded-b-md transition-all duration-500"
                   style={{ width: `${getVotePercentage(option.votes)}%` }} />
            )}
          </div>
        ))}
        
        {poll.isActive && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-primary animate-pulse-glow" />
              <span>Votes are encrypted until poll closes</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PollCard;