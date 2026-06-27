#include "../../../shared/shaders/simplex-noise-4d.glsl"

uniform float uTime;

void main(){

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particlesTexture = texture(uParticles, uv);

    float time = uTime * 0.2;

    vec3 noisedCoords = vec3(
        simplexNoise4d(vec4(particlesTexture.xyz + 0.0, time)),
        simplexNoise4d(vec4(particlesTexture.xyz + 1.0, time)),
        simplexNoise4d(vec4(particlesTexture.xyz + 2.0, time))
    );

    particlesTexture.xyz += normalize(noisedCoords) * 0.01;
    gl_FragColor = vec4(particlesTexture);

}