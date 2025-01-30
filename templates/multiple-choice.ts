import { QtiItem } from '../types/qti-item';

interface MultipleChoiceOptions {
  title: string;
  prompt: string;
  choices: Array<{
    identifier: string;
    text: string;
  }>;
  correctChoice: string;
  imageUrl?: string;
  imageAlt?: string;
  subPrompt?: string;
}

/**
 * Creates a new multiple choice QTI item template
 * @param options Configuration options for the multiple choice item
 */
export const createMultipleChoiceTemplate = (
  options: MultipleChoiceOptions
): Omit<QtiItem, '_id' | 'createdAt' | 'updatedAt'> => {
  const {
    title,
    prompt,
    choices,
    correctChoice,
    imageUrl,
    imageAlt,
    subPrompt
  } = options;

  // Create the item body content
  const itemBodyContent: any = {
    p: []
  };

  // Add the main prompt
  itemBodyContent.p.push({ _: prompt });

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
    identifier: `mc-${Date.now()}`,
    title,
    type: 'qti-assessment-item',
    content: {
      xmlns: 'http://www.imsglobal.org/xsd/imsqtiasi_v3p0',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd',
      identifier: `mc-${Date.now()}`,
      title,
      adaptive: 'false',
      'time-dependent': 'false',
      'qti-response-declaration': {
        identifier: 'RESPONSE',
        cardinality: 'single',
        'base-type': 'identifier',
        'qti-correct-response': {
          'qti-value': correctChoice
        }
      },
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
        'qti-choice-interaction': {
          'response-identifier': 'RESPONSE',
          shuffle: 'true',
          'max-choices': '1',
          ...(subPrompt && {
            'qti-prompt': subPrompt
          }),
          'qti-simple-choice': choices.map(choice => ({
            _: choice.text,
            identifier: choice.identifier
          }))
        }
      },
      'qti-response-processing': {
        'qti-response-condition': {
          'qti-response-if': {
            'qti-match': {
              'qti-variable': { identifier: 'RESPONSE' },
              'qti-correct': { identifier: 'RESPONSE' }
            },
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