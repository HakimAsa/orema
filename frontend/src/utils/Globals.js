import CONS from './Constants.js';

export const changeCase = (str, isLower = true) => {
  if (!str || typeof str !== 'string') throw new Error(CONS.STR_INPUT_STRING);
  return isLower ? str.toLowerCase() : str.toUpperCase();
};

export const companyStartDate = () => {
  return new Date().getFullYear() > 2022
    ? `2022 - ${new Date().getFullYear()}`
    : '2022';
};

export const validInput = (param) => {
  return (
    typeof param === 'undefined' ||
    (!param && typeof param === 'object') ||
    (!param && typeof param === 'number')
  );
};
export const placeForwardslash = (hasForwardslash = true, ...endPoints) => {
  if (validInput(endPoints.length))
    throw new Error('Your input array should contain at least one element');
  const hasFS = CONS.STR_FORWARDSLASH + endPoints.join(CONS.STR_FORWARDSLASH);
  return hasForwardslash
    ? hasFS.startsWith('//')
      ? hasFS.replace('//', '/')
      : hasFS
    : endPoints.join(CONS.STR_FORWARDSLASH);
};

export const dispatchOnFail = async (dispatch, type, error) => {
  return await dispatch({
    type,
    payload:
      error.response && error.response.data.message
        ? error.response.data.message
        : typeof error.data === 'string'
        ? error.data
        : (error.data.message ? error.data.message : error.data.errorMessage) ||
          error.message,
  });
};

export const capitalize = (str) => {
  if (!str || typeof str !== 'string') throw new Error(CONS.STR_INPUT_STRING);
  return changeCase(str.trim().charAt(0), false) + str.trim().substring(1);
};

export const addSuffix = (str, suf = '') => {
  if (!str || typeof str !== 'string') throw new Error(CONS.STR_INPUT_STRING);
  return str + suf;
};

export const log = (...msg) =>
  process.env.NODE_ENV === 'development' && console.log(msg);
