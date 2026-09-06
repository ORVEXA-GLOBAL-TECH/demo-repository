import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/responsive.dart';
import '../../providers/auth_provider.dart';
import '../../providers/locale_provider.dart';
import '../../providers/currency_provider.dart';
import '../screens/tour_plan/tour_plan_screen.dart';
import '../screens/rcpa/rcpa_home_screen.dart';
import '../screens/inventory/sample_inventory_screen.dart';
import '../screens/edetailing/edetailing_catalog_screen.dart';
import '../screens/expenses/expense_home_screen.dart';
import '../screens/gps_tracking/gps_tracking_screen.dart';
import '../screens/sales/sales_home_screen.dart';
import '../screens/reports/reports_hub_screen.dart';
import '../screens/targets/target_management_screen.dart';
import '../screens/leave/leave_home_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/dashboard/dashboard_screen.dart';
import 'alleviare_logo.dart';
import 'text_size_sheet.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  Widget _drawerItem({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Color? iconColor,
    Color? badgeColor,
    String? badgeText,
  }) {
    final fs = Responsive.sp(context, 13);
    final subFs = Responsive.sp(context, 11);
    return ListTile(
      dense: true,
      contentPadding: EdgeInsets.symmetric(
        horizontal: Responsive.horizontalPadding(context),
        vertical: 2,
      ),
      leading: Container(
        padding: const EdgeInsets.all(7),
        decoration: BoxDecoration(
          color: (iconColor ?? AppColors.primary).withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(9),
        ),
        child: Icon(icon, color: iconColor ?? AppColors.primary, size: Responsive.iconSize(context, base: 20)),
      ),
      title: Row(
        children: [
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: fs,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF0F172A),
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (badgeText != null) ...[
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
              decoration: BoxDecoration(
                color: badgeColor ?? AppColors.primaryContainer,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Text(
                badgeText,
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  color: badgeColor != null ? Colors.amber.shade900 : AppColors.primary,
                ),
              ),
            ),
          ],
        ],
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(fontSize: subFs, color: const Color(0xFF64748B)),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: const Icon(Icons.chevron_right_rounded, size: 16, color: Color(0xFF94A3B8)),
      onTap: onTap,
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().currentUser;
    final drawerWidth = Responsive.isTablet(context)
        ? Responsive.screenWidth(context) * 0.38
        : Responsive.screenWidth(context) * 0.82;

    return Drawer(
      width: drawerWidth,
      backgroundColor: Colors.white,
      elevation: 16,
      child: SafeArea(
        top: false,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // Drawer Header with Alleviare Branding & MR Info
            Container(
              padding: const EdgeInsets.fromLTRB(18, 44, 18, 18),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF009CBF), Color(0xFF007799), Color(0xFF0F172A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Official Alleviare Brand Logo Card
                  const AlleviareBrandCard(width: 190, height: 64),
                  const SizedBox(height: 14),

                  // MR Info Row
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.gold, width: 1.8),
                        ),
                        child: CircleAvatar(
                          radius: 22,
                          backgroundColor: Colors.white.withValues(alpha: 0.2),
                          child: const Icon(Icons.person_rounded, color: Colors.white, size: 24),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14.5,
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              '${user.designation} • ${user.empCode}',
                              style: const TextStyle(
                                color: AppColors.goldLight,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              'ASM: ${user.managerName}',
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.8),
                                fontSize: 10,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Punch In / Punch Out Status Chip
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.25),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 7,
                          height: 7,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: user.isPunchedIn ? AppColors.success : AppColors.error,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            user.isPunchedIn ? 'PUNCHED IN (Field Active)' : 'PUNCHED OUT (Off Duty)',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10.5,
                              fontWeight: FontWeight.w600,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 8),

            // 0. Main Dashboard
            _drawerItem(
              context: context,
              icon: Icons.dashboard_rounded,
              iconColor: AppColors.primary,
              title: 'Dashboard',
              subtitle: 'Daily KPIs, targets & overview',
              onTap: () {
                Navigator.pop(context);
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) => const DashboardScreen()),
                  (route) => false,
                );
              },
            ),

            // 1. Tour Planning (MTP Planner)
            _drawerItem(
              context: context,
              icon: Icons.calendar_month_rounded,
              iconColor: const Color(0xFF009CBF),
              title: 'Tour Planning (MTP)',
              subtitle: 'Manager beats, visits & deviation',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const TourPlanScreen()),
                );
              },
            ),

            // 2. RCPA (Prescription Audit)
            _drawerItem(
              context: context,
              icon: Icons.analytics_outlined,
              iconColor: AppColors.primary,
              title: 'RCPA (Prescription Audit)',
              subtitle: 'Competitor Rx volume & share',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const RcpaHomeScreen()),
                );
              },
            ),

            // 3. Sample Distribution & Bag
            _drawerItem(
              context: context,
              icon: Icons.medication_rounded,
              iconColor: AppColors.primary,
              title: 'Sample Distribution',
              subtitle: 'Inventory, doctor acks, batch & expiry',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SampleInventoryScreen()),
                );
              },
            ),

            // 4. E-Detailing & Visual Aid
            _drawerItem(
              context: context,
              icon: Icons.auto_stories_rounded,
              iconColor: const Color(0xFF009CBF),
              title: 'E-Detailing & Visual Aid',
              subtitle: 'Brochures, 3D videos, trials & LBLs',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const EdetailingCatalogScreen()),
                );
              },
            ),

            // 5. Expenses Management
            _drawerItem(
              context: context,
              icon: Icons.receipt_long_rounded,
              iconColor: const Color(0xFF009CBF),
              title: 'Expenses Management',
              subtitle: 'Manage travel and work expenses',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ExpenseHomeScreen()),
                );
              },
            ),

            // 5. Live GPS & Route History
            _drawerItem(
              context: context,
              icon: Icons.gps_fixed_rounded,
              iconColor: AppColors.success,
              title: 'Live GPS & Route History',
              subtitle: 'Real-time location, timeline & stops',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const GpsTrackingScreen()),
                );
              },
            ),

            // 6. Product Sales & Reports
            _drawerItem(
              context: context,
              icon: Icons.point_of_sale_rounded,
              iconColor: const Color(0xFF009CBF),
              title: 'Product Sales & Reports',
              subtitle: 'Invoice upload, monthly & territory sales',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SalesHomeScreen()),
                );
              },
            ),

            // 7. Real-Time Reporting
            _drawerItem(
              context: context,
              icon: Icons.analytics_rounded,
              iconColor: AppColors.primary,
              title: 'Real-Time Reporting',
              subtitle: 'Daily, weekly, sales, expense & targets',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const RealTimeReportsScreen()),
                );
              },
            ),

            // 8. Target Management
            _drawerItem(
              context: context,
              icon: Icons.track_changes_rounded,
              iconColor: const Color(0xFF009CBF),
              title: 'Target Management',
              subtitle: 'Manager assigned, product & leaderboard',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const TargetManagementScreen()),
                );
              },
            ),

            // 9. Leave Management
            _drawerItem(
              context: context,
              icon: Icons.beach_access_rounded,
              iconColor: AppColors.primary,
              title: 'Leave Management',
              subtitle: 'Apply leave, balances, approvals & calendar',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const LeaveHomeScreen()),
                );
              },
            ),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Divider(height: 16, color: Color(0xFFE2E8F0)),
            ),

            // Language Switcher
            Consumer<LocaleProvider>(
              builder: (ctx, loc, _) => _drawerItem(
                context: context,
                icon: Icons.language_rounded,
                iconColor: const Color(0xFF009CBF),
                title: 'Language: ${loc.currentLanguage.label}',
                subtitle: 'Tap to switch (EN / ភាសាខ្មែរ)',
                badgeText: loc.currentLanguage.code.toUpperCase(),
                badgeColor: const Color(0xFFE0F7FA),
                onTap: () {
                  loc.toggleLanguage();
                },
              ),
            ),

            // Currency Switcher
            Consumer<CurrencyProvider>(
              builder: (ctx, curr, _) => _drawerItem(
                context: context,
                icon: Icons.currency_exchange_rounded,
                iconColor: const Color(0xFF10B981),
                title: 'Currency: ${curr.currentCurrency.name} (${curr.symbol})',
                subtitle: curr.isUsd ? 'Base Currency (USD \$)' : 'Cambodia (1 USD = 4,100 KHR)',
                badgeText: curr.code,
                badgeColor: const Color(0xFFE8F5E9),
                onTap: () {
                  curr.toggleCurrency();
                },
              ),
            ),

            // Letter & Text Sizing Adjuster
            Consumer<LocaleProvider>(
              builder: (ctx, loc, _) => _drawerItem(
                context: context,
                icon: Icons.format_size_rounded,
                iconColor: const Color(0xFF0D9488),
                title: 'Adjust Letter Sizing',
                subtitle: 'Scale: ${loc.fontScaleLabel}',
                badgeText: '${(loc.fontScale * 100).toInt()}%',
                badgeColor: const Color(0xFFCCFBF1),
                onTap: () {
                  Navigator.pop(context);
                  showAdjustTextSizeModal(context);
                },
              ),
            ),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Divider(height: 16, color: Color(0xFFE2E8F0)),
            ),

            // 6. MR Profile & Settings
            _drawerItem(
              context: context,
              icon: Icons.account_circle_outlined,
              iconColor: Colors.grey.shade700,
              title: 'MR Profile & Territory',
              subtitle: 'Territory zone & ASM contact',
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ProfileScreen()),
                );
              },
            ),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Divider(height: 16, color: Color(0xFFE2E8F0)),
            ),

            // 7. Logout Button
            ListTile(
              dense: true,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
              leading: Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: AppColors.errorContainer,
                  borderRadius: BorderRadius.circular(9),
                ),
                child: const Icon(Icons.logout_rounded, color: AppColors.error, size: 20),
              ),
              title: const Text(
                'Logout Session',
                style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: AppColors.error),
              ),
              subtitle: const Text(
                'End session and return to login',
                style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
              ),
              trailing: const Icon(Icons.chevron_right_rounded, size: 16, color: Color(0xFF94A3B8)),
              onTap: () {
                context.read<AuthProvider>().logout();
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              },
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
