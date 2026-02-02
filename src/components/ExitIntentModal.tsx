import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EXIT_INTENT_STORAGE_KEY = "exit_intent_shown";

export const ExitIntentModal = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const canSubmit = useMemo(() => {
    return name.trim() && email.trim() && phone.trim();
  }, [name, email, phone]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    const alreadyShown = sessionStorage.getItem(EXIT_INTENT_STORAGE_KEY) === "true";
    if (alreadyShown) return;

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0 && !open) {
        sessionStorage.setItem(EXIT_INTENT_STORAGE_KEY, "true");
        setOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [open]);

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("Please fill in your name, email, and mobile number.");
      return;
    }

    const subject = encodeURIComponent("Let's Connect");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nMobile: ${phone}\n\nI'd like to connect.`
    );
    window.location.href = `mailto:joshuavaz55@gmail.com?subject=${subject}&body=${body}`;
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Before you go</DialogTitle>
          <DialogDescription>
            Share your details and I’ll reach out soon.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="exit-name">Name</Label>
            <Input
              id="exit-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="exit-email">Email</Label>
            <Input
              id="exit-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="exit-phone">Mobile Number</Label>
            <Input
              id="exit-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+91 ..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Not Now
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Let's Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
