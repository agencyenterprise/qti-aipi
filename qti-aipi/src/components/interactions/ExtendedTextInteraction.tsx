import { useState, ChangeEvent } from 'react';

interface ExtendedTextInteractionProps {
  id: string;
  prompt: string;
  maxLength?: number;
  minLength?: number;
  expectedLines?: number;
  format?: 'plain' | 'preformatted' | 'xhtml';
  placeholderText?: string;
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (value: string) => void;
  sampleResponse?: string;
  rubric?: Array<{
    score: number;
    description: string;
  }>;
}

export default function ExtendedTextInteraction({
  id,
  prompt,
  maxLength,
  minLength = 0,
  expectedLines = 5,
  format = 'plain',
  placeholderText = 'Enter your response here...',
  mode = 'preview',
  onChange,
  sampleResponse,
  rubric = [],
}: ExtendedTextInteractionProps) {
  const [value, setValue] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setWordCount(newValue.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(newValue.length);
    onChange?.(newValue);
  };

  const isWithinLimits = () => {
    if (maxLength && charCount > maxLength) return false;
    if (minLength && charCount < minLength) return false;
    return true;
  };

  return (
    <div className="qti-extended-text-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>

      <div className="mt-1">
        <textarea
          id={`extended-text-${id}`}
          value={value}
          onChange={handleChange}
          rows={expectedLines}
          placeholder={placeholderText}
          className={`input-field font-mono ${
            !isWithinLimits()
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : ''
          } ${format === 'preformatted' ? 'whitespace-pre' : ''}`}
          disabled={mode === 'preview'}
          maxLength={maxLength}
          style={{ minHeight: `${expectedLines * 1.5}rem` }}
        />

        <div className="mt-2 flex justify-between text-sm text-gray-500">
          <div>
            <span>Words: {wordCount}</span>
            <span className="mx-2">|</span>
            <span>Characters: {charCount}</span>
          </div>
          {(maxLength || minLength) && (
            <div>
              {minLength > 0 && (
                <span>
                  Min: {minLength} {maxLength && '| '}
                </span>
              )}
              {maxLength && <span>Max: {maxLength}</span>}
            </div>
          )}
        </div>

        {!isWithinLimits() && (
          <p className="mt-2 text-sm text-red-600">
            {charCount > (maxLength || 0)
              ? 'Response exceeds maximum length'
              : 'Response is shorter than minimum length'}
          </p>
        )}
      </div>

      {mode === 'edit' && (
        <div className="mt-6 space-y-6">
          {sampleResponse && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Sample Response
              </h4>
              <div className="p-4 bg-gray-50 rounded-md">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {sampleResponse}
                </pre>
              </div>
            </div>
          )}

          {rubric.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Scoring Rubric
              </h4>
              <div className="space-y-3">
                {rubric.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 text-sm"
                  >
                    <span className="font-medium text-gray-700">
                      {criterion.score} points:
                    </span>
                    <span className="text-gray-600">
                      {criterion.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'preview' && (
        <div className="mt-4 text-sm text-gray-500">
          {format === 'xhtml'
            ? 'Rich text formatting is supported'
            : format === 'preformatted'
            ? 'Preformatted text (spacing and line breaks will be preserved)'
            : 'Plain text only'}
        </div>
      )}
    </div>
  );
} 