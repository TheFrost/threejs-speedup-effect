import * as THREE from 'three'
import { pubsub } from '../../tools'

export default class LoadingManager {
  constructor () {
    this.manager = new THREE.LoadingManager()

    this.bindEvents()
  }

  bindEvents () {
    this.manager.onLoad = () => this.onLoadHandler()
    this.manager.onProgress = (_, loaded, total) => this.onProgressHandler(loaded, total)
  }

  onLoadHandler () {
    window.setTimeout(() => {
      pubsub.publish('loadermanager:complete')
    }, 1000)
  }

  onProgressHandler (loaded, total) {
    const progress = Math.floor(loaded / total * 100)
    pubsub.publish('loadermanager:progress', progress)
  }
}
