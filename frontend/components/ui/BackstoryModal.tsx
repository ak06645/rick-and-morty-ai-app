'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function BackstoryModal({
  open,
  onClose,
  name,
  backstory,
  isCustom,
  onDelete,
  onRegenerate
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  backstory: string;
  isCustom: boolean;
  onDelete?: () => void;
  onRegenerate?: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Backstory for {name}</DialogTitle>
        </DialogHeader>

        <div className="whitespace-pre-wrap text-sm text-gray-700 max-h-[60vh] overflow-y-auto pr-2">
          {backstory}
        </div>

        <DialogFooter className="pt-4 flex justify-between">
          {isCustom ? (
            <Button variant="destructive" onClick={onDelete}>
              Delete Backstory
            </Button>
          ) : (
            <Button variant="default" onClick={onRegenerate}>
              Generate New Backstory
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}