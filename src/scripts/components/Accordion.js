export default class Accordion {
  static dataCount = {
    notClosingCount: 0,
    autoOpenCount: 0,
  };

  constructor(element) {
    this.element = element;
    this.options = {
      notClosing: false,
      autoOpen: false,
    };

    this.init();
  }

  init() {
    this.setOptions();
    this.initAccordion();
  }

  setOptions() {
    if ('notClosing' in this.element.dataset) {
      this.options.notClosing = true;
    }

    if ('autoOpen' in this.element.dataset) {
      this.options.autoOpen = true;
      Accordion.dataCount.autoOpenCount++;
    }

    if (Accordion.dataCount.autoOpenCount > 1) {
      this.options.notClosing = true;
    }
  }

  initAccordion() {
    const toggle = this.element.querySelector('.accordion__toggle');
    toggle.addEventListener('click', this.openAccordion.bind(this));

    if (this.options.autoOpen) {
      this.element
        .querySelector('.accordion__container')
        .classList.add('is-opened');
      this.element
        .querySelector('.accordion__content')
        .classList.add('is-opened');
    }
  }

  openAccordion() {
    const accordionContainers = document.querySelectorAll(
      '.accordion__container'
    );
    const accordionContainer = this.element.querySelector(
      '.accordion__container'
    );
    const accordionContent = this.element.querySelector('.accordion__content');

    const isOpened = accordionContainer.classList.contains('is-opened');

    if (!isOpened) {
      if (this.options.notClosing) {
        accordionContainer.classList.add('is-opened');
        accordionContent.classList.add('is-opened');
      } else {
        for (let i = 0; i < accordionContainers.length; i++) {
          const container = accordionContainers[i];

          container.classList.remove('is-opened');
          container
            .querySelector('.accordion__content')
            .classList.remove('is-opened');
        }

        accordionContainer.classList.add('is-opened');
        accordionContent.classList.add('is-opened');
      }
    } else {
      accordionContainer.classList.remove('is-opened');
      accordionContent.classList.remove('is-opened');
    }
  }
}
