import { invoke } from '@tauri-apps/api/core';
import { ask, open, save } from '@tauri-apps/plugin-dialog';
import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

function App() {
  const [markdown, setMarkdown] = useState<string>('');

  const handleSave = useCallback(async () => {
    try {
      const filePath = await save({
        filters: [
          {
            name: 'Markdown',
            extensions: ['md'],
          },
        ],
      });
      if (!filePath) return;
      await invoke('save_file', { path: filePath, contents: markdown });
      alert('保存しました');
    } catch (e) {
      console.error(e);
      alert('保存に失敗しました: ' + e);
    }
  }, [markdown]);

  const handleOpen = useCallback(async () => {
    try {
      const filePath = await open({
        multiple: false,
        filters: [
          {
            name: 'Markdown',
            extensions: ['md'],
          },
        ],
      });
      if (!filePath) return;
      const content = await invoke<string>('read_file', { path: filePath });
      setMarkdown(content);
    } catch (e) {
      console.error(e);
      alert('ファイルの読み込みに失敗しました: ' + e);
    }
  }, []);

  const handleNew = useCallback(async () => {
    if (markdown.length > 0) {
      const answer = await ask('内容は破棄されます。新規作成しますか？', {
        title: '確認',
        kind: 'warning',
        okLabel: '新規作成',
        cancelLabel: 'キャンセル',
      });
      if (!answer) return;
    }
    setMarkdown('');
  }, [markdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNew();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave, handleOpen, handleNew]);

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* ヘッダー */}
      <div className="flex items-center justify-end border-b border-gray-700 bg-gray-800 p-2">
        <button
          onClick={handleNew}
          className="mr-2 cursor-pointer rounded bg-green-600 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-green-500"
        >
          新規（New）
        </button>
        <button
          onClick={handleOpen}
          className="mr-2 cursor-pointer rounded bg-gray-600 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-gray-500"
        >
          開く（Open）
        </button>
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
