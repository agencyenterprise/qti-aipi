import { useState } from 'react';

interface MatchItem {
  id: string;
  content: string;
}

interface MatchPair {
  sourceId: string;
  targetId: string;
}

interface MatchInteractionProps {
  prompt: string;
  sourceItems: MatchItem[];
  targetItems: MatchItem[];
  maxAssociations?: number;
  minAssociations?: number;
  correctPairs?: MatchPair[];
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (pairs: MatchPair[]) => void;
}

export default function MatchInteraction({
  prompt,
  sourceItems,
  targetItems,
  maxAssociations = targetItems.length,
  minAssociations = 0,
  correctPairs = [],
  mode = 'preview',
  onChange,
}: MatchInteractionProps) {
  const [selectedPairs, setSelectedPairs] = useState<MatchPair[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleSourceClick = (sourceId: string) => {
    if (mode === 'preview') return;
    setSelectedSource(sourceId === selectedSource ? null : sourceId);
  };

  const handleTargetClick = (targetId: string) => {
    if (mode === 'preview' || !selectedSource) return;

    const existingPairIndex = selectedPairs.findIndex(
      (pair) => pair.sourceId === selectedSource || pair.targetId === targetId
    );

    let newPairs = [...selectedPairs];

    if (existingPairIndex !== -1) {
      // Remove existing pair
      newPairs.splice(existingPairIndex, 1);
    }

    if (selectedPairs.length < maxAssociations) {
      // Add new pair
      newPairs.push({ sourceId: selectedSource, targetId });
    }

    setSelectedPairs(newPairs);
    setSelectedSource(null);
    onChange?.(newPairs);
  };

  const isSourceSelected = (sourceId: string) => selectedSource === sourceId;
  const isSourceMatched = (sourceId: string) =>
    selectedPairs.some((pair) => pair.sourceId === sourceId);
  const isTargetMatched = (targetId: string) =>
    selectedPairs.some((pair) => pair.targetId === targetId);

  return (
    <div className="qti-match-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Source Items */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Source Items</h4>
          <div className="space-y-2">
            {sourceItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSourceClick(item.id)}
                className={`w-full text-left px-4 py-2 rounded-md border ${
                  isSourceSelected(item.id)
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                    : isSourceMatched(item.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${mode === 'preview' ? 'cursor-default' : 'cursor-pointer'}`}
                disabled={mode === 'preview'}
              >
                <span className="text-sm">{item.content}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Items */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Target Items</h4>
          <div className="space-y-2">
            {targetItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTargetClick(item.id)}
                className={`w-full text-left px-4 py-2 rounded-md border ${
                  isTargetMatched(item.id)
                    ? 'border-green-500 bg-green-50'
                    : selectedSource
                    ? 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                    : 'border-gray-300'
                } ${
                  mode === 'preview' || !selectedSource
                    ? 'cursor-default'
                    : 'cursor-pointer'
                }`}
                disabled={mode === 'preview' || !selectedSource}
              >
                <span className="text-sm">{item.content}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Matches */}
      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Current Matches</h4>
        <div className="space-y-2">
          {selectedPairs.map((pair) => (
            <div
              key={`${pair.sourceId}-${pair.targetId}`}
              className="flex items-center space-x-4 text-sm text-gray-600"
            >
              <span>
                {sourceItems.find((item) => item.id === pair.sourceId)?.content}
              </span>
              <span>→</span>
              <span>
                {targetItems.find((item) => item.id === pair.targetId)?.content}
              </span>
              {mode !== 'preview' && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPairs(
                      selectedPairs.filter(
                        (p) =>
                          p.sourceId !== pair.sourceId ||
                          p.targetId !== pair.targetId
                      )
                    )
                  }
                  className="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {mode === 'edit' && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Correct Matches
          </h4>
          <div className="space-y-2">
            {correctPairs.map((pair) => (
              <div
                key={`${pair.sourceId}-${pair.targetId}`}
                className="flex items-center space-x-4 text-sm text-gray-600"
              >
                <span>
                  {sourceItems.find((item) => item.id === pair.sourceId)?.content}
                </span>
                <span>→</span>
                <span>
                  {targetItems.find((item) => item.id === pair.targetId)?.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'preview' && (
        <div className="mt-4 text-sm text-gray-500">
          {minAssociations === maxAssociations
            ? `Make exactly ${maxAssociations} matches`
            : `Make between ${minAssociations} and ${maxAssociations} matches`}
        </div>
      )}
    </div>
  );
} 