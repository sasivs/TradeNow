require("dotenv").config();

const { Op } = require("sequelize");

const checkCode = async (req, res, next) => {
    const tradeCodes = require("../models/TradeVerCodes");
    console.log(req.user);
    try{
        console.log("Here")
        tradeCodes.findOne({
            where: {
                user_id: req.user.id,
                code: req.body.code,
                createdAt: { [Op.gte]: new Date(new Date() - 5 * 60 * 1000)},
                used: false,
            },
            order: [ [ 'createdAt', 'DESC' ]],
        }).then((codeRow)=>{
            console.log(codeRow);
            if(!codeRow) {
                return res.status(400).json({success: false, error: "Invalid Code"});
            }
            tradeCodes.update({
                used: true,
            },{
                where:{
                    id: codeRow.id,
                }
            }).then(([nrows, rows])=>{
                if (nrows === 0 || nrows > 1) {
                    return res.status(500).json({ error: "Please authenticate using a valid token" });
                }
                next();
            })
        })
    }
    catch (error) {
        return res.status(401).send({ error: "Please provide valid code" })
    }
}

module.exports = checkCode;
