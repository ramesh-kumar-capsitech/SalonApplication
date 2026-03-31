import joi from 'joi';
export const signupValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        mobile: joi.string().min(10).max(12).required(),

        password: joi.string().min(4).max(100).required(),


    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "bad request", error })
    }
    next();
}
export const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(100).required(),


    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "bad request", error })
    }
    next();
}
export const salonloginvalidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(100).required(),


    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "bad request", error })
    }
    next();
}
export const salonvalidation = (req, res, next) => {
    const schema = joi.object({
        salonname: joi.string().min(4).max(100).required(),
        ownername: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        phone: joi.string().min(10).max(12).required(),
        joinedyear: joi.string().min(4).max(14).required(),
        city: joi.string().min(3).max(100).required(),
        salonaddress: joi.string().min(4).max(100).required(),
        salondescription: joi.string().min(4).max(100).required(),
        staff: joi.string().min(1).max(100).required(),
        services: joi.array().items(
            joi.object({
                name: joi.string().required(),
                price: joi.number().required(),
                duration: joi.number().required()
            })
        )
    });
    const { error } = schema.validate(req.body);
    if (error) {

        return res.status(400)
            .json({ message: "bad request", error })


    }
    next();
}
export const applyjobvalidation = (req, res, next) => {
    const schema = joi.object({
        salonId: joi.string().min(2).max(100).required(),
        name: joi.string().min(4).max(100).required(),
        email: joi.string().email().required(),
        phone: joi.string().min(10).max(12).required(),
        role: joi.string().min(3).max(100).required(),
        experience: joi.string().min(4).max(14).required(),
        availability: joi.string().min(4).max(14).required(),


        skills: joi.array().items(joi.string()).required()
    })
    const { error } = schema.validate(req.body);
    if (error) {

        return res.status(400)
            .json({ message: "bad request", error })


    }
    next();

}
export const employeeloginvalidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(100).required(),


    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "bad request", error })
    }
    next();
}