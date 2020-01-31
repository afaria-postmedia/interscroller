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
