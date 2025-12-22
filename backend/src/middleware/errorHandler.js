// 404 Handler - Route Not Found
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'ERROR',
    message: 'API ROUTE | NOT FOUND',
    path: req.path
  });
};

// Global Rrror Handler
export const globalErrorHandler = (error, req, res, next) => {
  console.error('SERVER | ERROR: ', error);
  res.status(500).json({
    status: 'ERROR',
    message: 'INTERNAL SERVER | ERROR',
    error: error.message
  });
};
