const multer=require("multer")
const storage=multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
    
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype==='image/jpeg' || 'image/jpg' || 'image/png'){
        cb(null, true)
    }else{
        cb({message:"unsupported File Format"},false);
    }
}

const upload=multer({
    storage:storage,
    limits:{fileSize:1024 * 1024},
    fileFilter:fileFilter
})

module.exports=upload;


// const multer = require("multer")
const path = require("path")

module.exports=multer({
    storage:multer.diskStorage({}),
    fileFilter:(req,file,cb)=>{
        let ext = path.extname(file.originalname);
        if(ext !==".jpg" && ext !==".jpeg" && ext !==".png"){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true)
    },
});
