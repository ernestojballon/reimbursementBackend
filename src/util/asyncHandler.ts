export function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      err.statusCode && res.status(err.statusCode) || res.status(500) ;
      res.json({ message: err.message });
      //TO DO:: make and end point to handler the errors
      //next(err);
    }
  };
}
