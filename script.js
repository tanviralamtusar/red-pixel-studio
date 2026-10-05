import {createIcons,ArrowUpRight,ArrowRight,ArrowLeft,ArrowUp,Clapperboard,Aperture,Megaphone,Sparkles,Quote,Menu,X} from 'lucide';
import './motion.js';
createIcons({icons:{ArrowUpRight,ArrowRight,ArrowLeft,ArrowUp,Clapperboard,Aperture,Megaphone,Sparkles,Quote,Menu,X}});

const preloader=document.querySelector('.preloader');
window.addEventListener('load',()=>setTimeout(()=>{preloader.classList.add('done');document.documentElement.classList.add('is-loaded')},650));

const slides=[...document.querySelectorAll('.slide')], nextBtn=document.querySelector('#next'), prevBtn=document.querySelector('#prev');
const number=document.querySelector('#slideNo'), bar=document.querySelector('#progress');
let current=0, interval, started=0, DURATION=6500;
function renderSlide(i){
  current=(i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle('active',n===current));
  number.textContent=String(current+1).padStart(2,'0');
  started=performance.now(); bar.style.transition='none'; bar.style.width='0%';
  requestAnimationFrame(progressLoop);
}
function progressLoop(now){
  if(!slides[current].classList.contains('active'))return;
  const pct=Math.min((now-started)/DURATION*100,100);
  bar.style.width=pct+'%';
  if(pct<100)requestAnimationFrame(progressLoop);
}
function restart(){clearInterval(interval);interval=setInterval(()=>renderSlide(current+1),DURATION)}
nextBtn.addEventListener('click',()=>{renderSlide(current+1);restart()});
prevBtn.addEventListener('click',()=>{renderSlide(current-1);restart()});
renderSlide(0);restart();

const hero=document.querySelector('.hero');let touchStart=0;
hero.addEventListener('touchstart',e=>touchStart=e.changedTouches[0].clientX,{passive:true});
hero.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>45){dx<0?nextBtn.click():prevBtn.click()}},{passive:true});

const menu=document.querySelector('.mobile-nav'), menuBtn=document.querySelector('.menu-btn');
function setMenu(open){menu.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',open);document.body.classList.toggle('menu-open',open)}
menuBtn.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
document.addEventListener('click',e=>{if(menu.classList.contains('open')&&!menu.contains(e.target)&&!menuBtn.contains(e.target))setMenu(false)});
window.addEventListener('resize',()=>{if(innerWidth>980)setMenu(false)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');revealObserver.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(e=>revealObserver.observe(e));

const sections=[...document.querySelectorAll('main section[id]')], navLinks=[...document.querySelectorAll('.nav a')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-40% 0px -50% 0px'});
sections.forEach(s=>sectionObserver.observe(s));

document.querySelector('#contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const note=document.querySelector('#formNote');
  note.textContent='Thanks — your enquiry has been received in this demo. Connect the form to your email service before launch.';
  e.target.reset();
});

/* V2 — automatic client review carousel */
const reviewCards=[...document.querySelectorAll('.review-card')];
const reviewTrack=document.querySelector('#reviewsTrack'), reviewDots=document.querySelector('#reviewDots'), reviewProgress=document.querySelector('#reviewProgress'), reviewNo=document.querySelector('#reviewNo');
const reviewPrev=document.querySelector('#reviewPrev'), reviewNext=document.querySelector('#reviewNext');
let reviewIndex=0, reviewTimer, reviewStarted=0, REVIEW_DURATION=6000;
reviewCards.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Go to review '+(i+1));b.addEventListener('click',()=>{showReview(i);restartReviews()});reviewDots.appendChild(b)});
function showReview(i){reviewIndex=(i+reviewCards.length)%reviewCards.length;reviewTrack.style.transform=`translateX(-${reviewIndex*100}%)`;reviewCards.forEach((c,n)=>c.classList.toggle('active',n===reviewIndex));[...reviewDots.children].forEach((d,n)=>d.classList.toggle('active',n===reviewIndex));reviewNo.textContent=String(reviewIndex+1).padStart(2,'0');reviewStarted=performance.now();reviewProgress.style.transition='none';reviewProgress.style.width='0%';requestAnimationFrame(reviewProgressLoop)}
function reviewProgressLoop(now){const pct=Math.min((now-reviewStarted)/REVIEW_DURATION*100,100);reviewProgress.style.width=pct+'%';if(pct<100)requestAnimationFrame(reviewProgressLoop)}
function restartReviews(){clearInterval(reviewTimer);reviewTimer=setInterval(()=>showReview(reviewIndex+1),REVIEW_DURATION)}
reviewPrev.addEventListener('click',()=>{showReview(reviewIndex-1);restartReviews()});reviewNext.addEventListener('click',()=>{showReview(reviewIndex+1);restartReviews()});showReview(0);restartReviews();
const reviewSection=document.querySelector('.reviews-wrap');let reviewTouch=0;reviewSection.addEventListener('touchstart',e=>reviewTouch=e.changedTouches[0].clientX,{passive:true});reviewSection.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-reviewTouch;if(Math.abs(dx)>45){dx<0?reviewNext.click():reviewPrev.click()}},{passive:true});


// Animated About Us counters
const counters=[...document.querySelectorAll('[data-count]')];
const counterObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el=entry.target, target=Number(el.dataset.count), suffix=el.querySelector('span');
    const duration=1400, start=performance.now();
    function tick(now){
      const progress=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      el.firstChild.nodeValue=String(Math.round(target*eased));
      if(progress<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
},{threshold:.45});
counters.forEach(el=>counterObserver.observe(el));
