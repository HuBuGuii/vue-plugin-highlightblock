import type { Directive } from 'vue';
import { showHighlight, removeHighlight } from './highlight';

const highlightDirective: Directive = {
  mounted(el) {
    // 让目标元素可高亮，可自定义触发方式
    el.addEventListener('click', () => {
      // 标记当前元素，方便移除时清理样式
      el.setAttribute('data-v-highlight-active', '1');
      showHighlight(el);
    });
  },
  unmounted() {
    removeHighlight();
  }
};

export default highlightDirective;
