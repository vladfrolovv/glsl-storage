#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define RADIUS 0.5
#define ANGLEOFFSET 45.0
#define r 0.75

uniform vec2 u_resolution;
uniform float u_time;

float angle_from_vector(in vec2 _center, in vec2 _st) {
    float dx = _st.x - _center.x;
    float dy = _st.y - _center.y;
    
    float angle = atan(dy, dx) * (180.0 / PI);
    return mod(angle + 360.0, 360.0);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st = st * 2.0 - 1.0;
    
    float uv = 0.0;
    
    float pointR = distance(st, vec2(0));
    
    float startPointAngle = 45.0;
    float endPointAngle = 270.0;

    float angleOfPoint = angle_from_vector(vec2(0), st);
    if (pointR <= r 
        && angleOfPoint >= startPointAngle 
        && angleOfPoint <= endPointAngle) {
        uv = 1.0;
    } 
    
	gl_FragColor = vec4(uv);
}
