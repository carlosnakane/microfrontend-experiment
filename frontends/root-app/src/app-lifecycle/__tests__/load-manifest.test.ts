import loadManifest, { manifestFileName } from '../load-manifest';
import { FetchMock } from "jest-fetch-mock";
const fetchMock = fetch as FetchMock;

describe('load-manifest should...', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('load and parse a json manifest', () => {
    const mockData = { "rootnode": "<div id='root'></div>", "entrypoint": "static/js/main.2e4b03e4.chunk.js", "components": ["component-a"], "assets": ["static/css/main.162d0928.chunk.css", "static/js/runtime~main.e9246e7d.js", "static/js/2.b41502e9.chunk.js"] };
    const mockUrl = 'http://test.com';

    fetchMock.mockResponseOnce(JSON.stringify({ data: mockData }));

    loadManifest(mockUrl).then(res => {
      expect(res).toBe({ data: mockData });
    });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${mockUrl}/${manifestFileName}`);
  });

  it('throw an error', () => {
    const mockUrl = 'http://nowhere';
    loadManifest(mockUrl).then(res => {
      expect(res).toBeNull();
    });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${mockUrl}/${manifestFileName}`);
  });
});