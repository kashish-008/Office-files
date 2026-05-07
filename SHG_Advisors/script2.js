const { Engine, Runner, Bodies, Composite } = Matter;

const engine = Engine.create();
const world = engine.world;

// Initially NO gravity (like Google homepage)
engine.gravity.y = 0;

const elements = document.querySelectorAll('.box');
const bodies = [];

// Convert layout first
elements.forEach(el => {
  const rect = el.getBoundingClientRect();

  el.style.position = 'absolute';
  el.style.left = rect.left + 'px';
  el.style.top = rect.top + 'px';

  const body = Bodies.rectangle(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    rect.width,
    rect.height,
    {
      restitution: 0.8
    }
  );

  bodies.push({ el, body });
  Composite.add(world, body);
});

// Ground
const ground = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight + 50,
  window.innerWidth,
  100,
  { isStatic: true }
);

Composite.add(world, ground);

// Start engine
Runner.run(Runner.create(), engine);

// Sync loop
(function update() {
  bodies.forEach(({ el, body }) => {
    el.style.transform = `
      translate(${body.position.x - el.offsetWidth / 2}px,
                ${body.position.y - el.offsetHeight / 2}px)
      rotate(${body.angle}rad)
    `;
  });

  requestAnimationFrame(update);
})();

document.body.addEventListener('click', () => {
  engine.gravity.y = 1;
});