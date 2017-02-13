function WmataApiError(msg, statusCode){
    this.name = 'WmataApiError';
    this.msg = msg || '';
    this.statusCode = statusCode;
}

WmataApiError.prototype = Error.prototype;

WmataApiError.prototype.setMessage = function(msg){
    this.msg = msg;
}

module.exports = WmataApiError;
