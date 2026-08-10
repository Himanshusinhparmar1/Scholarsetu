import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Scholarship } from '../types';
import { Search, Filter, Calendar, IndianRupee, Landmark, GraduationCap, FileText, ArrowRight, Sparkles } from 'lucide-react';

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

export const ScholarshipDirectoryPage: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [homeState, setHomeState] = useState('');
  const [studyState, setStudyState] = useState('');
  const [course, setCourse] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { status: 'Active' };
      if (search) params.search = search;
      if (homeState) params.homeState = homeState;
      if (studyState) params.studyState = studyState;
      if (course) params.course = course;
      if (category) params.category = category;
      if (type) params.type = type;

      const data = await api.getScholarships(params);
      if (data.success) {
        setScholarships(data.scholarships || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [homeState, studyState, course, category, type]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchScholarships();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>Centralized Scheme Repository • Only Showing ACTIVE Schemes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Scholarship Directory
          </h1>
          <p className="text-indigo-200 text-sm max-w-2xl leading-relaxed">
            Search Central and State Government scholarship schemes available for students studying both inside and outside their home State.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search scholarships by scheme name, provider, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-900 text-white font-bold text-sm rounded-xl hover:bg-indigo-800 transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-medium pt-2 border-t border-slate-100">
            <div>
              <label className="block text-slate-500 mb-1">Home State</label>
              <select
                value={homeState}
                onChange={(e) => setHomeState(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="">All Home States</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Study State</label>
              <select
                value={studyState}
                onChange={(e) => setStudyState(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="">All Study States</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Course Level</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="">All Courses</option>
                <option value="B.Tech">B.Tech / Engineering</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBBS">MBBS / Medical</option>
                <option value="B.Sc">B.Sc / General Degree</option>
                <option value="MBA">MBA / Management</option>
                <option value="Diploma">Diploma / Polytechnic</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="">All Categories</option>
                <option value="General">General / EWS</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Scheme Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="">All Types</option>
                <option value="Central Government">Central Government</option>
                <option value="State Government">State Government</option>
              </select>
            </div>
          </div>
        </div>

        {/* List of Scholarships */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
            <span>Showing {scholarships.length} Active Scholarship Schemes</span>
            {(homeState || studyState || course || category || search) && (
              <button
                onClick={() => {
                  setSearch('');
                  setHomeState('');
                  setStudyState('');
                  setCourse('');
                  setCategory('');
                  setType('');
                }}
                className="text-indigo-600 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Searching active scholarship database...</div>
          ) : scholarships.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <p className="font-bold text-slate-700">No active scholarships found matching your filters.</p>
              <p className="text-xs text-slate-500">Try adjusting your Home State or Course filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarships.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 text-[11px] font-bold">
                        {sch.type}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        ACTIVE
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-indigo-950 leading-snug">{sch.name}</h3>
                    <p className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>{sch.provider}</span>
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{sch.description}</p>

                    {/* Eligibility Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                        Max Income: ₹{(sch.maxIncome / 100000).toFixed(1)} Lakhs
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                        Home State: {sch.homeStates.length === 0 ? 'All States' : sch.homeStates.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Footer & Apply CTA */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Scholarship Amount</p>
                      <p className="text-lg font-black text-indigo-900 flex items-center">
                        ₹{sch.amount.toLocaleString('en-IN')} <span className="text-xs text-slate-500 font-normal ml-1">/year</span>
                      </p>
                    </div>

                    <Link
                      to={`/scholarships/${sch.id}`}
                      className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>View & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
