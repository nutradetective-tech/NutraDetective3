export const getGradeColor = (score) => {
  if (score >= 90) return '#10B981';
  if (score >= 70) return '#F59E0B';
  if (score >= 50) return '#F97316';
  return '#EF4444';
};

export const getGradeGradient = (score) => {
  if (score >= 90) return ['#10B981', '#059669'];
  if (score >= 70) return ['#F59E0B', '#D97706'];
  if (score >= 50) return ['#F97316', '#EA580C'];
  return ['#EF4444', '#DC2626'];
};

export const getResultBackgroundColor = (score) => {
  if (score >= 90) return '#DCFCE7'; // Light green
  if (score >= 70) return '#FEF3C7'; // Light yellow
  if (score >= 50) return '#FED7AA'; // Light orange
  return '#FEE2E2'; // Light red
};

export const getStatusBadgeColor = (score) => {
  if (score >= 90) return '#10B981'; // Green
  if (score >= 70) return '#F59E0B'; // Yellow
  if (score >= 50) return '#F97316'; // Orange
  return '#EF4444'; // Red
};

export const getAverageGrade = (scanHistory) => {
  if (scanHistory.length === 0) return 'N/A';
  const avgScore = scanHistory.reduce((acc, item) => acc + item.score, 0) / scanHistory.length;
  
  if (avgScore >= 90) return 'A';
  if (avgScore >= 80) return 'A-';
  if (avgScore >= 75) return 'B+';
  if (avgScore >= 70) return 'B';
  if (avgScore >= 65) return 'B-';
  if (avgScore >= 60) return 'C+';
  if (avgScore >= 55) return 'C';
  if (avgScore >= 50) return 'C-';
  if (avgScore >= 45) return 'D+';
  if (avgScore >= 40) return 'D';
  if (avgScore >= 30) return 'D-';
  return 'F';
};

export const getTodayScans = (scanHistory) => {
  const today = new Date().toDateString();
  return scanHistory.filter(item => {
    const scanDate = new Date(item.date).toDateString();
    return scanDate === today;
  }).length;
};

export const calculateStreak = (scanHistory) => {
  if (scanHistory.length === 0) return 0;
  let streak = 1;
  const today = new Date().toDateString();
  const latestScan = new Date(scanHistory[0].date).toDateString();
  if (latestScan !== today) return 0;
  return streak;
};