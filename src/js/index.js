import SceneManager from './webgl/SceneManager'

const canvas = document.getElementById('canvas')
const sceneManager = new SceneManager(canvas, true)

const resizeCanvas = () => {
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  sceneManager.resizeHandler()
}

const bindEvents = () => {
  window.onresize = resizeCanvas
  resizeCanvas()

  window.addEventListener('keydown', (e) => sceneManager.keydownHandler(e))
  window.addEventListener('keyup', (e) => sceneManager.keyupHandler(e))
  window.addEventListener('touchstart', () => sceneManager.speedUp())
  window.addEventListener('touchend', () => sceneManager.speedDown())
}

const render = () => {
  window.requestAnimationFrame(render)
  sceneManager.update()
}

bindEvents()
render()
