const Joi = require('joi');

const patchValidator = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().min(3).max(100).optional(),
    completed: Joi.boolean().optional(),
  }).min(1);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = patchValidator;