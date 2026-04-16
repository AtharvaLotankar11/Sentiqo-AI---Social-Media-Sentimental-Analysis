'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Upload, FileText, CheckCircle2, AlertCircle, FileSpreadsheet, Sparkles } from 'lucide-react';
import { uploadData } from '@/services/api';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setStatus('idle');
      setMessage('');
    } else {
      setFile(null);
      setStatus('error');
      setMessage('Please select a valid .CSV file');
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
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
          <Card className="p-8 border-4 border-black shadow-neo-sm relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 px-3 py-1 bg-black text-white font-black text-[10px] uppercase">
               CSV-HANDLER-v1
            </div>

            <div className="flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-8 p-12 hover:border-primary transition-colors group cursor-pointer relative"
                 onClick={() => document.getElementById('file-upload').click()}>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept=".csv"
                onChange={handleFileChange}
              />
              
              <div className="w-20 h-20 bg-accent rounded-full border-2 border-black flex items-center justify-center shadow-neo-sm group-hover:scale-110 transition-transform mb-6">
                <FileSpreadsheet size={40} className="text-dark" />
              </div>

              <span className="font-black text-lg uppercase italic tracking-tighter">
                {file ? file.name : 'Choose CSV File'}
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                Click to browse internal directories
              </p>
            </div>

            <Button 
              className="w-full mt-8 py-4 text-lg"
              disabled={!file || status === 'uploading'}
              onClick={handleUpload}
            >
              {status === 'uploading' ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  PROCESSING NEURAL LINKS...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload size={20} />
                  COMMENCE INGESTION
                </span>
              )}
            </Button>
          </Card>

          {/* Guidelines Card */}
          <Card className="bg-primary text-white p-8 border-4 border-black shadow-neo-sm">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 mb-6">
              <Sparkles size={24} />
              INGESTION PROTOCOL
            </h2>
            
            <ul className="space-y-6">
              {[
                { title: 'Format Only', desc: 'Accepts .CSV exports from Twitter/Reddit.' },
                { title: 'Column Mapping', desc: 'Required fields: sentiment, id, date, query, user, text.' },
                { title: 'Neural Sorting', desc: 'Sentiment values must be 0 (Neg), 2 (Neu), or 4 (Pos).' },
                { title: 'Volume Limit', desc: 'Optimized for batches up to 50k nodes per session.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center shrink-0 font-black text-xs border-2 border-black">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase leading-tight italic">{item.title}</h3>
                    <p className="text-xs text-white/80 font-bold uppercase tracking-tight leading-normal mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Status Notification */}
        {status === 'success' && (
          <div className="p-6 bg-green-100 border-4 border-black rounded-8 flex items-start gap-4 shadow-neo-sm animate-in slide-in-from-bottom-4">
            <div className="p-3 bg-secondary rounded-full border-2 border-black text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-black text-xl uppercase italic tracking-tighter text-secondary">NODE LINK ESTABLISHED</h4>
              <p className="text-sm font-bold text-slate-700 uppercase">{message}</p>
              <div className="mt-4 flex gap-4">
                 <div className="px-3 py-1 bg-white border-2 border-black rounded-8 text-[10px] font-black uppercase">
                   Post Count: {details?.posts_created}
                 </div>
                 <div className="px-3 py-1 bg-white border-2 border-black rounded-8 text-[10px] font-black uppercase">
                   Status: Operational
                 </div>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-6 bg-red-100 border-4 border-black rounded-8 flex items-start gap-4 shadow-neo-sm animate-in slide-in-from-bottom-4">
             <div className="p-3 bg-negative rounded-full border-2 border-black text-white">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-black text-xl uppercase italic tracking-tighter text-negative">INGESTION ABORTED</h4>
              <p className="text-sm font-bold text-slate-700 uppercase">{message}</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default UploadPage;
