import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
// Flowing silk / fluid ribbons, tinted cinema-red, mouse-reactive.
const FRAG = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;
float n(vec2 p){return sin(p.x)*sin(p.y);}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/min(r.x,r.y);
  uv+= (m-.5)*.25;
  vec2 q=uv*2.2;
  float T=t*.12;
  for(int i=1;i<7;i++){
    float fi=float(i);
    q+=vec2(.55/fi*sin(fi*q.y+T+.3*fi),.45/fi*cos(fi*q.x-T*1.3+.5*fi));
  }
  float s=.5+.5*sin(q.x*1.4+q.y*1.1);
  float ribbon=pow(s,10.)*.85+pow(s,3.)*.08;
  float vig=smoothstep(1.4,.15,length(uv));
  vec3 red=vec3(.75,.06,.18);
  vec3 col=red*ribbon*vig+vec3(1.,.5,.55)*pow(s,24.)*.18*vig;
  gl_FragColor=vec4(col,1.);
}`;

export function SilkBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(hover: none)").matches;
    // Render at reduced resolution — the effect is soft, so it stays crisp enough and cheap.
    const scale = Math.min(window.devicePixelRatio, 2) * (mobile ? 0.35 : 0.5);
    const resize = () => {
      canvas.width = Math.max(1, canvas.clientWidth * scale);
      canvas.height = Math.max(1, canvas.clientHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, reduce ? 8 : (now - start) / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      if (visible && !document.hidden) draw(now);
      raf = requestAnimationFrame(loop);
    };
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`h-full w-full ${className}`} />;
}
