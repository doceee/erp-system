const login = async credentials => {
    await req.post('/api/auth/login').send(credentials);

    return req;
};

const logout = () => req.post('/api/auth/logout').send();

module.exports = { login, logout };
