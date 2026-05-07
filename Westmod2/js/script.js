gsap.registerPlugin(ScrollTrigger);

const imgWrap = document.querySelector('.modern-img-wrap');
const modernText = document.querySelector('.modern-text');

// final size — full viewport width, proper height
const finalW = window.innerWidth;
const finalH = window.innerHeight;

gsap.timeline({
    scrollTrigger: {
        trigger: '.modern',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,      // slow, cinematic feel
        pin: false,      // sticky handles pinning via CSS
        onLeave: () => {
            // text fades in when animation is fully done
            gsap.to(modernText, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            });
        },
        onEnterBack: () => {
            gsap.to(modernText, {
                opacity: 0,
                duration: 0.3
            });
        }
    }
})
.to(imgWrap, {
    width: finalW,
    height: finalH,
    borderRadius: 0,
    ease: 'none'
});