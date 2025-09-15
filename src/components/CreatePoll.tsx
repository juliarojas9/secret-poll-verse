import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePollContract } from "@/hooks/usePollContract";
import { useAccount } from "wagmi";
import { toast } from "sonner";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState("24");
  const [isCreating, setIsCreating] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { createPoll } = usePollContract();

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!question.trim() || options.some(opt => !opt.trim())) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsCreating(true);
    
    try {
      const durationInSeconds = parseInt(duration) * 3600; // Convert hours to seconds
      const validOptions = options.filter(opt => opt.trim());
      
      const result = await createPoll.writeAsync({
        args: [question.trim(), validOptions, BigInt(durationInSeconds)]
      });
      
      toast.success("Poll created successfully!");
      console.log("Poll created:", result);
      
      // Reset form
      setQuestion("");
      setOptions(["", ""]);
      setDuration("24");
    } catch (error) {
      console.error("Error creating poll:", error);
      toast.error("Failed to create poll");
    } finally {
      setIsCreating(false);
    }
  };

  const canCreate = question.trim() && options.every(opt => opt.trim()) && !isCreating;

  return (
    <Card className="bg-gradient-card border border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Create Encrypted Poll</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question" className="text-sm font-medium">
            Poll Question
          </Label>
          <Textarea
            id="question"
            placeholder="What would you like to ask?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[80px] bg-background/50 border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Poll Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="bg-background/50 border-border focus:border-primary focus:ring-primary/20"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeOption(index)}
                disabled={options.length <= 2}
                className={cn(
                  "shrink-0",
                  options.length <= 2 && "opacity-50 cursor-not-allowed"
                )}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {options.length < 6 && (
            <Button
              variant="outline"
              onClick={addOption}
              className="w-full border-dashed border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium">
            Poll Duration (hours)
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="168"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="bg-background/50 border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 animate-pulse-glow" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Fully Homomorphic Encryption</p>
              <p>Your poll will use FHE to keep votes completely private until the poll closes, preventing herd behavior and ensuring authentic responses.</p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCreatePoll}
          disabled={!canCreate}
          className={cn(
            "w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold",
            isCreating && "animate-pulse-glow"
          )}
        >
          {isCreating ? "Creating Encrypted Poll..." : "Create Poll"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreatePoll;