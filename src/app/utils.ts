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
