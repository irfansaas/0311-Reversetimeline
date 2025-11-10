import React, { useState } from 'react';
import { calculateRichardTimeline, QUESTIONS } from '../utils/timeline/richard-timeline-engine';

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
      alert(`Please answer all questions (${answeredCount}/21 answered)`);
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

  return (
    <div className="timeline-calculator p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Go-Live Timeline Calculator</h1>
        <p className="text-gray-600">
          Based on Richard's validated Excel methodology
        </p>
      </div>

      {/* Test Data Button */}
      <div className="mb-6">
        <button
          onClick={loadTestData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Load Test Data (Richard's Example)
        </button>
      </div>

      {/* Project Parameters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Project Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Go-Live Date
            </label>
            <input
              type="date"
              value={goLiveDate}
              onChange={(e) => setGoLiveDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
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
              What % of app work will be complete before Azure environment prep begins?
            </p>
          </div>
        </div>
      </div>

      {/* Discovery Questions */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Discovery Questions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Walk through these questions WITH your customer during discovery.
          Answered: {Object.keys(answers).length}/19
        </p>

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
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
        >
          Calculate Timeline
        </button>
      </div>

      {/* Results */}
      {showResults && results && (
        <div className="space-y-6">
          {/* Timeline Results */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Timeline Analysis</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded p-4">
                <div className="text-sm text-gray-600">Apps Transform</div>
                <div className="text-2xl font-bold">{results.durations.bucket1}w</div>
              </div>
              <div className="border rounded p-4">
                <div className="text-sm text-gray-600">Azure Prep</div>
                <div className="text-2xl font-bold">{results.durations.bucket2}w</div>
              </div>
              <div className="border rounded p-4">
                <div className="text-sm text-gray-600">Nerdio Deploy</div>
                <div className="text-2xl font-bold">{results.durations.bucket3}w</div>
              </div>
              <div className="border rounded p-4">
                <div className="text-sm text-gray-600">AVD Design</div>
                <div className="text-2xl font-bold">{results.durations.bucket4}w</div>
              </div>
              <div className="border rounded p-4">
                <div className="text-sm text-gray-600">Pilot</div>
                <div className="text-2xl font-bold">{results.durations.bucket5}w</div>
              </div>
              <div className="border rounded p-4">
                <div className="text-sm text-gray-600">Migration</div>
                <div className="text-2xl font-bold">{results.durations.bucket6}w</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Weeks Available</div>
                  <div className="text-xl font-semibold">{results.metadata.weeksToGoLive.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Weeks Needed</div>
                  <div className="text-xl font-semibold">{results.validation.totalWeeksNeeded}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Validation */}
          <div className={`rounded-lg p-6 ${results.validation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className="text-lg font-bold mb-2">
              {results.validation.isValid ? '✅ Timeline is Feasible' : '⚠️ Timeline is Tight'}
            </h3>
            <p className="text-sm mb-2">{results.validation.recommendation}</p>
            <p className="text-sm">
              Buffer: {results.validation.variance.toFixed(1)} weeks ({results.validation.variancePercent.toFixed(0)}%)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Question Card Component
function QuestionCard({ questionId, question, currentAnswer, onAnswer }) {
  if (question.isYesNo) {
    return (
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">
          {questionId}: {question.question}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onAnswer(questionId, 'Yes')}
            className={`px-4 py-2 rounded ${
              currentAnswer === 'Yes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => onAnswer(questionId, 'No')}
            className={`px-4 py-2 rounded ${
              currentAnswer === 'No'
                ? 'bg-blue-600 text-white'
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
    <div className="border rounded-lg p-4">
      <label className="block text-sm font-medium mb-2">
        {questionId}: {question.question}
      </label>
      <select
        value={currentAnswer || ''}
        onChange={(e) => onAnswer(questionId, e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">-- Select --</option>
        {Object.keys(question.options).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      
      {currentAnswer && question.options[currentAnswer] && (
        <div className="mt-2 text-xs text-gray-600">
          Score: {question.options[currentAnswer].score} × Weight: {question.options[currentAnswer].weight} = {question.options[currentAnswer].score * question.options[currentAnswer].weight} weeks
        </div>
      )}
    </div>
  );
}
