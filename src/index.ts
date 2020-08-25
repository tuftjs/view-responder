import type { ServerResponse } from 'http';
import type { TuftResponse } from 'tuft';

import { renderFile as renderEjsFile } from 'ejs';
import { renderFile as renderPugFile } from 'pug';
import { join } from 'path';

const DEFAULT_VIEW_DIR = '';
const DEFAULT_HTTP_STATUS = 200;
const HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';

export function createViewResponder(engine: 'ejs' | 'pug', viewDir = DEFAULT_VIEW_DIR) {
  if (engine !== 'ejs' && engine !== 'pug') {
    const err = Error('\'engine\' parameter must be either \'ejs\' or \'pug\'');
    console.error(err);
    process.exit(1);
  }

  async function ejsResponder(
    tuftResponse: TuftResponse,
    response: ServerResponse,
  ) {
    const { render, data = {}, status } = tuftResponse;

    if (typeof render !== 'string') {
      // There is no valid 'render' property.
      return tuftResponse;
    }

    const filename = join(viewDir, render);
    const body = await renderEjsFile(filename, data, {
      rmWhitespace: true,
      cache: true,
    });

    response
      .writeHead(status ?? DEFAULT_HTTP_STATUS, {
        ['content-type']: HTML_CONTENT_TYPE,
        ['content-length']: Buffer.byteLength(body),
      })
      .end(body);
  }

  function pugResponder(
    tuftResponse: TuftResponse,
    response: ServerResponse,
  ) {
    const { render, data = {}, status } = tuftResponse;

    if (typeof render !== 'string') {
      // There is no valid 'render' property.
      return tuftResponse;
    }

    const filename = join(viewDir, render);

    data.filename = render; // Required for caching to work
    data.cache = true;

    const body = renderPugFile(filename, data);

    response
      .writeHead(status ?? DEFAULT_HTTP_STATUS, {
        ['content-type']: HTML_CONTENT_TYPE,
        ['content-length']: Buffer.byteLength(body),
      })
      .end(body);
  }

  return engine === 'ejs' ? ejsResponder : pugResponder;
}
