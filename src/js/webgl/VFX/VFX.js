import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SpeedPass } from './SpeedPass/SpeedPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { pane } from '../tools'
import { gsap } from 'gsap'

export default class VFX {
  constructor ({ renderer, scene, camera }) {
    const rt = new THREE.WebGLRenderTarget(800, 600, {
      samples: 2
    })

    this.composer = new EffectComposer(renderer, rt)

    const renderPass = new RenderPass(scene, camera)
    this.composer.addPass(renderPass)

    this.shaderPass = new ShaderPass(SpeedPass)
    this.composer.addPass(this.shaderPass)

    if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
      const smaaPass = new SMAAPass()
      this.composer.addPass(smaaPass)
    }

    this.debug()
  }

  debug () {
    const tweaks = pane.addFolder({
      title: 'VFX Speed',
      expanded: false
    })

    tweaks.addBinding(this.shaderPass.uniforms.uLineDensity, 'value', {
      min: 0, max: 1, step: 0.1, label: 'Line Density'
    })
    tweaks.addBinding(this.shaderPass.uniforms.uLineFalloff, 'value', {
      min: 0, max: 1, step: 0.1, label: 'Line Falloff'
    })
    tweaks.addBinding(this.shaderPass.uniforms.uSpeed, 'value', {
      min: 0, max: 10, step: 0.1, label: 'Speed'
    })
    tweaks.addBinding(this.shaderPass.uniforms.uCenterMaskSize, 'value', {
      min: 0, max: 1, step: 0.01, label: 'Center Mask Size'
    })
    tweaks.addBinding(this.shaderPass.uniforms.uCenterMaskEdge, 'value', {
      min: 0, max: 1, step: 0.01, label: 'Center Mask Edge'
    })
  }

  speedUp () {
    gsap.to(this.shaderPass.uniforms.uLineDensity, {
      value: 1,
      duration: 1,
      ease: 'expo.inOut'
    })
  }

  speedDown () {
    gsap.to(this.shaderPass.uniforms.uLineDensity, {
      value: 0,
      duration: 1,
      ease: 'expo.out'
    })
  }

  update (delta, elapsed) {
    this.composer.render()
    this.shaderPass.uniforms.time.value = elapsed
  }
}