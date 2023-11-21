const { StatusCodes } = require('http-status-codes');
const VideoCall = require('../Models/videoCallModel');



exports.createVideoCall = async (req, res) => {
    try {
        const userId = req.user.id;

        const { doctorId, date, duration } = req.body;

        const newVideoCall = new VideoCall({
            doctor: doctorId,
            user: userId,
            date,
            duration,
        });

        const savedVideoCall = await newVideoCall.save();

        return res.status(StatusCodes.CREATED).json({
            status: 'Success',
            message: 'Video call scheduled successfully',
            data: savedVideoCall,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error scheduling video call',
            error: error.message,
        });
    }
};


exports.getAllVideoCalls = async (req, res) => {
    try {
        const videoCalls = await VideoCall.find().populate('doctor user');

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            data: videoCalls,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error retrieving video calls',
            error: error.message,
        });
    }
};


exports.getVideoCallById = async (req, res) => {
    try {
        const videoCallId = req.params.id;

        const videoCall = await VideoCall.findById(videoCallId).populate('doctor user');

        if (!videoCall) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Video call not found',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            data: videoCall,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error retrieving video call',
            error: error.message,
        });
    }
};


exports.updateVideoCall = async (req, res) => {
    try {
        const videoCallId = req.params.id;
        const { date, duration, status } = req.body;

        const videoCall = await VideoCall.findByIdAndUpdate(
            videoCallId,
            { date, duration, status },
            { new: true }
        ).populate('doctor user');

        if (!videoCall) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Video call not found',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Video call updated successfully',
            data: videoCall,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error updating video call',
            error: error.message,
        });
    }
};


exports.deleteVideoCall = async (req, res) => {
    try {
        const videoCallId = req.params.id;

        const deletedVideoCall = await VideoCall.findByIdAndDelete(videoCallId);

        if (!deletedVideoCall) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Video call not found',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Video call deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error deleting video call',
            error: error.message,
        });
    }
};
