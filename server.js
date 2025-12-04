// server.js
// ================================
// Node.js + Express сервер для управления профилем пользователя
// Реализует REST API для CRUD операций
// Хранение данных в локальном JSON файле
// Включает валидацию, обработку ошибок, логирование и комментарии
// ================================

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Путь к файлу с данными
const DATA_FILE = path.join(__dirname, 'profileData.json');

// ================================
// Мидлвары
// ================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ================================
// Вспомогательные функции
// ================================

// Проверка существования файла, если нет — создаем с дефолтными данными
function initializeDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      name: 'Иван Иванов',
      photo: 'https://cdn.pixabay.com/photo/2018/10/09/16/11/kylian-mbappe-3737379_1280.jpg',
      bio: 'Я фронтенд-разработчик, увлекаюсь веб-технологиями и анимациями.',
      skills: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/ivanivanov',
      resume: 'https://example.com/resume.pdf'
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

// Чтение данных из файла
function readProfileData() {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Ошибка чтения файла данных:', err);
    return null;
  }
}

// Запись данных в файл
function writeProfileData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Ошибка записи файла данных:', err);
    return false;
  }
}

// Простая валидация профиля
function validateProfile(data) {
  const errors = {};

  if (!data.name || data.name.length < 3 || data.name.length > 50) {
    errors.name = 'Имя должно содержать от 3 до 50 символов';
  }

  if (data.photo && !isValidURL(data.photo)) {
    errors.photo = 'Некорректный URL фото';
  }

  if (!data.bio || data.bio.length < 10 || data.bio.length > 300) {
    errors.bio = 'Описание должно содержать от 10 до 300 символов';
  }

  if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
    errors.skills = 'Введите хотя бы один навык';
  }

  if (!data.github || !isValidURL(data.github)) {
    errors.github = 'Некорректный URL GitHub';
  }

  if (!data.resume || !isValidURL(data.resume)) {
    errors.resume = 'Некорректный URL резюме';
  }

  return errors;
}

// Проверка URL
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ================================
// Инициализация
// ================================
initializeDataFile();

// ================================
// ROUTES
// ================================

// GET /api/profile — получить профиль
app.get('/api/profile', (req, res) => {
  const data = readProfileData();
  if (!data) {
    return res.status(500).json({ error: 'Не удалось прочитать данные профиля' });
  }
  res.json(data);
});

// POST /api/profile — создать профиль (или перезаписать)
app.post('/api/profile', (req, res) => {
  const data = req.body;
  const errors = validateProfile(data);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const success = writeProfileData(data);
  if (!success) {
    return res.status(500).json({ error: 'Не удалось сохранить профиль' });
  }
  res.status(201).json({ message: 'Профиль создан', profile: data });
});

// PUT /api/profile — обновить профиль
app.put('/api/profile', (req, res) => {
  const data = req.body;
  const errors = validateProfile(data);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const success = writeProfileData(data);
  if (!success) {
    return res.status(500).json({ error: 'Не удалось обновить профиль' });
  }
  res.json({ message: 'Профиль обновлен', profile: data });
});

// DELETE /api/profile — удалить профиль (сброс к дефолту)
app.delete('/api/profile', (req, res) => {
  const defaultData = {
    name: 'Имя Фамилия',
    photo: 'https://via.placeholder.com/150',
    bio: '',
    skills: [],
    github: '',
    resume: ''
  };
  const success = writeProfileData(defaultData);
  if (!success) {
    return res.status(500).json({ error: 'Не удалось сбросить профиль' });
  }
  res.json({ message: 'Профиль сброшен', profile: defaultData });
});

// ================================
// ОБРАБОТКА ОШИБОК
// ================================
app.use((req, res, next) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ================================
// ЗАПУСК СЕРВЕРА
// ================================
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// ================================
// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАСШИРЕНИЯ
// ================================
// Здесь можно добавить:
// - Логирование в файл
// - Расширенные проверки данных
// - Поддержку нескольких пользователей
// - Аутентификацию
// - Загрузку файлов (например фото и PDF) через multer
// Код выше уже готов для базового проекта с GitHub и PDF резюме.
// ================================
