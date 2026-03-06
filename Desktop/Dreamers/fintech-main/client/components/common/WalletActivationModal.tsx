import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "./GlassCard";
import { Zap, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WalletActivationModal() {
  const {
    isActivationModalOpen,
    setActivationModalOpen,
    setSkippedActivation,
  } = useApp();
  const navigate = useNavigate();

  const handleSkip = () => {
    setSkippedActivation(true);
  };

  const handleActivate = () => {
    // Navigate to a dedicated activation/payment page
    // For now, let's just close the modal, in a real scenario this would go to a payment flow.
    setActivationModalOpen(false);
    navigate("/wallet/deposit"); // Or a specific activation page
  };

  return (
    <Dialog open={isActivationModalOpen} onOpenChange={setActivationModalOpen}>
      <DialogContent
        className="p-0 border-none bg-transparent"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <GlassCard heavy className="p-8">
          <DialogHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Zap className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Activate Your Wallet
            </DialogTitle>
            <DialogDescription className="mt-2 text-muted-foreground">
              A one-time fee of $30 is required to activate your wallet. This
              ensures full access to all trading features, including deposits
              and withdrawals.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-4">
            <ShieldOff className="w-6 h-6 text-amber-500" />
            <p className="text-sm text-amber-200">
              Your wallet is currently inactive. Activation is required for
              any transactions.
            </p>
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSkip}
            >
              Skip For Now
            </Button>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleActivate}
            >
              <Zap className="mr-2 h-4 w-4" />
              Activate Now ($30)
            </Button>
          </DialogFooter>
        </GlassCard>
      </DialogContent>
    </Dialog>
  );
}
