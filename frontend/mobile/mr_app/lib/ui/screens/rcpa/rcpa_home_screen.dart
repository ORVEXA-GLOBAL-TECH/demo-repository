import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../providers/rcpa_provider.dart';
import '../../widgets/empty_state_view.dart';
import 'add_rcpa_screen.dart';

class RcpaHomeScreen extends StatelessWidget {
  const RcpaHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final rcpaProvider = context.watch<RcpaProvider>();
    final audits = rcpaProvider.audits;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('RCPA (Prescription Audit)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Colors.white)),
      ),
      body: audits.isEmpty
          ? EmptyStateView(
              icon: Icons.analytics_outlined,
              title: 'No RCPA Audits Logged',
              description: 'Compare your pharma brand prescriptions against competitors at chemist counters.',
              actionLabel: 'Log First RCPA Audit',
              onAction: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AddRcpaScreen()));
              },
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: audits.length,
              itemBuilder: (context, index) {
                final audit = audits[index];
                final share = audit.overallMarketSharePercent;

                return Container(
                  margin: const EdgeInsets.only(bottom: 14),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              audit.doctorName,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
                            ),
                          ),
                          Text(
                            DateFormatter.formatShortDate(audit.auditDate),
                            style: const TextStyle(fontSize: 11, color: Colors.grey),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${audit.doctorSpecialty} • Audited at ${audit.chemistShopName}',
                        style: const TextStyle(fontSize: 11.5, color: AppColors.primary, fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 12),

                      // Comparisons Table / Cards
                      ...audit.comparisons.map((c) {
                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${c.ownBrandName} (Our Brand)',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: AppColors.primary),
                                  ),
                                  Text(
                                    '${c.ownBrandRxCount} Rx (${c.ownMarketSharePercent.toStringAsFixed(0)}%)',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: AppColors.primary),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${c.competitorBrandName} (${c.competitorCompany})',
                                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                                  ),
                                  Text(
                                    '${c.competitorRxCount} Rx (${c.competitorMarketSharePercent.toStringAsFixed(0)}%)',
                                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      }),

                      const SizedBox(height: 8),
                      // Market share bar
                      Row(
                        children: [
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: share / 100,
                                minHeight: 6,
                                backgroundColor: Colors.grey.withValues(alpha: 0.2),
                                valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            '${share.toStringAsFixed(0)}% Share',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary),
                          ),
                        ],
                      ),
                      if (audit.observations.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(
                          'Note: ${audit.observations}',
                          style: TextStyle(
                            fontSize: 11,
                            fontStyle: FontStyle.italic,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                      ],
                    ],
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'rcpa_fab',
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AddRcpaScreen()));
        },
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_chart_rounded),
        label: const Text('Add RCPA Audit', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }
}
