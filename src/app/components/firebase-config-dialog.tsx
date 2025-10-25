'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FirebaseConfigDialogProps {
  children: React.ReactNode;
  dbUrl: string | null;
  setDbUrl: (url: string) => void;
}

export function FirebaseConfigDialog({ children, dbUrl, setDbUrl }: FirebaseConfigDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(dbUrl || '');

  useEffect(() => {
    if (dbUrl) {
      setUrlInput(dbUrl);
    }
  }, [dbUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput && urlInput.startsWith('https://')) {
      setDbUrl(urlInput);
      setIsOpen(false);
    } else {
      alert('Please enter a valid Firebase Realtime Database URL (starting with https://).');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Firebase Connection</DialogTitle>
          <DialogDescription>
            Enter your Firebase Realtime Database URL to connect and start receiving sensor data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="db-url" className="text-right">
                Database URL
              </Label>
              <Input
                id="db-url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="col-span-3"
                placeholder="https://your-project-id.firebaseio.com"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
