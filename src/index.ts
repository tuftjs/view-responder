import type { ServerResponse } from 'http';
import type { TuftResponse } from 'tuft';

import { join } from 'path';

const DEFAULT_VIEW_DIR = '';
const DEFAULT_HTTP_STATUS = 200;
const EJS_EXTNAME = '.ejs';
const PUG_EXTNAME = '.pug';
const HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';

/**
 * Returns a Tuft responder function for rendering views using the EJS engine.
 */

export async function createEjsResponder(viewDir = DEFAULT_VIEW_DIR) {
  const { renderFile } = await import('ejs');

  return async function ejsResponder(
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

    const body = await renderFile(filename, data, {
      rmWhitespace: true,
      cache: true,
    });

    response
      .writeHead(status ?? DEFAULT_HTTP_STATUS, {
        ['content-type']: HTML_CONTENT_TYPE,
        ['content-length']: Buffer.byteLength(body),
      })
      .end(body);
  };
}

/**
 * Returns a Tuft responder function for rendering views using the Pug engine.
 */

export async function createPugResponder(viewDir = DEFAULT_VIEW_DIR) {
  const { renderFile } = await import('pug');

  return function pugResponder(
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

    const body = renderFile(filename, data);

    response
      .writeHead(status ?? DEFAULT_HTTP_STATUS, {
        ['content-type']: HTML_CONTENT_TYPE,
        ['content-length']: Buffer.byteLength(body),
      })
      .end(body);
  };
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
