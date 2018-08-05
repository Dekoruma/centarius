import { dataId } from '../core/constants';

const getSsrData = (defaultDataId = dataId) =>
  typeof window !== 'undefined' && !!document
    ? JSON.parse(document.getElementById(defaultDataId).textContent)
    : {};

export default getSsrData;
