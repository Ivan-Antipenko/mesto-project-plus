const { celebrate, Joi } = require('celebrate');

export const addCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

export const changeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});
