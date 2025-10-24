// constants/onboarding.js
// Onboarding Configuration for NutraDetective

// ===== ONBOARDING MODES =====
export const MODES = {
  GAME: 'game',
  EDUCATIONAL: 'educational',
};

export const MODE_CONFIG = {
  game: {
    id: 'game',
    name: 'Game Mode',
    icon: '🎮',
    features: [
      'Earn XP and unlock ranks',
      'Collect 30+ badges',
      'Daily challenges',
      'Compete on leaderboards',
      'Streak tracking',
      'Share achievements',
    ],
    bestFor: 'Making healthy eating fun & engaging!',
    color: '#667EEA',
  },
  educational: {
    id: 'educational',
    name: 'Educational Mode',
    icon: '📚',
    features: [
      'Clean, data-focused UI',
      'No game elements',
      'Professional interface',
      'Streak counter only',
    ],
    bestFor: 'Professionals, researchers, and minimalists',
    color: '#10B981',
  },
};

// ===== ONBOARDING STEPS =====
export const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  NAME: 'name',
  MODE: 'mode',
  AUTH: 'auth',
};

export const ONBOARDING_PROGRESS = {
  welcome: 0,
  name: 25,
  mode: 50,
  auth: 75,
};

// ===== AUTH OPTIONS =====
export const AUTH_OPTIONS = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
  EMAIL: 'email',
  GUEST: 'guest',
};

export const AUTH_CONFIG = {
  facebook: {
    id: 'facebook',
    name: 'Continue with Facebook',
    icon: '📘',
    color: '#1877F2',
    subtitle: 'Recommended - Cloud backup + Friends',
    recommended: true,
  },
  google: {
    id: 'google',
    name: 'Continue with Google',
    icon: '🔍',
    color: '#4285F4',
    subtitle: 'Alternative - Cloud backup',
    recommended: false,
  },
  email: {
    id: 'email',
    name: 'Continue with Email',
    icon: '✉️',
    color: '#667EEA',
    subtitle: 'Traditional - Cloud backup',
    recommended: false,
  },
  guest: {
    id: 'guest',
    name: 'Continue as Guest',
    icon: '👤',
    color: '#6B7280',
    subtitle: 'Limited - Data saved on device only',
    recommended: false,
    warning: true,
  },
};

// ===== GUEST ACCOUNT LIMITATIONS =====
export const GUEST_LIMITATIONS = [
  '5 scans per day limit',
  'No cloud backup (data lost if deleted)',
  'No leaderboards or friend features',
];

export const GUEST_FEATURES = {
  maxScansPerDay: 5,
  cloudBackup: false,
  familyAccounts: false,
  leaderboards: false,
  friendCompetition: false,
  basicGrading: true,
  localHistory: true,
  allergenAlerts: true,
  recallAlerts: true,
  localStreak: true,
};

// ===== UPGRADE PROMPTS FOR GUESTS =====
export const GUEST_UPGRADE_TRIGGERS = {
  DAILY_LIMIT_HIT: 'daily_limit',
  SEVEN_DAY_STREAK: 'seven_days',
  NEW_DEVICE: 'new_device',
  THIRTY_SCANS: 'thirty_scans',
};

export const GUEST_UPGRADE_MESSAGES = {
  daily_limit: {
    title: '📊 Daily Limit Reached',
    message: "You've used all 5 free scans today!\n\nWant unlimited scans?",
    actions: ['Upgrade to Plus', 'Connect Account', 'Maybe Later'],
  },
  seven_days: {
    title: '🔥 7-Day Streak! You\'re Doing Great!',
    message: "But your progress isn't backed up 😟\n\nIf you uninstall or switch phones:\n✗ All scans lost\n✗ 7-day streak reset\n✗ Settings erased\n\nConnect now to save everything:",
    actions: ['Connect Account', 'Stay Guest'],
  },
  new_device: {
    title: '⚠️ Can\'t Restore Guest Data',
    message: 'Guest accounts are device-only.\n\nYour previous scans and streak cannot be transferred.\n\nTo prevent this in the future:',
    actions: ['Connect Account Now', 'Start Fresh as Guest'],
  },
  thirty_scans: {
    title: '🎉 30 Scans! You\'re Committed!',
    message: 'You\'ve scanned 30 products as a guest.\n\nConnect your account to:\n✓ Save progress forever\n✓ Access from any device\n✓ Unlock leaderboards',
    actions: ['Connect Now', 'Maybe Later'],
  },
};

// ===== DEFAULT ONBOARDING STATE =====
export const DEFAULT_ONBOARDING_STATE = {
  completed: false,
  currentStep: 'welcome',
  userName: '',
  selectedMode: null,
  isGuest: false,
  skipCount: 0,
  startedAt: null,
  completedAt: null,
};

// ===== ONBOARDING STORAGE KEYS =====
export const STORAGE_KEYS = {
  ONBOARDING_STATE: 'onboarding_state',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  USER_MODE: 'user_mode',
  IS_GUEST: 'is_guest',
  GUEST_USER_ID: 'guest_user_id',
  GUEST_UPGRADE_PROMPT_COUNT: 'guest_upgrade_prompt_count',
  GUEST_LAST_PROMPT_DATE: 'guest_last_prompt_date',
};

// ===== VALIDATION RULES =====
export const VALIDATION = {
  NAME: {
    minLength: 2,
    maxLength: 30,
    pattern: /^[a-zA-Z\s'-]+$/,
    errorMessages: {
      tooShort: 'Name must be at least 2 characters',
      tooLong: 'Name must be less than 30 characters',
      invalid: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    },
  },
};

// ===== ANIMATION DURATIONS =====
export const ANIMATIONS = {
  FADE_IN: 300,
  FADE_OUT: 200,
  SLIDE_IN: 250,
  PROGRESS_BAR: 400,
};

// ===== COLORS (Match your brand) =====
export const ONBOARDING_COLORS = {
  PRIMARY: '#667EEA',
  PRIMARY_DARK: '#764BA2',
  SUCCESS: '#10B981',
  WARNING: '#FBBF24',
  DANGER: '#EF4444',
  NEUTRAL: '#6B7280',
  BACKGROUND: '#F7FAFC',
  WHITE: '#FFFFFF',
  TEXT_PRIMARY: '#1A202C',
  TEXT_SECONDARY: '#64748B',
  BORDER: '#E2E8F0',
};