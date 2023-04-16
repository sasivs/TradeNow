require("dotenv").config();

const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");


const fetchuser = (req, res, next) => {
    const session = require("../models/Session");
    const token = req.headers['authtoken'];
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        session.findOne({
            where: {
                user_id: data.user.id,
                session_id: req.headers['authtoken'],
                ended_at: {
                    [Op.is]: null,
                }
            }
        }).then((result)=>{
            if(!result) return res.status(500).json({error: "Please authenticate using a valid token"});
            if(new Date(result.dataValues.last_request) < (new Date(new Date() - 15*60*1000))){
                session.update({
                    ended_at: new Date(),
                },{
                    returning: true,
                    where: {
                        user_id: data.user.id,
                        session_id: req.headers['authtoken'],
                        ended_at: {
                            [Op.is]: null,
                        }
                    }
                }).then(([nrows, rows]) => {
                    if (nrows === 0 || nrows > 1) {
                        return res.status(500).json({ error: "Please authenticate using a valid token" });
                    }
                    return res.status(200);
                });
            }
            else{
                session.update({
                    last_request: new Date(),
                },{
                    returning: true,
                    where: {
                        user_id: data.user.id,
                        session_id: req.headers['authtoken'],
                        ended_at: {
                            [Op.is]: null,
                        }
                    }
                }).then(([nrows, rows]) => {
                    if (nrows === 0 || nrows > 1) {
                        console.log("Second If :", nrows, rows);
                        return res.status(500).json({ error: "Please authenticate using a valid token" });
                    }
                    req.user = data.user;
                    next();
                })
            }
        })
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


module.exports = fetchuser;