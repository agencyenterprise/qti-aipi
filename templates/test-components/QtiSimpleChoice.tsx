import React, { useEffect, useRef, useState } from 'react';
import './QtiSimpleChoice.css';

type CardinalityType = 'single' | 'multiple' | 'ordered';

interface QtiSimpleChoiceProps {
  identifier: string;
  fixed?: string;
  templateIdentifier?: string;
  showHide?: string;
  label?: string;
  cardinality?: CardinalityType;
  children?: React.ReactNode;
  onSelect?: (identifier: string) => void;
  isSelected?: boolean;
}

const QtiSimpleChoice: React.FC<QtiSimpleChoiceProps> = ({
  identifier,
  fixed = 'false',
  templateIdentifier,
  showHide = 'show',
  label,
  cardinality = 'single',
  children,
  onSelect,
  isSelected = false
}) => {
  const [id, setId] = useState<string | null>(null);
  const [checked, setChecked] = useState<'true' | 'false'>(isSelected ? 'true' : 'false');
  const [isRadio, setIsRadio] = useState(true);
  const [role, setRole] = useState<'radio' | 'checkbox' | 'button'>('radio');
  const [tabIndex, setTabIndex] = useState('-1');
  const [hasMath, setHasMath] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const choiceRef = useRef<HTMLLIElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const wrapperStyles = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '0.5rem',
    paddingLeft: '2.1rem',
    position: 'relative' as const,
    minHeight: '1.5rem'
  };

  const labelStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: '1.5rem',
    margin: 0
  };

  const descriptionStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    flex: '1',
    margin: 0
  };

  useEffect(() => {
    initializeChoice();
    createId();
    if (label) {
      setLabel(label);
    }
    setChecked(isSelected ? 'true' : 'false');
  }, [label, isSelected]);

  const initializeChoice = () => {
    switch (cardinality) {
      case 'ordered':
        setRole('button');
        setIsRadio(false);
        setTabIndex('0');
        break;
      case 'multiple':
        setRole('checkbox');
        setIsRadio(false);
        setTabIndex('0');
        break;
      default:
        setRole('radio');
        setIsRadio(true);
        setTabIndex('-1');
        break;
    }
  };

  const createId = () => {
    if (choiceRef.current?.hasAttribute('id')) {
      setId(choiceRef.current.getAttribute('id'));
      return;
    }
    const newId = `choice_${Math.random().toString(36).substr(2, 5)}_${identifier}`;
    setId(newId);
    choiceRef.current?.setAttribute('id', newId);
  };

  const handleClick = () => {
    if (isDisabled) return;
    onSelect?.(identifier);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let flag = false;

    switch (event.code) {
      case 'Space':
      case 'Enter':
        if (!isDisabled) {
          onSelect?.(identifier);
        }
        flag = true;
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        if (isRadio) {
          if (choiceRef.current?.parentElement) {
            const event = new CustomEvent('setFocusPreviousChoice', {
              detail: identifier,
              bubbles: true
            });
            choiceRef.current.parentElement.dispatchEvent(event);
          }
          flag = true;
        }
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        if (isRadio) {
          if (choiceRef.current?.parentElement) {
            const event = new CustomEvent('setFocusNextChoice', {
              detail: identifier,
              bubbles: true
            });
            choiceRef.current.parentElement.dispatchEvent(event);
          }
          flag = true;
        }
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const handleFocus = () => {
    if (choiceRef.current?.parentElement && id) {
      const event = new CustomEvent('setActiveDescendant', {
        detail: id,
        bubbles: true
      });
      choiceRef.current.parentElement.dispatchEvent(event);
    }
  };

  const toggleChecked = () => {
    setChecked(prev => prev === 'true' ? 'false' : 'true');
  };

  const setLabel = (label: string) => {
    if (labelRef.current) {
      labelRef.current.innerText = `${label}.`;
    }
  };

  const hideLabel = () => {
    labelRef.current?.classList.add('qti-hidden');
  };

  const showLabel = () => {
    labelRef.current?.classList.remove('qti-hidden');
  };

  const setLabelSbac = (label: string) => {
    if (choiceRef.current && labelRef.current) {
      choiceRef.current.classList.add('sbac');
      choiceRef.current.setAttribute('data-label', label);
      labelRef.current.innerText = label;
      labelRef.current.classList.add('qti-visually-hidden');
    }
  };

  const setChoiceLrn = () => {
    choiceRef.current?.classList.add('lrn');
  };

  const hideControl = () => {
    choiceRef.current?.classList.add('control-hidden');
  };

  return (
    <li
      ref={choiceRef}
      role={role}
      aria-checked={checked === 'true'}
      tabIndex={parseInt(tabIndex)}
      data-identifier={identifier}
      data-label={label}
      onFocus={handleFocus}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="qti-simple-choice"
      style={{ position: 'relative' }}
    >
      <div className="qti-simple-choice-wrapper" style={wrapperStyles}>
        <div ref={labelRef} className="qti-choice-label" style={labelStyles}>{label && `${label}.`}</div>
        <div ref={descriptionRef} className="qti-choice-description" style={descriptionStyles}>
          {children}
        </div>
      </div>
    </li>
  );
};

export default QtiSimpleChoice;
