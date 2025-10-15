#!/usr/bin/env node
/**
 * M&A Process QA Bot - CLI Interface
 * 対話型コマンドラインインターフェース
 */

import * as readline from 'readline';
import { MAProcessQABot } from './qa-bot';

class MAProcessQACLI {
  private bot: MAProcessQABot;
  private rl: readline.Interface;

  constructor() {
    this.bot = new MAProcessQABot();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * CLIを起動
   */
  public start(): void {
    this.showWelcome();
    this.promptUser();
  }

  /**
   * ウェルカムメッセージを表示
   */
  private showWelcome(): void {
    console.log('\n========================================');
    console.log('🤝 M&Aプロセス QA Bot');
    console.log('========================================\n');
    console.log(`📚 データベース: ${this.bot.getQACount()}件のQ&Aを搭載\n`);
    console.log('💡 使い方:');
    console.log('  - M&Aに関する質問を入力してください');
    console.log('  - "help" でヘルプを表示');
    console.log('  - "topics" で利用可能なトピックを表示');
    console.log('  - "exit" または "quit" で終了\n');
  }

  /**
   * ユーザーにプロンプトを表示
   */
  private promptUser(): void {
    this.rl.question('質問を入力してください > ', (input) => {
      this.handleInput(input.trim());
    });
  }

  /**
   * ユーザー入力を処理
   * @param input ユーザー入力
   */
  private handleInput(input: string): void {
    if (!input) {
      this.promptUser();
      return;
    }

    const lowerInput = input.toLowerCase();

    // 特殊コマンド処理
    if (lowerInput === 'exit' || lowerInput === 'quit') {
      this.exit();
      return;
    }

    if (lowerInput === 'help') {
      this.showHelp();
      this.promptUser();
      return;
    }

    if (lowerInput === 'topics') {
      this.showTopics();
      this.promptUser();
      return;
    }

    // QA Botに質問
    const answer = this.bot.ask(input);
    console.log(`\n${answer}\n`);

    this.promptUser();
  }

  /**
   * ヘルプを表示
   */
  private showHelp(): void {
    console.log('\n【ヘルプ】');
    console.log('  - 質問を入力: M&Aプロセスに関する質問を自由に入力');
    console.log('  - help: このヘルプを表示');
    console.log('  - topics: 利用可能なトピック一覧を表示');
    console.log('  - exit / quit: プログラムを終了\n');
  }

  /**
   * 利用可能なトピックを表示
   */
  private showTopics(): void {
    const topics = this.bot.getAvailableTopics();
    console.log('\n【利用可能なトピック】');
    topics.forEach((topic, index) => {
      console.log(`  ${index + 1}. ${topic}`);
    });
    console.log('');
  }

  /**
   * プログラムを終了
   */
  private exit(): void {
    console.log('\n👋 M&A QA Botをご利用いただきありがとうございました！\n');
    this.rl.close();
    process.exit(0);
  }
}

export { MAProcessQACLI };
