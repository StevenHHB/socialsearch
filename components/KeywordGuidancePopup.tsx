import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface KeywordGuidancePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeywordGuidancePopup({ isOpen, onClose }: KeywordGuidancePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to Add Effective Keywords</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Adding the right keywords can help you find more relevant leads. Here are some tips:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use competitor alternatives, e.g., "Webflow alternative", "Airtable alternative"</li>
            <li>Include industry-specific terms related to your product</li>
            <li>Add problem-solving phrases your product addresses</li>
            <li>Consider including your product name and variations</li>
          </ul>
          <p>Examples of good keywords:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>"project management software"</li>
            <li>"remote team collaboration"</li>
            <li>"agile workflow tool"</li>
            <li>"[Your Product Name] review"</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}