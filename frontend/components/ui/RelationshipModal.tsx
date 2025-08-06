'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function RelationshipModal({
  open,
  onClose,
  relationship,
}: {
  open: boolean;
  onClose: () => void;
  relationship: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>🤝 Suggested Relationship</DialogTitle>
        </DialogHeader>

        <div className="whitespace-pre-wrap text-sm text-gray-800 max-h-[60vh] overflow-y-auto pr-2">
          {relationship}
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}