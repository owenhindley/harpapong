precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform vec2 resolution;
uniform float time;

const float PI      = 3.141592653;
const float radius  = .5;

void main(void) {
    vec2 cPos = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    float cLength = length(cPos);

    vec2 uv = gl_FragCoord.xy/resolution.xy+(cPos/cLength)*cos(cLength*12.0-time*4.0)*0.03;
    // vec3 col = texture2D(texture,uv).xyz;
    // vec3 col = vec3(cPos);

    gl_FragColor = texture2D(texture,uv);
}