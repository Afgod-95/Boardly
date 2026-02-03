// components/pins/popovers/share/SharePin.tsx
import { Button } from "@/components/ui/button";
import { PinItem } from "@/types/pin";
import { Link2, Facebook, Twitter, MessageCircle, Mail, X } from "lucide-react";

interface SharePinProps {
  pin: PinItem;
  onShare: (method: 'link' | 'facebook' | 'twitter' | 'whatsapp' | 'email') => void;
  onClose: () => void;
}

const SharePin = ({ pin, onShare, onClose }: SharePinProps) => {
  const shareOptions = [
    { id: 'link' as const, icon: Link2, label: 'Copy Link', color: 'bg-gray-100 hover:bg-gray-200' },
    { id: 'facebook' as const, icon: Facebook, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { id: 'twitter' as const, icon: Twitter, label: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600 text-white' },
    { id: 'whatsapp' as const, icon: MessageCircle, label: 'WhatsApp', color: 'bg-green-600 hover:bg-green-700 text-white' },
    { id: 'email' as const, icon: Mail, label: 'Email', color: 'bg-gray-700 hover:bg-gray-800 text-white' },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Share Pin</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {shareOptions.map(({ id, icon: Icon, label, color }) => (
          <Button
            key={id}
            onClick={() => {
              onShare(id);
              if (id !== 'link') onClose();
            }}
            className={`w-full justify-start gap-3 py-6 rounded-xl ${color}`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-semibold">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SharePin;