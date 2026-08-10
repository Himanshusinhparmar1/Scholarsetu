import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Institution } from '../types';
import { Modal } from '../components/Modal';
import { Building2, Search, MapPin, Plus, CheckCircle2, ShieldCheck, Phone, Mail, Award, Globe } from 'lucide-react';

const INDIAN_STATES = [
  'Gujarat',
  'Maharashtra',
  'Karnataka',
  'Rajasthan',
  'Tamil Nadu',
  'Delhi',
  'Uttar Pradesh',
  'Assam',
  'Bihar',
  'Kerala',
  'Madhya Pradesh',
  'Punjab',
  'West Bengal',
  'Telangana',
];

export const CollegeDirectoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [type, setType] = useState('');

  // Register Modal State
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('action') === 'onboard');
  const [form, setForm] = useState({
    name: '',
    type: 'Government',
    state: 'Gujarat',
    district: '',
    city: '',
    address: '',
    affiliation: '',
    institutionCode: '',
    contactEmail: '',
    contactPhone: '',
    nodalOfficerName: '',
  });
  const [onboardSuccess, setOnboardSuccess] = useState('');

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (state) params.state = state;
      if (type) params.type = type;

      const data = await api.getInstitutions(params);
      if (data.success) {
        setInstitutions(data.institutions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [state, type]);

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.registerInstitution(form);
      if (res.success) {
        setOnboardSuccess('Institution onboarded successfully! Zero registration fee charged.');
        fetchColleges();
        setTimeout(() => {
          setIsModalOpen(false);
          setOnboardSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      alert(err.message || 'Error onboarding institution');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-indigo-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-800 text-amber-300 text-xs font-bold">
              Centralized National Repository • Zero Fee for Institutions
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Indian Colleges & Universities Directory</h1>
            <p className="text-indigo-200 text-xs max-w-xl">
              Search recognized institutions across all 28 Indian States and Union Territories. Out-of-state institutions can onboard freely to verify their enrolled students.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Institution (Free ₹0)</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search college by name, city, code or university..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              />
            </div>
            <button
              onClick={fetchColleges}
              className="px-6 py-3 bg-indigo-900 text-white font-bold text-sm rounded-xl hover:bg-indigo-800 transition-colors shrink-0"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium pt-2 border-t border-slate-100">
            <div>
              <label className="block text-slate-500 mb-1">Filter by State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="">All Indian States</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Filter by Institution Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="">All Institution Types</option>
                <option value="Government">Government / Public</option>
                <option value="Private">Private / Deemed</option>
                <option value="University">University</option>
                <option value="Polytechnic">Polytechnic / ITI</option>
              </select>
            </div>
          </div>
        </div>

        {/* College Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-500">Searching institution records...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {institutions.map((inst) => (
              <div
                key={inst.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 text-[11px] font-bold">
                      {inst.type} Institution
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                      VERIFIED COLLEGE
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-indigo-950">{inst.name}</h3>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>
                      {inst.city}, {inst.district}, <strong>{inst.state}</strong>
                    </span>
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-500">
                      Code: <strong className="text-slate-800">{inst.institutionCode}</strong>
                    </p>
                    <p className="text-slate-500">
                      Affiliation: <strong className="text-slate-800">{inst.affiliation}</strong>
                    </p>
                    {inst.nodalOfficerName && (
                      <p className="text-slate-500">
                        Nodal Officer: <strong className="text-slate-800">{inst.nodalOfficerName}</strong>
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{inst.contactEmail || 'nodal@institution.edu.in'}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                    Zero Fee Partner
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onboarding Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Onboard Institution (Zero Registration Fee)"
        >
          {onboardSuccess ? (
            <div className="p-6 text-center text-emerald-700 font-bold space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <p>{onboardSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs font-medium">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                <strong>Zero Fee Policy:</strong> Educational Institutions pay <strong>₹0</strong> to register and verify out-of-state students on ScholarSetu.
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Institution Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Government Engineering College, Rajkot"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Institution Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="University">University</option>
                    <option value="Polytechnic">Polytechnic / ITI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">State *</label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">District / City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value, district: e.target.value })}
                    placeholder="e.g. Ahmedabad"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">University Affiliation</label>
                  <input
                    type="text"
                    value={form.affiliation}
                    onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                    placeholder="e.g. GTU / Autonomous"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Official Email</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    placeholder="nodal@college.ac.in"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Nodal Officer Name</label>
                  <input
                    type="text"
                    value={form.nodalOfficerName}
                    onChange={(e) => setForm({ ...form, nodalOfficerName: e.target.value })}
                    placeholder="Prof. S. Sharma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-900 text-white font-bold rounded-lg hover:bg-indigo-800"
                >
                  Complete Onboarding (₹0 Fee)
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};
