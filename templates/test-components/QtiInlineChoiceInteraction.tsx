import React, { useRef, useState, useEffect } from 'react';
import { Choice } from './qti';
import './QtiInlineChoiceInteraction.css';
// import Tooltip from '@/shared/components/Tooltip';

interface QtiInlineChoiceInteractionProps {
  responseIdentifier: string;
  shuffle?: string;
  required?: string;
  dataPrompt?: string;
  minChoices?: string;
  maxChoices?: string;
  dataMinSelectionsMessage?: string;
  choices: Choice[];
}

const QtiInlineChoiceInteraction: React.FC<QtiInlineChoiceInteractionProps> = ({
  responseIdentifier,
  shuffle = 'false',
  required = 'false',
  dataPrompt = 'Choose...',
  minChoices = '0',
  maxChoices = '1',
  dataMinSelectionsMessage,
  choices
}) => {
  const [response, setResponse] = useState<string | null>(null);
  const [isValidResponse, setIsValidResponse] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeDescendant, setActiveDescendant] = useState<string | null>(null);
  const [keysSoFar, setKeysSoFar] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const tooltipRef = useRef<any>(null);

  const labelId = `inlinechoice_label_${responseIdentifier}`;
  const buttonId = `inlinechoice_button_${responseIdentifier}`;
  const buttonAriaLabelledbyId = `${labelId} ${buttonId}`;
  const listboxId = `inlinechoice_listbox_${responseIdentifier}`;

  const shuffledChoices = shuffle === 'true'
    ? [...choices].sort(() => Math.random() - 0.5)
    : choices;

  const handleButtonClick = () => {
    if (isDisabled) return;
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      listboxRef.current?.focus();
    }
  };

  const handleOptionClick = (identifier: string) => {
    setResponse(identifier);
    setIsExpanded(false);
    setIsValidResponse(true);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        navigateOptions(e.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeDescendant) {
          handleOptionClick(activeDescendant);
        }
        break;
      case 'Escape':
        setIsExpanded(false);
        buttonRef.current?.focus();
        break;
      default:
        handleSearchByTyping(e.key);
    }
  };

  const navigateOptions = (delta: number) => {
    const options = Array.from(listboxRef.current?.children || []);
    const currentIndex = options.findIndex(opt => opt.id === activeDescendant);
    let newIndex = currentIndex + delta;

    if (newIndex < 0) newIndex = options.length - 1;
    if (newIndex >= options.length) newIndex = 0;

    const newOption = options[newIndex] as HTMLElement;
    setActiveDescendant(newOption.id);
    newOption.scrollIntoView({ block: 'nearest' });
  };

  const handleSearchByTyping = (char: string) => {
    if (char.length !== 1) return;

    const newKeysSoFar = keysSoFar + char.toLowerCase();
    setKeysSoFar(newKeysSoFar);

    const options = Array.from(listboxRef.current?.children || []);
    const matchingOption = options.find(opt =>
      opt.textContent?.toLowerCase().startsWith(newKeysSoFar)
    );

    if (matchingOption) {
      setActiveDescendant(matchingOption.id);
      (matchingOption as HTMLElement).scrollIntoView({ block: 'nearest' });
    }

    // Reset search string after delay
    setTimeout(() => setKeysSoFar(''), 500);
  };

  useEffect(() => {
    // Initialize component
    if (required === 'true' && !dataMinSelectionsMessage) {
      tooltipRef.current?.setMessage('A choice must be selected');
    }
  }, []);

  return (
    <div ref={rootRef} className="qti-inline-choice-interaction">
      <div className="inline-choice-wrapper">
        <div
          ref={labelRef}
          className={`inline-choice-select-label qti-hidden`}
        >
          {dataPrompt}
        </div>
        <button
          ref={buttonRef}
          id={buttonId}
          aria-haspopup="listbox"
          aria-labelledby={buttonAriaLabelledbyId}
          aria-expanded={isExpanded}
          className="inline-choice-select"
          onClick={handleButtonClick}
          disabled={isDisabled}
        >
          <div className="inline-choice-select-prompt">
            {response ? choices.find(c => c.identifier === response)?.content : dataPrompt}
          </div>
        </button>
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          className={`inline-choice-select-listbox ${
            !isExpanded ? 'inline-choice-select-listbox-hidden' : ''
          }`}
          onKeyDown={handleKeyDown}
        >
          {shuffledChoices.map((choice) => (
            <li
              key={choice.identifier}
              id={`option-${choice.identifier}`}
              role="option"
              aria-selected={response === choice.identifier}
              className={activeDescendant === `option-${choice.identifier}` ? 'focused' : ''}
              onClick={() => handleOptionClick(choice.identifier)}
            >
              {choice.content}
            </li>
          ))}
        </ul>
      </div>
      {/* {required === 'true' && (
        <Tooltip
          ref={tooltipRef}
          message={dataMinSelectionsMessage || 'A choice must be selected'}
        />
      )} */}
    </div>
  );
};

export default QtiInlineChoiceInteraction;