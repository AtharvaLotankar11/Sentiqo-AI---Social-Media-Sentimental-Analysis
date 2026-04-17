'use client';

import React, { useState, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Upload, CheckCircle2, AlertCircle, FileSpreadsheet, Sparkles, X } from 'lucide-react';
import { uploadData } from '@/services/api';

const PROTOCOL_STEPS = [
  { title: 'Format Only',     desc: 'Accepts .CSV exports from Twitter/Reddit.' },
  { title: 'Column Mapping',  desc: 'Required fields: sentiment, id, date, query, user, text.' },
  { title: 'Neural Sorting',  desc: 'Sentiment values must be 0 (Neg), 2 (Neu), or 4 (Pos).' },
  { title: 'Volume Limit',    desc: 'Optimized for batches up to 50k nodes per session.' },
];

const UploadPage = () => {
  const [file, setFile]       = useState(null);
  const [status, setStatus]   = useState('idle'); // idle | uploading | success | error
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const acceptFile = (selected) => {
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected);
      setStatus('idle');
      setMessage('');
      setDetails(null);
    } else {
      setFile(null);
      setStatus('error');
      setMessage('Please select a valid .CSV file');
    }
  };

  const handleFileChange = (e) => acceptFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    try {
      const result = await uploadData(file);
      setStatus('success');
      setDetails(result);
      setMessage(`Successfully ingested ${result.posts_created} social media nodes.`);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Ingestion failed. Check system logs.');
    }
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setMessage('');
    setDetails(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-dark underline decoration-primary decoration-4 underline-offset-8">
          DATA INGESTION
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
          Feed the Neural Engine with raw social media data
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Card */}
        <div className="bg-white border-4 border-black rounded-lg shadow-[4px_4px_0_0_#000] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-black text-white font-black text-[10px] uppercase">
            CSV-HANDLER-v1
          </div>

          {/* Drop Zone */}
          <div
            className={`flex flex-col items-center justify-center border-4 border-dashed rounded-lg p-12 cursor-pointer transition-colors
              ${dragging ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary'}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              id="file-upload"
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />

            <div className={`w-20 h-20 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] mb-6 transition-transform
              ${file ? 'bg-secondary scale-110' : 'bg-accent hover:scale-110'}`}>
              <FileSpreadsheet size={40} className="text-dark" />
            </div>

            {file ? (
              <>
                <span className="font-black text-base uppercase italic tracking-tighter text-center break-all">{file.name}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                  {(file.size / 1024).toFixed(1)} KB — Click to change
                </p>
              </>
            ) : (
              <>
                <span className="font-black text-lg uppercase italic tracking-tighter">Choose CSV File</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                  Click or drag & drop
                </p>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <Button
              className="flex-1 py-4 text-lg flex items-center justify-center gap-2"
              disabled={!file || status === 'uploading'}
              onClick={handleUpload}
            >
              {status === 'uploading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  COMMENCE INGESTION
                </>
              )}
            </Button>
            {file && status !== 'uploading' && (
              <Button variant="outline" onClick={reset} className="px-4 py-4">
                <X size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Protocol Card */}
        <div className="bg-primary border-4 border-black rounded-lg shadow-[4px_4px_0_0_#000] p-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 mb-6 text-white">
            <Sparkles size={24} />
            INGESTION PROTOCOL
          </h2>

          <ul className="space-y-6">
            {PROTOCOL_STEPS.map((item, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="w-7 h-7 bg-white text-primary rounded-full flex items-center justify-center shrink-0 font-black text-xs border-2 border-black">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase italic text-white leading-tight">{item.title}</h3>
                  <p className="text-xs text-white/80 font-bold uppercase tracking-tight leading-normal mt-1">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Sample data hint */}
          <div className="mt-8 p-3 bg-white/10 border-2 border-white/30 rounded-lg">
            <p className="text-[10px] font-black uppercase text-white/70 tracking-widest">
              Sample datasets available in <span className="text-white">/sample_data</span>
            </p>
          </div>
        </div>
      </div>

      {/* Status Notification */}
      {status === 'success' && (
        <div className="p-6 bg-green-100 border-4 border-black rounded-lg flex items-start gap-4 shadow-[4px_4px_0_0_#000]">
          <div className="p-3 bg-secondary rounded-full border-2 border-black text-white shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-xl uppercase italic tracking-tighter text-secondary">NODE LINK ESTABLISHED</h4>
            <p className="text-sm font-bold text-slate-700 uppercase mt-1">{message}</p>
            <div className="mt-4 flex gap-4 flex-wrap">
              <div className="px-3 py-1 bg-white border-2 border-black rounded text-[10px] font-black uppercase">
                Posts Ingested: {details?.posts_created?.toLocaleString()}
              </div>
              <div className="px-3 py-1 bg-white border-2 border-black rounded text-[10px] font-black uppercase">
                Status: Operational
              </div>
            </div>
          </div>
          <button onClick={reset} className="p-1 hover:bg-green-200 rounded transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="p-6 bg-red-100 border-4 border-black rounded-lg flex items-start gap-4 shadow-[4px_4px_0_0_#000]">
          <div className="p-3 bg-red-500 rounded-full border-2 border-black text-white shrink-0">
            <AlertCircle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-xl uppercase italic tracking-tighter text-red-600">INGESTION ABORTED</h4>
            <p className="text-sm font-bold text-slate-700 uppercase mt-1">{message}</p>
          </div>
          <button onClick={reset} className="p-1 hover:bg-red-200 rounded transition-colors">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
