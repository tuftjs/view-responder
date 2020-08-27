import { createViewResponder } from '../src';

const MOCK_VIEW_DIR = 'mock-views';
const MOCK_EJS_FILENAME = 'index.ejs';
const MOCK_PUG_FILENAME = 'index.pug';

const mockResponse: any = {
  writeHead: jest.fn(() => mockResponse),
  end: jest.fn(),
};

const mockConsoleError = jest
  .spyOn(console, 'error')
  .mockImplementation(() => { });

const mockExit = jest
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);

afterAll(() => {
  jest.restoreAllMocks();
});

/**
 * createViewResponder()
 */

describe('Calling createViewResponder(\'ejs\')', () => {
  test('returns a function named \'ejsResponder\'', () => {
    const result = createViewResponder('ejs');
    expect(typeof result).toBe('function');
    expect(result.name).toBe('ejsResponder');
  });
});

describe('Calling createViewResponder(\'pug\')', () => {
  test('returns a function named \'pugResponder\'', () => {
    const result = createViewResponder('pug');
    expect(typeof result).toBe('function');
    expect(result.name).toBe('pugResponder');
  });
});

describe('Calling createViewResponder() without passing a valid argument', () => {
  test('logs an error and exits', () => {
    const expectedError = Error('\'engine\' parameter must be either \'ejs\' or \'pug\'');
    const expectedErrorCode = 1;
    //@ts-expect-error
    createViewResponder();
    expect(mockConsoleError).toHaveBeenCalledWith(expectedError);
    expect(mockExit).toHaveBeenCalledWith(expectedErrorCode);
  });
});

/**
 * ejsResponder()
 */

const ejsResponder = createViewResponder('ejs', MOCK_VIEW_DIR);

describe('ejsResponder()', () => {
  describe('When passed an empty response object', () => {
    test('returns that response object', async () => {
      const tuftResponse = {};
      const result = ejsResponder(tuftResponse, mockResponse);
      await expect(result).resolves.toBe(tuftResponse);
    });
  });

  describe('When passed a response object that contains a \'render\' property', () => {
    describe('set to an invalid type', () => {
      test('returns that response object', async () => {
        const tuftResponse = { render: 42 };
        const result = ejsResponder(tuftResponse, mockResponse);
        await expect(result).resolves.toBe(tuftResponse);
      });
    });

    describe('set to a filename', () => {
      test('calls the expected response methods', async () => {
        const tuftResponse = {
          render: MOCK_EJS_FILENAME,
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
        const tuftResponse = {
          status: 200,
          render: MOCK_EJS_FILENAME,
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

const pugResponder = createViewResponder('pug', MOCK_VIEW_DIR);

describe('pugResponder()', () => {
  describe('When passed an empty response object', () => {
    test('returns that response object', () => {
      const tuftResponse = {};
      const result = pugResponder(tuftResponse, mockResponse);
      expect(result).toBe(tuftResponse);
    });
  });

  describe('When passed a response object that contains a \'render\' property', () => {
    describe('set to an invalid type', () => {
      test('returns that response object', () => {
        const tuftResponse = { render: 42 };
        const result = pugResponder(tuftResponse, mockResponse);
        expect(result).toBe(tuftResponse);
      });
    });

    describe('set to a filename', () => {
      test('calls the expected response methods', () => {
        const tuftResponse = {
          render: MOCK_PUG_FILENAME,
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
      test('calls the expected response methods', () => {
        const tuftResponse = {
          status: 200,
          render: MOCK_PUG_FILENAME,
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
