precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float xAmt;
uniform float yAmt;
const float PI = 3.141592653;

void main(void) {
	float ratio = xAmt / yAmt;
	float size = 1.0/xAmt;
	vec2 offset = vec2(size, size*ratio);
	vec2 uv = floor(vTextureCoord/offset) * offset;
	vec2 relatedUV = vTextureCoord - uv;

	float margin = .0015;
	if(relatedUV.x < margin || relatedUV.x > 1.0-margin || relatedUV.y < margin*ratio || relatedUV.y > 1.0-margin*ratio) {
		// gl_FragColor = vec4(vec3(.3), 1.0);
		gl_FragColor = vec4(.3);
	} else {
    	gl_FragColor = texture2D(texture, uv+offset*.5);
    	float floorIndex = floor(vTextureCoord.y/offset.y);
    	float offset = sin(relatedUV.x / size * PI - floorIndex*.5);
    	gl_FragColor.rgb *= pow(offset, 15.0);
    }
}