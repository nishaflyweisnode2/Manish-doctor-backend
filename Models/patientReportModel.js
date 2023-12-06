const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const patientReportSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    healthcareOrganization: {
        name: String,
        age: Number,
        sayrNo: String,
        gender: String,
        ipNo: String,
        dateOfConsultant: Date,
        department: String,
        roomNoBedNo: String,
        dateOfAdmissionTime: Date,
        dateOfDischargeTime: Date,
    },
    inPatientInitialAssessment: {
        chiefComplaint: String,
        associatedComplaint: String,
        historyOfPresentIllness: String,
        historyOfPastIllness: String,
        medicalIllness: String,
        surgicalIllness: String,
        presentMedication: String,
        previousInvestigations: String,
        familyHistory: String,
    },
    personalHistory: {
        maritalStatus: String,
        occupation: String,
        habits: String,
        diet: String,
        sleep: String,
        appetite: String,
        bladder: String,
        bowel: String,
        allergy: String,
        menstrualAndObstetricHistory: String,
    },
    physicalExamination: {
        bp: String,
        pulseRate: String,
        temperature: String,
        respRate: String,
        nutritionalScreening: String,
        height: String,
        weight: String,
        bmi: String,
        visceralFat: String,
    },
    provisionalDiagnosis: String,
    investigationsAdvised: String,
    diagnosis: String,
    detailedNutritionalAssessment: Boolean,
    carePlan: {
        type: String,
        enum: ['Curative', 'Preventative', 'Rehabilive'],
    },
    referral: [String],
    medicalOfficer: {
        name: String,
        signature: String,
        date: Date,
        time: String,
    },
    consult: {
        name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
        },
        signature: String,
        date: Date,
        time: String,
    },
});

const PatientReport = model('PatientReport', patientReportSchema);

module.exports = PatientReport;
