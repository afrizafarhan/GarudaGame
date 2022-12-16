const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const LikeCommentTableTestHelper = require('../../../../tests/LikeCommentTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });
  let accessToken = '';
  let userData;
  beforeAll(async () => {
    const requestPayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const server = await createServer(container);
    // add user
    const userResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    userData = JSON.parse(userResponse.payload).data;

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });
    const responseJson = JSON.parse(response.payload);
    accessToken = responseJson.data.accessToken;
  });
  describe('when POST /thread/{threadId}/comments', () => {
    it('should response 401 when not given valid access token', async () => {
      const requestPayload = {
        content: 'Dicoding',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: 'Bearer token-123',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson).toHaveProperty('error');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.error).toEqual('Unauthorized');
    });
    it('should response 404 when given no exist thread', async () => {
      const requestPayload = {
        content: 'Dicoding',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
    it('should response 400 when request payload not contain needed property', async () => {
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        userId: userData.addedUser.id,
      });
      const requestPayload = {
        content: '',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar pada thread dikarenakan properti yang dibutuhkan tidak ada');
    });
    it('should response 400 when request payload not meet data type specification', async () => {
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        userId: userData.addedUser.id,
      });
      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content harus string');
    });
    it('should response 201', async () => {
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        userId: userData.addedUser.id,
      });
      const requestPayload = {
        content: 'Pertanyaan yang bagus',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data).toEqual('object');

      expect(responseJson.data).toHaveProperty('addedComment');
      expect(responseJson.data.addedComment).toHaveProperty('id');
      expect(responseJson.data.addedComment).toHaveProperty('content');
      expect(responseJson.data.addedComment).toHaveProperty('owner');

      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
    });
  });

  describe('when DELETE /thread/{threadId}/comments/{commentsId}', () => {
    it('should response 401 when not given valid access token', async () => {
      const requestPayload = {
        content: 'Dicoding',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        payload: requestPayload,
        headers: {
          authorization: 'Bearer token-123',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson).toHaveProperty('error');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.error).toEqual('Unauthorized');
    });
    it('should response 404 when given no exist thread', async () => {
      const requestPayload = {
        content: 'Dicoding',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
    it('should response 403', async () => {
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        userId: userData.addedUser.id,
      });
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'hantu' });
      await ThreadCommentTableTestHelper.addThreadComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-124',
      });
      const requestPayload = {
        content: 'Pertanyaan yang bagus',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('kamu tidak punya akses untuk komentar ini');
    });
    it('should response 200', async () => {
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        userId: userData.addedUser.id,
      });
      await ThreadCommentTableTestHelper.addThreadComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: userData.addedUser.id,
      });
      const requestPayload = {
        content: 'Pertanyaan yang bagus',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
  describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    it('should return 401 when user not login', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: 'Bearer token-123',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson).toHaveProperty('error');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.error).toEqual('Unauthorized');
    });
    it('should response 404 when given no exist thread', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
    it('should response 404 when thread comment not found', async () => {
      await ThreadTableTestHelper.addThread({ userId: userData.addedUser.id });

      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson).toHaveProperty('status');
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komen tidak ditemukan');
    });
    it('should return 200 when user like the comment', async () => {
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        userId: userData.addedUser.id,
      });
      const payload = {
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-124',
        likes: 0,
      };
      await ThreadCommentTableTestHelper.addThreadComment(payload);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const comment = await ThreadCommentTableTestHelper.findThreadCommentById('comment-123');
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(comment[0].likes).toEqual(1);
      expect(comment[0].likes).not.toEqual(payload.likes);
    });
    it('should return 200 when user dislike comment', async () => {
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        userId: userData.addedUser.id,
      });
      const payload = {
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-124',
        likes: 1,
      };
      await ThreadCommentTableTestHelper.addThreadComment(payload);
      await LikeCommentTableTestHelper
        .addLikeComment({ id: payload.id, userId: userData.addedUser.id });

      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const comment = await ThreadCommentTableTestHelper.findThreadCommentById('comment-123');
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(comment[0].likes).toEqual(0);
      expect(comment[0].likes).not.toEqual(payload.likes);
    });
  });
});
