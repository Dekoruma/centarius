/* eslint-disable no-underscore-dangle */
const getSsrData = () =>
  typeof window !== 'undefined' && !!document
    ? window.__CENTARIUS_SERVER_STATE__
    : {};

export default getSsrData;
