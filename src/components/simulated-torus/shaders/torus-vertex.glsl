uniform sampler2D uParticlesTexture;

attribute vec2 aParticleUV;

varying vec3 vColor;

void main(){
    
    vec3 modelPositionLocal = position;
    modelPositionLocal.xyz += texture(uParticlesTexture, aParticleUV).xyz;

    vec4 modelPosition = modelMatrix * vec4(modelPositionLocal, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vColor = projectedPosition.xyz;
    gl_Position = projectedPosition;

    gl_PointSize = 20.0;

    gl_PointSize /= -viewPosition.z;

}