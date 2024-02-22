const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      console.log(err);
      // next(err);
      res.status(400).json({
        error: err.message,
        status: false,
      });
    });
  };
};

export default catchAsync;
