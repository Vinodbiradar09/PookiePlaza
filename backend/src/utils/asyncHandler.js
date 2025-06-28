
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
               
                if (typeof next === 'function') {
                    next(err);
                } else {
                   
                    console.error('AsyncHandler error (no next available):', err);
                    res.status(err.statusCode || 500).json({
                        success: false,
                        message: err.message || 'Internal Server Error'
                    });
                }
            });
    }
}

export default asyncHandler;

export {asyncHandler};