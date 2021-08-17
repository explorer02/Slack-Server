exports.extractFields = (obj, fields) => {
  return fields.reduce((acc, field) => {
    acc[field] = obj[field];
    return acc;
  }, {});
};

exports.checkFields = (obj, fields) => fields.every((f) => obj[f]);

exports.responseType = {
  sendResourceNotFound: (res, resource) => {
    res.status(404).json({ message: `${resource} not found!` });
  },
  sendUnauthorized: (res) => {
    res
      .status(401)
      .json({ message: "You are not authorized for this resource." });
  },
  sendForbidden: (res) => {
    res.status(403).json({ message: "You are forbidden to this resource." });
  },
  sendBadRequest: (res, message, data = {}) => {
    res.status(400).json({ message, ...data });
  },

  sendUnknownError: (res) => {
    res.status(500).json({ message: "Unknown Error!!" });
  },

  sendSuccess: (res, message = "Success!", data = {}) => {
    res.status(200).json({ message, ...data });
  },
};
