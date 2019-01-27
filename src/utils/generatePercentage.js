const generatePercentage = (val1 = 0, val2 = 0) => {
  if (val1 === 0 && val2 === 0) {
    return 0;
  }

  const result = (val1 / val2) * 100;

  if (result === 0) {
    return result;
  }
  return result.toFixed(0);
};

export default generatePercentage;
