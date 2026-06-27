#define GPGPU_DEBUG_PLANE_COLOR vec3(0.7, 0.4, 0.1)

void main(){

    vec3 rgb = GPGPU_DEBUG_PLANE_COLOR;

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 particlesTexture = texture(uParticles, uv);
    float mult = 1.0;
    if(particlesTexture.y > 2.0) {
        particlesTexture.y = 0.0;
    }

    particlesTexture.y += 0.01 * mult;

    gl_FragColor = vec4(particlesTexture);

}