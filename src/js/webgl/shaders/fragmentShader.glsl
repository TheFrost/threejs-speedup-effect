varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

void main() {
  vec3 color = vec3(0.0);

  color += 0.5 + 0.5 * cos(uTime + vUv.xyx + vec3(0.0,2.0,4.0));

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}