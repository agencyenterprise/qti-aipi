/**
 * @description Class to encapsulate all QTI shared presentation vocabulary
 * for a qti-choice-interaction.
 */
export class ChoicePresentationFactory {
  private constants = {
    // QTI 3 Shared Vocabulary constants
    LABELS_UPPER_ALPHA: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'] as string[],
    LABELS_LOWER_ALPHA: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'] as string[],
    LABELS_DECIMAL: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26'] as string[],
    LABELS_CJK_IDEOGRAPHIC: ['一','二','三','四','五','六','七','八','九','十'] as string[],
    LABELS_SUFFIX_PERIOD: '.',
    LABELS_SUFFIX_PARENTHESIS: ')',
    LABELS_SUFFIX_NONE: '',
    LABELS_SUFFIX_CJK_IDEOGRAPHIC_COMMA: '、',

    // Defines the Label
    QTI_LABELS_NONE: 'qti-labels-none',
    QTI_LABELS_DECIMAL: 'qti-labels-decimal',
    QTI_LABELS_LOWER_ALPHA: 'qti-labels-lower-alpha',
    QTI_LABELS_UPPER_ALPHA: 'qti-labels-upper-alpha',
    QTI_LABELS_CJK_IDEOGRAPHIC: 'qti-labels-cjk-ideographic',

    // Defines the suffix
    QTI_LABELS_SUFFIX_NONE: 'qti-labels-suffix-none',
    QTI_LABELS_SUFFIX_PERIOD: 'qti-labels-suffix-period',
    QTI_LABELS_SUFFIX_PARENTHESIS: 'qti-labels-suffix-parenthesis',
    QTI_LABELS_SUFFIX_CJK_IDEOGRAPHIC_COMMA: 'qti-labels-cjk-ideographic-comma',

    // Orientation
    QTI_ORIENTATION_VERTICAL: 'qti-orientation-vertical',
    QTI_ORIENTATION_HORIZONTAL: 'qti-orientation-horizontal',

    // Hide the input control
    QTI_INPUT_CONTROL_HIDDEN: 'qti-input-control-hidden',

    // Presentation styles
    SBAC_PRESENTATION: 'sbac',
    LRN_PRESENTATION: 'lrn',

    // Stacking options
    QTI_CHOICES_STACKING_1: 'qti-choices-stacking-1',
    QTI_CHOICES_STACKING_2: 'qti-choices-stacking-2',
    QTI_CHOICES_STACKING_3: 'qti-choices-stacking-3',
    QTI_CHOICES_STACKING_4: 'qti-choices-stacking-4',
    QTI_CHOICES_STACKING_5: 'qti-choices-stacking-5',

    // Data attributes
    DATA_MAX_SELECTIONS_MESSAGE: 'data-max-selections-message',
    DATA_MIN_SELECTIONS_MESSAGE: 'data-min-selections-message'
  } as const;

  private parentClassList: DOMTokenList | null = null;
  private choiceGroupNode: any = null;
  private choices: any[] = [];

  private presentation_HideLabels = false;
  private presentation_Labels: string[];
  private presentation_LabelsSuffix: string;
  private presentation_Sbac = false;
  private presentation_Lrn = false;
  private presentation_IsInputControlHidden = false;
  private presentation_IsOrientationVertical = false;
  private presentation_IsOrientationHorizontal = false;
  private presentation_MaxSelectionsMessage = '';
  private presentation_MinSelectionsMessage = '';
  private presentation_Label_Style = '';
  private presentation_Stacking_Class = '';

  constructor() {
    this.presentation_Labels = this.constants.LABELS_UPPER_ALPHA;
    this.presentation_LabelsSuffix = this.constants.LABELS_SUFFIX_PERIOD;
  }

  /**
   * @description Initialize the factory with a choice group node
   */
  initialize(choiceGroupNode: any): void {
    this.choiceGroupNode = choiceGroupNode;
    this.parentClassList = choiceGroupNode.choiceInteractionClassAttribute;
    this.choices = choiceGroupNode.choices;

    this.processRootClassAttribute(this.parentClassList);
    this.processStackingClass();
    this.processLabelsAndInputControls();
  }

  /**
   * @description Process the class attribute for QTI vocabulary
   */
  private processRootClassAttribute(classList: DOMTokenList): void {
    if (!classList) return;

    console.log('classList', classList);

    Array.from(classList).forEach(clazz => {
      switch (clazz) {
        case this.constants.QTI_ORIENTATION_VERTICAL:
          this.presentation_IsOrientationVertical = true;
          this.presentation_IsOrientationHorizontal = false;
          break;

        case this.constants.QTI_ORIENTATION_HORIZONTAL:
          this.presentation_IsOrientationVertical = false;
          this.presentation_IsOrientationHorizontal = true;
          break;

        case this.constants.QTI_CHOICES_STACKING_1:
        case this.constants.QTI_CHOICES_STACKING_2:
        case this.constants.QTI_CHOICES_STACKING_3:
        case this.constants.QTI_CHOICES_STACKING_4:
        case this.constants.QTI_CHOICES_STACKING_5:
          this.presentation_Stacking_Class = clazz;
          break;

        case this.constants.QTI_LABELS_NONE:
          this.presentation_HideLabels = true;
          break;

        case this.constants.QTI_LABELS_UPPER_ALPHA:
          this.presentation_Labels = this.constants.LABELS_UPPER_ALPHA;
          break;

        case this.constants.QTI_LABELS_LOWER_ALPHA:
          this.presentation_Labels = this.constants.LABELS_LOWER_ALPHA;
          break;

        case this.constants.QTI_LABELS_DECIMAL:
          this.presentation_Labels = this.constants.LABELS_DECIMAL;
          break;

        case this.constants.QTI_LABELS_CJK_IDEOGRAPHIC:
          this.presentation_Labels = this.constants.LABELS_CJK_IDEOGRAPHIC;
          break;

        case this.constants.QTI_LABELS_SUFFIX_NONE:
          this.presentation_LabelsSuffix = this.constants.LABELS_SUFFIX_NONE;
          break;

        case this.constants.QTI_LABELS_SUFFIX_PERIOD:
          this.presentation_LabelsSuffix = this.constants.LABELS_SUFFIX_PERIOD;
          break;

        case this.constants.QTI_LABELS_SUFFIX_PARENTHESIS:
          this.presentation_LabelsSuffix = this.constants.LABELS_SUFFIX_PARENTHESIS;
          break;

        case this.constants.QTI_LABELS_SUFFIX_CJK_IDEOGRAPHIC_COMMA:
          this.presentation_LabelsSuffix = this.constants.LABELS_SUFFIX_CJK_IDEOGRAPHIC_COMMA;
          break;

        case this.constants.QTI_INPUT_CONTROL_HIDDEN:
          this.presentation_IsInputControlHidden = true;
          break;

        case this.constants.SBAC_PRESENTATION:
          this.presentation_Sbac = true;
          break;

        case this.constants.LRN_PRESENTATION:
          this.presentation_Lrn = true;
          break;
      }
    });
  }

  /**
   * @description Process stacking class and orientation
   */
  private processStackingClass(): void {
    // If there is a stacking class but no explicit orientation
    if (this.presentation_Stacking_Class &&
        !this.presentation_IsOrientationVertical &&
        !this.presentation_IsOrientationHorizontal) {

      if (this.choices.length > 1) {
        this.presentation_IsOrientationHorizontal = true;
      } else {
        this.presentation_IsOrientationVertical = true;
      }
    }
    // If horizontal orientation but no stacking class
    else if (!this.presentation_Stacking_Class && this.presentation_IsOrientationHorizontal) {
      const count = this.choices.length;
      if (count >= 5) {
        this.presentation_Stacking_Class = this.constants.QTI_CHOICES_STACKING_5;
      } else if (count === 4) {
        this.presentation_Stacking_Class = this.constants.QTI_CHOICES_STACKING_4;
      } else if (count === 3) {
        this.presentation_Stacking_Class = this.constants.QTI_CHOICES_STACKING_3;
      } else if (count === 2) {
        this.presentation_Stacking_Class = this.constants.QTI_CHOICES_STACKING_2;
      }

      if (count === 1) {
        this.presentation_IsOrientationVertical = true;
        this.presentation_IsOrientationHorizontal = false;
      }
    }

    // Default to vertical if no orientation set
    if (!this.presentation_IsOrientationVertical && !this.presentation_IsOrientationHorizontal) {
      this.presentation_IsOrientationVertical = true;
    }

    // Apply classes to choice group
    const choiceList = this.choiceGroupNode.$refs?.choicegroup;
    if (choiceList) {
      choiceList.classList.add(
        this.presentation_IsOrientationVertical
          ? this.constants.QTI_ORIENTATION_VERTICAL
          : this.constants.QTI_ORIENTATION_HORIZONTAL
      );

      if (this.presentation_Stacking_Class) {
        choiceList.classList.add(this.presentation_Stacking_Class);
      }
    }
  }

  /**
   * @description Process labels and input controls for choices
   */
  private processLabelsAndInputControls(): void {
    this.choices.forEach((choice: any, index: number) => {
      // Update Labels
      if (this.presentation_HideLabels) {
        choice.hideLabel();
      } else if (this.presentation_Sbac) {
        choice.setLabelSbac(this.presentation_Labels[index]);
      } else {
        choice.setLabel(this.presentation_Labels[index] + this.presentation_LabelsSuffix);
      }

      // Set choice class to lrn
      if (this.presentation_Lrn) {
        choice.setChoiceLrn();
      }

      // Update input control visibility
      if (this.presentation_IsInputControlHidden) {
        choice.hideControl();
      }
    });
  }
}

export default ChoicePresentationFactory;
