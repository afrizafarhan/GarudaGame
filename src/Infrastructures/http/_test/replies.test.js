const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
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
  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401, if request not given access token', async () => {
      const requestPayload = {
        content: 'Dicoding',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson).toHaveProperty('error');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson).toHaveProperty('status');
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        content: true,
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson).toHaveProperty('status');
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content harus string');
    });

    it('should response 404 when thread not found', async () => {
      const requestPayload = {
        content: 'dicoding',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson).toHaveProperty('status');
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when thread not found', async () => {
      await ThreadTableTestHelper.addThread({ userId: userData.addedUser.id });
      const requestPayload = {
        content: 'dicoding',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
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

    it('should response 201', async () => {
      await ThreadTableTestHelper.addThread({ userId: userData.addedUser.id });
      await UsersTableTestHelper.addUser({
        username: 'hantu',
        id: 'user-124',
      });
      await ThreadCommentTableTestHelper.addThreadComment({ userId: 'user-124' });
      const requestPayload = {
        content: 'dicoding',
      };
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data).toEqual('object');

      expect(responseJson.data).toHaveProperty('addedReply');
      expect(responseJson.data.addedReply).toHaveProperty('id');
      expect(responseJson.data.addedReply).toHaveProperty('content');
      expect(responseJson.data.addedReply).toHaveProperty('owner');

      expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
    });
  });
});
