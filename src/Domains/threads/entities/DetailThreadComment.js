class DetailThreadComment {
  constructor(payload) {
    this.verifyPayload(payload);
    const {
      id,
      username,
      date,
      content,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
  }

  verifyPayload(payload) {
    if (!payload.id || !payload.date || !payload.username || !payload.content) {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.id !== 'string' || typeof payload.date !== 'string' || typeof payload.username !== 'string' || typeof payload.content !== 'string') {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThreadComment;
