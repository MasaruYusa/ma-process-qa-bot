/**
 * M&A Process QA Bot - Core Logic
 * ルールベースのQ&Aシステム
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface QAItem {
  id: number;
  keywords: string[];
  question: string;
  answer: string;
}

export interface QADatabase {
  qaDatabase: QAItem[];
  defaultResponse: string;
}

export class MAProcessQABot {
  private database: QADatabase;

  constructor(databasePath?: string) {
    const dbPath = databasePath || path.join(__dirname, 'data', 'ma-qa-database.json');
    const rawData = fs.readFileSync(dbPath, 'utf-8');
    this.database = JSON.parse(rawData);
  }

  /**
   * ユーザーの質問に対して回答を検索
   * @param query ユーザーの質問
   * @returns 回答
   */
  public ask(query: string): string {
    const normalizedQuery = this.normalizeText(query);

    // キーワードマッチング
    const matchedItem = this.findBestMatch(normalizedQuery);

    if (matchedItem) {
      return `【質問】${matchedItem.question}\n\n【回答】\n${matchedItem.answer}`;
    }

    return this.database.defaultResponse;
  }

  /**
   * テキストの正規化
   * @param text 正規化するテキスト
   * @returns 正規化されたテキスト
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[？?]/g, '')
      .replace(/[！!]/g, '');
  }

  /**
   * 最適なQ&Aアイテムを検索
   * @param normalizedQuery 正規化されたクエリ
   * @returns マッチしたQAアイテム、見つからない場合はnull
   */
  private findBestMatch(normalizedQuery: string): QAItem | null {
    let bestMatch: QAItem | null = null;
    let maxScore = 0;

    for (const item of this.database.qaDatabase) {
      let score = 0;

      // キーワードマッチング
      for (const keyword of item.keywords) {
        const normalizedKeyword = this.normalizeText(keyword);
        if (normalizedQuery.includes(normalizedKeyword)) {
          score += normalizedKeyword.length;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    // スコアが0より大きい場合のみ返す
    return maxScore > 0 ? bestMatch : null;
  }

  /**
   * 利用可能なトピック一覧を取得
   * @returns トピック一覧
   */
  public getAvailableTopics(): string[] {
    return this.database.qaDatabase.map(item => item.question);
  }

  /**
   * データベース内のQ&A件数を取得
   * @returns Q&A件数
   */
  public getQACount(): number {
    return this.database.qaDatabase.length;
  }
}
