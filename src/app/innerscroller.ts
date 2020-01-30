import { SELECTOR } from './constants';

interface IInnerscrollerProps {
  /**
   * type
   * @description the mounted element
   */
  type: string;

  /**
   * debug
   * @description turn console logging on/off
   */
  debug: boolean;
}

export interface IInnerscroller {
  /**
   * element
   * @description the mounted element
   */
  element: HTMLElement;

  /**
   * id
   * @description the id of the component
   */
  id: string;

  /**
   * props
   * @description the properties of the component
   */
  props: IInnerscrollerProps;
}

/**
 * Default props
 */
const defaultProps: IInnerscrollerProps = {
  type: 'something',
  debug: false
};

export class Innerscroller implements IInnerscroller {
  public element: HTMLElement;
  public id: string;
  public props: IInnerscrollerProps;

  /**
   * constructor()
   */
  constructor(element: HTMLElement, props: IInnerscrollerProps) {
    this.element = element;
    this.id = element.id;
    this.props = { ...defaultProps, ...props };

    this.init();
  }

  /**
   * init()
   * @access private
   * @description static initialization function for the instance
   */
  private init() {
    if (this.props.debug) {
      console.log(
        `[${Innerscroller.displayName}] "${this.id}" init -> instance intialized with`,
        'element:',
        this.element,
        '& props:',
        this.props
      );
    }
  }

  /**
   * displayName
   * @access public
   * @description simply the name of the component for logging & display purposes
   */
  public static displayName = 'Innerscroller';

  /**
   * init()
   * @access public
   * @description static initialization function for all components
   */
  public static init(): void {
    (window as any)[Innerscroller.displayName] = {};

    // Get all matching elements
    const elements: HTMLElement[] = Array.prototype.slice.call(
      document.querySelectorAll(SELECTOR)
    );

    // If elements found, loop & initialize if they have an id
    if (elements.length) {
      for (const element of elements) {
        const id = element.getAttribute('id');
        if (id) {
          const props: any = Innerscroller.getProps(element.dataset);
          if (props.debug)
            console.log(
              `[${Innerscroller.displayName}] "${id}" pre-init -> passing DOM props:`,
              props
            );
          (window as any)[Innerscroller.displayName][id] = new Innerscroller(
            element,
            props
          );
        }
      }
    }
  }

  /**
   * getProps()
   * @access public
   * @description static function to get a& parse all valid props from data attributes
   */
  public static getProps(data: any) {
    const output: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key) && Object.keys(defaultProps).includes(key)) {
        let value = data[key];
        if (!isNaN(value)) {
          value = parseInt(value);
        } else {
          if (value === 'true' || value === 'TRUE') value = true;
          if (value === 'false' || value === 'FALSE') value = false;
        }
        output[key] = value;
      }
    }
    return output;
  }
}
