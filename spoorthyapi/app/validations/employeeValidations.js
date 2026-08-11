const Joi = require('joi');
var GenderModel = require('../model/gender');
var RelationshipModel = require('../model/relationship')
var CourseModel = require('../model/course');
var DesignationModel = require('../model/designation');
var OccupationModel = require('../model/occupation');
var LanguageModel = require('../model/language');


const publicEmployeeSchema = Joi.object({
    id: Joi.string(),
    FullName: Joi.string().required(),
    ParentName: Joi.string().required(),
    EmailId: Joi.string(),
    SpouseName: Joi.string(),
    DateOfBirth: Joi.date().required(),
    Age: Joi.string().required(),
    PlaceOfBirth: Joi.string().required(),
    Gender: Joi.string().required(),
    MaritalStatus: Joi.string().required(),
    Religion: Joi.string().required(),
    MotherTongue: Joi.string().required(),
    BloodGroup: Joi.string(),
    PresentAddress: Joi.string().required(),
    PresentAddressDistrict: Joi.string().required(),
    PresentAddressPincode: Joi.string().required(),
    PresentAddressPhone: Joi.string().required(),
    PermanentAddress: Joi.string().required(),
    PermanentAddressDistrict: Joi.string().required(),
    PermanentAddressPincode: Joi.string().required(),
    PermanentAddressPhone: Joi.string().required(),
    Identification1: Joi.string().required(),
    Identification2: Joi.string().required(),
    Mark1: Joi.string().required(),
    Mark2: Joi.string().required(),
    AadharNo: Joi.string().required(),
    PAN: Joi.string(),
    FamilyDetail: Joi.string(),
    EducationalQualification: Joi.string().required(),
    WorkExperienceType: Joi.string().required(),
    WorkExperience: Joi.string().required(),
    LanguagesKnown: Joi.string().required(),
    References: Joi.string().required(),

    UniversalAccount: Joi.string(),
    PFAccount: Joi.string(),
    ESI: Joi.string(),
    SchemeCertificate: Joi.string(),
    PPONumber: Joi.string(),
    NonContributoryPeriod: Joi.string(),

    BankName: Joi.string().required(),
    Branch: Joi.string().required(),
    AccountNumber: Joi.string().required(),
    IFSC: Joi.string().required(),
})

const employeeRegisterSchema = Joi.object({
    id: Joi.string(),
    FullName: Joi.string().required(),
    ParentName: Joi.string().required(),
    EmailId: Joi.string(),
    SpouseName: Joi.string(),
    DateOfBirth: Joi.date().required(),
    Age: Joi.string().required(),
    PlaceOfBirth: Joi.string().required(),
    Gender: Joi.string().required(),
    MaritalStatus: Joi.string().required(),
    Religion: Joi.string().required(),
    MotherTongue: Joi.string().required(),
    BloodGroup: Joi.string(),
    PresentAddress: Joi.string().required(),
    PresentAddressDistrict: Joi.string().required(),
    PresentAddressPincode: Joi.string().required(),
    PresentAddressPhone: Joi.string().required(),
    PermanentAddress: Joi.string().required(),
    PermanentAddressDistrict: Joi.string().required(),
    PermanentAddressPincode: Joi.string().required(),
    PermanentAddressPhone: Joi.string().required(),
    Identification1: Joi.string().required(),
    Identification2: Joi.string().required(),
    Mark1: Joi.string().required(),
    Mark2: Joi.string().required(),
    AadharNo: Joi.string().required(),
    PAN: Joi.string(),
    NetSalary: Joi.number().required(),
    GrossSalary: Joi.number().required(),
    DeductedSalary: Joi.number(),
    WorkOrder: Joi.string(),
    FamilyDetail: Joi.string(),
    EducationalQualification: Joi.string().required(),
    WorkExperienceType: Joi.string().required(),
    ESIBasedOn: Joi.string(),
    WorkExperience: Joi.string().required(),
    LanguagesKnown: Joi.string().required(),
    References: Joi.string().required(),
    WorkOrderRole: Joi.string(),
    FetchFixation: Joi.string(),
    DateOfJoining: Joi.date(),
    DateOfExit: Joi.date(),
    ReasonForExit: Joi.string(),
    // WorkOrderUnitBranch: Joi.string(),

    UniversalAccount: Joi.string(),
    PFAccount: Joi.string(),
    ESI: Joi.string(),
    SchemeCertificate: Joi.string(),
    PPONumber: Joi.string(),
    NonContributoryPeriod: Joi.string(),

    BankName: Joi.string().required(),
    Branch: Joi.string().required(),
    AccountNumber: Joi.string().required(),
    IFSC: Joi.string().required(),

    BasicVDA: Joi.string(),
    benefitType: Joi.string(),
    Gratuity: Joi.string(),
    MedicalAllowance: Joi.string(),
    RelieverCharges: Joi.string(),
    Bonus: Joi.string(),
    HRA: Joi.string(),
    NationalFestivalHolidays: Joi.string(),
    Conveyance: Joi.string(),
    LeaveWithWages: Joi.string(),
    WashingAllowance: Joi.string(),
    SpecialAllowance: Joi.string(),

    deductionType: Joi.string(),
    PFAmount: Joi.string(),
    ESIAmount: Joi.string(),
    ProfessionalTax: Joi.string(),
})

const employeeBankSchema = Joi.object({
    id: Joi.string().required(),
    BankName: Joi.string().required(),
    Branch: Joi.string().required(),
    AccountNumber: Joi.string().required(),
    IFSC: Joi.string().required(),
})

const employeeESIPFSchema = Joi.object({
    id: Joi.string().required(),
    UniversalAccount: Joi.string(),
    PFAccount: Joi.string(),
    ESI: Joi.string(),
    SchemeCertificate: Joi.string(),
    PPONumber: Joi.string(),
    NonContributoryPeriod: Joi.string(),
})

const employeeIdSchema = Joi.object({
    id: Joi.string().required()
})

const workorderIdSchema = Joi.object({
    id: Joi.string().required()
})

const feebackSchema = Joi.object({
    id: Joi.string().required(),
    Type: Joi.string().required(),
    FeedbackRemarks: Joi.string().required(),
    SubmittedBy: Joi.string().required()
})

const ValidationTypes = {
    PUBLIC_EMPLOYEE_REGISTER: 'public_register_employee',
    EMPLOYEE_REGISTER: 'register_employee',
    EMPLOYEE_ID: 'employee_id',
    WORKORDER_ID: 'workorder_id',
    EMPLOYEE_BANK_REGISTER: 'register_bank',
    EMPLOYEE_ESIPF_UPDATE: 'update_esipf',
    EMPLOYEE_ADD_FEEDBACK: 'add_feedback'
}

function validate(type, data) {
    if (type == ValidationTypes.PUBLIC_EMPLOYEE_REGISTER) {
        return publicEmployeeSchema.validate(data);
    } else if (type == ValidationTypes.EMPLOYEE_REGISTER) {
        return employeeRegisterSchema.validate(data);
    } else if (type == ValidationTypes.EMPLOYEE_ID) {
        return employeeIdSchema.validate(data);
    } else if (type == ValidationTypes.WORKORDER_ID) {
        return workorderIdSchema.validate(data);
    } else if (type == ValidationTypes.EMPLOYEE_BANK_REGISTER) {
        return employeeBankSchema.validate(data);
    } else if (type == ValidationTypes.EMPLOYEE_ESIPF_UPDATE) {
        return employeeESIPFSchema.validate(data);
    } else if (type == ValidationTypes.EMPLOYEE_ADD_FEEDBACK) {
        return feebackSchema.validate(data)
    }
}

async function validateFamilyDetail(FamilyDetails) {
    if (FamilyDetails) {
        FamilyDetails = JSON.parse(FamilyDetails);
        if (Array.isArray(FamilyDetails) && FamilyDetails.length > 0) {
            for (const Member of FamilyDetails) {
                try {
                    const relationship = await RelationshipModel.findOne({ _id: Member.Relationship })
                    if (!relationship) {
                        return { success: false, message: 'Relationship not found' };
                    }
                    if (!Member.Name) {
                        return { success: false, message: 'Member name required' };
                    }
                    // if (!Member.DateOfBirth) {
                    //     return { success: false, message: 'Member Date of Birth required' };
                    // }
                    // if (!Member.ContactNo) {
                    //     return { success: false, message: 'Member ContactNo. required' };
                    // }
                    // if (!Member.AadharNo) {
                    //     return { success: false, message: 'Member AadharNo. required' };
                    // }
                } catch (error) {
                    console.log("Error - validateFamilyDetail ", error);
                    return { success: false, message: 'Internal server error' };
                }
            }
            return { success: true, message: '' };
        }
    }
    return { success: false, message: 'FamilyDetail is required' };
}

async function validateEducationalQualification(EducationalQualificationDetails) {
    if (EducationalQualificationDetails) {
        EducationalQualificationDetails = JSON.parse(EducationalQualificationDetails);
        if (Array.isArray(EducationalQualificationDetails) && EducationalQualificationDetails.length > 0) {
            for (const EducationalQualification of EducationalQualificationDetails) {
                try {
                    const Course = await CourseModel.findOne({ _id: EducationalQualification.Course })
                    if (!Course) {
                        return { success: false, message: 'Course not found' };
                    }
                    // if (!EducationalQualification.SchoolCollegeName) {
                    //     return { success: false, message: 'EducationalQualification SchoolCollegeName required' };
                    // }
                    // if (!EducationalQualification.From) {
                    //     return { success: false, message: 'EducationalQualification From required' };
                    // }
                    // if (!EducationalQualification.To) {
                    //     return { success: false, message: 'EducationalQualification To required' };
                    // }
                    // if (!EducationalQualification.Marks) {
                    //     return { success: false, message: 'EducationalQualification Marks required' };
                    // }
                } catch (error) {
                    console.log("Error - validateEducationalQualification ", error);
                    return { success: false, message: 'Internal server error' };
                }
            }
            return { success: true, message: '' };
        }
    }
    return { success: false, message: 'EducationalQualificationDetails is required' };
}

async function validateWorkExperience(WorkExperienceDetails) {
    if (WorkExperienceDetails) {
        WorkExperienceDetails = JSON.parse(WorkExperienceDetails);
        if (Array.isArray(WorkExperienceDetails) && WorkExperienceDetails.length > 0) {
            for (const WorkExperience of WorkExperienceDetails) {
                try {
                    // const Designation = await DesignationModel.findOne({ _id: WorkExperience.Designation })
                    // if (!Designation) {
                    //     return { success: false, message: 'Designation not found' };
                    // }
                    if (!WorkExperience.Designation) {
                        return { success: false, message: 'WorkExperience Designation required' };
                    }
                    if (!WorkExperience.CompanyName) {
                        return { success: false, message: 'WorkExperience CompanyName required' };
                    }
                    if (!WorkExperience.From) {
                        return { success: false, message: 'WorkExperience From required' };
                    }
                    if (!WorkExperience.To) {
                        return { success: false, message: 'WorkExperience To required' };
                    }
                    if (!WorkExperience.SalaryDrawn) {
                        return { success: false, message: 'WorkExperience SalaryDrawn required' };
                    }
                    if (!WorkExperience.ReasonForLeaving) {
                        return { success: false, message: 'WorkExperience ReasonForLeaving required' };
                    }
                    // if (!WorkExperience.SupervisorName) {
                    //     return { success: false, message: 'WorkExperience SupervisorName required' };
                    // }
                    // if (!WorkExperience.SupervisorMobile) {
                    //     return { success: false, message: 'WorkExperience SupervisorMobile required' };
                    // }
                    // if (!WorkExperience.SupervisorEmail) {
                    //     return { success: false, message: 'WorkExperience SupervisorEmail required' };
                    // }
                } catch (error) {
                    console.log("Error - validateWorkExperience ", error);
                    return { success: false, message: 'Internal server error' };
                }
            }
            return { success: true, message: '' };
        }
    }
    return { success: false, message: 'WorkExperienceDetails is required' };
}

async function validateLanguagesKnown(LanguagesKnownDetails) {
    if (LanguagesKnownDetails) {
        LanguagesKnownDetails = JSON.parse(LanguagesKnownDetails);
        if (Array.isArray(LanguagesKnownDetails) && LanguagesKnownDetails.length > 0) {
            for (const LanguagesKnown of LanguagesKnownDetails) {
                try {
                    // if (!LanguagesKnown.Language) {
                    //     return { success: false, message: 'Language required' };
                    // }
                    const Language = await LanguageModel.findOne({ _id: LanguagesKnown.Language })
                    if (!Language) {
                        return { success: false, message: 'Language not found' };
                    }
                    if (LanguagesKnown.Speak != false && LanguagesKnown.Speak != true) {
                        return { success: false, message: 'LanguagesKnown Speak required' };
                    }
                    if (LanguagesKnown.Read != false && LanguagesKnown.Read != true) {
                        return { success: false, message: 'LanguagesKnown Read required' };
                    }
                    if (LanguagesKnown.Write != false && LanguagesKnown.Write != true) {
                        return { success: false, message: 'LanguagesKnown Write required' };
                    }
                } catch (error) {
                    console.log("Error - validateLanguagesKnown ", error);
                    return { success: false, message: 'Internal server error' };
                }
            }
            return { success: true, message: '' };
        }
    }

    return { success: false, message: 'LanguagesKnownDetails is required' };
}

async function validateReferences(ReferencesDetails) {
    if (ReferencesDetails) {
        ReferencesDetails = JSON.parse(ReferencesDetails);
        if (Array.isArray(ReferencesDetails) && ReferencesDetails.length > 0) {
            for (const References of ReferencesDetails) {
                try {
                    // const Occupation = await OccupationModel.findOne({ _id: References.Occupation })
                    if (!References.Occupation) {
                        return { success: false, message: 'Occupation is required' };
                    }
                    if (!References.Name) {
                        return { success: false, message: 'References Name required' };
                    }
                    if (!References.Address) {
                        return { success: false, message: 'References Address required' };
                    }
                    if (!References.ContactNo) {
                        return { success: false, message: 'References ContactNo required' };
                    }
                    // if (!References.AadharNo) {
                    //     return { success: false, message: 'References AadharNo required' };
                    // }
                } catch (error) {
                    console.log("Error - validateReferences ", error);
                    return { success: false, message: 'Internal server error' };
                }
            }
            return { success: true, message: '' };
        }
    }
    return { success: false, message: 'ReferencesDetails is required' };
}

module.exports = {
    ValidationTypes,
    validate,
    validateFamilyDetail,
    validateEducationalQualification,
    validateWorkExperience,
    validateLanguagesKnown,
    validateReferences
}
