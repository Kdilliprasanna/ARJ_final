import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import client from '../api/client';

const CATEGORIES = ['Full-Stack', 'Frontend React', 'Backend Node', 'System Design'];

const MOCK_QUESTIONS = [
  {
    id: 1,
    category: 'Frontend React',
    question: 'What is the Virtual DOM in React and how does it optimize UI rendering?',
    options: [
      'A) It is a direct copy of the browser DOM updated synchronously on every state change',
      'B) An in-memory lightweight representation of real DOM nodes enabling fast diffing & batching',
      'C) A server-side database cache for HTML template strings',
      'D) A browser extension requirement for React web applications',
    ],
    correctIndex: 1,
    explanation: 'React creates a lightweight virtual DOM tree and compares changes (reconciliation) before applying batch updates to the real browser DOM.',
  },
  {
    id: 2,
    category: 'Backend Node',
    question: 'Which HTTP status code indicates that a requested resource was created successfully?',
    options: ['A) 200 OK', 'B) 201 Created', 'C) 204 No Content', 'D) 301 Moved Permanently'],
    correctIndex: 1,
    explanation: 'HTTP 201 Created is returned when a new resource is created successfully (e.g., via POST request).',
  },
  {
    id: 3,
    category: 'System Design',
    question: 'What is the primary benefit of adding a Redis caching layer in front of a relational database?',
    options: [
      'A) Guarantees ACID transactional compliance across distributed nodes',
      'B) Reduces database read latency by serving frequently accessed queries in sub-millisecond RAM speeds',
      'C) Automatically normalizes SQL table schemas',
      'D) Replaces backend application server business logic',
    ],
    correctIndex: 1,
    explanation: 'Redis in-memory caching stores hot data in RAM, dramatically decreasing DB read load and response latency.',
  },
  {
    id: 4,
    category: 'Full-Stack',
    question: 'What is the average time complexity of looking up a key in a Hash Table (Dictionary)?',
    options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n log n)'],
    correctIndex: 0,
    explanation: 'Hash table lookups compute hash index direct references, resulting in O(1) constant time average performance.',
  },
];

export default function MockTestScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Full-Stack');
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streakCount, setStreakCount] = useState(1);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const res = await client.get('/mocktest/today').catch(() => client.get('/mock/today'));
      if (res && res.questions && Array.isArray(res.questions) && res.questions.length > 0) {
        setQuestions(res.questions);
      }
    } catch (e) {
      console.log('Mock questions fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions;
  const currentQ = filteredQuestions[currentIdx] || MOCK_QUESTIONS[0];

  const handleSelectOption = (idx) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOpt === null) return;
    setSubmitted(true);
    if (selectedOpt === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIdx + 1 < filteredQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setCompleted(true);
      setShowBadgeModal(true);
      try {
        const finalScore = score + (selectedOpt === currentQ.correctIndex ? 1 : 0);
        const res = await client.post('/mocktest/submit', {
          score: finalScore,
          totalQuestions: filteredQuestions.length,
          category: selectedCategory,
        }).catch(() => client.post('/mock/submit', {
          score: finalScore,
          totalQuestions: filteredQuestions.length,
          category: selectedCategory,
        }));
        if (res && res.streak) {
          setStreakCount(res.streak);
        }
      } catch (e) {
        console.log('Submit result fallback:', e);
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setSubmitted(false);
    setCompleted(false);
    setShowBadgeModal(false);
  };

  if (completed) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.trophyEmoji}>🏆</Text>
        <Text style={styles.completeTitle}>Mock Test Completed!</Text>
        <Text style={styles.scoreText}>{score} / {filteredQuestions.length} Correct ({percentage}%)</Text>
        
        <View style={styles.badgeCard}>
          <Text style={styles.badgeTitle}>🔥 +1 Day Streak Added!</Text>
          <Text style={styles.badgeSub}>Badge Unlocked: "Full-Stack Interview Champion"</Text>
        </View>

        <TouchableOpacity style={styles.retryBtn} onPress={handleResetQuiz}>
          <Text style={styles.retryBtnText}>Take Another Mock Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 Daily Mock Test</Text>
        <Text style={styles.headerSub}>
          Timed technical interview questions & daily streak rewards
        </Text>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catPill,
              selectedCategory === cat && styles.catPillActive,
            ]}
            onPress={() => {
              setSelectedCategory(cat);
              handleResetQuiz();
            }}
          >
            <Text
              style={[
                styles.catText,
                selectedCategory === cat && styles.catTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.questionNumText}>
            Question {currentIdx + 1} of {filteredQuestions.length}
          </Text>
          <Text style={styles.categoryBadgeText}>{currentQ.category}</Text>
        </View>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIdx + 1) / filteredQuestions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQ.question}</Text>

        <View style={styles.optionsList}>
          {currentQ.options.map((opt, idx) => {
            let optionStyle = styles.optionItem;
            let textStyle = styles.optionText;

            if (selectedOpt === idx) {
              optionStyle = [styles.optionItem, styles.optionSelected];
              textStyle = [styles.optionText, styles.optionTextSelected];
            }

            if (submitted) {
              if (idx === currentQ.correctIndex) {
                optionStyle = [styles.optionItem, styles.optionCorrect];
                textStyle = [styles.optionText, styles.optionTextCorrect];
              } else if (selectedOpt === idx && selectedOpt !== currentQ.correctIndex) {
                optionStyle = [styles.optionItem, styles.optionWrong];
                textStyle = [styles.optionText, styles.optionTextWrong];
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                style={optionStyle}
                onPress={() => handleSelectOption(idx)}
                activeOpacity={0.7}
              >
                <Text style={textStyle}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {submitted && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>💡 Technical Explanation:</Text>
            <Text style={styles.explanationText}>{currentQ.explanation}</Text>
          </View>
        )}

        {/* Action Button */}
        {!submitted ? (
          <TouchableOpacity
            style={[styles.actionBtn, selectedOpt === null && styles.actionBtnDisabled]}
            onPress={handleConfirmAnswer}
            disabled={selectedOpt === null}
          >
            <Text style={styles.actionBtnText}>Submit & Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn} onPress={handleNextQuestion}>
            <Text style={styles.actionBtnText}>
              {currentIdx + 1 === filteredQuestions.length ? 'View Final Results 🏆' : 'Next Question ➔'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  scrollContent: { padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0a0f1f' },
  header: { marginBottom: 14 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#f8fafc' },
  headerSub: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  catPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#131c2d', borderWidth: 1, borderColor: '#2d3a4e' },
  catPillActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  catText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  catTextActive: { color: '#ffffff' },
  progressContainer: { marginBottom: 16 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  questionNumText: { fontSize: 12, fontWeight: '700', color: '#60a5fa' },
  categoryBadgeText: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  progressBg: { height: 6, backgroundColor: '#1e293b', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#3b82f6', borderRadius: 3 },
  questionCard: {
    backgroundColor: '#131c2d',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  questionText: { fontSize: 16, fontWeight: '700', color: '#f8fafc', lineHeight: 24, marginBottom: 18 },
  optionsList: { gap: 10, marginBottom: 16 },
  optionItem: {
    backgroundColor: '#0f1729',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  optionSelected: { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
  optionCorrect: { backgroundColor: '#064e3b', borderColor: '#10b981' },
  optionWrong: { backgroundColor: '#7f1d1d', borderColor: '#ef4444' },
  optionText: { fontSize: 14, color: '#cbd5e1', fontWeight: '500', lineHeight: 20 },
  optionTextSelected: { color: '#93c5fd', fontWeight: '700' },
  optionTextCorrect: { color: '#34d399', fontWeight: '700' },
  optionTextWrong: { color: '#fca5a5', fontWeight: '700' },
  explanationBox: { backgroundColor: '#0f1729', padding: 14, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' },
  explanationTitle: { fontSize: 13, fontWeight: '700', color: '#60a5fa', marginBottom: 4 },
  explanationText: { fontSize: 12, color: '#cbd5e1', lineHeight: 18 },
  actionBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  actionBtnDisabled: { backgroundColor: '#1e293b' },
  actionBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },
  trophyEmoji: { fontSize: 60, marginBottom: 16 },
  completeTitle: { fontSize: 24, fontWeight: '800', color: '#f8fafc', marginBottom: 8 },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#60a5fa', marginBottom: 20 },
  badgeCard: { backgroundColor: '#78350f', padding: 18, borderRadius: 14, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#f59e0b' },
  badgeTitle: { fontSize: 16, fontWeight: '800', color: '#fbbf24' },
  badgeSub: { fontSize: 12, color: '#fde68a', marginTop: 4 },
  retryBtn: { backgroundColor: '#2563eb', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  retryBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },
});
