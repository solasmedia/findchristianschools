import { Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

interface SaveSchoolButtonProps {
  schoolId: number;
  schoolType?: "domestic" | "international";
  className?: string;
  size?: "sm" | "md";
}

export function SaveSchoolButton({ schoolId, schoolType = "domestic", className = "", size = "sm" }: SaveSchoolButtonProps) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const isSavedQuery = trpc.savedSchools.isSaved.useQuery(
    { schoolId, schoolType },
    { enabled: isAuthenticated }
  );

  const saveMutation = trpc.savedSchools.save.useMutation({
    onSuccess: () => {
      utils.savedSchools.isSaved.invalidate({ schoolId, schoolType });
      utils.savedSchools.list.invalidate();
      toast.success("School saved to favorites!");
    },
    onError: () => toast.error("Could not save school"),
  });

  const unsaveMutation = trpc.savedSchools.unsave.useMutation({
    onSuccess: () => {
      utils.savedSchools.isSaved.invalidate({ schoolId, schoolType });
      utils.savedSchools.list.invalidate();
      toast.success("School removed from favorites");
    },
    onError: () => toast.error("Could not remove school"),
  });

  const isSaved = isSavedQuery.data === true;
  const isPending = saveMutation.isPending || unsaveMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast("Join free to save schools", {
        action: { label: "Join Free", onClick: () => { window.location.href = '/signup'; } },
      });
      return;
    }

    if (isSaved) {
      unsaveMutation.mutate({ schoolId, schoolType });
    } else {
      saveMutation.mutate({ schoolId, schoolType });
    }
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "w-8 h-8" : "w-9 h-9";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`${btnSize} rounded-full flex items-center justify-center transition-all ${
        isSaved
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-400"
      } disabled:opacity-50 ${className}`}
      aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
    >
      <Heart className={`${iconSize} ${isSaved ? "fill-current" : ""}`} />
    </button>
  );
}
