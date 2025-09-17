import { PageMapGenerator } from './page-map-generator';
import { CfiResolver } from './cfi-resolver';

describe('PageMapGenerator', () => {
  let pageMapGenerator: PageMapGenerator;
  let mockCfiResolver: jest.Mocked<CfiResolver>;

  beforeEach(() => {
    mockCfiResolver = {
      resolveForElement: jest.fn(),
      resolveEndForElement: jest.fn(),
    } as any;

    pageMapGenerator = new PageMapGenerator(mockCfiResolver);
  });

  it('should be instantiated correctly', () => {
    expect(pageMapGenerator).toBeInstanceOf(PageMapGenerator);
  });
});
