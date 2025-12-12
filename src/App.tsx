import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

function App() {
  const [markdown, setMarkdown] = useState<string>('');

  const handleSave = async () => {
    try {
      const fileName = 'test.md';
      await invoke('save_file', { path: fileName, contents: markdown });
      alert('保存しました');
    } catch (e) {
      console.error(e);
      alert('保存に失敗しました: ' + e);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* ヘッダー */}
      <div className="flex items-center justify-end border-b border-gray-700 bg-gray-800 p-2">
        <button
          onClick={handleSave}
          className="cursor-pointer rounded bg-blue-600 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-blue-500"
        >
          保存（Save）
        </button>
      </div>

      {/* エディタ */}
      <div className="flex flex-1 overflow-hidden">
        <textarea
          className="prose h-full w-1/2 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed prose-invert outline-none"
          placeholder="マークダウンを入力してください"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div className="h-full w-1/2 overflow-auto border-l border-gray-700 p-4">
          <div className="prose max-w-none prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
