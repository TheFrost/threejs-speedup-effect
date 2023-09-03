import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

// subjects
import { gsap } from 'gsap'
import Floor from './sceneSubjects/Floor/Floor'
import VFX from './VFX/VFX'
import Guy from './sceneSubjects/Guy'

export default class SceneManager {
  clock = new THREE.Clock()
  isSpeedupActive = false

  buildVFX = () => {
    return new VFX({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera
    })
  }

  buildScene = () => {
    const scene = new THREE.Scene()

    return scene
  }

  buildRender = ({ width, height }) => {
    const { canvas } = this

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    )
    renderer.setSize(width, height)

    return renderer
  }

  buildCamera = ({ width, height }) => {
    const aspectRatio = width / height
    const fieldOfView = 40
    const nearPlane = 0.1
    const farPlane = 1000
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    )
    camera.position.z = 5
    camera.position.y = 0.5

    return camera
  }

  buildHelpers = () => {
    const gridHelper = new THREE.GridHelper(20, 20)
    this.scene.add(gridHelper)
    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
  }

  buildStats = () => {
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  }

  buildOrbitControls = (camera, domElement) => {
    const controls = new OrbitControls(camera, domElement)
    controls.enableDamping = true

    return controls
  }

  createSceneSubjects = scene => {
    const sceneSubjects = [
      new Floor(scene),
      new Guy(scene)
    ]

    return sceneSubjects
  }

  constructor (canvas, debugMode = false) {
    this.debugMode = debugMode
    this.canvas = canvas
    this.screenDimentions = {
      width: this.canvas.width,
      height: this.canvas.height
    }

    this.scene = this.buildScene()
    this.renderer = this.buildRender(this.screenDimentions)
    this.camera = this.buildCamera(this.screenDimentions)
    // this.buildHelpers()
    this.sceneSubjects = this.createSceneSubjects(this.scene)
    // this.orbitControls = this.buildOrbitControls(this.camera, this.renderer.domElement)
    this.VFX = this.buildVFX()
    if (debugMode) {
      this.buildStats()
    }
  }

  update () {
    if (this.debugMode) this.stats.begin()

    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()

    this.sceneSubjects.map(s => s.update ? s.update(delta, elapsed) : null)

    this.renderer.render(
      this.scene,
      this.camera
    )

    this.orbitControls?.update()

    this.VFX.update(delta, elapsed)

    if (this.debugMode) this.stats.end()
  }

  resizeHandler () {
    const { width, height } = this.canvas

    this.screenDimentions = { width, height }

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    )
    this.renderer.setSize(width, height)
  }

  keydownHandler ({ code }) {
    if (code === 'Space') this.speedUp()
  }

  keyupHandler ({ code }) {
    if (code === 'Space') this.speedDown()
  }

  speedUp () {
    if (this.isSpeedupActive) return

    this.isSpeedupActive = true

    gsap.to(this.camera, {
      fov: 125,
      duration: 1,
      ease: 'expo.inOut',
      onUpdate: () => this.camera.updateProjectionMatrix()
    })

    this.sceneSubjects.map(s => s.speedUp?.())
    this.VFX.speedUp()
  }

  speedDown () {
    gsap.to(this.camera, {
      fov: 40,
      duration: 1,
      ease: 'expo.out',
      onUpdate: () => this.camera.updateProjectionMatrix()
    })

    this.sceneSubjects.map(s => s.speedDown?.())
    this.VFX.speedDown()

    this.isSpeedupActive = false
  }
}
