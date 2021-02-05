import { createEjsResponder, createPugResponder } from '../src';

const MOCK_VIEW_DIR = 'mock-views';
const FILENAME_SANS_EXT = 'index';
const EJS_FILENAME = 'index.ejs';
const PUG_FILENAME = 'index.pug';

const mockResponse: any = {
  writeHead: jest.fn(() => mockResponse),
  end: jest.fn(),
};

/**
 * createViewResponder()
 */

describe('Calling createEjsResponder()', () => {
  test('returns a function named \'ejsResponder\'', async () => {
    const result = await createEjsResponder();
    expect(typeof result).toBe('function');
    expect(result.name).toBe('ejsResponder');
  });
});

describe('Calling createPugResponder()', () => {
  test('returns a function named \'pugResponder\'', async () => {
    const result = await createPugResponder();
    expect(typeof result).toBe('function');
    expect(result.name).toBe('pugResponder');
  });
});

/**
 * ejsResponder()
 */

describe('ejsResponder()', () => {
  describe('When passed an empty response object', () => {
    test('returns that response object', async () => {
      const ejsResponder = await createEjsResponder(MOCK_VIEW_DIR);
      const tuftResponse = {};
      const result = ejsResponder(tuftResponse, mockResponse);
      await expect(result).resolves.toBe(tuftResponse);
    });
  });

  describe('When passed a response object that contains a \'render\' property', () => {
    describe('set to an invalid type', () => {
      test('returns that response object', async () => {
        const ejsResponder = await createEjsResponder(MOCK_VIEW_DIR);
        const tuftResponse = { render: 42 };
        const result = ejsResponder(tuftResponse, mockResponse);
        await expect(result).resolves.toBe(tuftResponse);
      });
    });

    describe('set to a filename', () => {
      test('calls the expected response methods', async () => {
        const ejsResponder = await createEjsResponder(MOCK_VIEW_DIR);
        const tuftResponse = {
          render: EJS_FILENAME,
          data: { title: 'Tuft' },
        };
        const result = ejsResponder(tuftResponse, mockResponse);
        const expectedBody = '<!DOCTYPE html>\n<html>\n<head>\n<title>Tuft</title>\n</head>\n<body>\n<h1>Tuft</h1>\n<p>Welcome to Tuft</p>\n</body>\n</html>';

        await expect(result).resolves.toBeUndefined();
        expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
          ['content-type']: 'text/html; charset=UTF-8',
          ['content-length']: expectedBody.length,
        });
        expect(mockResponse.end).toHaveBeenCalledWith(expectedBody);
      });
    });

    describe('set to a filename without an extension', () => {
      test('calls the expected response methods', async () => {
        const ejsResponder = await createEjsResponder(MOCK_VIEW_DIR);
        const tuftResponse = {
          render: FILENAME_SANS_EXT,
          data: { title: 'Tuft' },
        };
        const result = ejsResponder(tuftResponse, mockResponse);
        const expectedBody = '<!DOCTYPE html>\n<html>\n<head>\n<title>Tuft</title>\n</head>\n<body>\n<h1>Tuft</h1>\n<p>Welcome to Tuft</p>\n</body>\n</html>';

        await expect(result).resolves.toBeUndefined();
        expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
          ['content-type']: 'text/html; charset=UTF-8',
          ['content-length']: expectedBody.length,
        });
        expect(mockResponse.end).toHaveBeenCalledWith(expectedBody);
      });
    });

    describe('and a \'status\' property', () => {
      test('calls the expected response methods', async () => {
        const ejsResponder = await createEjsResponder(MOCK_VIEW_DIR);
        const tuftResponse = {
          status: 200,
          render: EJS_FILENAME,
          data: { title: 'Tuft' },
        };
        const result = ejsResponder(tuftResponse, mockResponse);
        const expectedBody = '<!DOCTYPE html>\n<html>\n<head>\n<title>Tuft</title>\n</head>\n<body>\n<h1>Tuft</h1>\n<p>Welcome to Tuft</p>\n</body>\n</html>';

        await expect(result).resolves.toBeUndefined();
        expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
          ['content-type']: 'text/html; charset=UTF-8',
          ['content-length']: expectedBody.length,
        });
        expect(mockResponse.end).toHaveBeenCalledWith(expectedBody);
      });
    });
  });
});

/**
 * pugResponder()
 */

describe('pugResponder()', () => {
  describe('When passed an empty response object', () => {
    test('returns that response object', async () => {
      const pugResponder = await createPugResponder(MOCK_VIEW_DIR);
      const tuftResponse = {};
      const result = pugResponder(tuftResponse, mockResponse);
      expect(result).toBe(tuftResponse);
    });
  });

  describe('When passed a response object that contains a \'render\' property', () => {
    describe('set to an invalid type', () => {
      test('returns that response object', async () => {
        const pugResponder = await createPugResponder(MOCK_VIEW_DIR);
        const tuftResponse = { render: 42 };
        const result = pugResponder(tuftResponse, mockResponse);
        expect(result).toBe(tuftResponse);
      });
    });

    describe('set to a filename', () => {
      test('calls the expected response methods', async () => {
        const pugResponder = await createPugResponder(MOCK_VIEW_DIR);
        const tuftResponse = {
          render: PUG_FILENAME,
          data: { title: 'Tuft' },
        };
        const result = pugResponder(tuftResponse, mockResponse);
        const expectedBody = '<!DOCTYPE html><html><head><title>Tuft</title></head><body><h1>Tuft</h1><p>Welcome to Tuft</p></body></html>';

        expect(result).toBeUndefined();
        expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
          ['content-type']: 'text/html; charset=UTF-8',
          ['content-length']: expectedBody.length,
        });
        expect(mockResponse.end).toHaveBeenCalledWith(expectedBody);
      });
    });

    describe('set to a filename without an extension', () => {
      test('calls the expected response methods', async () => {
        const pugResponder = await createPugResponder(MOCK_VIEW_DIR);
        const tuftResponse = {
          render: FILENAME_SANS_EXT,
          data: { title: 'Tuft' },
        };
        const result = pugResponder(tuftResponse, mockResponse);
        const expectedBody = '<!DOCTYPE html><html><head><title>Tuft</title></head><body><h1>Tuft</h1><p>Welcome to Tuft</p></body></html>';

        expect(result).toBeUndefined();
        expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
          ['content-type']: 'text/html; charset=UTF-8',
          ['content-length']: expectedBody.length,
        });
        expect(mockResponse.end).toHaveBeenCalledWith(expectedBody);
      });
    });

    describe('and a \'status\' property', () => {
      test('calls the expected response methods', async () => {
        const pugResponder = await createPugResponder(MOCK_VIEW_DIR);
        const tuftResponse = {
          status: 200,
          render: PUG_FILENAME,
          data: { title: 'Tuft' },
        };
        const result = pugResponder(tuftResponse, mockResponse);
        const expectedBody = '<!DOCTYPE html><html><head><title>Tuft</title></head><body><h1>Tuft</h1><p>Welcome to Tuft</p></body></html>';

        expect(result).toBeUndefined();
        expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
          ['content-type']: 'text/html; charset=UTF-8',
          ['content-length']: expectedBody.length,
        });
        expect(mockResponse.end).toHaveBeenCalledWith(expectedBody);
      });
    });
  });
});
