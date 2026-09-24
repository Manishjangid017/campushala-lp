function filterCards(category, element) {
    // 1. Update active class on filter buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // 2. Get all card wrapper elements
    const cards = document.querySelectorAll('.card-wrapper');

    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const isMatch = (category === 'all' || cardCategory === category);

        if (isMatch) {
            // Step A: Display block/grid layer restore karein
            card.classList.remove('d-none-filter');

            // Step B: Trigger Reflow so transition triggers properly
            void card.offsetWidth;

            // Step C: Animate In
            card.classList.remove('is-hidden');
        } else {
            // Step A: Animate Out
            card.classList.add('is-hidden');

            // Step B: Animation poori hone ke baad DOM layout se hide karein
            setTimeout(() => {
                if (card.classList.contains('is-hidden')) {
                    card.classList.add('d-none-filter');
                }
            }, 350); // CSS transition duration (350ms) se match karein
        }
    });
}
const aboutCarousel = new Swiper('.about-img-carousel', {
    slidesPerView: 1,
    spaceBetween: 15,
    loop: true,
    pagination: {
        el: '.about-carousel-pagination',
        clickable: true,
    },
});
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.rankings-swiper')) {
        new Swiper('.rankings-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 16,
            grabCursor: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            navigation: {
                nextEl: '.rankings-btn-next',
                prevEl: '.rankings-btn-prev',
                disabledClass: 'swiper-button-disabled',
            },
            pagination: {
                el: '.rankings-pagination',
                clickable: true,
            },
            breakpoints: {
                480: {
                    slidesPerView: 2.2,
                    spaceBetween: 16,
                },
                768: {
                    slidesPerView: 3.3,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 4.3,
                    spaceBetween: 20,
                },
                1216: {
                    slidesPerView: 4.4,
                    spaceBetween: 20,
                },
            },
        });
    }
});