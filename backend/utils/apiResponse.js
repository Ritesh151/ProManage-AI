class ApiResponse {
  static success(res, data = null, message = null, statusCode = 200) {
    const response = { success: true };
    if (data !== null) response.data = data;
    if (message) response.message = message;
    return res.status(statusCode).json(response);
  }

  static error(res, message = null, statusCode = 500, errors = null) {
    const response = { success: false };
    if (message) response.message = message;
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static paginated(res, data, page, limit, total) {
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
}

module.exports = ApiResponse;
