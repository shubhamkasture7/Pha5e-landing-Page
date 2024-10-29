const menuItem = document.querySelector(".navbar__menu-item");

function followImageCursor(event, menuItem) {
  const contentBox = menuItem.getBoundingClientRect();
  const dx = event.pageX - contentBox.x;
  const dy = event.pageY - contentBox.y;
  menuItem.children[1].style.transform = `translate(${dx}px, ${dy}px)`;
}

menuItem.addEventListener("mousemove", (event) => {
  followImageCursor(event, menuItem);
});

// // Slider code
// Function to select elements based on a selector and context
function $$(selector, context = document) {
  const elements = context.querySelectorAll(selector);
  return Array.from(elements);
}

// Initialize the slider with given options
function fncSliderInit($slider, options) {
  const prefix = ".fnc-";

  // Slider elements
  const $slidesCont = $slider.querySelector(`${prefix}slider__slides`);
  const $slides = $$(prefix + "slide", $slider);
  const $controls = $$(prefix + "nav__control", $slider);
  const $controlsBgs = $$(prefix + "nav__bg", $slider);
  const $progressAS = $$(prefix + "nav__control-progress", $slider);

  const numOfSlides = $slides.length;
  let curSlide = 1;
  let sliding = false;
  const slidingAT = parseFloat(getComputedStyle($slidesCont)["transition-duration"]) * 1000;
  const slidingDelay = parseFloat(getComputedStyle($slidesCont)["transition-delay"]) * 1000;

  let autoSlidingActive = false;
  let autoSlidingTO;
  const autoSlidingDelay = 5000;
  let autoSlidingBlocked = false;

  let $activeSlide, $activeControlsBg, $prevControl;

  // Assign classes and IDs to each slide and control element
  function setIDs() {
    $slides.forEach(($slide, index) => {
      $slide.classList.add(`fnc-slide-${index + 1}`);
    });

    $controls.forEach(($control, index) => {
      $control.setAttribute("data-slide", index + 1);
      $control.classList.add(`fnc-nav__control-${index + 1}`);
    });

    $controlsBgs.forEach(($bg, index) => {
      $bg.classList.add(`fnc-nav__bg-${index + 1}`);
    });
  }

  setIDs();

  // Handler after sliding is complete
  function afterSlidingHandler() {
    $slider.querySelector(".m--previous-slide").classList.remove("m--active-slide", "m--previous-slide");
    $slider.querySelector(".m--previous-nav-bg").classList.remove("m--active-nav-bg", "m--previous-nav-bg");

    $activeSlide.classList.remove("m--before-sliding");
    $activeControlsBg.classList.remove("m--nav-bg-before");
    $prevControl.classList.remove("m--prev-control", "m--reset-progress");

    sliding = false;
    if (autoSlidingActive && !autoSlidingBlocked) setAutoslidingTO();
  }

  // Slide control to perform sliding based on selected slide ID
  function performSliding(slideID) {
    if (sliding) return;
    sliding = true;
    clearTimeout(autoSlidingTO);
    curSlide = slideID;

    $prevControl = $slider.querySelector(".m--active-control");
    $prevControl.classList.remove("m--active-control");
    $prevControl.classList.add("m--prev-control");
    $slider.querySelector(`${prefix}nav__control-${slideID}`).classList.add("m--active-control");

    $activeSlide = $slider.querySelector(`${prefix}slide-${slideID}`);
    $activeControlsBg = $slider.querySelector(`${prefix}nav__bg-${slideID}`);

    $slider.querySelector(".m--active-slide").classList.add("m--previous-slide");
    $slider.querySelector(".m--active-nav-bg").classList.add("m--previous-nav-bg");

    $activeSlide.classList.add("m--before-sliding");
    $activeControlsBg.classList.add("m--nav-bg-before");

    $activeSlide.classList.add("m--active-slide");
    $activeControlsBg.classList.add("m--active-nav-bg");

    setTimeout(afterSlidingHandler, slidingAT + slidingDelay);
  }

  // Control click handler to initiate sliding
  function controlClickHandler() {
    if (sliding || this.classList.contains("m--active-control")) return;
    if (options.blockASafterClick) {
      autoSlidingBlocked = true;
      $slider.classList.add("m--autosliding-blocked");
    }

    const slideID = parseInt(this.getAttribute("data-slide"), 10);
    performSliding(slideID);
  }

  $controls.forEach($control => $control.addEventListener("click", controlClickHandler));

  // Set the timeout for autosliding
  function setAutoslidingTO() {
    clearTimeout(autoSlidingTO);
    const delay = options.autoSlidingDelay || autoSlidingDelay;
    curSlide = (curSlide % numOfSlides) + 1;

    autoSlidingTO = setTimeout(() => {
      performSliding(curSlide);
    }, delay);
  }

  // Activate autosliding if enabled
  if (options.autoSliding !== false && (options.autoSliding || options.autoSlidingDelay > 0)) {
    autoSlidingActive = true;
    setAutoslidingTO();
    $slider.classList.add("m--with-autosliding");

    const delay = (options.autoSlidingDelay || autoSlidingDelay) + slidingDelay + slidingAT;
    $progressAS.forEach($progress => {
      $progress.style.transition = `transform ${delay / 1000}s`;
    });
  }

  $slider.querySelector(".fnc-nav__control:first-child").classList.add("m--active-control");
}

// Main slider initialization function
function fncSlider(sliderSelector, options) {
  const $sliders = $$(sliderSelector);
  $sliders.forEach($slider => fncSliderInit($slider, options));
}

// Initialize the slider
fncSlider(".example-slider", { autoSlidingDelay: 4000 });

// Demo container actions
const $demoCont = document.querySelector(".demo-cont");
document.querySelectorAll(".fnc-slide__action-btn").forEach($btn => {
  $btn.addEventListener("click", () => {
    $demoCont.classList.toggle("credits-active");
  });
});

document.querySelector(".demo-cont__credits-close").addEventListener("click", () => {
  $demoCont.classList.remove("credits-active");
});

document.querySelector(".js-activate-global-blending").addEventListener("click", () => {
  document.querySelector(".example-slider").classList.toggle("m--global-blending-active");
});
