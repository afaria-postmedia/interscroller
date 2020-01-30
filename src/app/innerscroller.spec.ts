import { SELECTOR } from './constants';
import { Innerscroller } from './innerscroller';

const id: string = 'f548hgjf';

const store = () => (window as any)[Innerscroller.displayName];

describe(Innerscroller.displayName, () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <section></section>
        <${SELECTOR}></${SELECTOR}>
        <section></section>
      </main>
    `;
  });

  describe('before init', () => {
    it('should not init without an id', () => {
      Innerscroller.init();
      expect(Object.keys(store()).length).toBe(0);
    });

    it('should add instance to global store', () => {
      const element = document.querySelector(SELECTOR);
      if (element) {
        element.setAttribute('id', id);
      }
      Innerscroller.init();
      const instance = store()[id];
      expect(instance).toBeDefined();
    });

    it('it should map dom attrs to props', () => {
      const element = document.querySelector(SELECTOR);
      if (element) {
        element.setAttribute('id', id);
        element.setAttribute('data-type', 'something');
        element.setAttribute('data-debug', 'false');
      }
      Innerscroller.init();
      const instance = store()[id];
      expect(instance.props.type).toBe('something');
      expect(instance.props.debug).toBe(false);
    });
  });
});
