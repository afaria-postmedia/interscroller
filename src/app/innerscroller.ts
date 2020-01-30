import classNames from 'classnames';

import { parseDataAttribute } from './utils';
import { SELECTOR, DISPLAY_NAME, COMP_NAME } from './constants';

export interface IInnerscrollerProps {
  /**
   * type
   * @description
   */
  type: string;

  /**
   * media
   * @description
   */
  media: string | null;

  /**
   * mediaType
   * @description
   */
  mediaType: 'image' | 'video';

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

  /**
   * props
   * @description the properties of the component
   */
  mediaSrc: any;

  /**
   * methods
   */
  destroy(): void;
}

/**
 * defaultProps
 * @description defualt values for component properties which can be overriden by DOM attrs
 */
const defaultProps: IInnerscrollerProps = {
  media: null,
  mediaType: 'image',
  type: 'something',
  debug: false
};

export class Innerscroller implements IInnerscroller {
  public element: HTMLElement;
  public id: string;
  public props: IInnerscrollerProps;
  public mediaSrc: any;

  /**
   * constructor()
   * @description assign high level properties & initialize
   */
  constructor(element: HTMLElement, props: IInnerscrollerProps) {
    this.element = element;
    this.id = element.id;
    this.props = { ...defaultProps, ...props };

    this.init();
  }

  /**
   * destroy()
   * @access public
   * @description delete an instance by removing from dom and memory
   */

  public destroy(): void {
    // Delete from store
    delete Innerscroller.getStore()[this.id];

    // Remove element from dom
    if (this.element.parentNode)
      this.element.parentNode.removeChild(this.element);
  }

  /**
   * init()
   * @access private
   * @description initialization function for the instance
   */
  private init(): void {
    const { media, mediaType } = this.props;

    if (this.props.debug) {
      console.log(
        `[${Innerscroller.displayName}] "${this.id}" init -> instance intialized with`,
        'element:',
        this.element,
        '& props:',
        this.props
      );
    }

    this.addClasses();

    if (media && mediaType === 'image') {
      this.initMediaImage();
    }
  }

  /**
   * addClasses()
   * @access private
   * @description initialization function for the instance
   */
  private addClasses(): void {
    this.element.className = classNames(
      COMP_NAME,
      this.props.media ? `${COMP_NAME}--${this.props.mediaType}` : ''
    );
  }

  /**
   * initMediaImage()
   * @access private
   * @description init and load image source
   */
  private initMediaImage(): void {
    const { media } = this.props;

    // Create image
    this.mediaSrc = new Image();

    // Set load event
    this.mediaSrc.onload = this.onMediaLoad();

    // Pass source and style attrs
    this.mediaSrc = media;
    this.element.style.backgroundImage = `url(${media})`;
  }

  /**
   * onMediaLoad()
   * @access private
   * @description fires when media source is finished loading
   */
  private onMediaLoad(): void {
    this.element.classList.add('loaded');
  }

  /**
   * displayName
   * @access public
   * @description simply the name of the component for logging & display purposes
   */
  public static displayName: string = DISPLAY_NAME;

  /**
   * init()
   * @access public
   * @description static initialization function for all components
   */
  public static init(): void {
    // Get all matching elements
    const elements: HTMLElement[] = Array.prototype.slice.call(
      document.querySelectorAll(SELECTOR)
    );

    // If elements found, loop & initialize if they have an id
    if (elements.length) {
      for (const element of elements) {
        const id = element.getAttribute('id');

        if (id) {
          const props: IInnerscrollerProps = this.getProps(element.dataset);

          if (props.debug)
            console.log(
              `[${this.displayName}] "${id}" pre-init -> passing DOM props:`,
              props
            );

          // Add to store and initialize
          this.setStore(new Innerscroller(element, props));
        }
      }
    }
  }

  /**
   * getStore()
   * @access public
   * @description gets all stored instances from the global object store
   */
  public static getStore(id?: string): IInnerscroller | any {
    if (!(window as any)[Innerscroller.displayName])
      (window as any)[Innerscroller.displayName] = {};

    return id
      ? (window as any)[Innerscroller.displayName][id]
      : (window as any)[Innerscroller.displayName];
  }

  /**
   * setStore()
   * @access private
   * @description adds an instance to the global object store
   */
  private static setStore(instance: IInnerscroller): void {
    this.getStore()[instance.id] = instance;
  }

  /**
   * getProps()
   * @access private
   * @description static function to get a& parse all valid props from data attributes
   */
  private static getProps(data: any): IInnerscrollerProps {
    const output: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key) && Object.keys(defaultProps).includes(key)) {
        output[key] = parseDataAttribute(data[key]);
      }
    }
    return output;
  }
}
