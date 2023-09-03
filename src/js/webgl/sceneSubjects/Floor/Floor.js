import { gsap } from 'gsap'
import * as THREE from 'three'
import { pane } from '../../tools/'

import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default class Floor {
  MAX_VELOCITY = 1
  MIN_VELOCITY = 0.1
  WIDTH = 10
  HEIGHT = 20
  QUALITY = 100

  acceleration = 0
  velocity = this.MIN_VELOCITY

  constructor (scene) {
    const geometry = new THREE.PlaneGeometry(this.WIDTH, this.HEIGHT, this.QUALITY, this.QUALITY)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tMap: { value: this.texture },
        uTime: { value: 0 },
        uAcceleration: { value: this.acceleration },
        uTopColor: { value: new THREE.Color('#7fbf7f') },
        uBottomColor: { value: new THREE.Color('#e5dcd3') },
        uNoiseAmplitude: { value: 2 },
        uNoiseFrequency: { value: 1 },
        uPathSize: { value: 0.1 }
      },
      fragmentShader,
      vertexShader,
      // wireframe: true
    })

    const mesh = new THREE.Mesh(geometry, this.material)
    mesh.rotation.x = -(Math.PI / 2)

    scene.add(mesh)

    this.debug()
  }

  update (delta, elapsed) {
    this.acceleration += this.velocity
    this.material.uniforms.uAcceleration.value = this.acceleration;
  }

  speedUp () {
    gsap.to(this, {
      velocity: this.MAX_VELOCITY,
      duration: 1,
      ease: 'expo.inOut'
    })
  }

  speedDown () {
    gsap.to(this, {
      velocity: this.MIN_VELOCITY,
      duration: 1,
      ease: 'expo.out'
    })
  }

  debug () {
    const tweaks = pane.addFolder({
      title: 'Terrain',
      expanded: false
    })

    tweaks.addBinding(this.material.uniforms.uNoiseAmplitude, 'value', {
      min: 0.1, max: 5, step: 0.1, label: 'Mountains Amplitude'
    })
    tweaks.addBinding(this.material.uniforms.uNoiseFrequency, 'value', {
      min: 0.1, max: 5, step: 0.1, label: 'Mountains Frequency'
    })
    tweaks.addBinding(this.material.uniforms.uPathSize, 'value', {
      min: 0.1, max: 9, step: 0.1, label: 'Path Size'
    })
  }
}