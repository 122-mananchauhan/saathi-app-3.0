import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertCircle, FileSpreadsheet, ShieldCheck, RefreshCw } from 'lucide-react';
import { DataQualityReport } from '../../types';

export function DataManagementView() {
  const [isUploading, setIsUploading] = useState(false);
  const [report, setReport] = useState<DataQualityReport | null>({
    totalRows: 1240,
    validRows: 1215,
    missingValuesCount: 18,
    anomaliesDetected: 7,
    dataQualityScore: 94,
    issues: [
      "18 records missing baseline yield data for FY22 (auto-imputed)",
      "7 revenue entries flagged as statistical outliers (verified with district officer)",
      "100% state and district geographic codes passed schema validation"
    ]
  });

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setReport({
          totalRows: 1560,
          validRows: 1542,
          missingValuesCount: 12,
          anomaliesDetected: 6,
          dataQualityScore: 97,
          issues: [
            "Successfully ingested 1,560 FPO farmer records.",
            "12 records adjusted for missing phone contact details.",
            "Schema verification passed for all columns."
          ]
        });
      }, 1200);
    }
  };

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Data Integration & Governance</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Data Management & Ingestion</h1>
          <p className="mt-1 text-slate-500">Upload, validate, and audit CSV/Excel datasets for future government API synchronization.</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Drag and drop upload zone */}
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <FileSpreadsheet className="text-green-600" size={20} /> Dataset Upload Portal
          </h2>
          <p className="text-xs text-slate-500 mb-6">Supports CSV, XLSX, and JSON government data feeds</p>

          <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/40 p-8 text-center transition hover:border-green-400 hover:bg-green-50 cursor-pointer">
            <input type="file" accept=".csv,.xlsx,.json" onChange={handleSimulateUpload} className="hidden" />
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-100 text-green-700 mb-3">
              <UploadCloud size={24} />
            </div>
            <span className="font-bold text-sm text-slate-800">Click to upload or drag CSV file</span>
            <span className="text-xs text-slate-400 mt-1">Maximum file size: 50MB</span>

            {isUploading && (
              <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center text-green-700 font-bold text-sm">
                <RefreshCw className="animate-spin mb-2" size={24} />
                Parsing & Validating Dataset...
              </div>
            )}
          </label>
        </div>

        {/* Audit Report Box */}
        {report && (
          <div className="glass rounded-3xl p-6 lg:col-span-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="section-label">Automated Data Quality Audit</span>
                <h2 className="text-xl font-bold text-slate-900">Quality Index: {report.dataQualityScore}/100</h2>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 flex items-center gap-1">
                <ShieldCheck size={15} /> Verified Clean
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Ingested Rows</span>
                <b className="mt-1 block text-2xl text-slate-900">{report.totalRows}</b>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Missing Values</span>
                <b className="mt-1 block text-2xl text-amber-600">{report.missingValuesCount}</b>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Anomalies Detected</span>
                <b className="mt-1 block text-2xl text-blue-600">{report.anomaliesDetected}</b>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase text-slate-400 mb-3">Audit Logs & Validation Warnings:</p>
              <div className="space-y-2 text-xs">
                {report.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-slate-700 border border-slate-100">
                    <CheckCircle size={15} className="text-green-600 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
