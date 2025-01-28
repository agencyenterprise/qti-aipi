import { useState, useEffect } from 'react';

interface TextEntryInteractionProps {
  prompt: string;
  correctResponses?: string[];
  expectedLength?: number;
  patternMask?: string;
  placeholderText?: string;
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (value: string) => void;
}

export default function TextEntryInteraction({
  prompt,
  correctResponses = [],
  expectedLength,
  patternMask,
  placeholderText = 'Enter your answer',
  mode = 'preview',
  onChange,
}: TextEntryInteractionProps) {
  const [value, setValue] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (mode === 'preview' && value) {
      const correct = correctResponses.some(
        response => response.toLowerCase() === value.toLowerCase()
      );
      setIsCorrect(correct);
    }
  }, [value, correctResponses, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="qti-text-entry-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={mode === 'preview'}
          placeholder={placeholderText}
          maxLength={expectedLength}
          pattern={patternMask}
          className={`w-full px-4 py-2 border rounded-md shadow-sm ${
            mode === 'preview'
              ? isCorrect === true
                ? 'border-green-500 bg-green-50'
                : isCorrect === false
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
              : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
          }`}
        />
        {mode === 'preview' && value && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3">
            {isCorrect ? (
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
        )}
      </div>
      {mode === 'preview' && value && !isCorrect && (
        <div className="mt-2">
          <p className="text-sm text-red-600">
            Incorrect. The correct {correctResponses.length === 1 ? 'answer is' : 'answers are'}:{' '}
            {correctResponses.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
} 