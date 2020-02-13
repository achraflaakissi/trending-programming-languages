const Express = require('express');
const bodyParse = require('body-parser');
const cors = require('cors');
const app = Express();
const PORT = process.env.PORT || 3000;

app.use(bodyParse.json());
const corsOptionsDelegate = (req, callback) => {
    let corsOptions = {};
    corsOptions = {
        ...corsOptions,
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Authorization',
            'Accept'
        ]
    };
    callback(null, corsOptions);
};

app.listen(PORT, () => {
    console.log(`Serve running at ${PORT}`);
});