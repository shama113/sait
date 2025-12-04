// script.js
// Скрипт для интерактивного профиля с формой редактирования,
// валидацией, отображением навыков, ссылок и работы с API.

// Глобальные переменные и DOM элементы
const profileView = document.getElementById('profile-view');
const profileEdit = document.getElementById('profile-edit');

const editBtn = document.getElementById('edit-btn');
const cancelBtn = document.getElementById('cancel-btn');

const profilePhoto = document.getElementById('profile-photo');
const profileName = document.getElementById('profile-name');
const profileBio = document.getElementById('profile-bio');
const profileSkills = document.getElementById('profile-skills');
const profileLinks = document.getElementById('profile-links');

const form = document.getElementById('edit-form');

const inputName = document.getElementById('input-name');
const inputPhoto = document.getElementById('input-photo');
const inputBio = document.getElementById('input-bio');
const inputSkills = document.getElementById('input-skills');
const inputGitHub = document.getElementById('input-github');
const inputResume = document.getElementById('input-resume');

const errorName = document.getElementById('error-name');
const errorPhoto = document.getElementById('error-photo');
const errorBio = document.getElementById('error-bio');
const errorSkills = document.getElementById('error-skills');
const errorGitHub = document.getElementById('error-github');
const errorResume = document.getElementById('error-resume');

// Хранилище профиля (имитация загрузки с сервера)
let profileData = {
  name: 'Иван Иванов',
  photo: 'https://via.placeholder.com/150',
  bio: 'Я фронтенд-разработчик, увлекаюсь веб-технологиями и анимациями.',
  skills: ['HTML', 'CSS', 'JavaScript'],
  github: 'https://github.com/ivanivanov',
  resume: 'https://example.com/resume.pdf',
};

// Функция отрисовки профиля на странице
function renderProfile(data) {
  profilePhoto.src = data.photo || 'https://via.placeholder.com/150';
  profilePhoto.alt = data.name ? `Фото профиля ${data.name}` : 'Фото профиля';
  profileName.textContent = data.name || 'Имя Фамилия';
  profileBio.textContent = data.bio || 'Краткое описание...';

  // Очистить текущие навыки
  profileSkills.innerHTML = '';
  if (Array.isArray(data.skills)) {
    data.skills.forEach(skill => {
      const skillEl = document.createElement('span');
      skillEl.classList.add('skill');
      skillEl.textContent = skill.trim();
      profileSkills.appendChild(skillEl);
    });
  }

  // Ссылки
  profileLinks.innerHTML = '';
  if (data.github) {
    const aGitHub = document.createElement('a');
    aGitHub.href = data.github;
    aGitHub.target = '_blank';
    aGitHub.rel = 'noopener noreferrer';
    aGitHub.textContent = 'GitHub';
    profileLinks.appendChild(aGitHub);
  }
  if (data.resume) {
    const aResume = document.createElement('a');
    aResume.href = data.resume;
    aResume.target = '_blank';
    aResume.rel = 'noopener noreferrer';
    aResume.textContent = 'Резюме PDF';
    profileLinks.appendChild(aResume);
  }
}

// Функция показа формы редактирования с заполнением текущими данными
function showEditForm(data) {
  inputName.value = data.name || '';
  inputPhoto.value = data.photo || '';
  inputBio.value = data.bio || '';
  inputSkills.value = (data.skills || []).join(', ');
  inputGitHub.value = data.github || '';
  inputResume.value = data.resume || '';

  // Очистка ошибок
  clearErrors();

  // Показать форму, скрыть просмотр
  profileView.classList.add('hidden');
  profileEdit.classList.remove('hidden');
  profileEdit.classList.add('visible');
}

// Скрыть форму редактирования и показать профиль
function hideEditForm() {
  profileEdit.classList.add('hidden');
  profileEdit.classList.remove('visible');
  profileView.classList.remove('hidden');
}

// Очистить все ошибки в форме
function clearErrors() {
  errorName.textContent = '';
  errorPhoto.textContent = '';
  errorBio.textContent = '';
  errorSkills.textContent = '';
  errorGitHub.textContent = '';
  errorResume.textContent = '';
}

// Валидация URL (простая)
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Валидация формы, возвращает true/false и отображает ошибки
function validateForm() {
  let isValid = true;
  clearErrors();

  // Имя
  const nameVal = inputName.value.trim();
  if (nameVal.length < 3 || nameVal.length > 50) {
    errorName.textContent = 'Имя должно содержать от 3 до 50 символов.';
    isValid = false;
  }

  // Фото — необязательно, но если есть, то валидный URL
  const photoVal = inputPhoto.value.trim();
  if (photoVal && !isValidURL(photoVal)) {
    errorPhoto.textContent = 'Введите корректный URL для фото.';
    isValid = false;
  }

  // Описание
  const bioVal = inputBio.value.trim();
  if (bioVal.length < 10 || bioVal.length > 300) {
    errorBio.textContent = 'Описание должно содержать от 10 до 300 символов.';
    isValid = false;
  }

  // Навыки
  const skillsVal = inputSkills.value.trim();
  if (!skillsVal) {
    errorSkills.textContent = 'Введите хотя бы один навык.';
    isValid = false;
  }

  // GitHub
  const githubVal = inputGitHub.value.trim();
  if (!githubVal || !isValidURL(githubVal)) {
    errorGitHub.textContent = 'Введите корректный URL GitHub.';
    isValid = false;
  }

  // Резюме
  const resumeVal = inputResume.value.trim();
  if (!resumeVal || !isValidURL(resumeVal)) {
    errorResume.textContent = 'Введите корректный URL PDF резюме.';
    isValid = false;
  }

  return isValid;
}

// Обработка сабмита формы
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm()) return;

  // Обновляем данные профиля
  profileData.name = inputName.value.trim();
  profileData.photo = inputPhoto.value.trim() || 'https://via.placeholder.com/150';
  profileData.bio = inputBio.value.trim();
  profileData.skills = inputSkills.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  profileData.github = inputGitHub.value.trim();
  profileData.resume = inputResume.value.trim();

  // Сохраняем данные (имитация)
  saveProfileData(profileData);

  // Обновляем отображение
  renderProfile(profileData);

  // Скрываем форму
  hideEditForm();
});

// Кнопка отмены редактирования
cancelBtn.addEventListener('click', () => {
  hideEditForm();
});

// Кнопка редактирования — показать форму
editBtn.addEventListener('click', () => {
  showEditForm(profileData);
});

// Изменение фото по клику (опционально)
profilePhoto.parentElement.addEventListener('click', () => {
  showEditForm(profileData);
});

// Имитация сохранения данных на сервер
function saveProfileData(data) {
  // Здесь можно сделать fetch POST/PUT запрос к API.
  // Сейчас — сохраняем в localStorage.
  localStorage.setItem('userProfile', JSON.stringify(data));
}

// Имитация загрузки данных из "сервера"
function loadProfileData() {
  const stored = localStorage.getItem('userProfile');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      profileData = parsed;
    } catch {}
  }
}

// При загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
  renderProfile(profileData);
});
