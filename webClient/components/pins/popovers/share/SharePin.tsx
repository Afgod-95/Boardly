// components/pins/popovers/share/SharePin.tsx
import { Button } from "@/components/ui/button";
import { PinItem } from "@/types/pin";
import { Link2, Facebook, Twitter, MessageCircle, Mail, X, Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SharePinProps {
  pin: PinItem;
  onShare: (method: 'link' | 'facebook' | 'twitter' | 'whatsapp' | 'email') => void;
}

const SharePin = ({ pin, onShare }: SharePinProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/pin/${pin.id}`;

  const shareOptions = [
    { id: 'whatsapp' as const, icon: MessageCircle, label: 'WhatsApp', bg: 'bg-[#25D366]/10', color: 'text-[#25D366]' },
    { id: 'facebook' as const, icon: Facebook, label: 'Facebook', bg: 'bg-[#1877F2]/10', color: 'text-[#1877F2]' },
    { id: 'twitter' as const, icon: Twitter, label: 'X', bg: 'bg-black/10', color: 'text-black' },
    { id: 'email' as const, icon: Mail, label: 'Email', bg: 'bg-gray-100', color: 'text-gray-600' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onShare('link');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-xl font-bold tracking-tight">Send this Pin</h2>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 hover:bg-secondary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Horizontal Scroll / Grid for Socials */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {shareOptions.map(({ id, icon: Icon, label, bg, color }) => (
          <motion.button
            key={id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              onShare(id);
            }}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-14 h-14 rounded-full ${bg} ${color} flex items-center justify-center transition-transform group-hover:shadow-md`}>
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Link Section */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-muted-foreground uppercase px-1">
          Copy Link
        </label>
        <div className="relative flex items-center group">
          <Input
            readOnly
            value={shareUrl}
            className="pr-24 h-12 rounded-2xl bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <div className="absolute right-1">
            <Button
              onClick={handleCopy}
              size="sm"
              className={`rounded-xl h-10 px-4 transition-all ${copied ? 'bg-green-600 hover:bg-green-600' : 'bg-violet-600 hover:bg-violet-700'
                }`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" />
                    <span className="text-xs font-bold">Copied</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="text-xs font-bold">Copy</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-border/50 text-center">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Sharing this Pin will let others see the content and board it belongs to.
        </p>
      </div>
    </div>
  );
};

export default SharePin;