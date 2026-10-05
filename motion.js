const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!reduce){
  root.classList.add('motion');

  function splitLines(el){
    const groups=[[]];
    [...el.childNodes].forEach(n=>{if(n.nodeName==='BR'){groups.push([]);n.remove()}else groups[groups.length-1].push(n)});
    groups.filter(g=>g.some(n=>n.nodeType===1||n.textContent.trim())).forEach((nodes,i)=>{
      const line=document.createElement('span'), inner=document.createElement('span');
      line.className='line';inner.className='line-inner';inner.style.setProperty('--i',i);
      nodes.forEach(n=>inner.appendChild(n));line.appendChild(inner);el.appendChild(line);
    });
    el.classList.add('split');
  }

  const heroTitle=document.querySelector('.hero h1');
  splitLines(heroTitle);
  const headings=[...document.querySelectorAll('.about h2,.section-intro h2,.process h2,.review-sidebar h2,.contact-copy h2,.contact-panel h2,.footer-note')];
  headings.forEach(splitLines);

  document.querySelectorAll('.eyebrow').forEach(el=>el.classList.add('wipe'));
  document.querySelectorAll('.about-media,.service-image,.project-img,.contact-visual').forEach(el=>el.classList.add('img-reveal','parallax'));

  const staggers=[...document.querySelectorAll('.service-items,.steps,.numbers,.contact-panel form,.contact-details,.footer-links')];
  staggers.forEach(el=>{el.classList.remove('reveal');el.classList.add('stagger');[...el.children].forEach((c,i)=>c.style.setProperty('--i',i))});

  const io=new IntersectionObserver(entries=>entries.forEach(({isIntersecting,target})=>{
    if(!isIntersecting)return;
    target.classList.add('in','seen');io.unobserve(target);
    if(target.classList.contains('stagger'))setTimeout(()=>target.classList.remove('stagger','in'),target.children.length*90+1200);
  }),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  [...headings,...staggers].forEach(el=>io.observe(el));
  // clip-path hides these from IntersectionObserver, so they're revealed by position in frame()
  let clipped=[...document.querySelectorAll('.wipe,.img-reveal')];

  const startHero=()=>heroTitle.classList.add('in');
  if(root.classList.contains('is-loaded'))startHero();
  else new MutationObserver((_,obs)=>{if(root.classList.contains('is-loaded')){startHero();obs.disconnect()}}).observe(root,{attributes:true,attributeFilter:['class']});

  const progress=document.createElement('div');progress.className='scroll-progress';document.body.appendChild(progress);
  const header=document.querySelector('.header'), mobileNav=document.querySelector('.mobile-nav');
  const hero=document.querySelector('.hero'), heroCopy=document.querySelector('.hero-copy'), slidesEl=document.querySelector('.slides');
  const parallax=[...document.querySelectorAll('.parallax'),document.querySelector('.process')];
  let lastY=scrollY, ticking=false;

  function frame(){
    ticking=false;
    const y=scrollY, vh=innerHeight, max=root.scrollHeight-vh;
    progress.style.transform=`scaleX(${max>0?y/max:0})`;
    header.classList.toggle('is-scrolled',y>10);
    if(Math.abs(y-lastY)>4){header.classList.toggle('is-hidden',y>lastY&&y>300&&!mobileNav.classList.contains('open'));lastY=y}
    if(y<hero.offsetHeight){
      heroCopy.style.setProperty('--hy',y*.35+'px');
      heroCopy.style.setProperty('--ho',Math.max(1-y/(vh*.75),0));
      slidesEl.style.translate=`0 ${y*.4}px`;
    }
    if(clipped.length)clipped=clipped.filter(el=>{
      const r=el.getBoundingClientRect();
      if(r.top<vh*.9&&r.bottom>0){el.classList.add('in');return false}
      return true;
    });
    parallax.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.bottom<-100||r.top>vh+100)return;
      const p=(r.top+r.height/2-vh/2)/(vh/2+r.height/2);
      el.style.setProperty('--p',Math.max(-1,Math.min(1,p)).toFixed(4));
    });
  }
  const request=()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}};
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request);
  frame();

  if(matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.btn,.socials a,.slide-arrows button,.review-controls button').forEach(el=>{
      el.classList.add('magnetic');
      el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.translate=`${(e.clientX-r.left-r.width/2)*.22}px ${(e.clientY-r.top-r.height/2)*.35}px`});
      el.addEventListener('mouseleave',()=>{el.style.translate=''});
    });
  }
}
