"use client";

import { useEffect, useRef } from "react";

export default function MeshGradientBg(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    // ─── SHADERS ───
    const vertSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;

      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uMouseSmooth;

      vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 1.0/7.0;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }

      float fbm(vec3 p) {
        float val = 0.0;
        float amp = 0.5;
        float freq = 1.0;
        for (int i = 0; i < 4; i++) {
          val += amp * snoise(p * freq);
          freq *= 2.0;
          amp *= 0.5;
        }
        return val;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = uv;
        p.x *= aspect;

        float t = uTime * 0.15;

        // Cursor influence
        vec2 mousePos = uMouseSmooth;
        mousePos.x *= aspect;
        float mouseDist = length(p - mousePos);
        float mouseInfluence = smoothstep(0.8, 0.0, mouseDist);

        // UV distortion driven by noise + cursor
        vec2 distortion = vec2(
          fbm(vec3(p * 1.8 + t * 0.3, t * 0.5)),
          fbm(vec3(p * 1.8 + t * 0.3 + 100.0, t * 0.5 + 50.0))
        );

        distortion += mouseInfluence * 0.15 * vec2(
          snoise(vec3(p * 3.0, t * 2.0)),
          snoise(vec3(p * 3.0 + 50.0, t * 2.0))
        );

        vec2 warped = p + distortion * 0.3;

        // Color bands
        float n1 = fbm(vec3(warped * 1.2, t * 0.4)) * 0.5 + 0.5;
        float n2 = fbm(vec3(warped * 0.8 + 30.0, t * 0.3 + 20.0)) * 0.5 + 0.5;
        float n3 = snoise(vec3(warped * 2.0, t * 0.6)) * 0.5 + 0.5;

        // Monochrome dark palette — visible against #060606 base
        vec3 void_color = vec3(0.025, 0.025, 0.03);
        vec3 band1 = vec3(0.10, 0.10, 0.13);
        vec3 band2 = vec3(0.08, 0.08, 0.11);
        vec3 band3 = vec3(0.06, 0.065, 0.09);

        vec3 color = void_color;
        color = mix(color, band1, n1 * 0.8);
        color = mix(color, band2, n2 * 0.6);
        color = mix(color, band3, n3 * 0.4);

        // Cursor glow
        float glow = mouseInfluence * 0.08;
        color += vec3(glow * 0.8, glow * 0.8, glow * 1.0);

        // Film grain
        float grain = (fract(sin(dot(uv * uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.015;
        color += grain;

        // Subtle vignette
        float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.5);
        color *= 0.9 + vignette * 0.1;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // ─── COMPILE SHADERS ───
    function createShader(
      ctx: WebGLRenderingContext,
      type: number,
      source: string,
    ): WebGLShader | null {
      const shader = ctx.createShader(type);
      if (!shader) return null;
      ctx.shaderSource(shader, source);
      ctx.compileShader(shader);
      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error(ctx.getShaderInfoLog(shader));
        ctx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vert = createShader(gl, gl.VERTEX_SHADER, vertSrc);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // ─── FULLSCREEN QUAD ───
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // ─── UNIFORMS ───
    const uRes = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouseSmooth = gl.getUniformLocation(program, "uMouseSmooth");

    // ─── STATE ───
    const mouseNorm = { x: 0.5, y: 0.5 };
    const mouseSmooth = { x: 0.5, y: 0.5 };
    let animId: number = 0;
    let startTime = performance.now();

    // ─── MOUSE TRACKING ───
    const handleMouse = (e: MouseEvent): void => {
      mouseNorm.x = e.clientX / window.innerWidth;
      mouseNorm.y = 1.0 - e.clientY / window.innerHeight;
    };
    const handleTouch = (e: TouchEvent): void => {
      mouseNorm.x = e.touches[0].clientX / window.innerWidth;
      mouseNorm.y = 1.0 - e.touches[0].clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch, { passive: true });

    // ─── RESIZE ───
    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // ─── RENDER LOOP ───
    const render = (): void => {
      const elapsed = (performance.now() - startTime) / 1000;

      mouseSmooth.x += (mouseNorm.x - mouseSmooth.x) * 0.03;
      mouseSmooth.y += (mouseNorm.y - mouseSmooth.y) * 0.03;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouseSmooth, mouseSmooth.x, mouseSmooth.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };
    render();

    // ─── VISIBILITY: pause when tab hidden ───
    const handleVisibility = (): void => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        startTime = performance.now();
        render();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // ─── REDUCED MOTION: stop animation, show static frame ───
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      cancelAnimationFrame(animId);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouseSmooth, 0.5, 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // ─── CLEANUP ───
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
