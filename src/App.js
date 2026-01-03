import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { time } from 'three/tsl';
import ThreeText from './ThreeText';
import logo from './profile.png';
import { IconMap } from './icons';

const App = () => {
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Three.js 3D背景设置
  // useEffect(() => {

  //   if (!canvasRef.current) return;

  //   const scene = new THREE.Scene();
  //   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  //   const renderer = new THREE.WebGLRenderer({ 
  //     canvas: canvasRef.current, 
  //     alpha: true,
  //     antialias: true 
  //   });

  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //   // 创建粒子系统
  //   const particlesGeometry = new THREE.BufferGeometry();
  //   const particlesCount = 1000;
  //   const positions = new Float32Array(particlesCount * 3);

  //   for (let i = 0; i < particlesCount * 3; i++) {
  //     positions[i] = (Math.random() - 0.5) * 50;
  //   }

  //   particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  //   const particlesMaterial = new THREE.PointsMaterial({
  //     color: 0xD2FF00,
  //     size: 0.05,
  //     transparent: true,
  //     opacity: 0.8,
  //     blending: THREE.AdditiveBlending
  //   });

  //   const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  //   scene.add(particles);

  //   camera.position.z = 5;

  //   // 动画循环
  //   let animationId;
  //   const animate = () => {
  //     animationId = requestAnimationFrame(animate);

  //     particles.rotation.y += 0.001;
  //     particles.rotation.x += 0.0005;

  //     // 根据鼠标位置移动相机
  //     camera.position.x += (mousePos.x * 0.05 - camera.position.x) * 0.05;
  //     camera.position.y += (-mousePos.y * 0.05 - camera.position.y) * 0.05;
  //     camera.lookAt(scene.position);

  //     renderer.render(scene, camera);
  //   };

  //   animate();

  //   // 响应式处理
  //   const handleResize = () => {
  //     camera.aspect = window.innerWidth / window.innerHeight;
  //     camera.updateProjectionMatrix();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //     cancelAnimationFrame(animationId);
  //     renderer.dispose();
  //   };
  // }, []);

  // 滚动进度追踪
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 鼠标跟踪
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

const timelineRef = useRef(null);
const [timelineProgress, setTimelineProgress] = useState(0);
const [isTimelineActive, setIsTimelineActive] = useState(false);

useEffect(() => {
  const onScroll = () => {
    const section = timelineRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const totalScroll = section.offsetHeight - viewportHeight;

    const scrolled = Math.min(
      totalScroll,
      Math.max(0, -rect.top)
    );

    const progress = scrolled / totalScroll;
    setTimelineProgress(progress);

    const active = rect.top <= 0 && rect.bottom >= viewportHeight;
    setIsTimelineActive(active);
  };

  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
}, []);


  return (
    
    <div className="relative bg-[#111112] text-white" style={{ overflowX: 'hidden' }}>
      {/* 3D Canvas 背景 */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10"
      />

      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm">
        <div className="text-2xl font-bold tracking-tight">
          <a href='#'><span className="text-[#D2FF00]">BO</span> YI FAN</a>
        </div>
        <div className="flex gap-8 text-sm uppercase tracking-wider">
          <a href="#about" className="hover:text-[#D2FF00] transition-colors duration-300">About</a>
          <a href="#racing" className="hover:text-[#D2FF00] transition-colors duration-300">Racing</a>
          <a href="#merch" className="hover:text-[#D2FF00] transition-colors duration-300">Merch</a>
          <a href="#contact" className="hover:text-[#D2FF00] transition-colors duration-300">Contact</a>
        </div>
      </nav>

      {/* ThreeText 全屏覆盖层，随滚动缩小并淡出 */}
      <div 
        className="fixed top-0 left-0 w-full h-screen z-40 flex items-center justify-center origin-center"
        style={{
          transform: `scale(${Math.max(0.3, 1 - scrollProgress * 5)})`,
          opacity: Math.max(0, 1 - scrollProgress * 20),
          pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto'
        }}
      >
        <ThreeText />
      </div>
      <div style={{height:"25rem"}}></div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 relative">
        <div className="max-w-7xl w-full flex flex-row">
          <div 
            className="space-y-6 transform transition-all duration-1000"
            style={{
              transform: `translateY(${scrollProgress * 200}px)`,
              opacity: 1 - scrollProgress * 3
            }}
          >
            <div className="overflow-hidden">
              <h1 
                className="text-8xl md:text-9xl font-black leading-none tracking-tighter"
                style={{
                  transform: `translateX(${mousePos.x * 60}px)`
                }}
              >
                CREATION
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 
                className="text-8xl md:text-9xl font-black leading-none tracking-tighter text-[#D2FF00]"
                style={{
                  transform: `translateX(${-mousePos.x * 60}px)`
                }}
              >
                PASSION
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 
                className="text-8xl md:text-9xl font-black leading-none tracking-tighter"
                style={{
                  transform: `translateX(${mousePos.x * 50}px)`
                }}
              >
                determination
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mt-8">
             Full-Stack Development Engineer | Breaking boundaries && Make some cool things
            </p>
          </div>
          <div>
            <img src={logo} width={400} style={{marginLeft:100}}/>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs uppercase tracking-widest text-gray-500">Scroll</span>
          <div className="w-7 h-11 border-2 border-gray-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#D2FF00] rounded-full"></div>
          </div>
        </div>
      </section>

  

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center px-8 py-24">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
          <div 
            className="space-y-6 transform transition-all duration-700"
            style={{
              transform: `translateX(${Math.max(0, (scrollProgress - 0.1) * -200)}px)`,
              opacity: Math.min(1, Math.max(0, (scrollProgress - 0.1) * 15))
            }}
          >
            <h2 className="text-6xl font-black">
              BEYOND THE <span className="text-[#D2FF00]">SCREEN</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
            Currently a software engineering student at Hefei University of Technology.
            I am passionate about computer and creation.I don’t have any clear goals, I just want to do something cool.
            </p>
            <button className="px-8 py-4 bg-[#D2FF00] text-[#111112] font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300">
              <a href='http://106.14.127.174/'>Explore My Story</a>
            </button>
          </div>
          
          <div 
            className="relative h-[500px] transform transition-all duration-700"
            style={{
              transform: `translateX(${Math.max(0, (scrollProgress - 0.1) * 200)}px)`,
              opacity: Math.min(1, Math.max(0, (scrollProgress - 0.1) * 15))
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D2FF00]/20 to-transparent rounded-2xl backdrop-blur-sm border border-[#D2FF00]/30"></div>
            <div className="absolute inset-0 flex items-center justify-center text-9xl font-black text-[#D2FF00]/10">
              LN4
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="racing" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-16">
            Tech <span className="text-[#D2FF00]">Stack</span>
          </h2>
          
          <div className="space-y-16">
            {/* Frontend */}
            <div 
              className="transform transition-all duration-700"
              style={{
                transform: `translateX(${Math.max(0, (scrollProgress - 0.3) * -100)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollProgress - 0.2) * 10))
              }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#D2FF00]">●</span> FRONTEND
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'React', icon: IconMap.react, color: 'from-blue-500/20' },
                  { name: 'Vue', icon: IconMap.vue, color: 'from-green-500/20' },
                  { name: 'TypeScript', icon: IconMap.typescript, color: 'from-blue-600/20' },
                  { name: 'Webpack', icon:IconMap.webpack, color: 'from-[#D2FF00]/20' }
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="group relative p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl hover:border-[#D2FF00]/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D2FF00]/0 group-hover:from-[#D2FF00]/10 to-transparent rounded-xl transition-all duration-500"></div>
                    <div className="relative space-y-3">
                      <div className="w-20">{tech.icon}</div>
                      <div className="text-sm font-bold uppercase tracking-wider text-[#D2FF00]">
                        {tech.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div 
              className="transform transition-all duration-700"
              style={{
                transform: `translateX(${Math.max(0, (scrollProgress - 0.35) * 100)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollProgress - 0.25) * 10))
              }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#D2FF00]">●</span> BACKEND
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Node.js', icon: IconMap.node, color: 'from-green-500/20' },
                  { name: 'Python', icon: IconMap.python, color: 'from-yellow-500/20' },
                  { name: 'Go', icon: IconMap.go, color: 'from-cyan-500/20' },
                  { name: 'Spring', icon: IconMap.spring, color: 'from-[#D2FF00]/20' }
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="group relative p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl hover:border-[#D2FF00]/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D2FF00]/0 group-hover:from-[#D2FF00]/10 to-transparent rounded-xl transition-all duration-500"></div>
                    <div className="relative space-y-3">
                      <div className="w-20">{tech.icon}</div>
                      <div className="text-sm font-bold uppercase tracking-wider text-[#D2FF00]">
                        {tech.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Languages */}
            <div 
              className="transform transition-all duration-700"
              style={{
                transform: `translateX(${Math.max(0, (scrollProgress - 0.4) * -100)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollProgress - 0.25) * 10))
              }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#D2FF00]">●</span> OTHERS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'C++', icon: IconMap['c++'], color: 'from-blue-600/20' },
                  { name: 'Threejs', icon: IconMap.three, color: 'from-red-500/20' },
                  { name: 'Swift', icon: IconMap.swift, color: 'from-orange-500/20' },
                  { name: 'Tailwind', icon: IconMap.tailwind, color: 'from-purple-500/20' }
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="group relative p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl hover:border-[#D2FF00]/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D2FF00]/0 group-hover:from-[#D2FF00]/10 to-transparent rounded-xl transition-all duration-500"></div>
                    <div className="relative space-y-3">
                      <div className="w-20">{tech.icon}</div>
                      <div className="text-sm font-bold uppercase tracking-wider text-[#D2FF00]">
                        {tech.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Summary */}
            <div className="relative p-8 bg-gradient-to-br from-[#D2FF00]/10 to-transparent border border-[#D2FF00]/30 rounded-2xl backdrop-blur-sm"
              style={{
                transform: `translateX(${Math.max(0, (scrollProgress - 0.4) * -100)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollProgress - 0.35) * 15))
              }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#D2FF00]/5 to-transparent rounded-2xl"></div>
              <div className="relative">
                <h3 className="text-xl font-black mb-4">EXPERTISE AREAS</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                  <div>✓ Full Stack Web Development</div>
                  <div>✓ System Programming</div>
                  <div>✓ Mobile Development</div>
                  <div>✓ Algorithm & Data Structures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline Section */}
      <section className="relative py-24" style={{ height: '400vh',paddingTop:'1rem' }} ref={timelineRef} >
        {/* 非激活时显示的原生流内头部，占位并提供预览 */}
        {!isTimelineActive && (
          <div className="w-screen h-screen flex items-center justify-center">
            <div className="text-center space-y-6">
              <h2 className="text-7xl md:text-8xl font-black">
                CAREER <span className="text-[#D2FF00]">JOURNEY</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                从卡丁车冠军到 F1 明星的成长之路
              </p>
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="w-16 h-1 bg-[#D2FF00]"></div>
                <span className="text-sm uppercase tracking-widest text-gray-500">Scroll Right →</span>
              </div>
            </div>
          </div>
        )}

        {/* 固定层：仅在激活期间显示 */}
        <div className={`fixed top-0 left-0 w-full h-screen flex items-center z-20 ${isTimelineActive ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#111112] via-transparent to-[#111112] z-10 pointer-events-none" ></div>

          <div 
            className="flex gap-8 px-8 transition-transform duration-100 ease-out"
            style={{
              // 使用 timelineProgress (0..1) 映射到 0..100%
              transform: `translateX(-${Math.max(0, Math.min(100, timelineProgress * 100))}%)`,
              alignItems:'center'
            }}
          >
            {/* Timeline Header */}
            <div className="flex-shrink-0 w-screen h-screen flex items-center justify-center" >
              <div className="text-center space-y-6">
                <h2 className="text-7xl md:text-8xl font-black">
                  CAREER <span className="text-[#D2FF00]">JOURNEY</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  从卡丁车冠军到 F1 明星的成长之路
                </p>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <div className="w-16 h-1 bg-[#D2FF00]"></div>
                  <span className="text-sm uppercase tracking-widest text-gray-500">Scroll Right →</span>
                </div>
              </div>
            </div>

            {/* Timeline Items */}
            {[
              {
                year: '2006',
                age: '7岁',
                title: '开始卡丁车生涯',
                description: '在父亲的支持下开始接触赛车运动，展现出惊人的天赋和对速度的热爱。',
                achievement: '首次参加地区性卡丁车比赛',
                color: 'from-blue-500/20'
              },
              {
                year: '2013',
                age: '14岁',
                title: 'CIK-FIA 世界锦标赛',
                description: '在世界级卡丁车赛事中崭露头角，证明了自己的实力和竞争力。',
                achievement: 'KF级别世界锦标赛冠军',
                color: 'from-purple-500/20'
              },
              {
                year: '2015',
                age: '16岁',
                title: '进入方程式赛车',
                description: '从卡丁车升级到方程式赛车，开始职业生涯的重要转折点。',
                achievement: 'MSA 方程式锦标赛冠军',
                color: 'from-pink-500/20'
              },
              {
                year: '2016',
                age: '17岁',
                title: 'F3 欧洲锦标赛',
                description: '在 F3 赛场上持续进步，吸引了 F1 车队的注意。',
                achievement: '多次登上领奖台',
                color: 'from-red-500/20'
              },
              {
                year: '2017',
                age: '18岁',
                title: '加入迈凯伦青训',
                description: '正式成为迈凯伦车队青年车手计划成员，距离 F1 梦想更进一步。',
                achievement: 'F2 锦标赛年度亚军',
                color: 'from-orange-500/20'
              },
              {
                year: '2019',
                age: '19岁',
                title: 'F1 首秀',
                description: '在澳大利亚大奖赛完成 F1 首秀，成为迈凯伦最年轻的车手之一。',
                achievement: '首个赛季获得积分',
                color: 'from-[#D2FF00]/20'
              },
              {
                year: '2020',
                age: '21岁',
                title: '首个领奖台',
                description: '在奥地利大奖赛获得职业生涯首个 F1 领奖台，展现出巨大潜力。',
                achievement: '赛季第三次登台',
                color: 'from-green-500/20'
              },
              {
                year: '2021',
                age: '22岁',
                title: '首个杆位',
                description: '在俄罗斯大奖赛获得职业生涯首个杆位，距离胜利仅一步之遥。',
                achievement: '4次领奖台完赛',
                color: 'from-cyan-500/20'
              },
              {
                year: '2023',
                age: '24岁',
                title: '迈阿密突破',
                description: '终于在迈阿密大奖赛夺得职业生涯首胜，多年努力终获回报。',
                achievement: '首个 F1 分站冠军',
                color: 'from-[#D2FF00]/30'
              },
              {
                year: '2024',
                age: '25岁',
                title: '争冠赛季',
                description: '赛季表现出色，多次获胜，向世界冠军发起强有力的挑战。',
                achievement: '4个分站冠军，18次登台',
                color: 'from-[#D2FF00]/40'
              },
              {
                year: '2025',
                age: '26岁',
                title: '未来可期',
                description: '继续在 F1 赛场上追逐梦想，目标直指世界冠军头衔。',
                achievement: 'To Be Continued...',
                color: 'from-white/20'
              }
            ].map((item, i) => (
              <div 
                key={i}
                className="flex-shrink-0 w-[500px] h-[600px] flex items-center" 
              >
                <div className="relative w-full h-[500px] group" >
                  {/* Card Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent backdrop-blur-sm border-2 border-gray-800 rounded-2xl transition-all duration-500 group-hover:border-[#D2FF00]/50 group-hover:scale-105`}></div>
                  
                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-between" >
                    {/* Top Section */}
                    <div>
                      {/* Year Badge */}
                      <div className="inline-block px-6 py-2 bg-[#D2FF00] text-[#111112] font-black text-2xl rounded-full mb-4">
                        {item.year}
                      </div>
                      
                      {/* Age */}
                      <div className="text-gray-500 text-sm uppercase tracking-widest mb-6">
                        {item.age}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-4xl font-black mb-4 leading-tight">
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 leading-relaxed mb-6">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Bottom Section */}
                    <div>
                      {/* Achievement Badge */}
                      <div className="p-4 bg-black/50 rounded-xl border border-[#D2FF00]/30">
                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                          Key Achievement
                        </div>
                        <div className="text-[#D2FF00] font-bold">
                          {item.achievement}
                        </div>
                      </div>
                      
                      {/* Timeline Dot */}
                      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-4 h-4 bg-[#D2FF00] rounded-full shadow-lg shadow-[#D2FF00]/50"></div>
                        <div className="w-0.5 h-12 bg-gradient-to-b from-[#D2FF00] to-transparent"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-[#D2FF00]/0 group-hover:bg-[#D2FF00]/5 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}

            {/* End Card */}
            <div className="flex-shrink-0 w-screen h-screen flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="text-9xl font-black text-[#D2FF00]/20 mb-4">
                  2026+
                </div>
                <h3 className="text-5xl font-black">
                  THE JOURNEY<br />
                  <span className="text-[#D2FF00]">CONTINUES</span>
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  生命还没结束自然就有它的目的
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="flex items-center gap-3 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full border border-gray-800">
            <span className="text-xs uppercase tracking-widest text-gray-500">Timeline</span>
            <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#D2FF00] transition-all duration-150"
                style={{ 
                  width: `${Math.max(0, Math.min(100, timelineProgress * 100))}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>


      {/* Merch Showcase */}
      <section id="merch" className="min-h-screen flex items-center px-8 py-24">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-6xl font-black mb-16 text-center">
            OFFICIAL <span className="text-[#D2FF00]">MERCHANDISE</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {['HELMET COLLECTION', 'RACING APPAREL', 'LIMITED EDITIONS'].map((item, i) => (
              <div 
                key={i}
                className="group relative h-[400px] overflow-hidden rounded-xl cursor-pointer"
                style={{
                  transform: `translateY(${Math.max(0, (scrollProgress - 0.5) * -150 + i * 30)}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollProgress - 0.5) * 3))
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D2FF00]/20 to-[#111112] group-hover:from-[#D2FF00]/40 transition-all duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl font-black text-center transform group-hover:scale-110 transition-transform duration-500">
                    {item}
                  </h3>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-sm uppercase tracking-wider">Shop Now</span>
                  <span className="text-2xl">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-gray-800 px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-[#D2FF00]">BO</span> YIFAN
              </h3>
              <p className="text-gray-500 text-sm">
                Personal Website
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#D2FF00] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#D2FF00] transition-colors">Racing</a></li>
                <li><a href="#" className="hover:text-[#D2FF00] transition-colors">Merch</a></li>
                <li><a href="#" className="hover:text-[#D2FF00] transition-colors">News</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Social</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#D2FF00] transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-[#D2FF00] transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-[#D2FF00] transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-[#D2FF00] transition-colors">Twitch</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">Stay updated with latest news</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 px-4 py-2 rounded text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#D2FF00]"
                />
                <button className="bg-[#D2FF00] text-[#111112] px-4 py-2 rounded font-bold hover:bg-white transition-colors" onClick={() => alert('Subscribed Successfully!')}>
                  →
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500">
            <p>© 2025 Bo YiFan. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#D2FF00] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#D2FF00] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 滚动进度条 */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-[#D2FF00] transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default App;