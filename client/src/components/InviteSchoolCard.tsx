import { Mail, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InviteSchoolCardProps {
  state?: string;
  stateCode?: string;
}

export default function InviteSchoolCard({ state = "your state", stateCode = "XX" }: InviteSchoolCardProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate invite URL with state pre-filled
  const inviteUrl = `${window.location.origin}/submit-school?state=${stateCode}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "List Your School on Find Christian Schools",
          text: `Don't see your school listed? Share this link with your school to get listed on Find Christian Schools.`,
          url: inviteUrl,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#0055A4]/10 to-[#6EBE44]/10 border border-[#0055A4]/20 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#0055A4]/20 flex items-center justify-center flex-shrink-0">
          <Mail className="w-6 h-6 text-[#0055A4]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#002855] mb-1">Don't see your school listed?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Share this link with your school to invite them to list on Find Christian Schools<span className="trademark">™</span>. It's quick, easy, and helps families find faith-based education.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleShare}
              className="bg-[#0055A4] hover:bg-[#002855] text-white border-0 text-sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Invite Link
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="border-[#0055A4] text-[#0055A4] hover:bg-blue-50 text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
