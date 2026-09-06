import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/locale_provider.dart';
import '../../providers/currency_provider.dart';
import '../../core/localization/app_strings.dart';
import 'alleviare_logo.dart';
import 'mr_notifications_sheet.dart';

class MrConnectHeader extends StatelessWidget {
  const MrConnectHeader({super.key});

  void _showLanguageSelector(BuildContext context) {
    final localeProvider = context.read<LocaleProvider>();
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              context.tr('select_language'),
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 12),
            ...AppLanguage.values.map((lang) {
              final isSelected = localeProvider.currentLanguage == lang;
              return ListTile(
                leading: Text(lang.flag, style: const TextStyle(fontSize: 24)),
                title: Text(lang.label, style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                trailing: isSelected ? const Icon(Icons.check_circle_rounded, color: Color(0xFF1E88E5)) : null,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                tileColor: isSelected ? const Color(0xFFE3F2FD) : null,
                onTap: () {
                  localeProvider.setLanguage(lang);
                  Navigator.pop(ctx);
                },
              );
            }),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  void _showCurrencySelector(BuildContext context) {
    final currencyProvider = context.read<CurrencyProvider>();
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              context.tr('select_currency'),
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 12),
            ...AppCurrency.values.map((curr) {
              final isSelected = currencyProvider.currentCurrency == curr;
              return ListTile(
                leading: CircleAvatar(
                  radius: 18,
                  backgroundColor: isSelected ? const Color(0xFF1E88E5) : const Color(0xFFE2E8F0),
                  child: Text(
                    curr.symbol,
                    style: TextStyle(
                      color: isSelected ? Colors.white : const Color(0xFF0F172A),
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                title: Text('${curr.name} (${curr.code})', style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                subtitle: Text(curr == AppCurrency.khr ? '1 USD = 4,100 KHR (Cambodia)' : 'Base Currency (USD \$)'),
                trailing: isSelected ? const Icon(Icons.check_circle_rounded, color: Color(0xFF1E88E5)) : null,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                tileColor: isSelected ? const Color(0xFFE3F2FD) : null,
                onTap: () {
                  currencyProvider.setCurrency(curr);
                  Navigator.pop(ctx);
                },
              );
            }),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  void _showUserTerritorySheet(BuildContext context, user) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: const Color(0xFF1E88E5).withValues(alpha: 0.15),
                  child: const Icon(Icons.person, color: Color(0xFF1E88E5), size: 28),
                ),
                const SizedBox(width: 14),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text('${user.designation} • ${user.empCode}', style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(),
            ListTile(
              dense: true,
              leading: const Icon(Icons.location_on, color: Color(0xFF1E88E5)),
              title: Text(context.tr('territory'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              subtitle: Text(user.territory, style: const TextStyle(fontSize: 12)),
            ),
            ListTile(
              dense: true,
              leading: const Icon(Icons.business_rounded, color: Color(0xFF1E88E5)),
              title: Text(context.tr('headquarters'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              subtitle: Text('${user.headquarters} • ${user.division}', style: const TextStyle(fontSize: 12)),
            ),
            ListTile(
              dense: true,
              leading: const Icon(Icons.supervisor_account_rounded, color: Color(0xFF1E88E5)),
              title: Text(context.tr('reporting_manager'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              subtitle: Text('${user.managerName} (${user.managerPhone})', style: const TextStyle(fontSize: 12)),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.currentUser;
    final localeProvider = context.watch<LocaleProvider>();
    final currencyProvider = context.watch<CurrencyProvider>();

    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF0B172E),
            Color(0xFF11223F),
            Color(0xFF162D52),
          ],
        ),
      ),
      child: Stack(
        children: [
          // Subtle starry night sparkles overlay
          Positioned(
            top: 25,
            left: 70,
            child: Container(
              width: 3,
              height: 3,
              decoration: const BoxDecoration(color: Colors.white70, shape: BoxShape.circle),
            ),
          ),
          Positioned(
            top: 15,
            right: 80,
            child: Container(
              width: 2.5,
              height: 2.5,
              decoration: const BoxDecoration(color: Colors.white60, shape: BoxShape.circle),
            ),
          ),
          Positioned(
            top: 55,
            right: 120,
            child: Container(
              width: 2,
              height: 2,
              decoration: const BoxDecoration(color: Colors.white54, shape: BoxShape.circle),
            ),
          ),
          Positioned(
            top: 45,
            left: 140,
            child: Container(
              width: 2,
              height: 2,
              decoration: const BoxDecoration(color: Colors.white54, shape: BoxShape.circle),
            ),
          ),
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      // Left: Alleviare Pharma Official Brand Logo Card
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(13),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.18),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: const AlleviareSymbol(size: 26),
                      ),
                      const SizedBox(width: 12),

                      // Center: Alleviare Pharmaceuticals Title & User Tag Pill
                      Expanded(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.centerLeft,
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Text(
                                    'ALLEVIARE',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 0.7,
                                    ),
                                  ),
                                  const SizedBox(width: 5),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 4.5, vertical: 1.5),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF00A7CE).withValues(alpha: 0.35),
                                      borderRadius: BorderRadius.circular(4),
                                      border: Border.all(color: const Color(0xFF00A7CE), width: 0.8),
                                    ),
                                    child: const Text(
                                      'PHARMA',
                                      style: TextStyle(
                                        color: Color(0xFF80DEEA),
                                        fontSize: 9,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 1),
                            const Text(
                              'way towards new life',
                              style: TextStyle(
                                color: Color(0xFFFF8A80),
                                fontSize: 9.5,
                                fontWeight: FontWeight.w600,
                                fontStyle: FontStyle.italic,
                                letterSpacing: 0.2,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            GestureDetector(
                              onTap: () => _showUserTerritorySheet(context, user),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.2),
                                    width: 0.8,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.person_outline_rounded,
                                      color: Colors.white,
                                      size: 12,
                                    ),
                                    const SizedBox(width: 3),
                                    Flexible(
                                      child: Text(
                                        user.name.isNotEmpty ? user.name : 'G Anand',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    const SizedBox(width: 2),
                                    const Icon(
                                      Icons.arrow_drop_down_rounded,
                                      color: Colors.white70,
                                      size: 14,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),

                      // Quick Language Switcher Pill
                      GestureDetector(
                        onTap: () => _showLanguageSelector(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: Colors.white.withValues(alpha: 0.25), width: 0.8),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(localeProvider.currentLanguage.flag, style: const TextStyle(fontSize: 11)),
                              const SizedBox(width: 2),
                              Text(
                                localeProvider.currentLanguage.shortLabel,
                                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 4),

                      // Quick Currency Switcher Pill
                      GestureDetector(
                        onTap: () => _showCurrencySelector(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: Colors.white.withValues(alpha: 0.25), width: 0.8),
                          ),
                          child: Text(
                            currencyProvider.symbol,
                            style: const TextStyle(color: Color(0xFF00E5FF), fontSize: 11.5, fontWeight: FontWeight.w900),
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),

                      // Right: Notification Bell with Badge '4'
                      Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (ctx) => const MrNotificationsSheet(),
                            );
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(11),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.25),
                                width: 0.8,
                              ),
                            ),
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                const Icon(
                                  Icons.notifications_none_rounded,
                                  color: Colors.white,
                                  size: 19,
                                ),
                                Positioned(
                                  top: 4,
                                  right: 4,
                                  child: Container(
                                    padding: const EdgeInsets.all(2.5),
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFE53935),
                                      shape: BoxShape.circle,
                                    ),
                                    constraints: const BoxConstraints(
                                      minWidth: 13,
                                      minHeight: 13,
                                    ),
                                    child: const Center(
                                      child: Text(
                                        '4',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 7.5,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
