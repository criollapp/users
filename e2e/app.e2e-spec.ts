import { GuCommonModulePage } from './app.po';

describe('gu-common-module App', () => {
  let page: GuCommonModulePage;

  beforeEach(() => {
    page = new GuCommonModulePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
