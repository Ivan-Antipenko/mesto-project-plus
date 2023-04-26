const { celebrate, Joi } = require('celebrate');

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const changeUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const setAvatarUserValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});
