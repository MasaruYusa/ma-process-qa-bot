/**
 * M&A Process QA Bot - Web Server
 * Express.jsベースのWebアプリケーション
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MAProcessQABot } from './qa-bot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// QA Botインスタンス作成
const qaBot = new MAProcessQABot();

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API エンドポイント

/**
 * GET / - Webアプリケーションのトップページ
 */
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * POST /api/ask - 質問を送信して回答を取得
 */
app.post('/api/ask', (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    res.status(400).json({
      error: '質問が無効です',
      message: 'questionパラメータは必須です'
    });
    return;
  }

  try {
    const answer = qaBot.ask(question);
    res.json({
      question,
      answer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'サーバーエラー',
      message: error instanceof Error ? error.message : '不明なエラー'
    });
  }
});

/**
 * GET /api/topics - 利用可能なトピック一覧を取得
 */
app.get('/api/topics', (req: Request, res: Response) => {
  try {
    const topics = qaBot.getAvailableTopics();
    res.json({
      topics,
      count: topics.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'サーバーエラー',
      message: error instanceof Error ? error.message : '不明なエラー'
    });
  }
});

/**
 * GET /api/stats - QA Botの統計情報を取得
 */
app.get('/api/stats', (req: Request, res: Response) => {
  try {
    res.json({
      qaCount: qaBot.getQACount(),
      version: '1.0.0',
      status: 'running'
    });
  } catch (error) {
    res.status(500).json({
      error: 'サーバーエラー',
      message: error instanceof Error ? error.message : '不明なエラー'
    });
  }
});

/**
 * GET /api/health - ヘルスチェック
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 404 ハンドラー
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `${req.method} ${req.path} が見つかりません`
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🤝 M&AプロセスQA Bot - Web Server');
  console.log('========================================');
  console.log(`📚 データベース: ${qaBot.getQACount()}件のQ&Aを搭載`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   POST /api/ask - 質問を送信`);
  console.log(`   GET  /api/topics - トピック一覧`);
  console.log(`   GET  /api/stats - 統計情報`);
  console.log(`   GET  /api/health - ヘルスチェック`);
  console.log('========================================\n');
});

export default app;
