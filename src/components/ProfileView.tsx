import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Bell,
  Lock,
  Download,
  Trash2,
  FileText,
  ChevronRight,
  Info,
  Sparkles,
  Check,
  X,
  FolderArchive,
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../utils/androidProjectFiles';

interface ProfileViewProps {
  onExportCsv: () => void;
  onLoadSampleData: () => void;
  onClearAllData: () => void;
  onNotify: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onExportCsv,
  onLoadSampleData,
  onClearAllData,
  onNotify,
}) => {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('pennywise_user_name') || 'Usman Rahmat';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('pennywise_user_email') || 'uhmaanrmathefirst@gmail.com';
  });

  const [dailyReminder, setDailyReminder] = useState<boolean>(true);
  const [biometricLock, setBiometricLock] = useState<boolean>(false);

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(userName);
  const [tempEmail, setTempEmail] = useState<string>(userEmail);

  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'about' | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) {
      onNotify('Name cannot be blank', 'error');
      return;
    }
    setUserName(tempName.trim());
    setUserEmail(tempEmail.trim());
    localStorage.setItem('pennywise_user_name', tempName.trim());
    localStorage.setItem('pennywise_user_email', tempEmail.trim());
    setIsEditingProfile(false);
    onNotify('Profile details updated', 'success');
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
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
      onNotify('Pennywise-Android-SyntecxHub.zip downloaded', 'success');
    } catch (err) {
      console.error(err);
      onNotify('Failed to bundle ZIP file', 'error');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-3 pb-16">
      {/* SKEUOMORPHIC STITCHED LEATHER PROFILE CARD (Minimalist Monochrome & Slate) */}
      <div className="skeuo-leather rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
        {/* Subtle perimeter stitch detail */}
        <div className="absolute inset-1.5 rounded-xl skeuo-leather-stitch pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Brushed Metallic Monogram Seal */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-mono font-black text-xs flex items-center justify-center border-2 border-slate-400/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.3)] shrink-0">
              {userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'UR'}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-black text-white truncate drop-shadow-sm leading-tight">
                {userName}
              </h2>
              <p className="text-[10px] text-slate-300 truncate font-mono mt-0.5">
                {userEmail}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-bold text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                  Room SQLite · Offline
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setTempName(userName);
              setTempEmail(userEmail);
              setIsEditingProfile(true);
            }}
            className="px-2.5 py-1 text-[10px] font-bold bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all cursor-pointer shrink-0 active:translate-y-0.5 shadow-2xs"
          >
            Edit
          </button>
        </div>
      </div>

      {/* SETTINGS GROUP 1: General & Financial Preferences (Minimalist Slate) */}
      <div className="skeuo-card-paper rounded-2xl p-3.5 space-y-1.5">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">
          Preferences
        </h3>

        {/* Currency row */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-800 block leading-tight">Currency Format</span>
            <span className="text-[10px] text-slate-400">Fixed unit representation</span>
          </div>
          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono shadow-2xs">
            PKR (Rs.)
          </span>
        </div>

        {/* Daily Ledger Reminder with physical tactile switch */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">Daily Reminder</span>
              <span className="text-[10px] text-slate-400">Evening expense prompt</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setDailyReminder(!dailyReminder);
              onNotify(`Reminder ${!dailyReminder ? 'enabled' : 'disabled'}`, 'info');
            }}
            className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer shadow-inner ${
              dailyReminder ? 'bg-slate-800' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                dailyReminder ? 'left-4' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Security Lock switch */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">App Passcode Lock</span>
              <span className="text-[10px] text-slate-400">Require on app resume</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setBiometricLock(!biometricLock);
              onNotify(`Lock ${!biometricLock ? 'activated' : 'deactivated'}`, 'info');
            }}
            className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer shadow-inner ${
              biometricLock ? 'bg-slate-800' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                biometricLock ? 'left-4' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* SETTINGS GROUP 2: Data Management */}
      <div className="skeuo-card-paper rounded-2xl p-3.5 space-y-1">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">
          Ledger Storage
        </h3>

        {/* Export to CSV */}
        <button
          onClick={onExportCsv}
          className="w-full flex items-center justify-between py-2 text-left border-b border-slate-100 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">Export Ledger to CSV</span>
              <span className="text-[10px] text-slate-400">Storage Access Framework</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Load Demo Data */}
        <button
          onClick={onLoadSampleData}
          className="w-full flex items-center justify-between py-2 text-left border-b border-slate-100 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">Load Sample Dataset</span>
              <span className="text-[10px] text-slate-400">Demo transactions for testing</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Purge All Records */}
        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full flex items-center justify-between py-2 text-left hover:bg-rose-50/50 -mx-1 px-1 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <div>
              <span className="text-xs font-bold text-slate-700 block leading-tight">Purge Database Records</span>
              <span className="text-[10px] text-slate-400">Clear all local transactions</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* SETTINGS GROUP 3: Policies & About */}
      <div className="skeuo-card-paper rounded-2xl p-3.5 space-y-1">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">
          Policies & Info
        </h3>

        {/* Privacy Policy */}
        <button
          onClick={() => setActivePolicyModal('privacy')}
          className="w-full flex items-center justify-between py-2 text-left border-b border-slate-100 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">Privacy Policy</span>
              <span className="text-[10px] text-slate-400">Zero cloud tracking</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Terms of Service */}
        <button
          onClick={() => setActivePolicyModal('terms')}
          className="w-full flex items-center justify-between py-2 text-left border-b border-slate-100 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">Terms & Agreement</span>
              <span className="text-[10px] text-slate-400">Offline usage guidelines</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* About App & Internship Source */}
        <button
          onClick={() => setActivePolicyModal('about')}
          className="w-full flex items-center justify-between py-2 text-left hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">About Pennywise</span>
              <span className="text-[10px] text-slate-400">SyntecxHub Week 4 · v1.0.0</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl w-full max-w-[320px] p-4 shadow-2xl border border-slate-300 animate-fade-in">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Edit Profile</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Usman Rahmat"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 shadow-inner focus:outline-hidden focus:ring-1 focus:ring-slate-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 shadow-inner focus:outline-hidden focus:ring-1 focus:ring-slate-700 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[11px] font-black text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-md cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY & LEGAL MODAL */}
      {activePolicyModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl w-full max-w-[340px] max-h-[88%] flex flex-col shadow-2xl border border-slate-300 animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                {activePolicyModal === 'privacy' && <ShieldCheck className="w-4 h-4 text-slate-700" />}
                {activePolicyModal === 'terms' && <FileText className="w-4 h-4 text-slate-700" />}
                {activePolicyModal === 'about' && <Info className="w-4 h-4 text-slate-700" />}
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                  {activePolicyModal === 'privacy' && 'Privacy Policy'}
                  {activePolicyModal === 'terms' && 'Terms of Use'}
                  {activePolicyModal === 'about' && 'About Pennywise'}
                </h3>
              </div>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-3.5 overflow-y-auto text-[11px] text-slate-600 space-y-2.5 leading-relaxed font-sans">
              {activePolicyModal === 'privacy' && (
                <>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium">
                    🔒 <strong>100% Offline & On-Device:</strong> Pennywise does not collect, track, or transmit your personal financial records.
                  </div>
                  <h4 className="font-bold text-slate-800">1. Local Storage via Room SQLite</h4>
                  <p>All transactions, categories, and balances are stored strictly in your device's secured local database sandbox.</p>
                  <h4 className="font-bold text-slate-800">2. Zero Telemetry</h4>
                  <p>There are no analytics SDKs, advertising libraries, or cloud sync services in this application.</p>
                  <h4 className="font-bold text-slate-800">3. Storage Access Framework (SAF)</h4>
                  <p>CSV exports use Android Storage Access Framework so you choose where files are written.</p>
                </>
              )}

              {activePolicyModal === 'terms' && (
                <>
                  <h4 className="font-bold text-slate-800">1. Intended Use</h4>
                  <p>Pennywise is built for personal expense and income bookkeeping.</p>
                  <h4 className="font-bold text-slate-800">2. Financial Precision</h4>
                  <p>Amounts are stored in 64-bit integer minor units (paisas) to eliminate floating-point calculation errors.</p>
                  <h4 className="font-bold text-slate-800">3. Data Ownership</h4>
                  <p>You hold complete ownership of your records and can export or purge them anytime.</p>
                </>
              )}

              {activePolicyModal === 'about' && (
                <>
                  <div className="text-center py-2">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-mono font-black mx-auto flex items-center justify-center text-xs mb-1.5 shadow-md">
                      PW
                    </div>
                    <h4 className="text-xs font-black text-slate-900">Pennywise v1.0.0</h4>
                    <span className="text-[10px] text-slate-600 font-mono font-bold">
                      SyntecxHub Week 4 Internship
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Developed with traditional Android Views (XML), ViewBinding, Kotlin Coroutines, Room Database, and MVVM Architecture.
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={handleDownloadZip}
                      disabled={isDownloadingZip}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:translate-y-0.5"
                    >
                      <FolderArchive className="w-3.5 h-3.5" />
                      <span>{isDownloadingZip ? 'Packaging...' : 'Download Android Studio Project (.ZIP)'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-3.5 py-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM PURGE DIALOG */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl w-full max-w-[320px] p-4 shadow-2xl border border-slate-300 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Purge All Records?</h3>
                <p className="text-[10px] text-slate-500">Irreversible action</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 mb-3">
              This will permanently delete all recorded income and expense transactions from the local database.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-1.5 text-[11px] font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md cursor-pointer active:translate-y-0.5"
              >
                Purge Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
