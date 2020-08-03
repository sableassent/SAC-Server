const User = require("../models/user.model");
const Business = require("../models/business.model");
const utils = require('../utils');
const businessCategories = require("../models/businessCategory.model");
const FileUploadService = require("./fileUpload.service")

const validVerificationStatus = ["PENDING", "VERIFIED", "REJECTED"];

/**
 * Business service contains methods related to business creation, finding and other operations
 */

exports.findForSearch = async (searchQuery, category, location, maxDistance, limit, offset) => {
    let andQuery = [];
    if(searchQuery) andQuery.push({name: {$regex: '.*' + searchQuery + '.*'}});


    if(category && !category.trim().length > 0) {
        andQuery.push({category: category.trim()});
    }

    if(location && location.latitude && location.longitude){
        const {latitude, longitude} = location;
        if(!maxDistance) maxDistance = 10 * 1000; // in meters
        andQuery.push({location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistance
                }
            }})
    }

    andQuery.push({verification: 'VERIFIED'});
    if(!offset) offset = 0;
    if(!limit)  limit = 10;
    return Business.find({$and: andQuery}).skip(offset).limit(limit) || null;
}

exports.findByLocation = async (location, maxDistance, limit, offset) => {
    const {latitude, longitude} = location;
    let andQuery = [];
    andQuery.push({verification: 'VERIFIED'});

    andQuery.push({location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance
            }
        }});
    if(!offset) offset = 0;
    if(!limit)  limit = 10;
    // maxDistance is in meters
    return Business.find({$and: andQuery}).skip(offset).limit(limit) || null;
}

exports.findByUserId = async (userId) => {
    return Business.find({userId}) || null;
}

exports.findByVerificationStatus = async (verification, offset, limit) => {
    // if(!verification) throw Error("verification status cannot be empty");
    // if(validVerificationStatus.indexOf(verification) === -1)
    //     throw Error("Invalid status");
    if(!offset) offset = 0;
    if(!limit)  limit = 10;
    if(!verification){
        return await Business.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit) || null;
    }
    return await Business.find({verification}).sort({ createdAt: -1 }).skip(offset).limit(limit) || null;
}

// exports.getByStatus = async (status) => {
//     User.find({'business.verification': })
// }

exports.createBusiness = async (obj, user) => {
    const {name, email, phoneNumber, address, location, category,twitterUrl,instagramUrl,facebookUrl,description, foundationYear} = obj;
    if(!name) throw Error("Invalid business name");
    if(!email) throw Error("Invalid email");
    if(!phoneNumber) throw Error("Invalid phone number");
    if(!location) throw Error("Location not specified")
    if(!location.latitude) throw Error("Location does not contain latitude")
    if(!location.longitude) throw Error("Location does not contain longitude")
    if(!category) throw Error("Category cannot be empty");
    if(!foundationYear) throw Error("Foundation Year is required");
    let business = new Business({
        // _id,
        name,
        userId: user._id,
        email,
        phoneNumber,
        address,
        category,
        twitterUrl,
        instagramUrl,
        facebookUrl,
        description,
        foundationYear,
        location: {
            type: 'Point',
            coordinates: [location.latitude, location.longitude]
        }
    });

    business = await business.save();
    return {business};
}

exports.findBusiness = async (obj, user) => {
    const {searchQuery, category, offset, limit, latitude, longitude} = obj;
    return await module.exports.findForSearch(searchQuery, category,{latitude, longitude}, limit, offset);
}

exports.findBusinessByLocation = async (obj, user) => {
    let {maxDistance, offset, limit, latitude, longitude} = obj;
    // if(!location) throw Error("No location specified");
    if(!latitude) throw Error("Location does not contain latitude")
    if(!longitude) throw Error("Location does not contain longitude")
    if(!maxDistance) maxDistance = 10 * 1000; // distance is in meters (so 10 km)
    return module.exports.findByLocation({latitude, longitude}, maxDistance, limit, offset);
}


exports.verifyBusiness = async (obj, admin) => {
    let {verificationStatus, businessId} = obj;
    if(!businessId) throw Error("business ID cannot be empty");

    if(!verificationStatus) throw Error("Invalid status supplied");
    verificationStatus = verificationStatus.toUpperCase();
    if(validVerificationStatus.indexOf(verificationStatus) === -1){
        // Invalid verification status
        throw Error("Invalid verification status");
    }

    const business = await Business.findById(businessId);
    if(!business) throw Error("Business not found");

    business.verification = verificationStatus;
    return business.save();

}

exports.modifyBusiness = async (obj, user) => {
    const {name, email, phoneNumber, address, location, foundationYear, businessId, category,twitterUrl,instagramUrl,facebookUrl,description} = obj;

    if(!businessId) throw Error("businessId cannot be empty");
    if(!name) throw Error("Invalid business name");
    if(!email) throw Error("Invalid email");
    if(!phoneNumber) throw Error("Invalid phone number");
    if(!location) throw Error("Location not specified")
    if(!location.latitude) throw Error("Location does not contain latitude")
    if(!location.longitude) throw Error("Location does not contain longitude")


    return await Business.update({_id: businessId},{
        name,
        email,
        phoneNumber,
        address,
        category,
        twitterUrl,
        instagramUrl,
        facebookUrl,
        description,
        foundationYear,
        location: {
            type: 'Point',
            coordinates: [location.latitude, location.longitude]
        }
    })
}

exports.getBusinessByStatus = async (obj, admin) => {
    let {verificationStatus, offset, limit} = obj;
    if(verificationStatus)
    verificationStatus = verificationStatus.toUpperCase();
    if(verificationStatus && validVerificationStatus.indexOf(verificationStatus) === -1){
        //invalid verification status
        throw Error("Invalid verification status");
    }
    if(offset) offset = parseInt(offset);
    if(limit)  limit = parseInt(limit);

    return module.exports.findByVerificationStatus(verificationStatus, offset, limit);
}

exports.getCategoryList = async (obj, user) => {
    return businessCategories.categories;
}

exports.addBusinessImage = async (req, user) => {
    const imageId = await FileUploadService.uploadFileUnique(req);
    const {businessId} = req.body;
    if(!businessId) throw Error("business ID cannot be empty");

    let business = await Business.findById(businessId);
    if(business.userId !== user._id){
        throw Error("User does not match")
    }
    business.images.push({createdAt: new Date(), imageId: imageId});
    return business.save();
}

exports.getMyBusiness = async (obj, user) => {
    return findByUserId(user._id);
}