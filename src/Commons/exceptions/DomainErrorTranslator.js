const AuthorizationError = require('./AuthorizationError');
const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator.directories[error.message] || error;
  },
};

DomainErrorTranslator.directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('title dan body harus string'),
  'GET_THREAD.NO_THREAD_FOUND': new NotFoundError('thread tidak ditemukan'),
  'ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat komentar pada thread dikarenakan properti yang dibutuhkan tidak ada'),
  'ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('content harus string'),
  'GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND': new NotFoundError('komen tidak ditemukan'),
  'VERIFY_COMMENT_OWNER.ACCESS_FORBIDEN': new AuthorizationError('kamu tidak punya akses untuk komentar ini'),
  'DELETE_THREAD_COMMENT.ACCESS_FORBIDEN': new AuthorizationError('kamu tidak punya akses untuk menghapus komentar ini'),
  'ADD_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat reply karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('content harus string'),
  'GET_REPLY.NO_REPLY_FOUND': new NotFoundError('reply tidak ditemukan'),
  'VERIFY_OWNER_REPLY.ACCESS_FORBIDEN': new AuthorizationError('kamu tidak punya akses untuk reply ini'),
};

module.exports = DomainErrorTranslator;
