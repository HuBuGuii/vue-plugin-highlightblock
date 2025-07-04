// 高亮与遮罩的具体操作逻辑

let mask: HTMLElement | null = null;

export function showHighlight(target: HTMLElement) {
  removeHighlight();

  // 创建遮罩层
  mask = document.createElement('div');
  mask.style.position = 'fixed';
  mask.style.left = '0';
  mask.style.top = '0';
  mask.style.width = '100vw';
  mask.style.height = '100vh';
  mask.style.background = 'rgba(0,0,0,0.7)';
  mask.style.zIndex = '9999';
  mask.style.pointerEvents = 'auto';

  // 遮罩点击关闭
  mask.onclick = removeHighlight;

  document.body.appendChild(mask);

  // 高亮目标元素
  target.style.position = 'relative';
  target.style.zIndex = '10000';
  target.style.boxShadow = '0 0 0 4px #fff, 0 0 20px 8px #fffa';

  // 可选：滚动到视野内
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function removeHighlight() {
  if (mask) {
    mask.remove();
    mask = null;
  }
  // 清理所有可能被高亮的元素
  document.querySelectorAll('[data-v-highlight-active]').forEach(el => {
    (el as HTMLElement).style.zIndex = '';
    (el as HTMLElement).style.boxShadow = '';
    el.removeAttribute('data-v-highlight-active');
  });
}
