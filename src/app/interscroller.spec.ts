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

/**
 * Test suite
 */
describe(InterScroller.displayName, () => {
  /**
   * Inject content into DOM before each
   */
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <section></section>
        <${SELECTOR}></${SELECTOR}>
        <section></section>
      </main>
    `;
  });

  /**
   * Before init
   */
  describe('before init', () => {
    it('should not init without an id', () => {
      InterScroller.init();
      expect(Object.keys(store()).length).toBe(0);
    });

    it('should add instance to global store', () => {
      initWithId();
      expect(store(id)).toBeDefined();
    });

    it('should map dom attrs to props', () => {
      initWithId(true);
      const instance = store(id);
      expect(instance.props.type).toBe(attrs['data-type']);
      expect(instance.props.debug).toBe(
        parseDataAttribute(attrs['data-debug'])
      );
    });

    it('should add neccesary classes', () => {
      initWithId();
      const instance = store(id);
      expect(instance.element.className).toBeDefined();
      expect(instance.element.classList.contains(COMP_NAME)).toBe(true);
    });
  });
});
