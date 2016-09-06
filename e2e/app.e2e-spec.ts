import { SpaceroniPage } from './app.po';

describe('spaceroni App', function() {
  let page: SpaceroniPage;

  beforeEach(() => {
    page = new SpaceroniPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
