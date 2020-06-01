/* eslint-disable no-eval */
import { dataId } from '../core/constants';

const getSsrData = (defaultDataId = dataId) =>
  typeof window !== 'undefined' && !!document
    ? eval(`(${document.getElementById(defaultDataId).textContent})`)
    : {};

export default getSsrData;
