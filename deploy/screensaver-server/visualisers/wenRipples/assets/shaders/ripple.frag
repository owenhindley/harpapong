precision mediump float;

vec4 permute(vec4 x) {  return mod(((x*34.0)+1.0)*x, 289.0);    }
vec4 taylorInvSqrt(vec4 r) {    return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
    return snoise(vec3(x, y, z));
}


mat4 rotateZ(float psi){
    return mat4(
        vec4(cos(psi),-sin(psi),0.,0),
        vec4(sin(psi),cos(psi),0.,0.),
        vec4(0.,0.,1.,0.),
        vec4(0.,0.,0.,1.));
}


vec3 rotateZ(vec3 v, float theta) {
    mat4 mtx = rotateZ(theta);
    vec4 newV = mtx * vec4(v, 1.0) ;
    return newV.xyz;
}


float map(float value, float sx, float sy, float tx, float ty) {
    float p = ( value - sx ) / ( sy - sx );
    if(p < .0) p = .0;
    else if(p > 1.0) p = 1.0;
    return tx + ( ty - tx ) * p;
}

varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float time;

const float PI      = 3.141592653;
const float radius  = .5;

const float waveLength = .05;

uniform vec2 waveCenter0;
uniform float waveFront0;
uniform float waveLength0;

uniform vec2 waveCenter1;
uniform float waveFront1;
uniform float waveLength1;

uniform vec2 waveCenter2;
uniform float waveFront2;
uniform float waveLength2;

uniform vec2 waveCenter3;
uniform float waveFront3;
uniform float waveLength3;

uniform vec2 waveCenter4;
uniform float waveFront4;
uniform float waveLength4;

uniform vec2 waveCenter5;
uniform float waveFront5;
uniform float waveLength5;

uniform vec2 waveCenter6;
uniform float waveFront6;
uniform float waveLength6;

uniform vec2 waveCenter7;
uniform float waveFront7;
uniform float waveLength7;

uniform vec2 waveCenter8;
uniform float waveFront8;
uniform float waveLength8;

uniform vec2 waveCenter9;
uniform float waveFront9;
uniform float waveLength9;

const vec2 center = vec2(.5);


uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;


const float waveSize = .0;
uniform float generalWaveHeight;
uniform float showFullPerlinColors;

const float aspectRatio = 39.0 / 11.0;
float contrast(float value, float scale) {  return (value - .5) * scale + .5;   }

float getWaveHeight(vec2 uv, vec2 waveCenter, float waveFront, float waveLength) {
    float distToWave = distance(uv, waveCenter);    
    if( abs(distToWave - waveFront) < waveLength) {   return (1.0 - sin(abs(distToWave - waveFront)/waveLength * PI * .5)) * generalWaveHeight; }
    else return 0.0;
}

void main(void) {
	vec2 uv = vTextureCoord;
    uv.x = contrast(uv.x, aspectRatio);
    
	float waveHeight = 0.0;
	vec4 colorOrg = texture2D(texture, uv);

    waveHeight += getWaveHeight(uv, waveCenter0, waveFront0, waveLength0);
    waveHeight += getWaveHeight(uv, waveCenter1, waveFront1, waveLength1);
    waveHeight += getWaveHeight(uv, waveCenter2, waveFront2, waveLength2);
    waveHeight += getWaveHeight(uv, waveCenter3, waveFront3, waveLength3);
    waveHeight += getWaveHeight(uv, waveCenter4, waveFront4, waveLength4);
    waveHeight += getWaveHeight(uv, waveCenter5, waveFront5, waveLength5);
    waveHeight += getWaveHeight(uv, waveCenter6, waveFront6, waveLength6);
    waveHeight += getWaveHeight(uv, waveCenter7, waveFront7, waveLength7);
    waveHeight += getWaveHeight(uv, waveCenter8, waveFront8, waveLength8);
    waveHeight += getWaveHeight(uv, waveCenter9, waveFront9, waveLength9);

    float blend = snoise(uv.x, uv.y, time);
    blend = waveHeight;
    vec3 c1;
    vec3 c2;
    float offset;

    if(blend < .25) {
        c1 = color0;
        c2 = color1;
        offset = blend;
    } else if(blend < .5) {
        c1 = color1;
        c2 = color2;
        offset = blend-.25;
    } else if(blend < .75) {
        c1 = color2;
        c2 = color3;
        offset = blend-.5;
    } else {
        c1 = color3;
        c2 = color4;
        offset = blend-.75;
    } 

    vec3 color = mix(c1, c2, offset/.25);
    
    gl_FragColor = vec4(color, waveHeight+showFullPerlinColors);
    
}