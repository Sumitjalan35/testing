import { useState, useMemo, useRef, useEffect } from 'react';
import apiService from '../services/api';

function InterviewGenerator() {
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const canStart = useMemo(() => role.trim().length >= 2 && numQuestions >= 1 && numQuestions <= 20, [role, numQuestions]);

  const startInterview = async () => {
    if (!canStart) return;
    setStarting(true);
    setHistory([]);
    setSessionId(null);
    try {
      const res = await apiService.startInterview({ role, num_questions: Number(numQuestions), difficulty });
      setSessionId(res.session_id);
      setHistory([{ interviewer: res.message, candidate: '' }]);
    } catch (e) {
      alert(e?.message || 'Failed to start interview');
    } finally {
      setStarting(false);
    }
  };

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || !sessionId) return;
    setLoading(true);
    try {
      const res = await apiService.interviewChat({ session_id: sessionId, message });
      // Update candidate reply for last turn
      setHistory((prev) => {
        const copy = [...prev];
        if (copy.length > 0 && copy[copy.length - 1].candidate === '') {
          copy[copy.length - 1] = { ...copy[copy.length - 1], candidate: message };
        }
        copy.push({ interviewer: res.response, candidate: '' });
        return copy;
      });
      setInput('');
    } catch (e) {
      alert(e?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 lg:p-8 border border-gray-200">
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary-800 mb-2">Interview Question Generator</h1>
        <p className="text-secondary-600 mb-6">Practice a conversational mock interview tailored to your role and difficulty.</p>

        {/* Setup */}
        {!sessionId && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-secondary-700 mb-1">Target Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Data Analyst"
              />
            </div>
            <div>
              <label className="block text-sm text-secondary-700 mb-1">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-secondary-700 mb-1">Number of Questions</label>
              <input
                type="number"
                min={1}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          {!sessionId ? (
            <button onClick={startInterview} disabled={!canStart || starting} className={`btn-primary ${(!canStart || starting) ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {starting ? 'Starting…' : 'Start Interview'}
            </button>
          ) : (
            <button onClick={() => { setSessionId(null); setHistory([]); }} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50">
              End Session
            </button>
          )}
        </div>

        {/* Chat */}
        <div className="border rounded-xl bg-white overflow-hidden">
          <div className="h-[420px] overflow-y-auto p-4 space-y-4">
            {history.length === 0 && (
              <div className="text-secondary-600">Start a session to receive your first question.</div>
            )}
            {history.map((turn, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 max-w-[90%]">
                    <div className="text-xs font-semibold mb-1">Interviewer</div>
                    <div className="whitespace-pre-wrap leading-relaxed">{turn.interviewer}</div>
                  </div>
                </div>
                {turn.candidate && (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 max-w-[90%]">
                      <div className="text-xs font-semibold mb-1 text-right">You</div>
                      <div className="whitespace-pre-wrap leading-relaxed">{turn.candidate}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t bg-gray-50 flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              placeholder={sessionId ? 'Type your answer…' : 'Start an interview to reply'}
              disabled={!sessionId || loading}
              className="flex-1 px-3 py-2 rounded-lg border"
            />
            <button onClick={sendMessage} disabled={!sessionId || loading || !input.trim()} className={`btn-primary ${(!sessionId || loading || !input.trim()) ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {loading ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewGenerator;


