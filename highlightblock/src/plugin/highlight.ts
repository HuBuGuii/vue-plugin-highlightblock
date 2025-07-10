import { createApp, defineComponent, h, Transition, unref } from 'vue'
import type { highlightOptions } from './directive'
import './highlight.css'

// 单例变量提升到模块作用域
let mask: HTMLElement | null = null
let highlightInstance: ReturnType<typeof createApp> | null = null
let isActive = false

export function createHighlightComponent(options: highlightOptions) {
  const resolvedOptions = {
    maskColor: unref(options.maskColor) || 'rgba(200, 200, 200, 0.5)',
    borderColor: unref(options.borderColor) || 'red',
    switch: unref(options.switch),
    target: options.target,
  }

  const HighlightComponent = defineComponent({
    name: 'HighlightComponent',
    setup() {
      return () => {
        const maskElement = h('div', {
          class: 'highlight-mask',
          style: {
            'background-color': resolvedOptions.maskColor,
          },
        })
        return () =>
          h(
            Transition,
            { name: 'fade', appear: true },
            {
              default: () => maskElement,
            },
          )
      }
    },
  })

  const createMask = () => {
    if (isActive) return // 单例检测
    highlightInstance = createApp(HighlightComponent)
    mask = highlightInstance.mount(document.createElement('div')).$el
    document.body.appendChild(mask!)
    isActive = true
    addTargetClass()
  }

  const destroyMask = () => {
    if (highlightInstance) {
      highlightInstance.unmount()
      highlightInstance = null
    }
    if (mask && document.body.contains(mask)) {
      document.body.removeChild(mask)
      mask = null
    }
    isActive = false
    removeTargetClass()
  }

  const addTargetClass = () => {
    options.target.classList.add('highlight-target')
    options.target.style.borderColor = resolvedOptions.borderColor
  }

  const removeTargetClass = () => {
    options.target.classList.remove('highlight-target')
    options.target.style.borderColor = ''
  }

  return {
    createMask,
    destroyMask,
    removeTargetClass,
  }
}
