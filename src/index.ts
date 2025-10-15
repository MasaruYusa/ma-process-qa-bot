#!/usr/bin/env node
/**
 * ma-process-qa-bot - Entry Point
 * M&AプロセスQA Bot - ルールベースのQ&Aシステム
 */

import { MAProcessQACLI } from './cli.js';

export { MAProcessQABot } from './qa-bot.js';
export { MAProcessQACLI } from './cli.js';

// Run CLI - ESM entry point
const cli = new MAProcessQACLI();
cli.start();
