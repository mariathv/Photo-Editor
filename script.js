document.addEventListener('DOMContentLoaded', function () {
    const chooseBtn = document.getElementById('choose-btn');
    const fileInput = document.getElementById('file-input');
    const previewImage = document.querySelector('.preview-image');


    const rotateLeftbtn = document.querySelector("#rotate-left");
    const rotateRightbtn = document.querySelector("#rotate-right");
    const flipHorizontally = document.querySelector("#flip-horiz");
    const flipVertically = document.querySelector("#flip-vertic");

    const resetBtn = document.querySelector("#reset-btn");

    const saturationBtn = document.querySelector("#saturation-switch")
    const brightnessBtn = document.querySelector("#brightness-switch")
    const inversionBtn = document.querySelector("#inversion-switch");
    const grayscaleBtn = document.querySelector("#grayscale-switch");

    const sliderLabel = document.querySelector("#slider-label");
    const filterInfo = document.querySelector("#filter-info");
    const blurInfo = document.querySelector("#blur-info");
    const sepiaInfo = document.querySelector("#sepia-info");
    const rotateInfo = document.querySelector("#rotate-info");


    const buttons = [saturationBtn, brightnessBtn, inversionBtn, grayscaleBtn];

    const slider = document.querySelector('#main-slider');
    const blurSlider = document.querySelector("#blur-slider");
    const sepiaSlider = document.querySelector("#sepia-slider");
    const rotateSlider = document.querySelector("#rotate-slider");

    const fileNameInput = document.querySelector("#fileNameInput");

    let activeTabValue;

    let currentRotation = 0;
    let currentFlipX = 1;
    let currentFlipY = 1;

    let currentBrightness = 1;
    let currentSaturation = 1;
    let currentInversion = 0;
    let currentGrayscale = 0;
    let currentBlur = 0;
    let currentSepia = 0;

    let isImageSelected = false;

    let fileName = 'edited-image';

    filterInfo.textContent = currentBrightness;

    let activeTab = 1;

    fileNameInput.value = fileName;

    fileNameInput.addEventListener('input', function (event) {
        fileName = event.target.value;
    });


    resetFilters();




    function chooseImage() {

        fileInput.click();
    }

    previewImage.addEventListener('click', function () {

        if (!isImageSelected) {
            isImageSelected = true;
            chooseImage();
        }
    });

    chooseBtn.addEventListener('click', function () { chooseImage(); isImageSelected = true; });

    document.querySelector('.save-img').addEventListener('click', function () {
        const image = document.querySelector('.preview-image');

        if (!image.complete || image.naturalWidth === 0) {
            alert("Image is not loaded properly. Please try again.");
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        // Reset and apply transformations
        ctx.resetTransform();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(currentFlipY, currentFlipX);
        ctx.rotate(currentRotation * (Math.PI / 180)); // Convert degrees to radians

        // Apply filters
        let blurValue = document.getElementById("blur-slider").value;
        let sepiaValue = document.getElementById("sepia-slider").value;

        ctx.filter = `blur(${blurValue}px) sepia(${sepiaValue}) ${getComputedStyle(image).filter}`;

        // Draw the image with applied filters
        ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        // Convert canvas to downloadable image
        const link = document.createElement('a');
        link.download = `${document.getElementById("fileNameInput").value || 'edited-image'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });





    function updateAllFilters() {
        previewImage.style.filter = `
        grayscale(${currentGrayscale})
        saturate(${currentSaturation}) 
        brightness(${currentBrightness}) 
        invert(${currentInversion})
        blur(${currentBlur}px) 
        sepia(${currentSepia})
    `;
    }

    saturationBtn.addEventListener('click', function (event) {

        if (activeTab != 2) {
            sliderLabel.textContent = 'Saturation';
            buttons.forEach(button => {
                button.classList.remove('active');
            });
            event.target.classList.add('active');

            activeTab = 2;
            slider.value = currentSaturation;
            activeTabValue = currentSaturation;
            filterInfo.textContent = currentSaturation;
        }
    });

    brightnessBtn.addEventListener('click', function (event) {
        if (activeTab != 1) {
            sliderLabel.textContent = 'Brightness';
            buttons.forEach(button => {
                button.classList.remove('active');
            });

            event.target.classList.add('active');

            activeTab = 1;
            slider.value = currentBrightness;
            activeTabValue = currentBrightness;
            filterInfo.textContent = currentBrightness;
        }
    });

    inversionBtn.addEventListener('click', function (event) {
        if (activeTab != 3) {
            sliderLabel.textContent = 'Inversion';

            buttons.forEach(button => {
                button.classList.remove('active');
            });

            event.target.classList.add('active');

            activeTab = 3
            slider.value = currentInversion;
            activeTabValue = currentInversion;
            filterInfo.textContent = currentInversion;

        }
    });

    grayscaleBtn.addEventListener('click', function (event) {
        if (activeTab != 4) {
            sliderLabel.textContent = 'Grayscale';

            buttons.forEach(button => {
                button.classList.remove('active');
            });

            event.target.classList.add('active');

            activeTab = 4;
            slider.value = currentGrayscale;
            activeTabValue = currentGrayscale;
            filterInfo.textContent = currentGrayscale;
        }
    });

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    slider.addEventListener('input', function (event) {
        if (activeTab == 1) {
            currentBrightness = event.target.value;
            // previewImage.style.filter = `brightness(${currentBrightness})`;
            filterInfo.textContent = Math.round(currentBrightness * 100) + "%";

        } else if (activeTab == 2) {
            currentSaturation = event.target.value;
            //  previewImage.style.filter = `saturate(${currentSaturation})`
            filterInfo.textContent = currentSaturation;
        } else if (activeTab == 3) {
            currentInversion = event.target.value;
            // previewImage.style.filter = `invert(${currentInversion})`;
            filterInfo.textContent = currentInversion;
        } else if (activeTab == 4) {
            currentGrayscale = event.target.value;
            // previewImage.style.filter = `grayscale(${currentGrayscale})`;
            filterInfo.textContent = currentGrayscale;

        }

        updateAllFilters();
    });

    blurSlider.addEventListener('input', function (event) {
        currentBlur = event.target.value;
        //previewImage.style.filter = `blur(${currentBlur}px)`;
        updateAllFilters();
        blurInfo.textContent = currentBlur + "px";
    });

    sepiaSlider.addEventListener('input', function (event) {
        currentSepia = event.target.value;
        //previewImage.style.filter = `sepia(${currentSepia})`;
        updateAllFilters();
        sepiaInfo.textContent = currentSepia + "px";
    });

    rotateSlider.addEventListener('input', function (event) {
        console.log("rotating");
        currentRotation = event.target.value;
        //previewImage.style.filter = `sepia(${currentSepia})`;
        previewImage.style.transform = `rotate(${currentRotation}deg)`;
        rotateInfo.textContent = currentRotation + "°";
    });

    rotateLeftbtn.addEventListener('click', function (event) {

        currentRotation -= 45;
        rotateInfo.textContent = currentRotation;
        rotateSlider.value = currentRotation;
        previewImage.style.transform = `rotate(${currentRotation}deg)`;
    })

    rotateRightbtn.addEventListener('click', function (event) {

        currentRotation += 45;
        rotateInfo.textContent = currentRotation;
        rotateSlider.value = currentRotation;
        previewImage.style.transform = `rotate(${currentRotation}deg)`;
    })

    flipHorizontally.addEventListener('click', function (event) {
        currentFlipX = currentFlipX == -1 ? 1 : -1;
        previewImage.style.transform = `scaleX(${currentFlipX})`;
    })

    flipVertically.addEventListener('click', function (event) {
        currentFlipY = currentFlipY == -1 ? 1 : -1;
        previewImage.style.transform = `scaleY(${currentFlipY})`;
    })

    function resetSliders() {

        slider.value = activeTabValue;
        sepiaSlider.value = currentSepia;
        rotateSlider.value = currentRotation;
        blurSlider.value = 0;

        filterInfo.textContent = activeTabValue;
        blurInfo.textContent = 0;
        sepiaInfo.textContent = currentSepia;
        rotateInfo.textContent = currentRotation + "°";;
    }

    function resetFilters() {
        currentRotation = 0;
        currentFlipX = 1;
        currentFlipY = 1;

        currentBrightness = 1;
        currentSaturation = 1;
        currentInversion = 0;
        currentGrayscale = 0;
        currentBlur = 0;
        currentSepia = 0;

        previewImage.style.filter = ``;
        previewImage.style.transform = `rotate(${currentRotation}deg)`;
        previewImage.style.transform = `rotate(${currentRotation}deg)`;
        previewImage.style.transform = `scaleX(${currentFlipX})`;
        previewImage.style.transform = `scaleY(${currentFlipY})`;

        resetSliders();
    }
    resetBtn.addEventListener('click', function (event) {
        resetFilters();
    })
});
