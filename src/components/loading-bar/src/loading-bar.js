import Vue from 'vue'
import LoadingBarVue from './loading-bar.vue'

const LoadingBarConstructor = Vue.extend(LoadingBarVue)

let loadingBarInstance, instance, timer
let width = 2

const LoadingBar = options => {
  options = options || {}

  instance = new LoadingBarConstructor({
    data: options
  })

  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
}

LoadingBar.prototype.update = options => {
  if (options.percent) {
    instance.percent = options.percent
  }
  if (options.status) {
    instance.status = options.status
  }
  if (options.show) {
    instance.show = options.show
  }
}

LoadingBar.prototype.destroy = () => {
  document.body.removeChild(instance.vm.$el)
}

function getLoadingBarInstance () {
  loadingBarInstance = loadingBarInstance || new LoadingBar({ width })
  return loadingBarInstance
}

function clearTimer () {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function update (options) {
  const barInstance = getLoadingBarInstance()
  barInstance.update(options)
}

function hide () {
  setTimeout(() => {
    update({
      percent: 0,
      show: false
    })
    destroy()
  }, 800)
}

function destroy () {
  const barInstance = getLoadingBarInstance()
  clearTimer()
  loadingBarInstance = null
  barInstance.destroy()
}

export default {
  config (options) {
    if (options.width) {
      width = options.width
    }
  },
  start () {
    if (timer) return

    let percent = 0

    update({
      percent,
      status: 'success',
      show: true
    })

    timer = setInterval(() => {
      percent += Math.floor((Math.random() * 3) + 5)
      if (percent > 95) {
        clearTimer()
      }
      update({
        percent,
        status: 'success',
        show: true
      })
    }, 200)
  },
  update (percent) {
    clearTimer()
    update({
      percent,
      status: 'success',
      show: true
    })
  },
  finish () {
    clearTimer()
    update({
      percent: 100,
      status: 'success',
      show: true
    })
    hide()
  },
  error () {
    clearTimer()
    update({
      percent: 100,
      status: 'error',
      show: true
    })
    hide()
  }
}
