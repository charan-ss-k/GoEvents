import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const CreateEvent: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleCreateEvent = () => {
    toast.success("Event created successfully");
    setShowDialog(false);
  };

  return (
    <div className="bg-background rounded-lg shadow-lg overflow-hidden max-w-sm w-full h-auto">
      <Button onClick={() => setShowDialog(true)}>Create Event</Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="overflow-y-auto max-h-[calc(100vh-4rem)]">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Form fields for creating an event */}
            <input type="text" placeholder="Event Title" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Event Description" className="w-full p-2 border rounded" />
            <input type="date" className="w-full p-2 border rounded" />
            <input type="time" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Location" className="w-full p-2 border rounded" />
            <input type="number" placeholder="Capacity" className="w-full p-2 border rounded" />
            <input type="number" placeholder="Price" className="w-full p-2 border rounded" />
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEvent;
