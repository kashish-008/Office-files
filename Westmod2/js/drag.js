// custom cursor
const dragSection = document.querySelector('.drag');
const cursor = document.getElementById('dragCursor');

dragSection.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

dragSection.addEventListener('mouseenter', () => {
    cursor.classList.add('visible');
});

dragSection.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
});

// card data for each slide
const cardData = [
    { name: 'Pool Only',       price: '$63,500', sizes: '3 Sizes to Choose From' },
    { name: 'Spool',           price: '$48,200', sizes: '2 Sizes to Choose From' },
    { name: 'Pool with Coping',price: '$71,000', sizes: '4 Sizes to Choose From' },
    { name: 'Lap Pool',        price: '$55,800', sizes: '2 Sizes to Choose From' },
    { name: 'Infinity Pool',   price: '$89,500', sizes: '3 Sizes to Choose From' },
    { name: 'Resort Pool',     price: '$112,000','sizes': '5 Sizes to Choose From' },
];

// swiper init
const swiper = new Swiper('.dragSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    grabCursor: false,   // we use custom cursor
    freeMode: {
        enabled: true,
        momentum: true,         // gravity/inertia feel
        momentumRatio: 0.8,
        momentumVelocityRatio: 0.6,
    },
    on: {
        slideChange: function () {
            updateInfo(this.activeIndex);
        }
    }
});

// update info below slider on slide change
function updateInfo(index) {
    const data = cardData[index];
    document.querySelector('.drag-info-name').textContent = data.name;
    document.querySelector('.drag-info-price').innerHTML =
        'starting at <span>' + data.price + '</span>';
    document.querySelector('.drag-info-sizes').textContent = data.sizes;
}