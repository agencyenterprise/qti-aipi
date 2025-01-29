import { QtiItem } from '../types/qti-item';

interface Choice {
  identifier: string;
  text: string;
}

interface ChoiceInteraction {
  responseIdentifier: string;
  prompt: string;
  choices: Choice[];
  orientation?: 'horizontal' | 'vertical';
  maxChoices?: number;
}

interface MultipleSelectOptions {
  title: string;
  interactions: ChoiceInteraction[];
  imageUrl?: string;
  imageAlt?: string;
}

/**
 * Creates a new multiple select QTI item template
 * @param options Configuration options for the multiple select item
 */
export const createMultipleSelectTemplate = (
  options: MultipleSelectOptions
): Omit<QtiItem, '_id' | 'createdAt' | 'updatedAt'> => {
  const {
    title,
    interactions,
    imageUrl,
    imageAlt
  } = options;

  // Create the item body content
  const itemBodyContent: any = {
    p: []
  };

  // Add image if provided
  if (imageUrl) {
    itemBodyContent.p.push({
      _: '',
      'qti-printed-variable': [{
        identifier: 'image',
        src: imageUrl,
        alt: imageAlt || ''
      }]
    });
  }

  return {
    identifier: `ms-${Date.now()}`,
    title,
    type: 'qti-assessment-item',
    content: {
      xmlns: 'http://www.imsglobal.org/xsd/imsqtiasi_v3p0',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd',
      identifier: `ms-${Date.now()}`,
      title,
      adaptive: 'false',
      'time-dependent': 'false',
      // Create response declarations for each interaction
      'qti-response-declaration': interactions.map(interaction => ({
        identifier: interaction.responseIdentifier,
        cardinality: 'multiple',
        'base-type': 'identifier'
      })),
      'qti-outcome-declaration': {
        identifier: 'SCORE',
        cardinality: 'single',
        'base-type': 'float',
        'qti-default-value': {
          'qti-value': '0'
        }
      },
      'qti-item-body': {
        ...itemBodyContent,
        'qti-choice-interaction': interactions.map(interaction => ({
          ...(interaction.orientation && {
            class: `qti-orientation-${interaction.orientation}`
          }),
          'response-identifier': interaction.responseIdentifier,
          'max-choices': interaction.maxChoices?.toString() || '0',
          'qti-prompt': interaction.prompt,
          'qti-simple-choice': interaction.choices.map(choice => ({
            _: choice.text,
            identifier: choice.identifier
          }))
        }))
      },
      'qti-response-processing': {
        'qti-response-condition': {
          'qti-response-if': {
            'qti-match': interactions.map(interaction => ({
              'qti-variable': { identifier: interaction.responseIdentifier },
              'qti-correct': { identifier: interaction.responseIdentifier }
            })),
            'qti-set-outcome-value': {
              identifier: 'SCORE',
              'qti-base-value': { 'base-type': 'float', _: '1' }
            }
          }
        }
      }
    }
  };
};