import React, { useState } from 'react';
import { 
  FileText, 
  Filter, 
  Calendar, 
  Hospital, 
  User, 
  ExternalLink, 
  Download, 
  AlertCircle,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { LabReport, LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface DoctorTimelineViewProps {
  reports: LabReport[];
  language: LanguageCode;
  onOpenUpload: () => void;
}

export const DoctorTimelineView: React.FC<DoctorTimelineViewProps> = ({
  reports,
  language,
  onOpenUpload,
}) => {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeReportDetail, setActiveReportDetail] = useState<LabReport | null>(null);

  const categories = ['All', 'Blood Work', 'Cardiology', 'Endocrinology', 'Radiology', 'Prescription'];

  const filteredReports = selectedCategory === 'All'
    ? reports
    : reports.filter((r) => r.category === selectedCategory);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-5">
      {/* Header and Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" />
            <span>{t.healthTimeline}</span>
          </h2>
          <p className="text-xs text-slate-500">Verified Longitudinal Health Record Timeline</p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-sky-700 font-bold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenUpload}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            + Add Report
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {filteredReports.map((report) => (
          <div key={report.id} className="relative group">
            {/* Timeline Node Point */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-sky-600 flex items-center justify-center text-sky-600 shadow-xs group-hover:scale-110 group-hover:bg-sky-50 transition-all">
              <FileText className="w-3.5 h-3.5" />
            </div>

            {/* Timeline Report Card */}
            <div className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 p-4 transition-all hover:shadow-card hover:border-slate-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {report.category}
                    </span>
                    <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                      {report.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    {report.patientName && (
                      <>
                        <span className="flex items-center gap-1 font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          <User className="w-3.5 h-3.5 text-sky-600" />
                          Patient: {report.patientName}
                        </span>
                        <span>•</span>
                      </>
                    )}
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {report.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Hospital className="w-3.5 h-3.5 text-slate-400" />
                      {report.facility}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {report.doctor}
                    </span>
                    {report.securityCheck && (
                      <>
                        <span>•</span>
                        <span className="text-[10px] bg-slate-900 text-emerald-400 font-mono px-2 py-0.5 rounded flex items-center gap-1">
                          🔒 {report.securityCheck.tamperCheckStatus}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => setActiveReportDetail(report)}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    <span>View Record</span>
                  </button>
                  <button
                    onClick={() => alert(`Downloading ${report.title} (${report.fileSize})...`)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Download Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary and Biomarkers preview */}
              <div className="pt-3 space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.summary}
                </p>

                {report.keyValues && report.keyValues.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {report.keyValues.slice(0, 4).map((kv, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg p-2 border border-slate-200/80 text-xs shadow-2xs"
                      >
                        <p className="text-[10px] text-slate-500 truncate">{kv.name}</p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className={`font-bold ${kv.isAbnormal ? 'text-amber-600' : 'text-slate-800'}`}>
                            {kv.value}
                          </span>
                          {kv.isAbnormal && (
                            <span title="Outside reference range">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Report Quick Inspection Modal */}
      {activeReportDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {activeReportDetail.category} • {activeReportDetail.status}
                </span>
                <h3 className="text-base font-heading font-bold text-slate-900 mt-1">
                  {activeReportDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveReportDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-600">
              <p><strong>Hospital / Lab:</strong> {activeReportDetail.facility}</p>
              <p><strong>Clinician:</strong> {activeReportDetail.doctor}</p>
              <p><strong>Date:</strong> {activeReportDetail.date}</p>
              <p><strong>File Type:</strong> {activeReportDetail.fileType} ({activeReportDetail.fileSize})</p>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                <p className="font-semibold text-slate-700 mb-1">Clinical Findings & Remarks:</p>
                <p className="text-slate-600">{activeReportDetail.summary}</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <p className="font-semibold text-slate-700">Detailed Biomarkers:</p>
                {activeReportDetail.keyValues.map((kv, i) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded">
                    <span>{kv.name}</span>
                    <span className={kv.isAbnormal ? 'font-bold text-amber-600' : 'font-semibold text-slate-800'}>
                      {kv.value} <span className="text-[10px] text-slate-400 font-normal">({kv.reference})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveReportDetail(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Report successfully sent to electronic medical record (EMR)');
                  setActiveReportDetail(null);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
              >
                Export to EMR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
