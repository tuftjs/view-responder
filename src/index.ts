import type { ServerResponse } from 'http';
import type { TuftResponse } from 'tuft';

import { renderFile as renderEjsFile } from 'ejs';
import { renderFile as renderPugFile } from 'pug';
import { join } from 'path';

const DEFAULT_VIEW_DIR = '';
const DEFAULT_HTTP_STATUS = 200;
const EJS_EXTNAME = '.ejs';
const PUG_EXTNAME = '.pug';
const HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';

/**
 * Returns a Tuft responder function for rendering the provided template engine type.
 */

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

    // Add '.ejs' file extension if it doesn't exist on the provided filename.
    const filename = hasExtension(render, EJS_EXTNAME)
      ? join(viewDir, render)
      : join(viewDir, render + EJS_EXTNAME);

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

    // Add '.pug' file extension if it doesn't exist on the provided filename.
    const filename = hasExtension(render, PUG_EXTNAME)
      ? join(viewDir, render)
      : join(viewDir, render + PUG_EXTNAME);

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

/**
 * Returns true if the provided filename ends with the provided extension, or false otherwise.
 */

function hasExtension(filename: string, extname: string) {
  return (
    filename.length > extname.length &&
    filename.indexOf(extname) === filename.length - extname.length
  );
}
