import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/locale_provider.dart';
import '../widgets/mr_connect_header.dart';
import '../widgets/telegram_floating_button.dart';

// Tabs
import 'dashboard/mr_dashboard_tab.dart';
import 'work/mr_work_tab.dart';
import 'reports/mr_reports_tab.dart';
import 'utilities/mr_utilities_tab.dart';
import 'profile/mr_profile_tab.dart';

class MainNavigationScreen extends StatefulWidget {
  final int initialIndex;
  const MainNavigationScreen({super.key, this.initialIndex = 0});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final localeProvider = context.watch<LocaleProvider>();

    final screens = [
      MrDashboardTab(onNavigateTab: _onTabTapped),
      const MrWorkTab(),
      const MrReportsTab(),
      const MrUtilitiesTab(),
      const MrProfileTab(),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFEDF2F9),
      body: Column(
        children: [
          // Top Navy Starry Header
          const MrConnectHeader(),
          // Main Body Screen Stack
          Expanded(
            child: IndexedStack(
              index: _currentIndex,
              children: screens,
            ),
          ),
        ],
      ),
      // Floating Telegram Direct Connect Button (Bottom Right)
      floatingActionButton: const Padding(
        padding: EdgeInsets.only(bottom: 8, right: 2),
        child: TelegramFloatingButton(
          telegramUsername: 'alleviare_support',
        ),
      ),
      // Sleek Dark Slate Bottom Navigation Bar
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF0C192E),
          border: Border(
            top: BorderSide(
              color: Color(0xFF1A2E4C),
              width: 1,
            ),
          ),
        ),
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.grid_view_rounded, localeProvider.translate('tab_dashboard')),
                _buildNavItem(1, Icons.bolt_rounded, localeProvider.translate('tab_work')),
                _buildNavItem(2, Icons.description_outlined, localeProvider.translate('tab_reports')),
                _buildNavItem(3, Icons.fact_check_outlined, localeProvider.translate('tab_utilities')),
                _buildNavItem(4, Icons.person_outline_rounded, localeProvider.translate('tab_profile')),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;

    return GestureDetector(
      onTap: () => _onTabTapped(index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? 10 : 6,
          vertical: isSelected ? 6 : 6,
        ),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1E3A6E) : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
          border: isSelected
              ? Border.all(color: const Color(0xFF2962FF).withValues(alpha: 0.35), width: 1)
              : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 21,
              color: isSelected ? const Color(0xFF5DB3FF) : const Color(0xFF94A3B8),
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 9.5,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? const Color(0xFF5DB3FF) : const Color(0xFF94A3B8),
                letterSpacing: 0.2,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
