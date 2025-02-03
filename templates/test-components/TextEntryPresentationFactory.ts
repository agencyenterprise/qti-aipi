/**
 * @description Class to encapsulate QTI shared presentation vocabulary
 * for a qti-text-entry-interaction.
 */
export class TextEntryPresentationFactory {
  private constants = {
    // QTI 3 Shared Vocabulary constants

    // Orientation
    QTI_ORIENTATION_HORIZONTAL: 'qti-orientation-horizontal',
    QTI_ORIENTATION_VERTICAL: 'qti-orientation-vertical',

    QTI_INPUT_WIDTH_DEFAULT: '',

    // When orientation is horizontal (default) this defines the width of the input
    // area of the control.  When orientation is vertical, this is used to define
    // the height of the input area of the control.
    QTI_INPUT_WIDTH_1: 'qti-input-width-1',
    QTI_INPUT_WIDTH_2: 'qti-input-width-2',
    QTI_INPUT_WIDTH_3: 'qti-input-width-3',
    QTI_INPUT_WIDTH_4: 'qti-input-width-4',
    QTI_INPUT_WIDTH_5: 'qti-input-width-5',
    QTI_INPUT_WIDTH_6: 'qti-input-width-6',
    QTI_INPUT_WIDTH_10: 'qti-input-width-10',
    QTI_INPUT_WIDTH_15: 'qti-input-width-15',
    QTI_INPUT_WIDTH_20: 'qti-input-width-20',
    QTI_INPUT_WIDTH_25: 'qti-input-width-25',
    QTI_INPUT_WIDTH_30: 'qti-input-width-30',
    QTI_INPUT_WIDTH_35: 'qti-input-width-35',
    QTI_INPUT_WIDTH_40: 'qti-input-width-40',
    QTI_INPUT_WIDTH_45: 'qti-input-width-45',
    QTI_INPUT_WIDTH_50: 'qti-input-width-50',
    QTI_INPUT_WIDTH_72: 'qti-input-width-72'
  } as const;

  private classList: string;
  private presentation_OrientationClass: string;
  private presentation_WidthClass: string;
  private presentation_MaxLength: number;

  constructor(classList: string) {
    this.classList = classList;
    // Default to horizontal orientation
    this.presentation_OrientationClass = this.constants.QTI_ORIENTATION_HORIZONTAL;
    // Default is empty, or about 8 characters
    this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_DEFAULT;
    // Set a default maxlength
    // Note: only used when orientation is vertical
    this.presentation_MaxLength = 8;

    // Sniff for shared CSS vocabulary
    this.processClassAttribute();
  }

  /**
   * @description The class attribute on the interaction may contain
   * QTI 3 shared vocabulary.
   */
  private processClassAttribute(): void {
    if (!this.classList?.length) {
      return;
    }

    const clazzTokens = this.classList.split(' ');
    for (const token of clazzTokens) {
      switch (token) {
        case this.constants.QTI_ORIENTATION_VERTICAL:
          this.presentation_OrientationClass = this.constants.QTI_ORIENTATION_VERTICAL;
          break;
        case this.constants.QTI_ORIENTATION_HORIZONTAL:
          this.presentation_OrientationClass = this.constants.QTI_ORIENTATION_HORIZONTAL;
          break;
        case this.constants.QTI_INPUT_WIDTH_1:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_1;
          this.presentation_MaxLength = 1;
          break;
        case this.constants.QTI_INPUT_WIDTH_2:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_2;
          this.presentation_MaxLength = 2;
          break;
        case this.constants.QTI_INPUT_WIDTH_3:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_3;
          this.presentation_MaxLength = 3;
          break;
        case this.constants.QTI_INPUT_WIDTH_4:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_4;
          this.presentation_MaxLength = 4;
          break;
        case this.constants.QTI_INPUT_WIDTH_5:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_5;
          this.presentation_MaxLength = 5;
          break;
        case this.constants.QTI_INPUT_WIDTH_6:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_6;
          this.presentation_MaxLength = 6;
          break;
        case this.constants.QTI_INPUT_WIDTH_10:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_10;
          this.presentation_MaxLength = 10;
          break;
        case this.constants.QTI_INPUT_WIDTH_15:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_15;
          this.presentation_MaxLength = 15;
          break;
        case this.constants.QTI_INPUT_WIDTH_20:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_20;
          this.presentation_MaxLength = 20;
          break;
        case this.constants.QTI_INPUT_WIDTH_25:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_25;
          this.presentation_MaxLength = 25;
          break;
        case this.constants.QTI_INPUT_WIDTH_30:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_30;
          this.presentation_MaxLength = 30;
          break;
        case this.constants.QTI_INPUT_WIDTH_35:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_35;
          this.presentation_MaxLength = 35;
          break;
        case this.constants.QTI_INPUT_WIDTH_40:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_40;
          this.presentation_MaxLength = 40;
          break;
        case this.constants.QTI_INPUT_WIDTH_45:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_45;
          this.presentation_MaxLength = 45;
          break;
        case this.constants.QTI_INPUT_WIDTH_50:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_50;
          this.presentation_MaxLength = 50;
          break;
        case this.constants.QTI_INPUT_WIDTH_72:
          this.presentation_WidthClass = this.constants.QTI_INPUT_WIDTH_72;
          // Not sure about this
          this.presentation_MaxLength = 500;
          break;
      }
    }
  }

  getOrientationClass(): string {
    return this.presentation_OrientationClass;
  }

  isOrientationVertical(): boolean {
    return this.presentation_OrientationClass === this.constants.QTI_ORIENTATION_VERTICAL;
  }

  getWidthClass(): string {
    return this.presentation_WidthClass;
  }

  getVerticalMaxLength(): number {
    return this.presentation_MaxLength;
  }
}

export default TextEntryPresentationFactory;