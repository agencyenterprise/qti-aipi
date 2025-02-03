import React, { useRef, useState, useEffect } from 'react';
import './TextEntryPlainDefaultVertical.css';

interface TextEntryPlainDefaultVerticalProps {
  responseIdentifier: string;
  expectedLength?: string;
  placeholder?: string;
  patternMask?: string;
  patternMaskMessage?: string;
  spellcheck?: string;
  widthClass?: string;
  maxlength?: string;
  value?: string;
  onChange?: (data: { response: string; state?: any }) => void;
  onReady?: (data: { node: any }) => void;
}

const TextEntryPlainDefaultVertical: React.FC<TextEntryPlainDefaultVerticalProps> = ({
  responseIdentifier,
  expectedLength,
  placeholder = '',
  patternMask,
  patternMaskMessage = 'Invalid Input',
  spellcheck = 'false',
  widthClass = '',
  maxlength = '8',
  value = '',
  onChange = () => {},
  onReady = () => {}
}) => {
  const [response, setResponse] = useState(value);
  const [priorResponse, setPriorResponse] = useState(value);
  const [isDisabled, setIsDisabled] = useState(false);
  const [caretIndex, setCaretIndex] = useState(0);
  const [maxlengthMessage, setMaxlengthMessage] = useState('');
  const [appliedRegex, setAppliedRegex] = useState<RegExp | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLLabelElement>(null);
  const tooltipRef = useRef<any>(null);
  const tooltipMaxlengthRef = useRef<any>(null);

  const getContent = () => inputRef.current?.innerText || '';

  const updateContent = (content: string) => {
    if (!inputRef.current) return;
    inputRef.current.innerText = content;
    if (content.length > 0) {
      hidePlaceholder();
    } else {
      showPlaceholder();
    }
  };

  const showPlaceholder = () => {
    placeholderRef.current?.classList.remove('text-entry-ph-hidden');
  };

  const hidePlaceholder = () => {
    placeholderRef.current?.classList.add('text-entry-ph-hidden');
  };

  const handleInput = (event: React.FormEvent) => {
    event.preventDefault();
    const content = getContent();

    if (content.length > 0) {
      hidePlaceholder();
    }

    if (!applyLimitCheck(content)) return;

    let inputSucceeded = true;
    if (appliedRegex) {
      inputSucceeded = applyPatternMask(content);
    } else {
      setResponse(content);
    }

    if (!inputSucceeded) return;

    if (content.length === 0) {
      showPlaceholder();
    }

    setPriorResponse(content);
    onChange({ response: content });
  };

  const applyLimitCheck = (value: string) => {
    if (value.length > parseInt(maxlength)) {
      tooltipMaxlengthRef.current?.show();
      updateContent(priorResponse);
      return false;
    }
    return true;
  };

  const applyPatternMask = (value: string) => {
    if (appliedRegex?.test(value)) {
      setResponse(value);
      setPriorResponse(value);
      return true;
    }

    tooltipRef.current?.show();
    updateContent(priorResponse);
    return false;
  };

  useEffect(() => {
    if (patternMask) {
      try {
        setAppliedRegex(new RegExp(patternMask));
      } catch (e) {
        console.error('Invalid pattern mask:', e);
      }
    }

    setMaxlengthMessage(`Maximum of ${maxlength} character${maxlength === '1' ? '' : 's'}`);

    onReady({
      node: {
        getResponse: () => response,
        setResponse: (val: string) => {
          const newValue = val || '';
          setResponse(newValue);
          updateContent(newValue);
        },
        setIsDisabled: (disabled: boolean) => setIsDisabled(disabled)
      }
    });
  }, []);

  return (
    <div
      ref={rootRef}
      className={`text-entry-default-vert-wrapper ${widthClass}`}
    >
      <div
        ref={labelRef}
        className={`text-entry-default-vert-label qti-hidden`}
        tabIndex={isDisabled ? 0 : -1}
      />
      <div
        ref={inputRef}
        className={`text-entry-default-vert`}
        contentEditable={!isDisabled}
        tabIndex={0}
        spellCheck={spellcheck === 'true'}
        onInput={handleInput}
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      />
      <label
        ref={placeholderRef}
        className={`text-entry-default-vert-ph`}
        aria-hidden="true"
      >
        {placeholder}
      </label>
      {/* {patternMask && (
        <Tooltip
          ref={tooltipRef}
          target={() => inputRef.current}
          message={patternMaskMessage}
        />
      )}
      <Tooltip
        ref={tooltipMaxlengthRef}
        target={() => inputRef.current}
        message={maxlengthMessage}
      /> */}
    </div>
  );
};

export default TextEntryPlainDefaultVertical;