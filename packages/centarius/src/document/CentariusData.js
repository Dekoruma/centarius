import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

import { dataId } from '../core/constants';

const CentariusData = ({ id, data, ...rest }) => (
  <script
    type="application/json"
    // eslint-disable-next-line
    dangerouslySetInnerHTML={{
      __html: serialize(data),
    }}
    {...rest}
  />
);

CentariusData.propTypes = {
  data: PropTypes.any,
  id: PropTypes.string,
};

CentariusData.defaultProps = {
  data: {},
  id: dataId,
};

export default CentariusData;
