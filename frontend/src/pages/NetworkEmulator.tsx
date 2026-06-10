import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const NetworkEmulator = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [serverIP, setServerIP] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold text-foreground mb-6">
          Network Emulator
        </h1>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between font-semibold mb-4"
            >
              Configuration Settings
              <span className="ml-2">{isOpen ? "−" : "+"}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Server IP Address
              </label>
              <Input
                type="text"
                placeholder="Enter server IP address"
                value={serverIP}
                onChange={(e) => setServerIP(e.target.value)}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default NetworkEmulator;
