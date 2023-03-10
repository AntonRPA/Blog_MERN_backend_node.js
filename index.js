import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';
//  mongoose.set('strictQuery', true);

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations.js';

import { checkAuth, handleValidationnErrors } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.j4bqi3w.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

//Создаем хранилище изображений
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); //Позволяет прочитать json в POST запросе от пользователя, в body
app.use(cors());
app.use('/uploads', express.static('uploads')); //Get запрос на получение статичного файла

//Авторизация пользователя
app.post(
  '/auth/login',
  loginValidation,
  handleValidationnErrors,
  UserController.login
);
//Регистрация пользователя
app.post(
  '/auth/register',
  registerValidation,
  handleValidationnErrors,
  UserController.register
);
//Проверка пользователя
app.get('/auth/me', checkAuth, UserController.getMe);

//Rout на загрузку картинки на сервер в папку "uploads"
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//Работа с постами
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationnErrors,
  PostController.create
);
app.delete('/posts/:idPost', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationnErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
