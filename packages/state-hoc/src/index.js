import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

import { CentariusConsumer } from 'centarius/core';

const centariusHoc = ({ LoadingComponent = null, ErrorComponent = null }) => (
  WrappedComponent
) => {
  const CentariusStateWrapper = (props) => (
    <CentariusConsumer>
      {(state) => {
        if (state.loading && !!LoadingComponent) {
          return <LoadingComponent {...props} {...state} />;
        }

        if (state.error && !!ErrorComponent) {
          return <ErrorComponent {...props} {...state} />;
        }

        return <WrappedComponent {...props} {...state} />;
      }}
    </CentariusConsumer>
  );

  const componentName = WrappedComponent.displayName || WrappedComponent.name;
  CentariusStateWrapper.ErrorComponent = ErrorComponent;
  CentariusStateWrapper.LoadingComponent = LoadingComponent;
  CentariusStateWrapper.displayName = `withCentariusStateHoc(${componentName})`;

  return hoistStatics(CentariusStateWrapper, WrappedComponent);
};

export default centariusHoc;
