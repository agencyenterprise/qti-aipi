import { useState } from 'react';

interface Choice {
  id: string;
  content: string;
  isCorrect: boolean;
}

interface ChoiceInteractionProps {
  id: string;
  prompt: string;
  choices: Choice[];
  maxChoices?: number;
  minChoices?: number;
  orientation?: 'vertical' | 'horizontal';
  onChange?: (selectedIds: string[]) => void;
  mode?: 'edit' | 'preview' | 'response';
}

export default function ChoiceInteraction({
  id,
  prompt,
  choices,
  maxChoices = 1,
  minChoices = 1,
  orientation = 'vertical',
  onChange,
  mode = 'preview',
}: ChoiceInteractionProps) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const handleChoiceChange = (choiceId: string) => {
    let newSelected: string[];

    if (maxChoices === 1) {
      // Single choice mode
      newSelected = [choiceId];
    } else {
      // Multiple choice mode
      if (selectedChoices.includes(choiceId)) {
        newSelected = selectedChoices.filter(id => id !== choiceId);
      } else {
        if (selectedChoices.length < maxChoices) {
          newSelected = [...selectedChoices, choiceId];
        } else {
          return; // Max choices reached
        }
      }
    }

    setSelectedChoices(newSelected);
    onChange?.(newSelected);
  };

  return (
    <div className="qti-choice-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>
      <div
        className={`space-y-${orientation === 'vertical' ? '4' : '0'} ${
          orientation === 'horizontal' ? 'flex space-x-4' : ''
        }`}
      >
        {choices.map((choice) => (
          <div
            key={choice.id}
            className={`relative flex items-start ${
              orientation === 'horizontal' ? 'flex-col items-center' : ''
            }`}
          >
            <div className="flex items-center h-5">
              <input
                id={`choice-${id}-${choice.id}`}
                type={maxChoices === 1 ? 'radio' : 'checkbox'}
                checked={selectedChoices.includes(choice.id)}
                onChange={() => handleChoiceChange(choice.id)}
                className={`h-4 w-4 ${
                  maxChoices === 1
                    ? 'rounded-full border-gray-300 text-primary-600 focus:ring-primary-500'
                    : 'rounded border-gray-300 text-primary-600 focus:ring-primary-500'
                }`}
                disabled={mode === 'preview'}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={`choice-${id}-${choice.id}`}
                className={`font-medium text-gray-700 ${
                  mode === 'preview' ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {choice.content}
              </label>
            </div>
            {mode === 'edit' && (
              <div className="ml-auto flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {choice.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {mode === 'preview' && (
        <div className="mt-4 text-sm text-gray-500">
          {maxChoices === 1
            ? 'Select one option'
            : `Select between ${minChoices} and ${maxChoices} options`}
        </div>
      )}
    </div>
  );
} 