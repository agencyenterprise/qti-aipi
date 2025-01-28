import { useState, useEffect } from 'react';

interface RubricCriterion {
  score: number;
  description: string;
}

interface ExtendedTextInteractionProps {
  prompt: string;
  format: 'plain' | 'preformatted' | 'xhtml';
  maxLength?: number;
  minLength?: number;
  expectedLines?: number;
  placeholderText?: string;
  sampleResponse?: string;
  rubric?: RubricCriterion[];
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (value: string) => void;
}

export default function ExtendedTextInteraction({
  prompt,
  format = 'plain',
  maxLength,
  minLength = 0,
  expectedLines = 5,
  placeholderText = 'Enter your response',
  sampleResponse,
  rubric = [],
  mode = 'preview',
  onChange,
}: ExtendedTextInteractionProps) {
  const [value, setValue] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="qti-extended-text-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={value}
            onChange={handleChange}
            disabled={mode === 'preview'}
            placeholder={placeholderText}
            rows={expectedLines}
            maxLength={maxLength}
            className={`w-full px-4 py-2 border rounded-md shadow-sm ${
              mode === 'preview'
                ? 'bg-gray-50 border-gray-300'
                : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
            }`}
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{wordCount} words</span>
            {maxLength && (
              <span>
                {value.length}/{maxLength} characters
              </span>
            )}
          </div>
        </div>

        {mode === 'response' && value.length < minLength && (
          <p className="text-sm text-red-600">
            Please enter at least {minLength} characters.
          </p>
        )}

        {sampleResponse && (
          <div>
            <button
              type="button"
              onClick={() => setShowSample(!showSample)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              {showSample ? 'Hide' : 'Show'} Sample Response
            </button>
            {showSample && (
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{sampleResponse}</p>
              </div>
            )}
          </div>
        )}

        {rubric.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowRubric(!showRubric)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              {showRubric ? 'Hide' : 'Show'} Scoring Rubric
            </button>
            {showRubric && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Score
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rubric.map((criterion, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {criterion.score}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {criterion.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 