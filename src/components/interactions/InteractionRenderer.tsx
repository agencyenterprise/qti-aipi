import { useMemo } from 'react';
import ChoiceInteraction from './ChoiceInteraction';
import TextEntryInteraction from './TextEntryInteraction';
import MatchInteraction from './MatchInteraction';
import OrderInteraction from './OrderInteraction';
import ExtendedTextInteraction from './ExtendedTextInteraction';

interface InteractionRendererProps {
  interaction: {
    type: string;
    prompt: string;
    [key: string]: any;
  };
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (value: any) => void;
}

export default function InteractionRenderer({
  interaction,
  mode = 'preview',
  onChange,
}: InteractionRendererProps) {
  const interactionComponent = useMemo(() => {
    switch (interaction.type) {
      case 'choice':
        return (
          <ChoiceInteraction
            prompt={interaction.prompt}
            choices={interaction.choices}
            maxChoices={interaction.maxChoices}
            minChoices={interaction.minChoices}
            mode={mode}
            onChange={onChange}
          />
        );

      case 'textEntry':
        return (
          <TextEntryInteraction
            prompt={interaction.prompt}
            correctResponses={interaction.correctResponses}
            expectedLength={interaction.expectedLength}
            patternMask={interaction.patternMask}
            placeholderText={interaction.placeholderText}
            mode={mode}
            onChange={onChange}
          />
        );

      case 'match':
        return (
          <MatchInteraction
            prompt={interaction.prompt}
            sourceItems={interaction.sourceItems}
            targetItems={interaction.targetItems}
            maxAssociations={interaction.maxAssociations}
            minAssociations={interaction.minAssociations}
            correctPairs={interaction.correctPairs}
            mode={mode}
            onChange={onChange}
          />
        );

      case 'order':
        return (
          <OrderInteraction
            prompt={interaction.prompt}
            items={interaction.items}
            correctOrder={interaction.correctOrder}
            mode={mode}
            onChange={onChange}
          />
        );

      case 'extendedText':
        return (
          <ExtendedTextInteraction
            prompt={interaction.prompt}
            format={interaction.format}
            maxLength={interaction.maxLength}
            minLength={interaction.minLength}
            expectedLines={interaction.expectedLines}
            placeholderText={interaction.placeholderText}
            sampleResponse={interaction.sampleResponse}
            rubric={interaction.rubric}
            mode={mode}
            onChange={onChange}
          />
        );

      default:
        return (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md">
            <p className="text-red-700">
              Unsupported interaction type: {interaction.type}
            </p>
          </div>
        );
    }
  }, [interaction, mode, onChange]);

  return <div className="qti-interaction">{interactionComponent}</div>;
} 