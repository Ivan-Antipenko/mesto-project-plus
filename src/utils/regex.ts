const validateUrl = (value: string, helpers: any) => {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return value;
  } catch (err) {
    return helpers.error('Invalid URL provided');
  }
};
export default validateUrl;
