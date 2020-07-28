const User = require("../models/user.model");
const Business = require("../models/business.model");
const utils = require('../utils');
const businessCategories = require("../models/businessCategory.model");


const validVerificationStatus = ["PENDING", "VERIFIED"];

/**
 * Business service contains methods related to business creation, finding and other operations
 */

exports.findForSearch = async (searchQuery, category) => {
    let andQuery = [];
    andQuery.push({name: {$regex: '.*' + searchQuery + '.*'}});
    andQuery.push({verification: 'VERIFIED'});

    if(category && !category.trim().length > 0) {
        andQuery.push({category: category.trim()});
    }
    return await Business.find({$and: andQuery}).limit(10) || null;
}

exports.findByLocation = async (location, maxDistance) => {
    const {latitude, longitude} = location;
    let andQuery = [];
    andQuery.push({verification: 'VERIFIED'});

    andQuery.push({location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [latitude, longitude]
                },
                $maxDistance: maxDistance
            }
        }});
    // maxDistance is in meters
    return Business.find({$and: andQuery}).limit(100) || null;
}

exports.findByVerificationStatus = async (verification) => {
    if(!verification) throw Error("verification status cannot be empty");
    if(validVerificationStatus.indexOf(verification) === -1)
        throw Error("Invalid status");
    return await Business.find({verification}) || null;
}

// exports.getByStatus = async (status) => {
//     User.find({'business.verification': })
// }

exports.createBusiness = async (obj, user) => {
    const {name, email, phoneNumber, address, location, category} = obj;
    if(!name) throw Error("Invalid business name");
    if(!email) throw Error("Invalid email");
    if(!phoneNumber) throw Error("Invalid phone number");
    if(!location) throw Error("Location not specified")
    if(!location.latitude) throw Error("Location does not contain latitude")
    if(!location.longitude) throw Error("Location does not contain longitude")
    if(!category) throw Error("Category cannot be empty");
    const _id = utils.getUid(92, "alphaNumeric");
    let business = new Business({
        _id,
        name,
        userId: user._id,
        email,
        phoneNumber,
        address,
        category,
        location: {
            type: 'Point',
            coordinates: [location.latitude, location.longitude]
        }
    });

    business = await business.save();
    return {business};
}

exports.findBusiness = async (obj, user) => {
    const {searchQuery, category} = obj;
    if(!searchQuery) throw Error("searchQuery cannot be empty");
    return await module.exports.findForSearch(searchQuery, category);
}

exports.findBusinessByLocation = async (obj, user) => {
    const {location} = obj;
    let {maxDistance} = obj
    if(!location) throw Error("No location specified");
    if(!location.latitude) throw Error("Location does not contain latitude")
    if(!location.longitude) throw Error("Location does not contain longitude")
    if(!maxDistance) maxDistance = 10 * 1000; // distance is in meters (so 10 km)
    return module.exports.findByLocation(location, maxDistance);
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

    business.verification = "VERIFIED";
    return await business.save();

}

exports.modifyBusiness = async (obj, user) => {
    const {name, email, phoneNumber, address, location, businessId} = obj;
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
        location: {
            type: 'Point',
            coordinates: [location.latitude, location.longitude]
        }
    })
}

exports.getBusinessByStatus = async (obj, admin) => {
    let {verificationStatus} = obj;
    verificationStatus = verificationStatus.toUpperCase();
    if(!verificationStatus) throw Error("Verification status cannot be empty");
    if(validVerificationStatus.indexOf(verificationStatus) === -1){
        //invalid verification status
        throw Error("Invalid verification status");
    }

    return module.exports.findByVerificationStatus(verificationStatus);
}

exports.getCategoryList = async (obj, user) => {
    return businessCategories.categories;
}