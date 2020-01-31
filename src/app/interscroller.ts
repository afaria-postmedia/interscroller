import classNames from 'classnames';

import { parseDataAttribute, parseHex } from './utils';
import { SELECTOR, DISPLAY_NAME, COMP_NAME, DATA_SELECTOR } from './constants';

export type InterScrollerElements = {
  root: HTMLElement;
  ad?: HTMLElement;
  left?: HTMLElement;
  right?: HTMLElement;
};

export interface IInterScrollerProps {
  /**
   * type
   * @description
   */
  bgColor: string;

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

export interface IInterScroller {
  /**
   * id
   * @description the id of the component
   */
  id: string;

  /**
   * elements
   * @description object that contains all HTML elements
   */
  elements: InterScrollerElements;

  /**
   * props
   * @description the properties of the component
   */
  props: IInterScrollerProps;

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
const defaultProps: IInterScrollerProps = {
  media: null,
  mediaType: 'image',
  bgColor: '',
  debug: false
};

export class InterScroller implements IInterScroller {
  public elements: InterScrollerElements;
  public id: string;
  public props: IInterScrollerProps;
  public mediaSrc: any;

  /**
   * constructor()
   * @description assign high level properties & initialize
   */
  constructor(element: HTMLElement, props: IInterScrollerProps) {
    this.id = element.id;
    this.elements = {
      root: element
    };
    this.props = { ...defaultProps, ...props, ...this.getInjectedProps() };

    this.init();
  }

  private getInjectedProps() {
    let data = {};
    const jsonElement = this.elements.root.querySelector(DATA_SELECTOR);

    if (jsonElement) {
      data = jsonElement.innerHTML ? JSON.parse(jsonElement.innerHTML) : {};
      return InterScroller.getProps(data);
    }

    return data;
  }

  /* - - - - - - - - - - - - - - - PUBLIC METHODS - - - - - - - - - - - - - - */

  /**
   * destroy()
   * @access public
   * @description delete an instance by removing from dom and memory
   */

  public destroy(): void {
    // Delete from store
    delete InterScroller.getStore()[this.id];

    // Remove element from dom
    if (this.elements.root.parentNode)
      this.elements.root.parentNode.removeChild(this.elements.root);
  }

  /* - - - - - - - - - - - - - - - INIT METHODS - - - - - - - - - - - - - - */

  /**
   * init()
   * @access private
   * @description initialization function for the instance
   */
  private init(): void {
    const { media, mediaType } = this.props;

    this.elements.root.setAttribute('data-init', 'true');

    if (this.props.debug) {
      console.log(
        `[${InterScroller.displayName}] "${this.id}" init -> instance intialized with`,
        'element:',
        this.elements.root,
        '& props:',
        this.props
      );
    }

    this.addClasses();
    this.addElements();

    if (media && mediaType === 'image') {
      this.initMediaImage();
    }

    this.doStyles();
    this.initEvents();
  }

  /**
   * initEvents()
   * @access private
   * @description initalizes all events
   */
  private initEvents(): void {
    // Add click event
    this.elements.root.addEventListener('click', this.onClick);
    // Window resize event
    window.addEventListener('resize', () => {
      this.onWindowResize();
    });
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

    if (this.elements.ad)
      this.elements.ad.style.backgroundImage = `url(${media})`;
  }

  /* - - - - - - - - - - - - - - - DOM MANIPULATION - - - - - - - - - - - - - - */

  /**
   * addClasses()
   * @access private
   * @description initialization function for the instance
   */
  private addClasses(): void {
    this.elements.root.className = classNames(
      COMP_NAME,
      this.props.media ? `${COMP_NAME}--${this.props.mediaType}` : ''
    );
  }

  /**
   * addElements()
   * @access private
   * @description inject necessary elements into the DOM
   */
  private addElements() {
    this.elements.ad = this.elements.root.querySelector(
      `.${COMP_NAME}--ad`
    ) as HTMLElement;
    this.elements.left = this.elements.root.querySelector(
      `.${COMP_NAME}--left`
    ) as HTMLElement;
    this.elements.right = this.elements.root.querySelector(
      `.${COMP_NAME}--right`
    ) as HTMLElement;
  }

  /**
   * doStyles()
   * @access private
   * @description adds necessary style properties to elements
   */
  private doStyles() {
    const space = this.calculateEmptySpace();
    // Left side
    if (this.elements.left) {
      if (this.props.bgColor)
        this.elements.left.style.backgroundColor = parseHex(this.props.bgColor);
      this.elements.left.style.width = `${space}px`;
      this.elements.left.style.left = `-${space}px`;
    }
    // Right side
    if (this.elements.right) {
      if (this.props.bgColor)
        this.elements.right.style.backgroundColor = parseHex(
          this.props.bgColor
        );
      this.elements.right.style.width = `${space}px`;
      this.elements.right.style.right = `-${space}px`;
    }
  }

  /**
   * calculateEmptySpace()
   * @access private
   * @description calculates the space needed to fill on either side
   */
  private calculateEmptySpace(): number {
    const contentWidth = this.elements.root.getBoundingClientRect().width;
    return (window.innerWidth - contentWidth) / 2;
  }

  /* - - - - - - - - - - - - - - - EVENT HANDLERS - - - - - - - - - - - - - - */

  /**
   * onMediaLoad()
   * @access private
   * @description fires when media source is finished loading
   */
  private onMediaLoad(): void {
    this.elements.root.classList.add('loaded');
  }

  /**
   * onWindowResize()
   * @access private
   * @description window resize event handler
   */
  private onWindowResize(): void {
    this.doStyles();
  }

  /**
   * onClick()
   * @access private
   * @description window resize event handler
   */
  private onClick(e: Event): void {
    e.preventDefault();
    console.log('on click, do something');
  }

  /* - - - - - - - - - - - - - - - STATIC - - - - - - - - - - - - - - */

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
          const props: IInterScrollerProps = this.getProps(element.dataset);

          if (props.debug)
            console.log(
              `[${this.displayName}] "${id}" pre-init -> passing DOM props:`,
              props
            );

          // Add to store and initialize
          this.setStore(new InterScroller(element, props));
        }
      }
    }
  }

  /**
   * getStore()
   * @access public
   * @description gets all stored instances from the global object store
   */
  public static getStore(id?: string): IInterScroller | any {
    if (!(window as any)[InterScroller.displayName])
      (window as any)[InterScroller.displayName] = {};

    return id
      ? (window as any)[InterScroller.displayName][id]
      : (window as any)[InterScroller.displayName];
  }

  /**
   * setStore()
   * @access private
   * @description adds an instance to the global object store
   */
  private static setStore(instance: IInterScroller): void {
    this.getStore()[instance.id] = instance;
  }

  /**
   * getProps()
   * @access private
   * @description static function to get a& parse all valid props from data attributes
   */
  private static getProps(data: any): IInterScrollerProps {
    const output: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key) && Object.keys(defaultProps).includes(key)) {
        output[key] = parseDataAttribute(data[key]);
      }
    }
    return output;
  }
}
