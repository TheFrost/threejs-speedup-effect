import { gsap } from 'gsap'
import * as THREE from 'three'

export default class Guy {
  MIN_POSITION = 4
  MAX_POSITION = 4.75
  oscilation = 1
  rotationVelocity = 0.01

  constructor (scene) {
    const geometry = new THREE.CapsuleGeometry(1, 1, 1, 6)
    const material = new THREE.MeshNormalMaterial({
      // wireframe: true,
      flatShading: true
    })
    this.mesh = new THREE.Mesh(geometry, material)

    const scale = 0.1
    this.mesh.scale.set(scale, scale, scale)
    this.mesh.rotation.x = Math.PI * 0.65
    this.mesh.position.set(0, 0.2, this.MIN_POSITION)

    scene.add(this.mesh)
  }

  update (delta, elapsed) {
    this.mesh.position.y += (Math.sin(elapsed * 5) * 0.001) * this.oscilation
    this.mesh.position.x = (Math.sin(elapsed) * 0.1) * this.oscilation
    this.mesh.rotation.y += this.rotationVelocity
  }

  speedUp () {
    gsap.to(this.mesh.position, {
      z: this.MAX_POSITION,
      duration: 1,
      ease: 'expo.out'
    })

    gsap.to(this.mesh.rotation, {
      x: Math.PI * 0.5,
      duration: 1,
      ease: 'expo.out'
    })

    gsap.to(this, {
      oscilation: 0.5,
      duration: 1,
      ease: 'expo.out'
    })

    gsap.to(this, {
      rotationVelocity: 0.1,
      duration: 1,
      ease: 'expo.out'
    })
  }
  
  speedDown () {
    gsap.to(this.mesh.position, {
      z: this.MIN_POSITION,
      duration: 1,
      ease: 'expo.out'
    })

    gsap.to(this.mesh.rotation, {
      x: Math.PI * 0.65,
      duration: 1,
      ease: 'expo.out'
    })

    gsap.to(this, {
      oscilation: 1,
      duration: 1,
      ease: 'expo.out'
    })

    gsap.to(this, {
      rotationVelocity: 0.01,
      duration: 1,
      ease: 'expo.out'
    })
  }
}