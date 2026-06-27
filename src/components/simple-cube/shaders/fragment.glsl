uniform float uTime;

varying vec2 vUv;

void main() {

    vec2 formattedUv = mix(vec2(1.0) - vUv, vUv, sin(uTime));
    vec2 uvColor = formattedUv;
    gl_FragColor = vec4(uvColor, 0.3, 1.0);

}