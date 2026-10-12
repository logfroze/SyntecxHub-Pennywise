import React, { useState } from 'react';
import {
  FolderArchive,
  Download,
  Copy,
  Check,
  Code2,
  FileCode,
  FileText,
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES, AndroidSourceFile } from '../utils/androidProjectFiles';

interface AndroidProjectViewerProps {
  onNotify: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const AndroidProjectViewer: React.FC<AndroidProjectViewerProps> = ({ onNotify }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidSourceFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onNotify('Copied to clipboard!', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      ANDROID_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Pennywise-Android-SyntecxHub.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onNotify('Pennywise-Android-SyntecxHub.zip downloaded!', 'success');
    } catch (err) {
      console.error('Error generating project ZIP:', err);
      onNotify('Failed to bundle Android project zip', 'error');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-3 pb-16">
      {/* Top Info & ZIP Download Button */}
      <div className="skeuo-card-paper rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
              SyntecxHub Week 4
            </span>
            <h2 className="text-xs font-black text-slate-900 mt-1 uppercase tracking-tight">
              Android Source Code
            </h2>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-2.5 py-1.5 skeuo-btn-teal text-white rounded-xl text-[10px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Zipping...' : 'Get .ZIP'}</span>
          </button>
        </div>

        {/* File Selector Dropdown */}
        <div>
          <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">
            Select Android File ({ANDROID_PROJECT_FILES.length})
          </label>
          <select
            value={selectedFile.path}
            onChange={(e) => {
              const f = ANDROID_PROJECT_FILES.find((x) => x.path === e.target.value);
              if (f) setSelectedFile(f);
            }}
            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-[11px] font-medium text-slate-900 shadow-inner"
          >
            {ANDROID_PROJECT_FILES.map((file) => (
              <option key={file.path} value={file.path}>
                {file.path} ({file.language})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Code Viewer (Dark Terminal / Code Window) */}
      <div className="rounded-2xl border border-slate-700/80 bg-[#0F172A] text-slate-100 overflow-hidden shadow-md flex flex-col max-h-[320px]">
        {/* Header Bar */}
        <div className="px-3 py-1.5 bg-[#1E293B] border-b border-slate-700/70 flex items-center justify-between">
          <div className="truncate mr-2">
            <span className="text-[10px] font-mono font-bold text-slate-200 truncate block">
              {selectedFile.path.split('/').pop()}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="px-2 py-0.5 bg-slate-700/70 hover:bg-slate-700 rounded-md text-[10px] font-bold text-slate-200 flex items-center gap-1 cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-3 text-[10px] font-mono overflow-auto flex-1 leading-relaxed text-slate-300 selection:bg-teal-700">
          <code>{selectedFile.content}</code>
        </pre>
      </div>
    </div>
  );
};
