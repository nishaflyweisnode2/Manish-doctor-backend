// const cloudinary=require("cloudinary").v2;
// const dotenv=require("dotenv");
// dotenv.config();

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY ,
//     api_secret: process.env.CLOUDINARY_API_SECRET 
//   });

//   exports.uploads=(file, folder)=>{
//         return new Promise(resolve=>{
//             cloudinary.uploader.upload(file,(result)=>{
//                 resolve({
//                     url:result.url,
//                     id:result.public_id
//                 })
//             },{
//                 resource_type:"auto",
//                 folder:folder
//             })
//         })
//   }

//   module.exports=cloudinary;




const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
var multer = require("multer");
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

var uploads = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder: folder
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: result.url,
                    id: result.public_id
                });
            }
        });
    });
};

const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "mManish/registration2", allowed_formats: ["jpg", "jfif", "avif", "webp", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });

const storage11 = multer({ storage: storage })

var kpUpload = storage11.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'doctorspicture', maxCount: 1 },
    { name: 'digitalSignature', maxCount: 1 },
    { name: 'clinicPhoto', maxCount: 1 },
    { name: 'letterHead', maxCount: 1 },
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'medicalDegrees', maxCount: 1 },
]);

module.exports = cloudinary;
module.exports = { kpUpload, storage11, uploads };
