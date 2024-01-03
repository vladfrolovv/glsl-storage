#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define RADIUS 0.5
#define ANGLEOFFSET 45.0
#define MAINCIRCLERADIUS 0.75
#define ANGLESTART 0.0
#define ANGLEEND 90.0

uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
		_radius+(_radius*0.01),
        dot(dist,dist)*4.0);
}

float circle(in vec2 _st, in float _radius, in float _borderWidth){
    vec2 dist = _st - vec2(0.5);
    float outerSmooth = smoothstep(_radius - (_radius * 0.01), _radius + (_radius * 0.01), dot(dist, dist) * 4.0);
    float innerSmooth = smoothstep((_radius + _borderWidth) - ((_radius + _borderWidth) * 0.01), (_radius + _borderWidth)
                                   + ((_radius + _borderWidth) * 0.01), dot(dist, dist) * 4.0);
    return outerSmooth - innerSmooth;
}

vec2 vector_from_angle(in float angle, in float radius) {
    float x = radius * cos(angle);
    float y = radius * sin(angle);
    
    return vec2(x, y);
}

float angle_from_vector(in vec2 _center, in vec2 _st) {
    float dx = _st.x - _center.x;
    float dy = _st.y - _center.y;
    
    float angle = atan(dy, dx) * (180.0 / PI);
    return mod(angle + 360.0, 360.0);
}

void main(){
    vec3 radarColor = vec3(0.5,0.8,0.85);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st = st * 2.0 - 1.0;
    
    vec3 radar = vec3(0.0);
    
	float angleOfPoint = angle_from_vector(vec2(0), st);
    float pointRadius = distance(st, vec2(0));
    float startPointAngle = mod(-u_time * 100.0 + ANGLESTART, 360.0);
    float endPointAngle = mod(-u_time * 100.0 + ANGLEEND, 360.0);
    
    bool radiusInsideSector = (pointRadius <= MAINCIRCLERADIUS);
	bool pointInsideSector = 
        ((endPointAngle <= startPointAngle && (angleOfPoint <= endPointAngle || angleOfPoint >= startPointAngle)) ||
        (endPointAngle > startPointAngle && angleOfPoint >= startPointAngle && angleOfPoint <= endPointAngle));

    if (pointInsideSector && radiusInsideSector) {
        radar = vec3(1.0);
    }
    
    radar = radar * radarColor;
    
    float alpha = 1.0;
    float minAlphaStep = 0.0;
    float maxAlphaStep = 1.5;
    if (startPointAngle < endPointAngle) {
    	alpha = smoothstep(minAlphaStep, maxAlphaStep, 1.0 - (angleOfPoint - startPointAngle) / (endPointAngle - startPointAngle));
    } else {
		if (angleOfPoint >= startPointAngle) {
	    	alpha = smoothstep(minAlphaStep, maxAlphaStep, 1.0 - (angleOfPoint - startPointAngle) / (endPointAngle + (360.0 - startPointAngle)));
        }
        
        if (angleOfPoint <= endPointAngle) {
            alpha = smoothstep(minAlphaStep, maxAlphaStep, 1.0 - (angleOfPoint + (360.0 - startPointAngle)) / (endPointAngle + (360.0 - startPointAngle)));
        }
    }
    
    alpha *= 0.5;
    
    float cir1 = circle((st + 1.0) / 2.0, MAINCIRCLERADIUS * 0.75, .005);
    float cir2 = circle((st + 1.0) / 2.0, MAINCIRCLERADIUS * 0.4, .0025);
    float cir3 = circle((st + 1.0) / 2.0, MAINCIRCLERADIUS * 0.15, .002);
    
    vec4 radarWithAlpha = vec4(radar, alpha);
    vec4 finalColor = mix(radarWithAlpha, vec4(1.0), cir1);
    finalColor = mix(finalColor, vec4(1.0), cir2);
	finalColor = mix(finalColor, vec4(1.0), cir3);

	gl_FragColor = finalColor;
}















