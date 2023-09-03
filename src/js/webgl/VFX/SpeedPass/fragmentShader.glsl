#define TWO_PI 6.28318530718

uniform sampler2D tDiffuse;
uniform float time;
uniform float uLineDensity;
uniform float uLineFalloff;
uniform float uSpeed;
uniform float uCenterMaskSize;
uniform float uCenterMaskEdge;

varying vec2 vUv;

mat2 rotate2d(in float radians){
    float c = cos(radians);
    float s = sin(radians);
    return mat2(c, -s, s, c);
}
vec2 rotate(in vec2 st, in float radians, in vec2 center) {
    return rotate2d(radians) * (st - center) + center;
}

// inverse Lerp
float invLerp (float a, float b, float t) {
  return (t - a) / (b - a);
}

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

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
  vec4 color = texture2D(tDiffuse, vUv);

  // polar coords
  vec2 toCenter = vec2(0.5) - vUv;
  float angle = atan(toCenter.x, toCenter.y) * 0.5;
  vec2 st = vec2(angle);
  st = rotate(st, time * uSpeed, vec2(0.5));

  float n = noise(st * 100.);

  float distanceToCenter = length(toCenter);

  float mask = invLerp(uCenterMaskSize, uCenterMaskSize + uCenterMaskEdge, distanceToCenter);
  mask *= uLineDensity;
  float maskInverted = 1. - mask;
  float maskLineFalloff = maskInverted + uLineFalloff;

  float lines = smoothstep(maskInverted, maskLineFalloff, n);

  gl_FragColor = color + lines;
}