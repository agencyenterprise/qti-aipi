import React, { useState } from 'react';
import type { ItemBody, ContentBlock, FeedbackBlock, HTMLBlock, TemplateBlock, RubricBlock, MathBlock, FigureBlock, TableBlock } from '../types/item-body';
import { ChoiceInteraction } from './question-interactions/qti-choice-interaction';
import { ExtendedTextInteraction, TextEntryInteraction, MatchInteraction, GapMatchInteraction } from './question-interactions';
import type { ChoiceInteractionType, ExtendedTextInteractionType, TextEntryInteractionType, MatchInteractionType, GapMatchInteractionType } from '../types/interactions';

interface ItemBodyProps {
  /**
   * The item body data
   */
  itemBody: ItemBody;

  /**
   * Whether the component is in edit mode
   */
  isEditing?: boolean;

  /**
   * Callback when any interaction response changes
   */
  onResponseChange?: (responseIdentifier: string, response: string | string[] | string[][]) => void;

  /**
   * Callback when the item body changes in edit mode
   */
  onItemBodyChange?: (updates: Partial<ItemBody>) => void;

  /**
   * The current response values keyed by responseIdentifier
   */
  values?: Record<string, string | string[] | string[][]>;

  /**
   * The outcome values keyed by outcomeIdentifier
   */
  outcomeValues?: Record<string, boolean>;
}

export const ItemBodyComponent: React.FC<ItemBodyProps> = ({
  itemBody,
  isEditing = false,
  onResponseChange,
  onItemBodyChange,
  values = {},
  outcomeValues = {}
}) => {
  const [showAllAttributes, setShowAllAttributes] = useState(false);

  const handleContentBlockChange = (index: number, updates: Partial<ContentBlock>) => {
    if (!onItemBodyChange) return;
    const newContent = [...itemBody.content];
    const currentBlock = newContent[index];
    
    // Type guard to ensure type safety
    if (currentBlock.type === updates.type || !updates.type) {
      newContent[index] = { ...currentBlock, ...updates } as ContentBlock;
      onItemBodyChange({ content: newContent });
    }
  };

  const handleInteractionChange = (responseIdentifier: string, updates: Partial<ChoiceInteractionType | ExtendedTextInteractionType | TextEntryInteractionType | MatchInteractionType | GapMatchInteractionType>) => {
    if (!onItemBodyChange || !itemBody.interactions) return;
    const index = itemBody.interactions.findIndex(i => i.responseIdentifier === responseIdentifier);
    if (index === -1) return;
    
    const newInteractions = [...itemBody.interactions];
    newInteractions[index] = { ...newInteractions[index], ...updates };
    onItemBodyChange({ interactions: newInteractions });
  };

  const addContentBlock = (type: ContentBlock['type']) => {
    if (!onItemBodyChange) return;
    
    let newBlock: ContentBlock;
    
    switch (type) {
      case 'html':
        newBlock = {
          type: 'html',
          content: '',
          class: '',
          label: ''
        } as HTMLBlock;
        break;
        
      case 'feedbackBlock':
        newBlock = {
          type: 'feedbackBlock',
          class: '',
          label: '',
          content: {
            identifier: `feedback_${itemBody.content.length + 1}`,
            outcomeIdentifier: '',
            showHide: 'show',
            content: ''
          }
        } as FeedbackBlock;
        break;
        
      case 'templateBlock':
        newBlock = {
          type: 'templateBlock',
          class: '',
          label: '',
          content: {
            identifier: `template_${itemBody.content.length + 1}`,
            markup: '',
            variables: {}
          }
        } as TemplateBlock;
        break;
        
      case 'rubricBlock':
        newBlock = {
          type: 'rubricBlock',
          class: '',
          label: '',
          content: {
            identifier: `rubric_${itemBody.content.length + 1}`,
            view: ['candidate'],
            content: ''
          }
        } as RubricBlock;
        break;
        
      case 'mathBlock':
        newBlock = {
          type: 'mathBlock',
          class: '',
          label: '',
          content: {
            markup: '',
            notation: 'MathML'
          }
        } as MathBlock;
        break;
        
      case 'figureBlock':
        newBlock = {
          type: 'figureBlock',
          class: '',
          label: '',
          content: {
            src: '',
            caption: '',
            alt: ''
          }
        } as FigureBlock;
        break;
        
      case 'tableBlock':
        newBlock = {
          type: 'tableBlock',
          class: '',
          label: '',
          content: {
            data: [['']],
            caption: '',
            summary: ''
          }
        } as TableBlock;
        break;
        
      default:
        return;
    }
    
    onItemBodyChange({
      content: [...itemBody.content, newBlock]
    });
  };

  const removeContentBlock = (index: number) => {
    if (!onItemBodyChange) return;
    const newContent = itemBody.content.filter((_, i) => i !== index);
    onItemBodyChange({ content: newContent });
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    if (isEditing) {
      return (
        <div key={index} className="space-y-2 border p-4 rounded">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{block.type}</h4>
            <button
              onClick={() => removeContentBlock(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          {/* Common attributes */}
          {showAllAttributes && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Class</label>
                <input
                  type="text"
                  value={block.class || ''}
                  onChange={(e) => handleContentBlockChange(index, { class: e.target.value })}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Label</label>
                <input
                  type="text"
                  value={block.label || ''}
                  onChange={(e) => handleContentBlockChange(index, { label: e.target.value })}
                  className="mt-1 block w-full"
                />
              </div>
            </div>
          )}

          {/* Block-specific content */}
          {renderBlockContent(block, index)}
        </div>
      );
    }

    return renderBlockDisplay(block, index);
  };

  const renderBlockContent = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'html':
        return (
          <textarea
            value={(block as HTMLBlock).content}
            onChange={(e) => handleContentBlockChange(index, { content: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
          />
        );

      case 'feedbackBlock': {
        const feedback = (block as FeedbackBlock).content;
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Identifier</label>
              <input
                type="text"
                value={feedback.identifier}
                onChange={(e) => handleContentBlockChange(index, {
                  content: { ...feedback, identifier: e.target.value }
                })}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Outcome Identifier</label>
              <input
                type="text"
                value={feedback.outcomeIdentifier}
                onChange={(e) => handleContentBlockChange(index, {
                  content: { ...feedback, outcomeIdentifier: e.target.value }
                })}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Show/Hide</label>
              <select
                value={feedback.showHide}
                onChange={(e) => handleContentBlockChange(index, {
                  content: { ...feedback, showHide: e.target.value as 'show' | 'hide' }
                })}
                className="mt-1 block w-full"
              >
                <option value="show">Show</option>
                <option value="hide">Hide</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={feedback.content}
                onChange={(e) => handleContentBlockChange(index, {
                  content: { ...feedback, content: e.target.value }
                })}
                className="mt-1 block w-full"
                rows={3}
              />
            </div>
          </div>
        );
      }

      // Add other block type editors here...
      
      default:
        return null;
    }
  };

  const renderBlockDisplay = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'html':
        return (
          <div 
            key={index}
            className={block.class}
            dangerouslySetInnerHTML={{ __html: (block as HTMLBlock).content }}
          />
        );

      case 'feedbackBlock': {
        const feedback = (block as FeedbackBlock).content;
        const shouldShow = outcomeValues[feedback.outcomeIdentifier] && feedback.showHide === 'show';
        return shouldShow ? (
          <div
            key={index}
            className={`my-2 ${block.class}`}
            dangerouslySetInnerHTML={{ __html: feedback.content }}
          />
        ) : null;
      }

      // Add other block type displays here...
      
      default:
        return null;
    }
  };

  const renderInteraction = (
    interaction: ChoiceInteractionType | ExtendedTextInteractionType | TextEntryInteractionType | MatchInteractionType | GapMatchInteractionType,
    isEditing: boolean,
    onInteractionChange: (responseIdentifier: string, updates: Partial<typeof interaction>) => void,
    onResponseChange: (responseIdentifier: string, response: string | string[] | string[][]) => void,
    values: Record<string, string | string[] | string[][]>
  ) => {
    switch (interaction.type) {
      case 'choiceInteraction':
        return (
          <ChoiceInteraction
            key={interaction.responseIdentifier}
            question={interaction as ChoiceInteractionType}
            isEditing={isEditing}
            onQuestionChange={(updates) => onInteractionChange(interaction.responseIdentifier, updates)}
            onResponseChange={(response) => onResponseChange(interaction.responseIdentifier, response)}
            value={values[interaction.responseIdentifier] as string[]}
          />
        );
      case 'extendedTextInteraction':
        return (
          <ExtendedTextInteraction
            key={interaction.responseIdentifier}
            question={interaction as ExtendedTextInteractionType}
            isEditing={isEditing}
            onQuestionChange={(updates) => onInteractionChange(interaction.responseIdentifier, updates)}
            onResponseChange={(response) => onResponseChange(interaction.responseIdentifier, response)}
            value={values[interaction.responseIdentifier] as string}
          />
        );
      case 'textEntryInteraction':
        return (
          <TextEntryInteraction
            key={interaction.responseIdentifier}
            question={interaction as TextEntryInteractionType}
            isEditing={isEditing}
            onQuestionChange={(updates) => onInteractionChange(interaction.responseIdentifier, updates)}
            onResponseChange={(response) => onResponseChange(interaction.responseIdentifier, response)}
            value={values[interaction.responseIdentifier] as string}
          />
        );
      case 'matchInteraction':
        return (
          <MatchInteraction
            key={interaction.responseIdentifier}
            question={interaction as MatchInteractionType}
            isEditing={isEditing}
            onQuestionChange={(updates) => onInteractionChange(interaction.responseIdentifier, updates)}
            onResponseChange={(response) => onResponseChange(interaction.responseIdentifier, response)}
            value={values[interaction.responseIdentifier] as string[][]}
          />
        );
      case 'gapMatchInteraction':
        return (
          <GapMatchInteraction
            key={interaction.responseIdentifier}
            question={interaction as GapMatchInteractionType}
            isEditing={isEditing}
            onResponseChange={(response) => onResponseChange(interaction.responseIdentifier, response)}
            onQuestionChange={(updates) => handleInteractionChange(interaction.responseIdentifier, updates)}
            value={values[interaction.responseIdentifier] as string[][]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="qti-item-body">
      {isEditing && (
        <div className="space-y-4">
          {/* Show all attributes toggle */}
          <div className="flex justify-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showAllAttributes}
                onChange={(e) => setShowAllAttributes(e.target.checked)}
              />
              <span className="text-sm">Show all attributes</span>
            </label>
          </div>

          {/* Required Attributes */}
          <div>
            <label className="block text-sm font-medium">Identifier</label>
            <input
              type="text"
              value={itemBody.identifier}
              onChange={(e) => onItemBodyChange?.({ identifier: e.target.value })}
              className="mt-1 block w-full"
              required
            />
          </div>

          {/* Optional Attributes */}
          {showAllAttributes && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Class</label>
                  <input
                    type="text"
                    value={itemBody.class || ''}
                    onChange={(e) => onItemBodyChange?.({ class: e.target.value })}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Language</label>
                  <input
                    type="text"
                    value={itemBody.lang || ''}
                    onChange={(e) => onItemBodyChange?.({ lang: e.target.value })}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Label</label>
                  <input
                    type="text"
                    value={itemBody.label || ''}
                    onChange={(e) => onItemBodyChange?.({ label: e.target.value })}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Text Direction</label>
                  <select
                    value={itemBody.dir || ''}
                    onChange={(e) => onItemBodyChange?.({ dir: e.target.value as 'ltr' | 'rtl' | 'auto' })}
                    className="mt-1 block w-full"
                  >
                    <option value="">Default</option>
                    <option value="ltr">Left to Right</option>
                    <option value="rtl">Right to Left</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Blocks */}
      <div className="space-y-4 mt-4">
        <label className="block text-sm font-medium">Content Blocks</label>
        {itemBody.content.map((block, index) => renderContentBlock(block, index))}

        {isEditing && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addContentBlock('html')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add HTML Content
            </button>
            <button
              onClick={() => addContentBlock('rubricBlock')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Rubric Block
            </button>
            <button
              onClick={() => addContentBlock('templateBlock')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Template Block
            </button>
            <button
              onClick={() => addContentBlock('feedbackBlock')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Feedback Block
            </button>
            <button
              onClick={() => addContentBlock('mathBlock')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Math Block
            </button>
            <button
              onClick={() => addContentBlock('figureBlock')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Figure Block
            </button>
            <button
              onClick={() => addContentBlock('tableBlock')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Table Block
            </button>
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="space-y-4 mt-4">
        <label className="block text-sm font-medium">Interactions</label>
        {itemBody.interactions?.map(interaction => {
          return renderInteraction(
            interaction as ChoiceInteractionType | ExtendedTextInteractionType | TextEntryInteractionType | MatchInteractionType | GapMatchInteractionType,
            isEditing,
            handleInteractionChange,
            (responseIdentifier: string, response: string | string[] | string[][]) => {
              onResponseChange?.(responseIdentifier, response);
            },
            values || {}
          );
        })}
      </div>
    </div>
  );
}; 