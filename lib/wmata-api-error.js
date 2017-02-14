function WmataApiError(msg, statusCode, url){
    this.name = 'WmataApiError';
    this.message = msg || '';
    this.statusCode = statusCode;
    this.url = url;
}

WmataApiError.prototype = Error.prototype;

WmataApiError.prototype.setMessage = function(msg){
    this.msg = msg;
}

module.exports = WmataApiError;
