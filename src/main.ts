import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as bowser from 'bowser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const browser = bowser.getParser(window.navigator.userAgent);
function addHtmlClass(browserClass): void {
  const htmlElt = document.getElementsByClassName('incompatible-error')[0];
  if (htmlElt.className.indexOf(browserClass) === -1) {
    htmlElt.className = htmlElt.className + ' ' + browserClass;
  }
}

const browserVersion = parseFloat(browser.getBrowser().version.split('.')[0]);
const isExplorer = browser.getBrowser().name === 'Internet Explorer';
const isEdgeUnsupported = browser.getBrowser().name === 'Microsoft Edge' && browserVersion <= 13;
if (isExplorer || isEdgeUnsupported) {
  addHtmlClass('browser-unsupported');
} else {
  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}
