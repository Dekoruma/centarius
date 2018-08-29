import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ReactLoadable = ({ chunks, ...rest }) => (
  <Fragment>
    {chunks.map((chunk) => (
      <script
        key={chunk.file}
        crossOrigin="anonymous"
        type="text/javascript"
        src={
          process.env.NODE_ENV === 'production'
            ? `/${chunk.file}`
            : `http://${process.env.HOST || 'localhost'}:${parseInt(
                process.env.PORT,
                10
              ) + 1}/${chunk.file}`
        }
        {...rest}
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
