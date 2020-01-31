import { SELECTOR, COMP_NAME } from './constants';
import { InterScroller } from './interscroller';
import { parseDataAttribute } from './utils';

/**
 * Test data & utils
 */
const id: string = 'f548hgjf';
const attrs: any = {
  'data-type': 'something',
  'data-debug': 'false'
};
const jsonData = {
  bgColor: '#ff9000',
  media: '/example.ad.jpg'
};

/**
 * Global store method
 */
const store = InterScroller.getStore;

/**
 * initWithId
 * @description helper to add neccesary attrs to element and init instance (optionally with data attrs)
 */
const initWithId = (withAttrs: boolean = false): HTMLElement => {
  const element = document.querySelector(SELECTOR) as HTMLElement;
  if (element) {
    element.setAttribute('id', id);
    if (withAttrs) {
      for (const key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          element.setAttribute(key, attrs[key]);
        }
      }
    }
  }
  InterScroller.init();
  return element;
};

let element: HTMLElement;

/**
 * Test suite
 */
describe(InterScroller.displayName, () => {
  /**
   * Inject content into DOM before each
   */
  beforeEach(() => {
    element = document.createElement('div');
    element.setAttribute(`data-ad-${COMP_NAME}`, '');
    element.innerHTML = `<script type="application/json" id="${COMP_NAME}-data">{"bgColor":"#ff9000","media":"/example-ad.jpg"}</script>`;
    document.body.appendChild(element);
  });

  /**
   * Before init
   */
  describe('before init', () => {
    it('should not init without an ID', () => {
      InterScroller.init();
      expect(element.getAttribute('data-init')).toBe(null);
    });

    it('should init with ID', () => {
      element.setAttribute('id', id);
      InterScroller.init();
      expect(element.getAttribute('data-init')).toBe('true');
    });
  });
});
