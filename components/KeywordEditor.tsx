import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';
import { KeywordGuidancePopup } from './KeywordGuidancePopup';
import { HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Info } from 'lucide-react';

interface KeywordEditorProps {
  keywords: string[];
  onSave: (keywords: string[]) => void;
  onCancel: () => void;
}

export function KeywordEditor({ keywords: initialKeywords, onSave, onCancel }: KeywordEditorProps) {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setShowWarning(keywords.length >= 5);
  }, [keywords]);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && keywords.length < 5) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Keyword Tips</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use "[Competitor] + alternative" (e.g., "Airtable alternative")</li>
            <li>Include problem-specific phrases (e.g., "streamline project management")</li>
            <li>Add industry + solution (e.g., "healthcare scheduling software")</li>
            <li>Use location-based terms for local services (e.g., "NYC web design")</li>
            <li>Incorporate current trends or pain points in your industry</li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <div key={index} className="flex items-center bg-muted rounded-full px-3 py-1">
            <span>{keyword}</span>
            <Button
              size="sm"
              variant="ghost"
              className="ml-2 p-0 h-4 w-4"
              onClick={() => handleRemoveKeyword(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      {showWarning && (
        <Alert variant="default">
          <AlertDescription>
            You can have a maximum of 5 keywords. Remove a keyword to add a new one.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex space-x-2">
        <Input
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Add a new keyword"
          onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
          disabled={keywords.length >= 5}
        />
        <Button onClick={handleAddKeyword} disabled={keywords.length >= 5}>Add</Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsGuidanceOpen(true)}
          className="text-muted-foreground"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          Keyword Tips
        </Button>
      </div>
      <Alert variant="default">
        <AlertDescription>
          After saving your keywords, remember to click "Get Newest Leads" to refresh and get leads for your updated keywords.
        </AlertDescription>
      </Alert>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(keywords)} disabled={keywords.length > 5}>Save Keywords</Button>
      </div>
      <KeywordGuidancePopup isOpen={isGuidanceOpen} onClose={() => setIsGuidanceOpen(false)} />
    </div>
  );
}
