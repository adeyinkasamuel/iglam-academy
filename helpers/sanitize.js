const sanitizeRequestData = (data) => {
    const sanitizedData = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitizedData[key.trim()] = data[key].trim();
      }
    }
    return sanitizedData;
  };
  
  module.exports = sanitizeRequestData;
  