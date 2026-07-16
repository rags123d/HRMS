const Joi = require('joi');

const addCourseSchema = Joi.object({
    name: Joi.string().required(),
})

const editCourseSchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
})

const courseSchema = Joi.object({
    id: Joi.string().required(),
})

const ValidationTypes = {
    COURSE_UPDATE: 'update_name',
    COURSE_ID: 'name_id',
    COURSE_EDIT: 'name_edit'
}

function validate(type, data) {
    if (type == ValidationTypes.COURSE_UPDATE) {
        return addCourseSchema.validate(data);
    } else if (type == ValidationTypes.COURSE_ID) {
        return courseSchema.validate(data);
    } else if (type == ValidationTypes.COURSE_EDIT) {
        return editCourseSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}