uniform sampler2D tMap;
uniform float uTime;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;

varying vec2 vUv;
varying vec3 vPosition;


void main() {
  vec4 color = vec4(mix(uTopColor, uBottomColor, 1. - vPosition.z), 1.0);

  gl_FragColor = color;
}