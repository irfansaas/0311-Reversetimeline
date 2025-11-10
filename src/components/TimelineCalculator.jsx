import React, { useState } from 'react';
import { calculateRichardTimeline, QUESTIONS } from '../utils/timeline/richard-timeline-engine';
import TimelineGanttChart from './TimelineGanttChart';

export default function TimelineCalculator() {
  // State
  const [answers, setAnswers] = useState({});
  const [goLiveDate, setGoLiveDate] = useState('');
  const [appCompletionPercent, setAppCompletionPercent] = useState(30);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Calculate timeline
  const handleCalculate = () => {
    // Validate
    if (!goLiveDate) {
      alert('Please select a go-live date');
      return;
    }

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < 19) {
      alert(`Please answer all questions (${answeredCount}/19 answered)`);
      return;
    }

    try {
      const calculated = calculateRichardTimeline(
        answers,
        new Date(goLiveDate),
        appCompletionPercent
      );
      
      setResults(calculated);
      setShowResults(true);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('timeline-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Error calculating timeline. Check console for details.');
    }
  };

  // Load test data (Richard's example)
  const loadTestData = () => {
    setAnswers({
      D6: '3 to 9 months',
      D8: '1,000 to 5,000 users',
      D9: '5 to 10 use cases',
      D10: 'Yes',
      D11: 'No',
      D12: 'No',
      D13: 'No',
      D15: 'No defined cloud strategy yet',
      D16: 'No, we are new to Azure',
      D17: 'Windows 10 multisession or Windows Server 2016',
      D19: 'Standard corporate processes, less than 1 week per change request',
      D21: 'We have challenging security processes',
      D23: '100 to 300 applications',
      D24: 'Complex formats (MSI, EXE), no modernization required',
      D25: 'On-prem physical desktops to cloud VDI (Net/New DAAS)',
      D26: 'Yes, but there are few and/or they are low priority/latency insensitive',
      D27: 'Yes, needs RemoteFX plus 3rd party software',
      D28: 'Not really tested',
      D29: '1 to 2 years ago'
    });
    setGoLiveDate('2025-07-30');
    setAppCompletionPercent(30);
    alert('Test data loaded! Click Calculate to see results.');
  };

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = Object.keys(QUESTIONS).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div className="timeline-calculator p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Go-Live Timeline Calculator</h1>
        <p className="text-gray-600">
          Based on Richard's validated Excel methodology • 100% accurate
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={loadTestData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          📝 Load Test Data
        </button>
        
        {showResults && (
          <button
            onClick={() => {
              setAnswers({});
              setGoLiveDate('');
              setAppCompletionPercent(30);
              setResults(null);
              setShowResults(false);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            🔄 Reset
          </button>
        )}
      </div>

      {/* Project Parameters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Project Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Go-Live Date *
            </label>
            <input
              type="date"
              value={goLiveDate}
              onChange={(e) => setGoLiveDate(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              App Transformation Progress Before Azure Prep: {appCompletionPercent}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={appCompletionPercent}
              onChange={(e) => setAppCompletionPercent(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Azure prep can start before app work is 100% complete (parallel execution)
            </p>
          </div>
        </div>
      </div>

      {/* Discovery Questions */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Discovery Questions</h2>
          <div className="text-sm font-medium">
            <span className="text-blue-600">{answeredCount}</span>
            <span className="text-gray-500"> / {totalQuestions}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Walk through these questions WITH your customer during discovery
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(QUESTIONS).map(([questionId, question]) => (
            <QuestionCard
              key={questionId}
              questionId={questionId}
              question={question}
              currentAnswer={answers[questionId]}
              onAnswer={handleAnswerChange}
            />
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <div className="mb-6 text-center">
        <button
          onClick={handleCalculate}
          disabled={answeredCount < totalQuestions || !goLiveDate}
          className={`px-8 py-3 rounded-lg text-lg font-semibold transition ${
            answeredCount < totalQuestions || !goLiveDate
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {answeredCount < totalQuestions || !goLiveDate
            ? `Complete All Questions (${answeredCount}/${totalQuestions})`
            : '🚀 Calculate Timeline'
          }
        </button>
      </div>

      {/* Results */}
      {showResults && results && (
        <div id="timeline-results" className="space-y-6 scroll-mt-6">
          
          {/* Gantt Chart - NEW! */}
          <TimelineGanttChart timelineResults={results} />

          {/* Timeline Results - Compact Cards */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Phase Durations</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <PhaseCard
                name="Apps Transform"
                weeks={results.durations.bucket1}
                color="blue"
              />
              <PhaseCard
                name="Azure Prep"
                weeks={results.durations.bucket2}
                color="green"
              />
              <PhaseCard
                name="Nerdio Deploy"
                weeks={results.durations.bucket3}
                color="purple"
              />
              <PhaseCard
                name="AVD Design"
                weeks={results.durations.bucket4}
                color="orange"
              />
              <PhaseCard
                name="Pilot"
                weeks={results.durations.bucket5}
                color="pink"
              />
              <PhaseCard
                name="Migration"
                weeks={results.durations.bucket6}
                color="red"
              />
            </div>
          </div>

          {/* Validation Alert */}
          <div className={`rounded-lg p-6 ${
            results.validation.isValid 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-3xl">
                {results.validation.isValid ? '✅' : '⚠️'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">
                  {results.validation.isValid ? 'Timeline is Feasible' : 'Timeline is Tight'}
                </h3>
                <p className="text-sm mb-3">{results.validation.recommendation}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Weeks Available</div>
                    <div className="text-xl font-semibold">
                      {results.metadata.weeksToGoLive.toFixed(1)}w
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Weeks Needed</div>
                    <div className="text-xl font-semibold">
                      {results.validation.totalWeeksNeeded}w
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Buffer</div>
                    <div className={`text-xl font-semibold ${
                      results.validation.variance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {results.validation.variance >= 0 ? '+' : ''}{results.validation.variance.toFixed(1)}w
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Variance</div>
                    <div className={`text-xl font-semibold ${
                      results.validation.variancePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {results.validation.variancePercent.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Phase Card Component
function PhaseCard({ name, weeks, color }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
    pink: 'border-pink-200 bg-pink-50',
    red: 'border-red-200 bg-red-50'
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="text-sm text-gray-700 font-medium mb-1">{name}</div>
      <div className="text-3xl font-bold">{weeks}w</div>
    </div>
  );
}

// Question Card Component
function QuestionCard({ questionId, question, currentAnswer, onAnswer }) {
  if (question.isYesNo) {
    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition">
        <label className="block text-sm font-medium mb-3">
          <span className="text-blue-600 font-bold">{questionId}</span>: {question.question}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onAnswer(questionId, 'Yes')}
            className={`flex-1 px-4 py-2 rounded font-medium transition ${
              currentAnswer === 'Yes'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => onAnswer(questionId, 'No')}
            className={`flex-1 px-4 py-2 rounded font-medium transition ${
              currentAnswer === 'No'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            No
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <label className="block text-sm font-medium mb-3">
        <span className="text-blue-600 font-bold">{questionId}</span>: {question.question}
      </label>
      <select
        value={currentAnswer || ''}
        onChange={(e) => onAnswer(questionId, e.target.value)}
        className="w-full border-2 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">-- Select an answer --</option>
        {Object.keys(question.options).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      
      {currentAnswer && question.options[currentAnswer] && question.options[currentAnswer].weight && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
          <div className="flex justify-between items-center text-gray-700">
            <span>Score: <strong>{question.options[currentAnswer].score}</strong></span>
            <span>×</span>
            <span>Weight: <strong>{question.options[currentAnswer].weight}</strong></span>
            <span>=</span>
            <span className="text-blue-600 font-bold">
              {question.options[currentAnswer].score * question.options[currentAnswer].weight} weeks
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
