import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

const CentariusData = ({ data, ...rest }) => (
  <script
    type="application/json"
    // eslint-disable-next-line
    dangerouslySetInnerHTML={{
      __html: `window.__CENTARIUS_SERVER_STATE__=${serialize(data)}`,
    }}
    {...rest}
  />
);

CentariusData.propTypes = {
  data: PropTypes.any,
};

CentariusData.defaultProps = {
  data: {},
};

export default CentariusData;
