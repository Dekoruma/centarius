// ./src/Document.js
import React from 'react';
import { CentariusRoot, CentariusData } from 'centarius/document';

import serialize from 'serialize-javascript';

class CustomDocument extends React.Component {
  static async getInitialProps({ assets, data, renderPage }) {
    // register the app
    const page = await renderPage();

    return { assets, data, ...page };
  }

  render() {
    const { rootId, dataId, assets, data, rnwCss, serverState } = this.props;

    return (
      <html>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
          {process.env.NODE_ENV === 'production' ? (
            <span
              dangerouslySetInnerHTML={{
                __html: `<script src="${assets.client.js}" defer></script>`,
              }}
            />
          ) : (
            <span
              dangerouslySetInnerHTML={
                { __html: `<script src="${assets.client.js}" defer crossorigin></script>` } // prettier-ignore
              }
            />
          )}
          <span dangerouslySetInnerHTML={{ __html: rnwCss }} />
        </head>
        <body>
          <CentariusRoot id={rootId} />
          <CentariusData id={dataId} data={data} />
          <span
            dangerouslySetInnerHTML={
              { __html: `<script>window.__PRELOADED_STATE__ = ${serialize(serverState)}</script>` } // prettier-ignore
            }
          />
        </body>
      </html>
    );
  }
}

export default CustomDocument;
