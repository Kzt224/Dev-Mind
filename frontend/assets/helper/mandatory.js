export const checkMandatoryFields = (formData) => {
    const mandatoryFields = ["email","name"];
    return mandatoryFields.filter(
        (field) => !formData[field] || formData[field].trim() === ""
    );
};