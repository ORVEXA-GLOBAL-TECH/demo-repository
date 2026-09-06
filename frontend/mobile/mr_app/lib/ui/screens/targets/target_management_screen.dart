import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/target_model.dart';
import '../../../providers/target_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/report_export_sheet.dart';

class TargetManagementScreen extends StatefulWidget {
  const TargetManagementScreen({super.key});

  @override
  State<TargetManagementScreen> createState() => _TargetManagementScreenState();
}

class _TargetManagementScreenState extends State<TargetManagementScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _selectedPeriodIndex = 0; // 0 = Monthly, 1 = Quarterly, 2 = Annual

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final targetProvider = context.watch<TargetProvider>();

    TargetPlanSummary currentPlan;
    if (_selectedPeriodIndex == 0) {
      currentPlan = targetProvider.monthlyTarget;
    } else if (_selectedPeriodIndex == 1) {
      currentPlan = targetProvider.quarterlyTarget;
    } else {
      currentPlan = targetProvider.annualTarget;
    }

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
        title: const Text(
          'Target & Sales Performance',
          style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Target & Sales Performance Report',
                period: currentPlan.periodName,
                summaryMetrics: {
                  'Target Value': CurrencyFormatter.formatInr(currentPlan.totalSalesTarget),
                  'Achieved Value': CurrencyFormatter.formatInr(currentPlan.totalSalesAchieved),
                  'Achievement %': '${currentPlan.salesAchievementPercentage.toStringAsFixed(1)}%',
                  'Incentive Tier': 'Tier 1 (Silver Bonus)',
                },
                headers: ['Brand / Product Category', 'Assigned Target (Qty)', 'Achieved (Qty)', 'Achievement %', 'Incentive Potential'],
                rows: targetProvider.productTargets.map((pt) {
                  return [
                    pt.productName,
                    '${pt.targetUnits} Units',
                    '${pt.achievedUnits} Units',
                    '${pt.achievementPercentage.toStringAsFixed(1)}%',
                    '\$450.00',
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Manager Target Banner
          Container(
            margin: const EdgeInsets.fromLTRB(16, 10, 16, 8),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF009CBF), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(currentPlan.periodName.toUpperCase(), style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: AppColors.success, borderRadius: BorderRadius.circular(6)),
                      child: Text('Rank #${targetProvider.currentMrLeaderboardRank} in Region', style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(CurrencyFormatter.formatInr(currentPlan.totalSalesAchieved), style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800)),
                    Text('${currentPlan.salesAchievementPercentage.toStringAsFixed(1)}% Achieved', style: const TextStyle(color: Colors.amberAccent, fontSize: 14, fontWeight: FontWeight.w900)),
                  ],
                ),
                const SizedBox(height: 4),
                Text('Target: ${CurrencyFormatter.formatInr(currentPlan.totalSalesTarget)} • Remaining: ${CurrencyFormatter.formatInr(currentPlan.remainingSalesTarget)}', style: const TextStyle(color: Colors.white70, fontSize: 11.5, fontWeight: FontWeight.w500)),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: (currentPlan.salesAchievementPercentage / 100).clamp(0.0, 1.0),
                    backgroundColor: Colors.white24,
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.greenAccent),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    _kpiChip('DOCTOR CALLS', '${currentPlan.doctorCallsDone}/${currentPlan.doctorCallTarget}', Icons.person_rounded),
                    const SizedBox(width: 8),
                    _kpiChip('CHEMIST CALLS', '${currentPlan.chemistCallsDone}/${currentPlan.chemistCallTarget}', Icons.local_pharmacy_rounded),
                    const SizedBox(width: 8),
                    _kpiChip('POB BOOKED', CurrencyFormatter.formatCompactInr(currentPlan.pobOrdersBooked), Icons.shopping_bag_rounded),
                  ],
                ),
              ],
            ),
          ),

          // Period Filter Switcher (Monthly, Quarterly, Annual)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: [
                _periodChip('📅 Monthly Target (Aug 2026)', 0),
                _periodChip('📆 Quarterly Target (Q2)', 1),
                _periodChip('🗓️ Annual Target (FY 26-27)', 2),
              ],
            ),
          ),

          // Tabs
          TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: AppColors.primary,
            unselectedLabelColor: const Color(0xFF64748B),
            indicatorColor: AppColors.primary,
            labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
            tabs: const [
              Tab(text: '🎯 Target Overview'),
              Tab(text: '💊 Product-Wise'),
              Tab(text: '🗺️ Territory Patch'),
              Tab(text: '🏆 Leaderboard'),
            ],
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Overview & Strategy
                _buildOverviewTab(currentPlan),

                // 2. Product-Wise Targets
                _buildProductTargetsTab(targetProvider),

                // 3. Territory Patch Targets
                _buildTerritoryTargetsTab(targetProvider),

                // 4. Regional Leaderboard
                _buildLeaderboardTab(targetProvider),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _periodChip(String label, int index) {
    final sel = _selectedPeriodIndex == index;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(label),
        selected: sel,
        selectedColor: AppColors.primary,
        backgroundColor: Colors.white,
        side: BorderSide(color: sel ? AppColors.primary : const Color(0xFFE2E8F0)),
        labelStyle: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: sel ? Colors.white : const Color(0xFF334155)),
        onSelected: (s) => s ? setState(() => _selectedPeriodIndex = index) : null,
      ),
    );
  }

  Widget _kpiChip(String label, String val, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
        child: Column(
          children: [
            Icon(icon, size: 12, color: Colors.white70),
            const SizedBox(height: 2),
            Text(val, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10.5)),
            Text(label, style: const TextStyle(color: Colors.white60, fontSize: 7.5, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  // TAB 1: Target Overview
  Widget _buildOverviewTab(TargetPlanSummary plan) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Manager Assignment Note Card
        AppSectionCard(
          title: 'Manager Target Assignment & Strategy',
          subtitle: 'Assigned by ${plan.assignedByManagerName}',
          icon: Icons.assignment_ind_rounded,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Strategy Guidance: “${plan.managerStrategyNotes}”', style: const TextStyle(fontSize: 12, color: Color(0xFF334155), fontStyle: FontStyle.italic, fontWeight: FontWeight.w600)),
              const Divider(height: 16),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.green.shade200)),
                child: Row(
                  children: [
                    const Icon(Icons.stars_rounded, color: AppColors.success, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text('Incentive Slab: ${plan.incentiveSlabDescription}', style: TextStyle(fontSize: 11, color: Colors.green.shade900, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Sales Target Breakdown Card
        AppSectionCard(
          title: 'Detailed KPI Achievement Metrics',
          subtitle: 'Call coverage, order value & volume targets',
          icon: Icons.track_changes_rounded,
          child: Column(
            children: [
              _metricRow('Doctor Call Coverage Target', '${plan.doctorCallsDone} / ${plan.doctorCallTarget} Calls', plan.doctorCallAchievementPercentage, AppColors.primary),
              const SizedBox(height: 10),
              _metricRow('Chemist Counter Visit Target', '${plan.chemistCallsDone} / ${plan.chemistCallTarget} Stores', plan.chemistCallAchievementPercentage, AppColors.secondary),
              const SizedBox(height: 10),
              _metricRow('Secondary Sales Revenue', '${CurrencyFormatter.formatInr(plan.totalSalesAchieved)} / ${CurrencyFormatter.formatInr(plan.totalSalesTarget)}', plan.salesAchievementPercentage, AppColors.success),
            ],
          ),
        ),
      ],
    );
  }

  Widget _metricRow(String title, String status, double pct, Color col) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Color(0xFF334155))),
            Text(status, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: col)),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: (pct / 100).clamp(0.0, 1.0),
            backgroundColor: const Color(0xFFF1F5F9),
            valueColor: AlwaysStoppedAnimation<Color>(col),
            minHeight: 5,
          ),
        ),
      ],
    );
  }

  // TAB 2: Product-Wise Targets
  Widget _buildProductTargetsTab(TargetProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.productTargets.length,
      itemBuilder: (ctx, idx) {
        final p = provider.productTargets[idx];
        final isMet = p.isTargetMet;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: isMet ? Colors.green.shade300 : const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(p.productName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                      Text(p.category, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isMet ? AppColors.successContainer : AppColors.primaryContainer,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '${p.achievementPercentage.toStringAsFixed(1)}% ${isMet ? "🏆 Achieved" : ""}',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isMet ? AppColors.success : AppColors.primary),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Target: ${CurrencyFormatter.formatInr(p.targetAmount)} (${p.targetUnits} Units)', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                  Text('Achieved: ${CurrencyFormatter.formatInr(p.achievedAmount)} (${p.achievedUnits} Units)', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: (p.achievementPercentage / 100).clamp(0.0, 1.0),
                  backgroundColor: const Color(0xFFF1F5F9),
                  valueColor: AlwaysStoppedAnimation<Color>(isMet ? AppColors.success : const Color(0xFF009CBF)),
                  minHeight: 5,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // TAB 3: Territory Patch Targets
  Widget _buildTerritoryTargetsTab(TargetProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.territoryTargets.length,
      itemBuilder: (ctx, idx) {
        final t = provider.territoryTargets[idx];
        final isMet = t.isTargetMet;

        return AppSectionCard(
          title: t.patchName,
          subtitle: '${t.mappedDoctors} Doctors • ${t.mappedChemists} Chemists Mapped',
          icon: Icons.location_on_rounded,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Target: ${CurrencyFormatter.formatInr(t.targetAmount)}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                  Text('Achieved: ${CurrencyFormatter.formatInr(t.achievedAmount)} (${t.achievementPercentage.toStringAsFixed(1)}%)', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: isMet ? AppColors.success : AppColors.primary)),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: (t.achievementPercentage / 100).clamp(0.0, 1.0),
                  backgroundColor: const Color(0xFFF1F5F9),
                  valueColor: AlwaysStoppedAnimation<Color>(isMet ? AppColors.success : AppColors.primary),
                  minHeight: 5,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // TAB 4: Regional Sales Leaderboard
  Widget _buildLeaderboardTab(TargetProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.leaderboard.length,
      itemBuilder: (ctx, idx) {
        final item = provider.leaderboard[idx];
        final isYou = item.isCurrentMr;

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isYou ? const Color(0xFFF0FDF4) : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: isYou ? Colors.green.shade400 : const Color(0xFFE2E8F0), width: isYou ? 1.5 : 1),
            boxShadow: [
              if (isYou) BoxShadow(color: Colors.green.withValues(alpha: 0.08), blurRadius: 8, offset: const Offset(0, 2)),
            ],
          ),
          child: Row(
            children: [
              // Rank Badge
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: item.rank == 1 ? Colors.amber.shade400 : (item.rank == 2 ? const Color(0xFFE2E8F0) : const Color(0xFFF1F5F9)),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    '#${item.rank}',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: item.rank == 1 ? Colors.brown.shade900 : const Color(0xFF0F172A)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(item.mrName, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: isYou ? Colors.green.shade900 : const Color(0xFF0F172A))),
                        if (isYou) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                            decoration: BoxDecoration(color: AppColors.success, borderRadius: BorderRadius.circular(4)),
                            child: const Text('YOU', style: TextStyle(color: Colors.white, fontSize: 8.5, fontWeight: FontWeight.w900)),
                          ),
                        ],
                      ],
                    ),
                    Text('${item.territory} • ${item.badge}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('${item.achievementPercentage.toStringAsFixed(1)}%', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: item.achievementPercentage >= 100 ? AppColors.success : AppColors.primary)),
                  Text(CurrencyFormatter.formatCompactInr(item.achievedAmount), style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
