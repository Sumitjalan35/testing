import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import apiService from '../services/api';

const JobMatcher = () => {
  const [text, setText] = useState('');
  const [topN, setTopN] = useState(5);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await apiService.getJobRecommendations({ text, topN });
      if (res && res.success) {
        setResults(res.matches || []);
      } else {
        setError(res?.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="card">
            <h1 className="text-2xl font-bold text-secondary-800 mb-4">Job Matcher</h1>
            <p className="text-secondary-600 mb-4">Paste your resume or list your skills and get top matching jobs from the dataset.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                className="input-field h-40"
                placeholder="Paste resume or list skills (e.g., Python, SQL, Machine Learning, AWS)"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex items-center space-x-3">
                <label className="text-secondary-700">Top N</label>
                <input
                  type="number"
                  className="input-field w-24"
                  value={topN}
                  min={1}
                  max={20}
                  onChange={(e) => setTopN(Number(e.target.value))}
                />
                <button type="submit" className="btn-primary flex items-center">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                  Get Recommendations
                </button>
              </div>
            </form>
            {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}
          </div>

          {results.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-bold text-secondary-800 mb-4">Top Matches</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-secondary-600 border-b">
                      <th className="py-2 pr-4">Job Title</th>
                      <th className="py-2 pr-4">City</th>
                      <th className="py-2 pr-4">State</th>
                      <th className="py-2 pr-4">Salary</th>
                      <th className="py-2 pr-4">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, idx) => (
                      <tr key={idx} className="border-b last:border-none">
                        <td className="py-2 pr-4 font-medium">{r.job_title}</td>
                        <td className="py-2 pr-4">{r.city || '-'}</td>
                        <td className="py-2 pr-4">{r.state || '-'}</td>
                        <td className="py-2 pr-4">{r.salary || '-'}</td>
                        <td className="py-2 pr-4">{(r.match_score * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JobMatcher;


