const suppressToastMiddleware = (req, res, next) => {
  // Store the original json method
  const originalJson = res.json;

  // Override the json method to check for suppress toast header
  res.json = function (data) {
    // Check if client wants to suppress toast notifications
    const suppressToast = req.headers["x-suppress-toast"] === "true";

    if (suppressToast && data && data.msg) {
      // Remove the message to suppress toast
      const { msg, ...dataWithoutMsg } = data;
      return originalJson.call(this, dataWithoutMsg);
    }

    // Return original response
    return originalJson.call(this, data);
  };

  next();
};

module.exports = suppressToastMiddleware;
