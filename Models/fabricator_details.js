const mongoose = require("mongoose");


const fabricatorSchema=new mongoose.Schema({
    brand_name: String,
    yr_of_est: Number,
    admin: String,
    gst_no:Number,
    wrk_strenght:Number,
    good_at: { type: mongoose.Schema.Types.ObjectId, ref: "fabricator_service" },
    mail:String,
    mobile_number:Number
});

module.exports = mongoose.model("fabricator_detail",fabricatorSchema);