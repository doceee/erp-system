const app = require('../index');
const {
    app: { port }
} = require('../config');

app.listen(port, () => console.log(`server running on port ${port}`));
