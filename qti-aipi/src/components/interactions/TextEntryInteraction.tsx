import { useState, ChangeEvent } from 'react';

interface TextEntryInteractionProps {
  id: string;
  prompt: string;
  expectedLength?: number;
  patternMask?: string;
  placeholderText?: string;
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (value: string) => void;
  correctResponses?: string[];
}

export default function TextEntryInteraction({
  id,
  prompt,
  expectedLength,
  patternMask,
  placeholderText = 'Enter your answer',
  mode = 'preview',
  onChange,
  correctResponses = [],
}: TextEntryInteractionProps) {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (patternMask) {
      const pattern = new RegExp(patternMask);
      setIsValid(pattern.test(newValue));
    }

    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="qti-text-entry-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>
      <div className="mt-1">
        <input
          type="text"
          id={`text-entry-${id}`}
          value={value}
          onChange={handleChange}
          maxLength={expectedLength}
          placeholder={placeholderText}
          className={`input-field ${
            !isValid ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
          }`}
          disabled={mode === 'preview'}
        />
        {!isValid && (
          <p className="mt-2 text-sm text-red-600">
            Please enter a valid response matching the required format.
          </p>
        )}
      </div>
      {mode === 'edit' && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Correct Responses:</h4>
          <div className="mt-2 space-y-2">
            {correctResponses.map((response, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-sm text-gray-600"
              >
                <span>•</span>
                <span>{response}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {mode === 'preview' && expectedLength && (
        <p className="mt-2 text-sm text-gray-500">
          Maximum length: {expectedLength} characters
        </p>
      )}
    </div>
  );
} 