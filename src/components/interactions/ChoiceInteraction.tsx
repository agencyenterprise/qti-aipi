import { useState } from 'react';

interface Choice {
  id: string;
  content: string;
  isCorrect?: boolean;
}

interface ChoiceInteractionProps {
  prompt: string;
  choices: Choice[];
  maxChoices?: number;
  minChoices?: number;
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (selectedIds: string[]) => void;
}

export default function ChoiceInteraction({
  prompt,
  choices,
  maxChoices = 1,
  minChoices = 1,
  mode = 'preview',
  onChange,
}: ChoiceInteractionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleChoiceClick = (choiceId: string) => {
    if (mode === 'preview') return;

    let newSelectedIds: string[];
    if (maxChoices === 1) {
      // Single choice mode
      newSelectedIds = [choiceId];
    } else {
      // Multiple choice mode
      if (selectedIds.includes(choiceId)) {
        newSelectedIds = selectedIds.filter(id => id !== choiceId);
      } else {
        if (selectedIds.length < maxChoices) {
          newSelectedIds = [...selectedIds, choiceId];
        } else {
          return; // Max choices reached
        }
      }
    }

    setSelectedIds(newSelectedIds);
    onChange?.(newSelectedIds);
  };

  const isSelected = (choiceId: string) => selectedIds.includes(choiceId);
  const isCorrect = (choice: Choice) => mode === 'preview' && choice.isCorrect;

  return (
    <div className="qti-choice-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>
      <div className="space-y-2">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoiceClick(choice.id)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
              isSelected(choice.id)
                ? 'bg-primary-50 border-primary-500'
                : isCorrect(choice)
                ? 'bg-green-50 border-green-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            disabled={mode === 'preview'}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 h-5 w-5 border rounded-full mr-3 ${
                  isSelected(choice.id)
                    ? 'border-primary-500'
                    : isCorrect(choice)
                    ? 'border-green-500'
                    : 'border-gray-300'
                }`}
              >
                {isSelected(choice.id) && (
                  <div className="h-3 w-3 m-0.5 rounded-full bg-primary-500" />
                )}
                {isCorrect(choice) && !isSelected(choice.id) && (
                  <div className="h-3 w-3 m-0.5 rounded-full bg-green-500" />
                )}
              </div>
              <span className="text-sm text-gray-900">{choice.content}</span>
            </div>
          </button>
        ))}
      </div>
      {mode === 'response' && selectedIds.length < minChoices && (
        <p className="mt-2 text-sm text-red-600">
          Please select at least {minChoices} {minChoices === 1 ? 'choice' : 'choices'}.
        </p>
      )}
    </div>
  );
} 