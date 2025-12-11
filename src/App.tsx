import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  const [markdown, setMarkdown] = useState<string>("");

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <textarea
        className="w-1/2 prose prose-invert p-4 bg-transparent resize-none outline-none"
        placeholder="マークダウンを入力してください"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <div className="w-1/2 prose prose-invert p-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;
