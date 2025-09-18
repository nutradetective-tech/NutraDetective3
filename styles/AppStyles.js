import { StyleSheet } from 'react-native';
import { getResponsiveSize } from '../utils/responsive';

export const styles = StyleSheet.create({

    // Enhanced Product Header Styles
  productHeaderCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  
  // Status Badge Styles
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Allergen Alert Styles
  allergenAlertBox: {
    backgroundColor: '#FED7AA',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  allergenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  allergenIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  allergenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9A3412',
  },
  allergenDescription: {
    fontSize: 14,
    color: '#7C2D12',
    marginBottom: 8,
  },
  allergenItem: {
    fontSize: 14,
    color: '#7C2D12',
    marginLeft: 10,
    marginTop: 4,
  },
  
  // NEW: All Allergens Section
  allergensSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  allergenSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 5,
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  allergenChip: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  allergenChipText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // NEW: Nutrition Facts Styles
  nutritionSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  nutritionSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 5,
  },
  nutritionGrid: {
    marginTop: 12,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  nutritionLabel: {
    color: '#4B5563',
    fontSize: 14,
  },
  nutritionValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  nutritionValueBad: {
    color: '#DC2626',
  },
  servingSizeText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
  },
  
  // NEW: Additives Styles
  additivesSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  additivesText: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 8,
  },
  additiveItem: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 5,
  },
  additivesCount: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  
  // NEW: Ingredients Styles
  ingredientsSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  ingredientsText: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  
  // NEW: Processing Level Styles
  processingSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  novaGroupBadge: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  novaGroupText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // NEW: Nutri-Score Styles
  nutriScoreSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  nutriScoreBadge: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nutriScoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Concerns Section Styles
  concernsSection: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 10,
  },
  concernCard: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  concernNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  concernNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  concernContent: {
    flex: 1,
  },
  concernName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  concernDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  
  // Positive Aspects Styles
  positiveSection: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  positiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  positiveText: {
    fontSize: 14,
    color: '#1A202C',
    flex: 1,
  },
  
  // Container
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  responsiveContainer: {
    flex: 1,
    width: '100%',
  },
  tabletContainer: {
    maxWidth: 768,
    alignSelf: 'center',
  },
  desktopContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
  },

  // Splash Screen
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogoContainer: {
    marginBottom: 30,
  },
  splashIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  splashIcon: {
    fontSize: 64,
  },
  splashTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  splashTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 40,
  },
  loadingTextWhite: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Card Shadow Effect
  cardShadow: {
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },

  // Glass Effect
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    flex: 1,
    textAlign: 'center',
  },
  gradientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitleCenter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: '#667EEA',
  },
  clearButton: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
  clearText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },

  // Home Header with Logo
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: getResponsiveSize(20, 30, 40),
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    flex: 1,
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  logoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
  },
  logoNutra: {
    color: '#667EEA',
  },
  logoDetective: {
    color: '#764BA2',
  },
  greetingContainer: {
    marginTop: 5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A202C',
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  profileCircle: {
    width: getResponsiveSize(40, 50, 60),
    height: getResponsiveSize(40, 50, 60),
    borderRadius: getResponsiveSize(20, 25, 30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircleText: {
    color: '#FFFFFF',
    fontSize: getResponsiveSize(16, 20, 24),
    fontWeight: '700',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  statsGridTablet: {
    paddingHorizontal: 30,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: getResponsiveSize(15, 20, 25),
    alignItems: 'center',
    width: `${100/3 - 2}%`,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#667EEA',
  },
  statLabel: {
    fontSize: getResponsiveSize(10, 12, 14),
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },

  // Scan Button with Animation
  scanButtonWrapper: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  scanButtonAnimated: {
    alignSelf: 'center',
  },
  scanButton: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  scanButtonIcon: {
    marginBottom: 5,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Recent Scans
  recentSection: {
    paddingHorizontal: getResponsiveSize(15, 30, 40),
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 15,
  },
  recentGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  recentCardTablet: {
    width: '48%',
    marginHorizontal: '1%',
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  recentGradeBadge: {
    width: getResponsiveSize(40, 45, 50),
    height: getResponsiveSize(40, 45, 50),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentGradeText: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recentName: {
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '600',
    color: '#1A202C',
  },
  recentTime: {
    fontSize: getResponsiveSize(12, 13, 14),
    color: '#64748B',
    marginTop: 2,
  },
  recentArrow: {
    fontSize: 18,
    color: '#64748B',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    position: 'relative',
  },
  navItemActive: {},
  navActiveIndicator: {
    position: 'absolute',
    top: -1,
    width: 40,
    height: 3,
    borderRadius: 2,
  },
  navIcon: {
    fontSize: getResponsiveSize(24, 28, 32),
    color: '#94A3B8',
    marginBottom: 4,
  },
  navIconActive: {
    color: '#667EEA',
  },
  navLabel: {
    fontSize: getResponsiveSize(10, 12, 14),
    fontWeight: '600',
    color: '#94A3B8',
  },
  navLabelActive: {
    color: '#667EEA',
  },

  // Results Screen
  resultContent: {
    padding: getResponsiveSize(15, 30, 40),
  },
  gradeCircle: {
    width: getResponsiveSize(100, 120, 140),
    height: getResponsiveSize(100, 120, 140),
    borderRadius: getResponsiveSize(50, 60, 70),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradeText: {
    fontSize: getResponsiveSize(48, 56, 64),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  productInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productName: {
    fontSize: getResponsiveSize(22, 26, 30),
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: getResponsiveSize(14, 16, 18),
    color: '#64748B',
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusText: {
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '600',
  },
  warningsContainer: {
    marginBottom: 20,
  },
  warningsTitle: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 10,
  },
  warningCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    gap: 12,
  },
  warningIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 18,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 2,
  },
  warningDesc: {
    fontSize: getResponsiveSize(12, 13, 14),
    color: '#64748B',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingVertical: 20,
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#667EEA',
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#667EEA',
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '700',
  },
  primaryButtonWrapper: {
    flex: 1,
  },
  primaryGradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '700',
  },

  // History Screen
  historyList: {
    padding: getResponsiveSize(15, 30, 40),
    paddingBottom: 100,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  historyItemTablet: {
    width: '48%',
    marginHorizontal: '1%',
  },
  historyGradeBadge: {
    width: getResponsiveSize(40, 45, 50),
    height: getResponsiveSize(40, 45, 50),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyGradeText: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '600',
    color: '#1A202C',
  },
  historyTime: {
    fontSize: getResponsiveSize(12, 13, 14),
    color: '#64748B',
    marginTop: 2,
  },
  historyArrow: {
    fontSize: 18,
    color: '#64748B',
  },

  // Profile Screen
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  profileAvatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatarIcon: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileNameWhite: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmailWhite: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  editNameButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  editNameText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileContent: {
    flex: 1,
    marginTop: -20,
  },
  profileStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginHorizontal: getResponsiveSize(15, 30, 40),
    marginBottom: 15,
    borderRadius: 16,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: getResponsiveSize(24, 28, 32),
    fontWeight: '700',
    color: '#667EEA',
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: getResponsiveSize(12, 14, 16),
    color: '#64748B',
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  premiumButtonWrapper: {
    marginHorizontal: getResponsiveSize(15, 30, 40),
    marginTop: 10,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  premiumIcon: {
    fontSize: getResponsiveSize(32, 36, 40),
    marginRight: 15,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: getResponsiveSize(18, 20, 22),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: getResponsiveSize(14, 15, 16),
    color: '#FFFFFF',
    opacity: 0.9,
  },
  premiumArrow: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  // Settings Section
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: getResponsiveSize(15, 30, 40),
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A202C',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 10,
  },
  settingArrow: {
    fontSize: 18,
    color: '#94A3B8',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    fontSize: getResponsiveSize(64, 72, 80),
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: getResponsiveSize(20, 24, 28),
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: getResponsiveSize(14, 16, 18),
    color: '#94A3B8',
  },

  // Ad Banner
  adBanner: {
    height: 50,
    backgroundColor: '#E2E8F0',
    marginHorizontal: getResponsiveSize(10, 30, 40),
    marginBottom: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    fontSize: 11,
    color: '#64748B',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F7F8FA',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalGradientButton: {
    padding: 15,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Goal Modal Styles
  goalSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  goalButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  goalButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#667EEA',
  },
  goalValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1A202C',
    minWidth: 60,
    textAlign: 'center',
  },
  goalHint: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Stats Selector Styles
  statOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  statOptionActive: {
    borderColor: '#667EEA',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
  statOptionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  statOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    flex: 1,
  },
  statOptionTextActive: {
    color: '#667EEA',
    fontWeight: '600',
  },

  productImageContainer: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    marginVertical: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
  },

});