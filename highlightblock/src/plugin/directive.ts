import type { Directive, MaybeRef } from 'vue'
import { ref } from 'vue'
import { createHighlightComponent } from './highlight'

// 创建 WeakMap 存储元素到高亮实例的映射
const instanceMap = new WeakMap<HTMLElement, any>()

type highlightObject = {
  [key: string]: any
}
type highlightBinding = {
  value: boolean | highlightObject
  instance: any
}
export type highlightOptions = {
  maskColor?: MaybeRef<string>
  borderColor?: MaybeRef<string>
  switch?: MaybeRef<boolean>
  target: HTMLElement
}

const isObject = (val: unknown): val is object => {
  return val !== null && typeof val === 'object'
}

const createHighlightMask = (el: HTMLElement, binding: highlightBinding) => {
  const getBindingProp = (key: string) => {
    if (isObject(binding.value)) {
      return ref(binding.value[key])
    }
    return undefined
  }

  const defaultOption = () => {
    if (typeof binding.value === 'boolean') {
      return ref(binding.value)
    }
    if (isObject(binding.value)) {
      return ref(true)
    }
  }

  const options: highlightOptions = {
    maskColor: getBindingProp('maskColor'),
    borderColor: getBindingProp('borderColor'),
    switch: getBindingProp('switch') || defaultOption(),
    target: el,
  }

  // 创建高亮组件并获取控制方法
  const highlight = createHighlightComponent(options)

  // 使用 WeakMap 存储实例
  instanceMap.set(el, { highlight, options })

  // 创建高亮遮罩
  highlight.createMask()
}

const updateOptions = (oldOptions: highlightOptions, newOptions: highlightOptions) => {
  
}

const highlightDirective: Directive = {
  mounted(el, binding) {
    if (binding.value) {
      createHighlightMask(el, binding)
    }
  },

  updated(el, binding) {
    // 处理值更新
    const instance = instanceMap.get(el)
    if (!instance) return

    // 根据绑定值变化决定显示或隐藏高亮
    if (binding.value) {
      instance.highlight.createMask()
    } else {
      instance.highlight.destroyMask()
    }
  },

  unmounted(el) {
    // 组件卸载时销毁高亮
    const instance = instanceMap.get(el)
    if (instance) {
      instance.highlight.destroyMask()
      instanceMap.delete(el)
    }
  },
}

export default highlightDirective
