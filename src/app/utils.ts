export const parseDataAttribute = (input: any): any => {
  let value = input;
  if (!isNaN(value)) {
    value = parseInt(value);
  } else {
    if (value === 'true' || value === 'TRUE') value = true;
    if (value === 'false' || value === 'FALSE') value = false;
  }
  return value;
};

export const parseHex = (str: string): string => {
  const value = str.trim().replace(/#/g, '');
  return value.length === 3 || value.length === 6 ? `#${value}` : '';
};

export const addStyles = (el: HTMLElement, styles: any) => {
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      const style = styles[key];
      el.style[key as any] = style;
    }
  }
};

export const isDesktop = () => {
  return window.parent.innerWidth >= 1024;
};
