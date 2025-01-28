import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { createItem, updateItem } from '../../store/slices/questionBankSlice';
import type { AssessmentItem } from '../../types/qti';
import { convertToQtiXml } from '../../utils/qtiConverter';

interface AssessmentItemFormProps {
  item?: AssessmentItem;
  onSave?: () => void;
  onCancel?: () => void;
}

type InteractionType = 'choice' | 'textEntry' | 'match' | 'order' | 'extendedText';

export default function AssessmentItemForm({
  item,
  onSave,
  onCancel,
}: AssessmentItemFormProps) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(item?.title || '');
  const [interactionType, setInteractionType] = useState<InteractionType>(
    (item?.metadata.interactionType as InteractionType) || 'choice'
  );
  const [prompt, setPrompt] = useState('');

  // Choice Interaction State
  const [choices, setChoices] = useState<Array<{ id: string; content: string; isCorrect: boolean }>>(
    []
  );

  // Text Entry State
  const [correctResponses, setCorrectResponses] = useState<string[]>([]);

  // Match Interaction State
  const [sourceItems, setSourceItems] = useState<Array<{ id: string; content: string }>>([]);
  const [targetItems, setTargetItems] = useState<Array<{ id: string; content: string }>>([]);
  const [correctPairs, setCorrectPairs] = useState<Array<{ sourceId: string; targetId: string }>>([]);

  // Order Interaction State
  const [orderItems, setOrderItems] = useState<Array<{ id: string; content: string }>>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);

  // Extended Text State
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [minLength, setMinLength] = useState<number>(0);
  const [format, setFormat] = useState<'plain' | 'preformatted' | 'xhtml'>('plain');
  const [sampleResponse, setSampleResponse] = useState('');
  const [rubric, setRubric] = useState<Array<{ score: number; description: string }>>([]);

  const handleAddChoice = () => {
    setChoices([...choices, { id: uuidv4(), content: '', isCorrect: false }]);
  };

  const handleChoiceChange = (id: string, field: 'content' | 'isCorrect', value: string | boolean) => {
    setChoices(
      choices.map((choice) =>
        choice.id === id ? { ...choice, [field]: value } : choice
      )
    );
  };

  const handleRemoveChoice = (id: string) => {
    setChoices(choices.filter((choice) => choice.id !== id));
  };

  const handleAddSourceItem = () => {
    setSourceItems([...sourceItems, { id: uuidv4(), content: '' }]);
  };

  const handleAddTargetItem = () => {
    setTargetItems([...targetItems, { id: uuidv4(), content: '' }]);
  };

  const handleAddOrderItem = () => {
    setOrderItems([...orderItems, { id: uuidv4(), content: '' }]);
  };

  const handleAddRubricCriterion = () => {
    setRubric([...rubric, { score: 0, description: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const getInteractionData = () => {
      switch (interactionType) {
        case 'choice':
          return { choices };
        case 'textEntry':
          return { correctResponses };
        case 'match':
          return { sourceItems, targetItems, correctPairs };
        case 'order':
          return { items: orderItems, correctOrder };
        case 'extendedText':
          return {
            maxLength,
            minLength,
            format,
            sampleResponse,
            rubric,
          };
        default:
          return {};
      }
    };

    const itemData: AssessmentItem = {
      id: item?.id || uuidv4(),
      title,
      qtiVersion: '3.0',
      itemBody: {
        elements: [],
        interactions: [
          {
            type: interactionType,
            prompt,
            ...getInteractionData(),
          },
        ],
      },
      responseDeclarations: [],
      outcomeDeclarations: [],
      templateDeclarations: [],
      metadata: {
        itemTemplate: false,
        timeDependent: false,
        composite: false,
        interactionType,
        feedbackType: 'none',
        solutionAvailable: true,
        scoringMode: 'automatic',
        toolName: 'QTI Editor',
        toolVersion: '1.0',
        toolVendor: 'Custom',
      },
    };

    const qtiXml = convertToQtiXml(itemData);

    try {
      if (item) {
        await dispatch(updateItem(qtiXml));
      } else {
        await dispatch(createItem(qtiXml));
      }
      onSave?.();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  // ... rest of the component code remains the same ...
} 