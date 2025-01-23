import React from 'react';
import { Dispatch } from 'react';
import { BasePromptInteractionType } from '../../types/base-prompt-interaction';

// State and Action Interfaces
interface State {
  assessment: {
    questions: BasePromptInteractionType[];
  };
}

interface Action {
  type: 'UPDATE_ASSESSMENT';
  payload: {
    questions: BasePromptInteractionType[];
  };
}

// Props for the Component
export interface BasePromptInteractionProps {
  interaction: BasePromptInteractionType;
  index: number;
  updateInteraction: (
    index: number,
    field: keyof BasePromptInteractionType,
    value: string | number | boolean | { [key: string]: string }
  ) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const BasePromptInteraction = ({
  interaction,
  index,
  updateInteraction,
}: BasePromptInteractionProps) => {
  return (
    <div className="mb-4">
      <div>
        <label className="text-black">ID</label>
        <input
          type="text"
          value={interaction.id || ''}
          onChange={(e) => updateInteraction(index, 'id', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Optional: Unique ID for this interaction"
        />
      </div>
      
      {/* Class */}
      <div>
        <label className="text-black">Class</label>
        <input
          type="text"
          value={interaction.class || ''}
          onChange={(e) => updateInteraction(index, 'class', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Optional: Space-separated class names"
        />
      </div>
      
      {/* Response Identifier */}
      <div>
        <label className="text-black">Response Identifier</label>
        <input
          type="text"
          value={interaction.responseIdentifier}
          onChange={(e) => updateInteraction(index, 'responseIdentifier', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Required: Enter response identifier"
        />
      </div>
      
      {/* Prompt */}
      <div>
        <label className="text-black">Prompt</label>
        <textarea
          value={interaction.qtiPrompt || ''}
          onChange={(e) => updateInteraction(index, 'qtiPrompt', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Optional: Enter the prompt text"
        />
      </div>
      
      {/* Language - this is deprecated and should be removed */}
      {/* <div>
        <label className="text-black">Language (Deprecated)</label>
        <input
          type="text"
          value={interaction.language || ''}
          onChange={(e) => updateInteraction(index, 'language', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Optional: Language code"
        />
      </div> */}
      
      {/* Directionality */}
      <div>
        <label className="text-black">Directionality</label>
        <select
          value={interaction.dir || 'auto'}
          onChange={(e) => updateInteraction(index, 'dir', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
        >
          <option value="ltr">Left-to-Right</option>
          <option value="rtl">Right-to-Left</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      
      {/* Suppress TTS */}
      <div>
        <label className="text-black">Suppress TTS</label>
        <select
          value={interaction['data-qti-suppress-tts'] || ''}
          onChange={(e) =>
            updateInteraction(index, 'data-qti-suppress-tts', e.target.value as 'computer-read-aloud' | 'screen-reader' | 'all')
          }
          className="w-full p-1 border mt-1 text-black"
        >
          <option value="">None</option>
          <option value="computer-read-aloud">Computer Read Aloud</option>
          <option value="screen-reader">Screen Reader</option>
          <option value="all">All</option>
        </select>
      </div>
    </div>
  );
};
