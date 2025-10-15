/**
 * M&A Process QA Bot - Frontend JavaScript
 */

const API_BASE = window.location.origin;

// DOM要素
const messagesContainer = document.getElementById('messages');
const inputForm = document.getElementById('input-form');
const questionInput = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');
const topicButtonsContainer = document.getElementById('topic-buttons');
const qaCountElement = document.getElementById('qa-count');

/**
 * 初期化処理
 */
async function init() {
    await loadStats();
    await loadTopics();

    // フォーム送信イベント
    inputForm.addEventListener('submit', handleSubmit);
}

/**
 * 統計情報を読み込む
 */
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        const data = await response.json();
        qaCountElement.textContent = `📚 ${data.qaCount}件のQ&Aを搭載`;
    } catch (error) {
        console.error('統計情報の取得に失敗:', error);
        qaCountElement.textContent = '📚 データベース読み込みエラー';
    }
}

/**
 * トピック一覧を読み込んでボタンを生成
 */
async function loadTopics() {
    try {
        const response = await fetch(`${API_BASE}/api/topics`);
        const data = await response.json();

        // 最初の5件だけ表示
        const displayTopics = data.topics.slice(0, 5);

        displayTopics.forEach(topic => {
            const button = document.createElement('button');
            button.className = 'topic-button';
            button.textContent = topic;
            button.type = 'button';
            button.addEventListener('click', () => {
                questionInput.value = topic;
                questionInput.focus();
            });
            topicButtonsContainer.appendChild(button);
        });
    } catch (error) {
        console.error('トピック一覧の取得に失敗:', error);
    }
}

/**
 * フォーム送信ハンドラー
 */
async function handleSubmit(event) {
    event.preventDefault();

    const question = questionInput.value.trim();
    if (!question) return;

    // ユーザーメッセージを表示
    addMessage(question, 'user');

    // 入力欄をクリア
    questionInput.value = '';

    // 送信ボタンを無効化
    sendButton.disabled = true;
    sendButton.textContent = '送信中...';

    try {
        // APIに質問を送信
        const response = await fetch(`${API_BASE}/api/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();

        // ボットの回答を表示
        addMessage(data.answer, 'bot');

    } catch (error) {
        console.error('質問の送信に失敗:', error);
        addMessage('申し訳ございません。エラーが発生しました。もう一度お試しください。', 'bot');
    } finally {
        // 送信ボタンを有効化
        sendButton.disabled = false;
        sendButton.textContent = '送信';
        questionInput.focus();
    }
}

/**
 * メッセージを追加
 * @param {string} text - メッセージテキスト
 * @param {string} sender - 'user' または 'bot'
 */
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (sender === 'bot') {
        // ボットメッセージの場合、HTMLをそのまま表示
        contentDiv.innerHTML = formatBotMessage(text);
    } else {
        // ユーザーメッセージの場合、テキストとして表示
        contentDiv.textContent = text;
    }

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // スクロールを最下部に移動
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * ボットメッセージをフォーマット
 * @param {string} text - メッセージテキスト
 * @returns {string} - フォーマット済みHTML
 */
function formatBotMessage(text) {
    // 【質問】と【回答】を太字にする
    let formatted = text
        .replace(/【質問】/g, '<strong>【質問】</strong>')
        .replace(/【回答】/g, '<strong>【回答】</strong>');

    // 改行を<br>に変換
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

/**
 * Enterキーでの送信（Shift+Enterは改行）
 */
questionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        inputForm.dispatchEvent(new Event('submit'));
    }
});

// アプリケーション初期化
init();
