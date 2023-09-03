uniform float uTime;
uniform float uAcceleration;
uniform float uNoiseAmplitude;
uniform float uNoiseFrequency;
uniform float uPathSize;

varying vec2 vUv;
varying vec3 vPosition;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float pathArea = uPathSize / 2.;
  float path = smoothstep(pathArea, pathArea + 2., abs(pos.x));

  // Noise
  vec2 offset = vec2(0, uAcceleration);
  float n = noise((pos.xy * uNoiseFrequency) + offset) * uNoiseAmplitude;
  pos.z += n * path;

  vPosition = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}