import React from 'react';
import PropTypes from 'prop-types';

const LoadableComponents = ({ loadable, ...rest }) => (
  <script
    id="loadable-components"
    type="text/javascript"
    async
    // eslint-disable-next-line
    dangerouslySetInnerHTML={{
      __html: loadable.replace(/<\/script>/g, '').replace(/<script>/g, ''),
    }}
    {...rest}
  />
);

LoadableComponents.propTypes = {
  loadable: PropTypes.any,
};

LoadableComponents.defaultProps = {
  loadable: '',
};

export default LoadableComponents;
