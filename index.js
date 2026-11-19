// Получаем элементы страницы
const gallery = document.getElementById("gallery");
const mainImage = document.getElementById("main-image");
const authorName = document.getElementById("author-name");

const newImagesButton = document.getElementById("new-images");
const timerButton = document.getElementById("timer-button");
const statusText = document.getElementById("status");

// Массив изображений
let images = [];

// Индекс выбранной картинки
let selectedIndex = 0;

// Настройки таймера
const TIMER_INTERVAL = 5000;
let timerId = null;
let timerIsRunning = true;

// Получение случайного числа
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Загрузка четырёх случайных изображений
async function loadImages() {
  try {
    newImagesButton.disabled = true;
    statusText.textContent = "Loading images...";

    // Выбираем случайную страницу каталога Picsum
    const page = Math.floor(Math.random() * 10) + 1;

    const response = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=30`
    );

    if (!response.ok) {
      throw new Error("Failed to load images");
    }

    const data = await response.json();

    // Перемешиваем изображения и выбираем четыре
    images = shuffle(data).slice(0, 4);

    // Сбрасываем выбор на первую картинку
    selectedIndex = 0;

    // Показываем миниатюры
    renderGallery();

    // Показываем первую картинку
    selectImage(0);

    statusText.textContent = "Images loaded successfully";

    // Если таймер работал, начинаем новый отсчёт
    if (timerIsRunning) {
      startTimer();
    }
  } catch (error) {
    console.error(error);
    statusText.textContent = "Error loading images. Please try again.";
  } finally {
    newImagesButton.disabled = false;
  }
}

// Создание миниатюр
function renderGallery() {
  gallery.innerHTML = "";

  images.forEach((image, index) => {
    const thumbnail = document.createElement("button");

    thumbnail.type = "button";
    thumbnail.className = "thumbnail";
    thumbnail.setAttribute("aria-label", `Select image ${index + 1}`);
    thumbnail.setAttribute("aria-pressed", "false");

    const img = document.createElement("img");

    img.src = `https://picsum.photos/id/${image.id}/240/160`;
    img.alt = `Photo by ${image.author}`;

    thumbnail.appendChild(img);

    // Выбираем картинку при нажатии
    thumbnail.addEventListener("click", function () {
      selectImage(index);
    });

    gallery.appendChild(thumbnail);
  });
}

// Выбор изображения для большого просмотра
function selectImage(index) {
  if (images.length === 0) {
    return;
  }

  selectedIndex = index;

  const image = images[selectedIndex];

  // Показываем большое изображение
  mainImage.src = `https://picsum.photos/id/${image.id}/1000/650`;

  mainImage.alt = `Photo by ${image.author}`;

  // Показываем автора
  authorName.textContent = image.author;

  // Подсвечиваем выбранную миниатюру
  const thumbnails = gallery.querySelectorAll(".thumbnail");

  thumbnails.forEach((thumbnail, i) => {
    const isSelected = i === selectedIndex;

    thumbnail.classList.toggle("selected", isSelected);
    thumbnail.setAttribute("aria-pressed", String(isSelected));
  });
}

// Переход к следующему изображению
function showNextImage() {
  if (images.length === 0) {
    return;
  }

  const nextIndex = (selectedIndex + 1) % images.length;

  selectImage(nextIndex);
}

// Запуск таймера
function startTimer() {
  stopTimer();

  timerId = setInterval(showNextImage, TIMER_INTERVAL);

  timerIsRunning = true;
  timerButton.textContent = "STOP";
}

// Остановка таймера
function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  timerIsRunning = false;
  timerButton.textContent = "PLAY";
}

// Кнопка NEW
newImagesButton.addEventListener("click", loadImages);

// Запуск и остановка таймера
timerButton.addEventListener("click", function () {
  if (timerIsRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

// Загружаем изображения при открытии страницы
loadImages();
