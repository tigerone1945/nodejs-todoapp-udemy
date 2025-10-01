const express = require('express');
const app = express();
const connectDB = require('./db/connect');
require('dotenv').config();

// JSONボディをパースするためのミドルウェア
app.use(express.json());

const tasksRouter = require('./routes/tasks.js');

const PORT = 3000;

app.use('/api/v1/tasks', tasksRouter);
app.use(express.static('./public'));

// サーバー起動とデータベース接続

const start = async () => {
  try {
    await connectDB(process.env.MONGO_RENDER_URL || process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`サーバーがポート${PORT}で起動しました`));
  } catch (error) {
    console.error('データベース接続エラー:', error);
  }
};

start();
