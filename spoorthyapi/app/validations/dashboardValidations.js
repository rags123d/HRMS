const Joi = require('joi');
const Enum = require('../constants/enum')

const dashboardListingSchema = Joi.object({
    skip: Joi.number(),
    limit: Joi.number(),
    searchText: Joi.string(),
})

const dashboardListingFilterSchema = Joi.object({
    skip: Joi.number(),
    limit: Joi.number(),
    searchText: Joi.string(),
    filter: Joi.string().allow(null, ''),
    fromDate: Joi.date(),
    toDate: Joi.date(),
})

const ValidationTypes = {
    DASHBOARD_LISTING_SCHEMA: 'dashboard_listing_schema',
    DASHBOARD_LISTING_FILTER_SCHEMA: 'dashboard_listing_filter_schema',
}

function validate(type, data) {
    if (type == ValidationTypes.DASHBOARD_LISTING_SCHEMA) {
        return dashboardListingSchema.validate(data)
    }
    else if (type == ValidationTypes.DASHBOARD_LISTING_FILTER_SCHEMA) {
        return dashboardListingFilterSchema.validate(data)
    }
}

module.exports = {
    ValidationTypes,
    validate
}