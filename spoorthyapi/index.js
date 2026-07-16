const express = require('express')
var cors = require('cors');
var mongoose = require('mongoose')
var dotenv = require('dotenv');
var helmet = require('helmet');
var router = express.Router();
dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(cors());
var count1 = 0;
router.use((req, res, next) => {
    console.log("count1 ",count1++);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '50mb', }));
app.use(express.json({ limit: '50mb', extended: true }));

app.use(function (req, res, next) {
    res.setHeader("X-XSS-Protection", "1");
    next();
});

mongoose.connect(process.env.DATA_BASE_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(conn => {
    console.log('MongoDB is Connected')
}).catch(err => {
    console.log(err)
})

const publicDir = require('path').join(__dirname, '/public')
app.use(express.static(publicDir))

app.use('/api', require('./app/route'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});