const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Banking app running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}`);
});
