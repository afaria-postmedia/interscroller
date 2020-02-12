import { addStyles, isDesktop } from './utils';
import * as constants from './constants';

export type InterScrollerElements = {
  wrapper: HTMLElement | null;
  iframe: HTMLElement | null;
};

export interface IInterScrollerProps {
  /**
   * imageUrl
   * @description
   */
  imageUrl: string;

  /**
   * mobileImageUrl
   * @description
   */
  mobileImageUrl: string;

  /**
   * bgColor
   * @description
   */
  bgColor: string;

  /**
   * clickUrl
   * @description
   */
  clickUrl: string;

  /**
   * forceHeight
   * @description turn console logging on/off
   */
  forceHeight: string;
}

export interface IInterScroller {
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
   * window
   * @description the current window
   */
  window: Window;

  /**
   * methods
   */
  destroy(): void;
}

export class InterScroller implements IInterScroller {
  public elements: InterScrollerElements;
  public props: IInterScrollerProps;
  public window: Window;

  /**
   * constructor()
   * @description assign high level properties & initialize
   */
  constructor(iframe: HTMLElement, props: IInterScrollerProps) {
    this.window = window.parent;
    this.elements = {
      iframe,
      wrapper: iframe.parentElement
    };
    this.props = props;

    if (this.canInit()) {
      document.addEventListener('DOMContentLoaded', this.init);
    }
  }

  /* - - - - - - - - - - - - - - - PUBLIC METHODS - - - - - - - - - - - - - - */

  /**
   * destroy()
   * @access public
   * @description delete an instance by removing from dom and memory
   */

  public destroy(): void {}

  /* - - - - - - - - - - - - - - - INIT METHODS - - - - - - - - - - - - - - */

  /**
   * init()
   * @description initialization function for the instance
   */
  private init(): void {
    this.doStyles(true);
    if (this.props.clickUrl !== '') this.addClick();
    this.initEvents();
  }

  /**
   * initEvents()
   * @description initalizes all events
   */
  private initEvents(): void {
    // Window resize event
    this.window.addEventListener('resize', this.onWindowResize);
  }

  /**
   * canInit()
   * @description determine if the component can initialize
   */
  private canInit(): boolean {
    return this.elements.iframe &&
      this.elements.wrapper &&
      this.props.imageUrl !== '' &&
      isDesktop()
      ? true
      : false;
  }

  /* - - - - - - - - - - - - - - - DOM MANIPULATION - - - - - - - - - - - - - - */

  /**
   * doStyles()
   * @description add/alter styles of elements
   */
  private doStyles(initialLoad: boolean = false): void {
    if (!this.elements.iframe || !this.elements.wrapper) return;

    /**
     *  Iframe styles
     */
    if (initialLoad) {
      this.elements.iframe.style.height = '100%';
    }
    addStyles(this.elements.iframe, {
      width: `${this.window.innerWidth}px`
    });

    /**
     *  Wrapper styles
     */
    addStyles(this.elements.wrapper, {
      width: `${this.window.innerWidth}px`,
      height: `${
        !isDesktop() ? constants.HEIGHT_MOBILE_TABLET : constants.HEIGHT_DESKTOP
      }px`,
      backgroundImage: `url(${
        !isDesktop() ? this.props.mobileImageUrl : this.props.imageUrl
      })`
    });
  }

  /**
   * addClick()
   * @description adds transparent click element so the user can be taken to destination
   */
  private addClick(): void {
    const link = document.createElement('a');
    link.setAttribute('href', this.props.clickUrl);
    link.setAttribute('target', '_top');
    link.setAttribute('style', 'display:block;height:100%;');
    document.body.appendChild(link);
  }

  /* - - - - - - - - - - - - - - - EVENT HANDLERS - - - - - - - - - - - - - - */

  /**
   * onWindowResize()
   * @description update styles whenever the window is resized
   */
  private onWindowResize(): void {
    this.doStyles();
  }

  /* - - - - - - - - - - - - - - - STATIC - - - - - - - - - - - - - - */

  /**
   * displayName
   * @description simply the name of the component for logging & display purposes
   */
  public static displayName: string = constants.DISPLAY_NAME;

  /**
   * init()
   * @description static initialization function
   */
  public static init(): void {
    // Get all matching elements
    const elements: HTMLElement[] = Array.prototype.slice.call(
      document.querySelectorAll(constants.SELECTOR)
    );

    // If elements found, loop & initialize if they have an id
    if (elements.length) {
      for (const element of elements) {
        const props: IInterScrollerProps = this.getProps();
        new InterScroller(element, props);
      }
    }
  }

  /**
   * getProps()
   * @description static function to get properties to init with
   */
  private static getProps(): IInterScrollerProps {
    return constants.IS_DEV
      ? {
          imageUrl:
            'http://via.placeholder.com/' +
            constants.WIDTH_DESKTOP +
            'x' +
            constants.HEIGHT_DESKTOP +
            '/' +
            constants.PLACEHOLDER_IMAGE_COLOR +
            '/ffffff?text=' +
            constants.WIDTH_DESKTOP +
            '%20x%20' +
            constants.HEIGHT_DESKTOP,
          mobileImageUrl:
            'http://via.placeholder.com/' +
            constants.WIDTH_MOBILE_TABLET +
            'x' +
            constants.HEIGHT_MOBILE_TABLET +
            '/' +
            constants.PLACEHOLDER_IMAGE_COLOR +
            '/ffffff?text=' +
            constants.WIDTH_MOBILE_TABLET +
            '%20x%20' +
            constants.HEIGHT_MOBILE_TABLET,
          bgColor: '#' + constants.PLACEHOLDER_BG_COLOR,
          clickUrl: 'https://nationalpost.com',
          forceHeight: 'no'
        }
      : {
          imageUrl: '[%image_url%]',
          mobileImageUrl: '[%mobile_image_url%]',
          bgColor: '[%bg_color%]',
          clickUrl: '%%CLICK_URL_UNESC%%[%click_url%]',
          forceHeight: '[%force_height%]'
        };
  }
}
