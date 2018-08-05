import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ReactLoadable = ({ chunks, ...rest }) => (
  <Fragment>
    {chunks.map((chunk) => (
      <script
        key={chunk.file}
        crossOrigin="anonymous"
        type="text/javascript"
        src={chunk.file}
        {...rest}
        async
      />
    ))}
  </Fragment>
);

ReactLoadable.propTypes = {
  chunks: PropTypes.arrayOf(PropTypes.shape),
};

ReactLoadable.defaultProps = {
  chunks: [],
};

export default ReactLoadable;
