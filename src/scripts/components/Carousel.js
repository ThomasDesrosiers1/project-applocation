//import Swiper from 'swiper/bundle';

export default class Carousel {
  constructor(element) {
    this.element = element;
    this.options = {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 20,
      pagination: {
        el: this.element.querySelector('.swiper-pagination'),
      },
      navigation: {
        nextEl: this.element.querySelector('.swiper-button-next'),
        prevEl: this.element.querySelector('.swiper-button-prev'),
      },
    };
    this.init();
  }

  init() {
    this.setOptions();
    const swiper = new Swiper(this.element, this.options);
  }

  setOptions() {
    if ('split' in this.element.dataset) {
      this.options.breakpoints = {
        768: {
          slidesPerView: 2.5,
        },
      };
    }

    if ('autoplay' in this.element.dataset) {
      this.options.autoplay = {
        delay: 3000,
        pauseOnMouseEnter: true,
        disableOnInteraction: true,
      };
    }

    if ('loop' in this.element.dataset) {
      this.options.loop = { loop: true };
    }

    if (
      'slides' in this.element.dataset ||
      this.options == this.options.slidesPerView
    ) {
      this.options.slidesPerView = 1;
      this.options.breakpoints = {
        768: {
          slidesPerView: 2,
        },
      };
    }
  }
}
