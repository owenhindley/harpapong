precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

const float aspectRatio = 39.0/11.0;
const float size = 1.0/39.0;

void main(void) {
	vec2 offset = vec2(size, size*aspectRatio);
	vec2 uv = floor(vTextureCoord/offset) * offset;
    gl_FragColor = texture2D(texture, uv);
    // gl_FragColor.rgb = vec3(1.0) - gl_FragColor.rgb;
}