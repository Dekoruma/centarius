import React from 'react';
import PropTypes from 'prop-types';

import { rootId } from '../core/constants';

const CentariusRoot = ({ id, ...rest }) => (
  <div id={id} {...rest}>
    DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP
  </div>
);

CentariusRoot.propTypes = {
  id: PropTypes.string,
};

CentariusRoot.defaultProps = {
  id: rootId,
};

export default CentariusRoot;
