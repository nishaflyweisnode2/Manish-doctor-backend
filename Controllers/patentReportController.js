const { StatusCodes } = require('http-status-codes');
const PatientReport = require('../Models/patientReportModel');
const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const { Doctor } = require('../Models/doctorModel');



exports.createPatientReport = async (req, res) => {
  try {
    const { consult } = req.body;

    if (!isValidObjectId(consult?.name)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'Failed',
        message: 'Invalid Doctor ID in consult.name',
      });
    }

    const doctor = await Doctor.findById(consult.name);

    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'Failed',
        message: 'Doctor not found with the specified ID',
      });
    }

    consult.signature = doctor.digitalSignature;

    const newPatientReport = new PatientReport(req.body);
    const savedReport = await newPatientReport.save();

    return res.status(StatusCodes.CREATED).json({
      status: 'Success',
      message: 'Patient Report created successfully',
      data: savedReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Error creating Patient Report',
      error: error.message,
    });
  }
};


exports.getAllPatientReports = async (req, res) => {
  try {
    const patientReports = await PatientReport.find()
      .populate({
        path: 'consult.name',
        select: 'doctorname doctorspicture phonenumber',
        model: Doctor,
      })
      .populate('user');

    return res.status(StatusCodes.OK).json({
      status: 'Success',
      data: patientReports,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Error retrieving Patient Reports',
      error: error.message,
    });
  }
};


exports.getPatientReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const patientReport = await PatientReport.findById(reportId)
      .populate({
        path: 'consult.name',
        select: 'doctorname doctorspicture phonenumber',
        model: Doctor,
      })
      .populate('user');

    if (!patientReport) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'Failed',
        message: 'Patient Report not found',
      });
    }

    return res.status(StatusCodes.OK).json({
      status: 'Success',
      data: patientReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Error retrieving Patient Report',
      error: error.message,
    });
  }
};


exports.getPatientReportByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const patientReports = await PatientReport.find({ user: userId })
      .populate({
        path: 'consult.name',
        select: 'doctorname doctorspicture phonenumber',
        model: Doctor,
      })
      .populate('user');

    if (!patientReports || patientReports.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'Failed',
        message: 'Patient Reports not found for the given user ID',
      });
    }

    return res.status(StatusCodes.OK).json({
      status: 'Success',
      data: patientReports,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Error retrieving Patient Reports',
      error: error.message,
    });
  }
};


exports.updatePatientReport1 = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updatedReport = await PatientReport.findByIdAndUpdate(
      reportId,
      req.body,
      { new: true }
    );

    if (!updatedReport) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'Failed',
        message: 'Patient Report not found',
      });
    }

    return res.status(StatusCodes.OK).json({
      status: 'Success',
      message: 'Patient Report updated successfully',
      data: updatedReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Error updating Patient Report',
      error: error.message,
    });
  }
};


exports.updatePatientReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const existingReport = await PatientReport.findById(reportId);

    if (!existingReport) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'Failed',
        message: 'Patient Report not found',
      });
    }

    const {
      healthcareOrganization,
      inPatientInitialAssessment,
      personalHistory,
      physicalExamination,
      provisionalDiagnosis,
      investigationsAdvised,
      diagnosis,
      detailedNutritionalAssessment,
      carePlan,
      referral,
      medicalOfficer,
      consult,
    } = req.body;

    existingReport.healthcareOrganization = healthcareOrganization || existingReport.healthcareOrganization;
    existingReport.inPatientInitialAssessment = inPatientInitialAssessment || existingReport.inPatientInitialAssessment;
    existingReport.personalHistory = personalHistory || existingReport.personalHistory;
    existingReport.physicalExamination = physicalExamination || existingReport.physicalExamination;
    existingReport.provisionalDiagnosis = provisionalDiagnosis || existingReport.provisionalDiagnosis;
    existingReport.investigationsAdvised = investigationsAdvised || existingReport.investigationsAdvised;
    existingReport.diagnosis = diagnosis || existingReport.diagnosis;
    existingReport.detailedNutritionalAssessment = detailedNutritionalAssessment || existingReport.detailedNutritionalAssessment;
    existingReport.carePlan = carePlan || existingReport.carePlan;
    existingReport.referral = referral || existingReport.referral;
    existingReport.medicalOfficer = medicalOfficer || existingReport.medicalOfficer;
    existingReport.consult = consult || existingReport.consult;

    const updatedReport = await existingReport.save();

    return res.status(StatusCodes.OK).json({
      status: 'Success',
      message: 'Patient Report updated successfully',
      data: updatedReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Error updating Patient Report',
      error: error.message,
    });
  }
};


exports.deletePatientReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const deletedReport = await PatientReport.findByIdAndDelete(reportId);

    if (!deletedReport) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'Failed',
        message: 'Patient Report not found',
      });
    }

    return res.status(StatusCodes.OK).json({
      status: 'Success',
      message: 'Patient Report deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Error deleting Patient Report',
      error: error.message,
    });
  }
};
