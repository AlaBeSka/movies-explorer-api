const isEmail = require('validator/lib/isEmail');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const WrongEOP = require('../utils/errors/unAutorize');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      validate: [isEmail, 'Поле "email" неверно заполнено'],
      index: { unique: true },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
  },
  {
    versionKey: false,
    toJSON: {
      useProjection: true,
    },
    toObject: {
      useProjection: true,
    },
  },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new WrongEOP('Неверная почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new WrongEOP('Неверная почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
