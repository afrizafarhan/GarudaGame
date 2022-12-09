class DetailThreadComment {
  constructor(payload) {
    this.verifyPayload(payload);
    const {
      id,
      username,
      created_at: createdAt,
      content,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = createdAt;
    this.content = content;
  }

  verifyPayload(payload) {
    if (!payload.id || !payload.created_at || !payload.username || !payload.content) {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.id !== 'string' || typeof payload.created_at !== 'string' || typeof payload.username !== 'string' || typeof payload.content !== 'string') {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThreadComment;
