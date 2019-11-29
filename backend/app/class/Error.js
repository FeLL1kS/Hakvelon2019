function ValidationError(property) {
    Error.call(this, property);
    this.name = "ValidationError";

    this.property = property;
    this.message = "Error validating " + property;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ValidationError);
    } else {
        this.stack = (new Error()).stack;
    }

}

ValidationError.prototype = Object.create(Error.prototype);

module.exports ={
    ValidationError
}