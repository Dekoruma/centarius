/* eslint-disable */

import React from 'react';

import CentariusRoot from './CentariusRoot';
import CentariusData from './CentariusData';

export default class Document extends React.Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const page = await renderPage();

    return { assets, data, ...page };
  }

  render() {
    const { rootId, dataId, assets, data } = this.props;

    return (
      <html>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
        </head>
        <body>
          <CentariusRoot id={rootId} />
          <CentariusData id={dataId} data={data} />
          <script
            type="text/javascript"
            src={assets.client.js}
            defer
            crossOrigin="anonymous"
          />
        </body>
      </html>
    );
  }
}

/* eslint-enable */
