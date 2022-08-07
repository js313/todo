exports.catchAsync = (func) => {     //first implementation
    return async (req, res, next) => {
        try {
            await func(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

// exports.catchAsync = (func) => {     //second implementation
//     return (req, res, next) => {
//         func(req, res, next).catch(error => next(error))
//     }
// }