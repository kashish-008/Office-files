// 1. Create a Timeline Instance
const mainTimeline = gsap.timeline({
  defaults: {
    duration: 1,
    ease: 'power3.out'
  }
});

// 2. Sequential Orchestration
mainTimeline
  // Navbar Entrance
  .from('.logo', { y: -50, opacity: 0 })
  .from('.nav-links li', { y: -50, opacity: 0, stagger: 0.1 }, '-=0.8')

  // Hero Text Reveal
  .from('.title-word', { 
    y: 120, 
    rotation: 10,
    stagger: 0.15,
    duration: 1.2 
  }, '-=0.5')

  // Hero Subtext & Button
  .from('.hero-description', { y: 30, opacity: 0 }, '-=0.8')
  .from('.cta-button', { scale: 0.8, opacity: 0, ease: 'back.out(1.7)' }, '-=0.6')

  // Cards Entrance with Stagger
  .from('.card', { 
    x: 100, 
    opacity: 0, 
    stagger: 0.2 
  }, '-=0.8');


// 3. Interactive Mouse Hover Animation using GSAP
const button = document.querySelector('.cta-button');

button.addEventListener('mouseenter', () => {
  gsap.to(button, { scale: 1.05, backgroundColor: '#a29bfe', duration: 0.3 });
});

button.addEventListener('mouseleave', () => {
  gsap.to(button, { scale: 1, backgroundColor: '#6c5ce7', duration: 0.3 });
});