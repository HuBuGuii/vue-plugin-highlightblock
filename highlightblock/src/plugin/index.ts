import type { App } from 'vue';
import highlightDirective from './directive';

export const HightlightPlugin = {
  install(app: App) {
    app.directive('highlight', highlightDirective);
  }
};

export default HightlightPlugin;
