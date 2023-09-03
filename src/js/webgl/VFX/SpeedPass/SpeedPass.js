import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'

const SpeedPass = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    uLineDensity: { value: 0 },
    uLineFalloff: { value: 1 },
    uSpeed: { value: 1 },
    uCenterMaskSize: { value: 0 },
    uCenterMaskEdge: { value: 1 },
  },
  vertexShader,
  fragmentShader
}

export { SpeedPass }