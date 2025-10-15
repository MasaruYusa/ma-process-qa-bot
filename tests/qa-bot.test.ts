/**
 * QA Bot Test Suite
 * M&AプロセスQA Botのテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MAProcessQABot } from '../src/qa-bot';
import * as path from 'path';

describe('MAProcessQABot', () => {
  let bot: MAProcessQABot;

  beforeEach(() => {
    const dbPath = path.join(__dirname, '../src/data/ma-qa-database.json');
    bot = new MAProcessQABot(dbPath);
  });

  describe('基本機能', () => {
    it('QA Botインスタンスを作成できる', () => {
      expect(bot).toBeDefined();
      expect(bot).toBeInstanceOf(MAProcessQABot);
    });

    it('データベース内のQ&A件数を取得できる', () => {
      const count = bot.getQACount();
      expect(count).toBeGreaterThan(0);
      expect(typeof count).toBe('number');
    });

    it('利用可能なトピック一覧を取得できる', () => {
      const topics = bot.getAvailableTopics();
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
      expect(topics[0]).toContain('M&A');
    });
  });

  describe('質問応答機能', () => {
    it('M&Aに関する質問に回答できる', () => {
      const answer = bot.ask('M&Aとは何ですか？');
      expect(answer).toContain('M&A');
      expect(answer).toContain('合併');
      expect(answer).toContain('買収');
    });

    it('デューデリジェンスに関する質問に回答できる', () => {
      const answer = bot.ask('デューデリジェンスについて教えてください');
      expect(answer).toContain('デューデリジェンス');
      expect(answer).toContain('調査');
    });

    it('LOIに関する質問に回答できる', () => {
      const answer = bot.ask('LOIとは？');
      expect(answer).toContain('LOI');
      expect(answer).toContain('意向表明書');
    });

    it('クロージングに関する質問に回答できる', () => {
      const answer = bot.ask('クロージングについて');
      expect(answer).toContain('クロージング');
      expect(answer).toContain('契約');
    });

    it('バリュエーションに関する質問に回答できる', () => {
      const answer = bot.ask('企業価値評価について');
      expect(answer).toContain('バリュエーション');
      expect(answer).toContain('企業価値');
    });

    it('PMIに関する質問に回答できる', () => {
      const answer = bot.ask('PMIとは');
      expect(answer).toContain('PMI');
      expect(answer).toContain('統合');
    });
  });

  describe('キーワードマッチング', () => {
    it('大文字小文字を区別せずにマッチングする', () => {
      const answer1 = bot.ask('m&a');
      const answer2 = bot.ask('M&A');
      expect(answer1).toBe(answer2);
    });

    it('質問マークを含む質問にも対応する', () => {
      const answer = bot.ask('デューデリジェンスとは？');
      expect(answer).toContain('デューデリジェンス');
    });

    it('スペースを含む質問にも対応する', () => {
      const answer = bot.ask('M & A とは');
      expect(answer).toContain('M&A');
    });
  });

  describe('エラーハンドリング', () => {
    it('マッチしない質問にはデフォルトレスポンスを返す', () => {
      const answer = bot.ask('天気はどうですか？');
      expect(answer).toContain('申し訳ございません');
      expect(answer).toContain('トピック');
    });

    it('空の質問にもデフォルトレスポンスを返す', () => {
      const answer = bot.ask('');
      expect(answer).toContain('申し訳ございません');
    });

    it('ランダムな文字列にもデフォルトレスポンスを返す', () => {
      const answer = bot.ask('あいうえお');
      expect(answer).toContain('申し訳ございません');
    });
  });

  describe('複数キーワードマッチング', () => {
    it('複数のキーワードを含む質問に正しく対応する', () => {
      const answer = bot.ask('M&Aの買収プロセスについて');
      expect(answer).toContain('M&A');
    });

    it('部分一致でもマッチングする', () => {
      const answer = bot.ask('DDの調査期間は？');
      expect(answer).toContain('デューデリジェンス');
    });
  });

  describe('回答フォーマット', () => {
    it('回答に質問と回答の両方を含む', () => {
      const answer = bot.ask('M&A');
      expect(answer).toContain('【質問】');
      expect(answer).toContain('【回答】');
    });
  });
});
