
const asyncRapper = require("../Middlewares/asyncRapper")
const Product = require("../Models/productModel")
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../utils/cloudinary")





module.exports.Addproducts = async (req, res) => {
    const {
        productcategory,
        subproductcategories,
        name,
        price,
        description,
        benefits,
        ingredients,
        uses,
        howToUse,
        safetyInformation,
        faqs,
        productDetails,
        rating,
    } = req.body;

    try {
        if (!name || !price || !productcategory || !subproductcategories) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing.',
            });
        }

        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(StatusCodes.CONFLICT).json({
                status: 'Failed',
                message: 'Product with the same name already exists.',
            });
        }

        const result = await cloudinary.uploads(req.file.path)
        const newProduct = new Product({
            productimage: result.url,
            cloudinary_id: result.id,
            productcategory,
            subproductcategories,
            name,
            price,
            description,
            benefits,
            ingredients,
            uses,
            howToUse,
            safetyInformation,
            faqs,
            productDetails,
            rating,
        });

        const savedProduct = await newProduct.save();

        if (savedProduct) {
            return res.status(StatusCodes.CREATED).json({
                status: 'Success',
                message: 'Product Added',
                data: savedProduct,
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Failed to save the product.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while adding the product.',
            error: error.message,
        });
    }
};



module.exports.getallProducts = async (req, res) => {
    try {
        const data = await Product.find()
            .populate({ path: "subproductcategories" })
        res.status(200).json({
            message: "success",
            count: data.length,
            data: data
        });

    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports.getproductbyid = async (req, res) => {
    try {
        const singleProduct = await Product.findById(req.params.id)
            .populate({ path: "subproductcategories" })
        if (singleProduct) {
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleProduct
            })
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Product ID"
            })
        }


    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}



// module.exports.getproductbysubcategoryid = async (req, res) => {
//     const params = req.params.subproductcategories
//     console.log("params", params);
//     try {
//         const singleProduct = await Product.find(params)
//         console.log("singleProduct", singleProduct);
//         //.populate({path:"subcategory"})
//         if (singleProduct) {
//             res.status(StatusCodes.OK).json({
//                 message: "success",
//                 data: singleProduct
//             })
//         } else {
//             res.status(StatusCodes.BAD_REQUEST).json({
//                 status: "Failed",
//                 message: "Invalid Product ID"
//             })
//         }


//     } catch (error) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
//     }
// }

module.exports.getproductbysubcategoryid = async (req, res) => {
    const subcategoryIds = req.params.subproductcategories.split(',').map(id => id.trim()); // Assuming subproductcategories is a comma-separated string of subcategory IDs

    try {
        const products = await Product.find({ subcategory: { $in: subcategoryIds } }).populate('subproductcategories');

        if (products && products.length > 0) {
            res.status(StatusCodes.OK).json({
                message: "Success",
                data: products
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "No products found for the given subcategory IDs."
            });
        }
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "An error occurred while fetching products.",
            error: error.message
        });
    }
};



module.exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Product Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
}


// module.exports.editproduct = async (req, res) => {
//     const { oldprice, currentprice } = req.body
//     try {
//         let updateid = await Product.findById(req.params.id);
//         const prices = currentprice / oldprice * 100;
//         const rounded = prices.toFixed(2)
//         if (updateid) {
//             const data = {
//                 producttitle: req.body.producttitle || updateid.producttitle,
//                 oldprice: req.body.oldprice || updateid.oldprice,
//                 currentprice: req.body.currentprice || updateid.currentprice,
//                 availability: req.body.availability || updateid.availability,
//                 includetest: req.body.includetest || updateid.includetest,
//                 description: req.body.description || updateid.description,
//                 sampletest: req.body.sampletest || updateid.sampletest,
//                 fastingrequired: req.body.fastingrequired || updateid.fastingrequired,
//                 subcategory: req.body.subcategory || updateid.subcategory,
//                 percentageoff: rounded || updateid.percentageoff
//             };

//             Productdetails = await Product.findByIdAndUpdate(req.params.id, data, { new: true })
//             res.status(StatusCodes.OK).json({
//                 message: "Product updated successfuly",
//                 code: StatusCodes.OK,
//                 data: Productdetails
//             })
//         } else {
//             res.status(StatusCodes.BAD_REQUEST).json({
//                 code: StatusCodes.BAD_REQUEST,
//                 status: "failed",
//                 message: "Invalid Product ID",
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json(error)
//     }
// }



module.exports.editProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Product not found.',
            });
        }

        const {
            name,
            price,
            description,
            benefits,
            ingredients,
            uses,
            howToUse,
            safetyInformation,
            faqs,
            productDetails,
            rating,
        } = req.body;


        existingProduct.name = name || existingProduct.name;
        existingProduct.price = price || existingProduct.price;
        existingProduct.description = description || existingProduct.description;
        existingProduct.benefits = benefits || existingProduct.benefits;
        existingProduct.ingredients = ingredients || existingProduct.ingredients;
        existingProduct.uses = uses || existingProduct.uses;
        existingProduct.howToUse = howToUse || existingProduct.howToUse;
        existingProduct.safetyInformation = safetyInformation || existingProduct.safetyInformation;
        existingProduct.faqs = faqs || existingProduct.faqs;
        existingProduct.productDetails = productDetails || existingProduct.productDetails;
        existingProduct.rating = rating || existingProduct.rating;

        const updatedProduct = await existingProduct.save();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while updating the product.',
            error: error.message,
        });
    }
};


module.exports.searchProducts = async (req, res, next) => {
    const producttitleSearch = req.query.name
    try {
        const data = await Product.find({
            name:
                { $regex: `^${producttitleSearch}`, $options: 'i' }
        });
        res.status(200).json({ data });
    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
}



exports.createRating = async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.user.id;
        const { rating, comment } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found',
            });
        }

        const newRating = {
            rating,
            user: userId,
            comment,
        };

        product.rating.push(newRating);
        await product.save();

        return res.status(201).json({
            status: 'Success',
            message: 'Rating created successfully',
            data: newRating,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error creating rating',
            error: error.message,
        });
    }
};



exports.getAllRatings = async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findById(productId).populate('rating.user');

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found',
            });
        }

        const totalRatings = product.rating.length;

        if (totalRatings === 0) {
            return res.status(200).json({
                status: 'Success',
                message: 'No ratings available for the product',
                data: {
                    totalRatings: 0,
                    averageRating: 0,
                    ratings: [],
                },
            });
        }

        const sumRatings = product.rating.reduce((sum, rating) => sum + rating.rating, 0);
        const newNumOfReviews = product.rating.length;
        const averageRating = sumRatings / newNumOfReviews;

        return res.status(200).json({
            status: 'Success',
            message: 'Ratings retrieved successfully',
            data: {
                totalRatings,
                averageRating,
                ratings: product.rating,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error retrieving ratings',
            error: error.message,
        });
    }
};




exports.getRatingById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const ratingId = req.params.ratingId;

        const product = await Product.findById(productId).populate('rating.user');

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found',
            });
        }

        const rating = product.rating.id(ratingId);

        if (!rating) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Rating not found',
            });
        }

        return res.status(200).json({
            status: 'Success',
            data: rating,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error retrieving rating',
            error: error.message,
        });
    }
};



exports.updateRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const ratingId = req.params.ratingId;
        const { rating, comment } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found',
            });
        }

        const ratingToUpdate = product.rating.find(r => r._id.toString() === ratingId);

        if (!ratingToUpdate) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Rating not found',
            });
        }

        if (rating !== undefined) {
            ratingToUpdate.rating = rating;
        }
        if (comment !== undefined) {
            ratingToUpdate.comment = comment;
        }
        if (userId !== undefined) {
            ratingToUpdate.user = userId;
        }

        await product.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Rating updated successfully',
            data: ratingToUpdate,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error updating rating',
            error: error.message,
        });
    }
};



exports.deleteRating = async (req, res) => {
    try {
        const productId = req.params.productId;
        const ratingId = req.params.ratingId;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found',
            });
        }

        const ratingToDelete = product.rating.id(ratingId);

        if (!ratingToDelete) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Rating not found',
            });
        }

        ratingToDelete.remove();
        await product.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Rating deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error deleting rating',
            error: error.message,
        });
    }
};



exports.addReplyToRating = async (req, res) => {
    try {
        const { productId, ratingId } = req.params;
        const { reply } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found',
            });
        }

        const ratingToUpdate = product.rating.find(r => r._id.toString() === ratingId);

        if (!ratingToUpdate) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Rating not found',
            });
        }

        ratingToUpdate.reply = reply;
        await product.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Reply added to rating successfully',
            data: ratingToUpdate,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error adding reply to rating',
            error: error.message,
        });
    }
};
