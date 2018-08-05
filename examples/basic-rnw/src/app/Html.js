import React, { Component } from 'react';

import { CentariusRoot, CentariusData } from 'centarius/document';

/* eslint-disable */
export default class CustomDocument extends Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const page = await renderPage();

    return { assets, data, ...page };
  }

  render() {
    const { rootId, dataId, assets, data, rnwCss } = this.props;

    return (
      <html lang="en">
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
          <style
            id="react-native-stylesheet"
            dangerouslySetInnerHTML={{
              __html: rnwCss
                .replace(/<\/style>/g, '')
                .replace(/<style id="react-native-stylesheet">/g, ''),
            }}
          />
        </head>
        <body>
          <CentariusRoot id={rootId} />
          <CentariusData id={dataId} data={data} />
          <script
            type="text/javascript"
            src={assets.client.js}
            crossOrigin="anonymous"
          />
        </body>
      </html>
    );
  }
}
