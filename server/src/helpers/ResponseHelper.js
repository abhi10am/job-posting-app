class ResponseHelper {
  error (res, message, statusCode = 404, data = null) {
    return res.status(statusCode).send({
      status: {
        response: 'error',
        message: message
      },
      data
    })
  }

  success (res, message, data = null) {
    return res.status(200).send({
      status: {
        response: 'success',
        message: message
      },
      data
    })
  }
}

module.exports = new ResponseHelper();