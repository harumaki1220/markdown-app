import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  const [markdown, setMarkdown] = useState<string>("");

  return (
    <div className="flex h-screen">
      <textarea
        className="w-1/2 prose p-4"
        placeholder="マークダウンを入力してください"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <div className="w-1/2 prose p-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;
