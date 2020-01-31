exports.handler = async (event) => {
  // Get the request and its headers
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  // Specify the username and password to be used
  const username = 'user';
  const password = 'password';

  // Build a Basic Authentication string
  const authString = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  // Challenge for auth if auth credentials are absent or incorrect
  if (typeof headers.authorization == 'undefined' || headers.authorization[0].value != authString) {
    const response = {
      status: '401',
      statusDescription: 'Unauthorized',
      body: 'Unauthorized',
      headers: {
        'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic' }],
      },
    };

    return response;
  }

  // User has authenticated
  return request;
};
