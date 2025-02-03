import React, { useEffect, useRef, useState } from 'react';
import ChoicePresentationFactory from './ChoicePresentationFactory';
import QtiSimpleChoice from './QtiSimpleChoice';
import './ChoiceGroup.css';

type CardinalityType = 'single' | 'multiple' | 'ordered';

interface SimpleChoice {
  identifier: string;
  content: React.ReactNode;
  fixed: boolean;
  label: string;
  isChecked: () => boolean;
  setCorrectSolution: () => void;
  setIncorrectSolution: () => void;
  setExpectedSolution: () => void;
  setIgnoreSolution: () => void;
  hideLabel: () => void;
  setLabel: (label: string) => void;
  setLabelSbac: (label: string) => void;
  setChoiceLrn: () => void;
  hideControl: () => void;
}

interface ChoiceGroupProps {
  responseIdentifier: string;
  cardinality: CardinalityType;
  shuffle: string;
  maxChoices: string;
  minChoices: string;
  orientationClass?: string;
  stackingClass?: string;
  children?: React.ReactNode;
  onChoiceGroupReady?: (data: {
    choices: SimpleChoice[];
    firstChoice: SimpleChoice | null;
    lastChoice: SimpleChoice | null;
  }) => void;
  onSetChecked?: (identifier: string, checked: boolean) => void;
  onSetFocusNextChoice?: (currentChoice: SimpleChoice) => void;
  onSetFocusPreviousChoice?: (currentChoice: SimpleChoice) => void;
  onSetActiveDescendant?: (identifier: string) => void;
  onChange?: (value: any) => void;
  value?: any;
}

const LABELS_UPPER_ALPHA = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

const ChoiceGroup: React.FC<ChoiceGroupProps> = ({
  responseIdentifier,
  cardinality,
  shuffle,
  maxChoices,
  minChoices,
  orientationClass,
  stackingClass,
  children,
  onChoiceGroupReady,
  onSetChecked,
  onSetFocusNextChoice,
  onSetFocusPreviousChoice,
  onSetActiveDescendant,
  onChange,
  value,
}) => {
  const [choices, setChoices] = useState<SimpleChoice[]>([]);
  const [firstChoice, setFirstChoice] = useState<SimpleChoice | null>(null);
  const [lastChoice, setLastChoice] = useState<SimpleChoice | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [role, setRole] = useState<'group' | 'radiogroup'>('group');
  const [isRadio, setIsRadio] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [priorState, setPriorState] = useState<any>(null);
  const [presentationFactory] = useState(new ChoicePresentationFactory());

  const choiceGroupRef = useRef<HTMLUListElement>(null);

  // Initialize choice group based on cardinality
  useEffect(() => {
    if (typeof cardinality === 'undefined') {
      throw new Error('Undefined qti-choice-interaction cardinality');
    }

    const isMultiple = cardinality === 'multiple';
      setRole(isMultiple ? 'group' : 'radiogroup');
      setIsRadio(!isMultiple);
    setIsShuffle(shuffle === 'true');
  }, [cardinality, shuffle]);

  // Process children when they change
  useEffect(() => {
    if (!children) return;

    const processChildren = () => {
      return React.Children.toArray(children)
        .filter(child => React.isValidElement(child))
        .map((child, index) => {
          const element = child as React.ReactElement;
          const identifier = element.props['data-identifier'];
          const fixed = element.props['data-fixed'] === 'true';
          const content = element.props.children;
          const label = LABELS_UPPER_ALPHA[index];

          return {
            identifier,
            content,
            fixed,
            label,
            isChecked: () => value === identifier || (Array.isArray(value) && value.includes(identifier)),
            setCorrectSolution: () => {},
            setIncorrectSolution: () => {},
            setExpectedSolution: () => {},
            setIgnoreSolution: () => {},
            hideLabel: () => {},
            setLabel: () => {},
            setLabelSbac: () => {},
            setChoiceLrn: () => {},
            hideControl: () => {}
          } as SimpleChoice;
        });
    };

    const shuffleChoices = (choicesToShuffle: SimpleChoice[]) => {
      const fixed = choicesToShuffle.filter(choice => choice.fixed);
      const shuffleable = choicesToShuffle.filter(choice => !choice.fixed);
      const shuffled = [...shuffleable].sort(() => Math.random() - 0.5);
      return [...fixed, ...shuffled];
    };

    let processedChoices = processChildren();

    if (isShuffle) {
      if (priorState) {
        processedChoices = priorState.state.order.map(identifier =>
          processedChoices.find(choice => choice.identifier === identifier)!
        );
      } else {
        processedChoices = shuffleChoices(processedChoices);
      }
    }

    setChoices(processedChoices);

    if (processedChoices.length > 0) {
      setFirstChoice(processedChoices[0]);
      setLastChoice(processedChoices[processedChoices.length - 1]);
    }

    onChoiceGroupReady?.({
      choices: processedChoices,
      firstChoice: processedChoices[0] || null,
      lastChoice: processedChoices[processedChoices.length - 1] || null
    });

    console.log('choiceGroupRef', choiceGroupRef.current);

    // Initialize presentation factory
    if (choiceGroupRef.current) {
      presentationFactory.initialize({
        choiceInteractionClassAttribute: choiceGroupRef.current.classList,
        choices: processedChoices,
        $refs: { choicegroup: choiceGroupRef.current }
      });
    }
  }, [children, isShuffle, priorState, value]);

  const handleSelect = (identifier: string) => {
    if (cardinality === 'single') {
      setSelectedChoices([identifier]);
      onChange?.(identifier);
      onSetChecked?.(identifier, true);
    } else {
      // Handle multiple selection logic
      const maxChoicesNum = parseInt(maxChoices, 10);
      const newSelectedChoices = selectedChoices.includes(identifier)
        ? selectedChoices.filter(id => id !== identifier)
        : maxChoicesNum === 0 || selectedChoices.length < maxChoicesNum
          ? [...selectedChoices, identifier]
          : selectedChoices;

      setSelectedChoices(newSelectedChoices);
      onChange?.(newSelectedChoices);
      onSetChecked?.(identifier, !selectedChoices.includes(identifier));
    }
  };

  const handleSetFocusNextChoice = (identifier: string) => {
    const choice = choices.find(c => c.identifier === identifier);
    if (choice) {
      onSetFocusNextChoice?.(choice);
    }
  };

  const handleSetFocusPreviousChoice = (identifier: string) => {
    const choice = choices.find(c => c.identifier === identifier);
    if (choice) {
      onSetFocusPreviousChoice?.(choice);
    }
  };

  const handleSetActiveDescendant = (id: string) => {
    onSetActiveDescendant?.(id);
  };

  return (
    <ul
      ref={choiceGroupRef}
      role={role}
      className={`qti-choice-list ${stackingClass || ''} ${orientationClass || ''} ababa`}
      aria-activedescendant=""
    >
      {choices.map(choice => (
        <QtiSimpleChoice
          key={choice.identifier}
          identifier={choice.identifier}
          fixed={choice.fixed.toString()}
          label={choice.label}
          cardinality={cardinality}
          onSelect={handleSelect}
          isSelected={cardinality === 'single'
            ? selectedChoices[0] === choice.identifier
            : selectedChoices.includes(choice.identifier)}
        >
          {choice.content}
        </QtiSimpleChoice>
      ))}
    </ul>
  );
};

export default ChoiceGroup;