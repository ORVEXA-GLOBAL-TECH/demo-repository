import 'package:flutter/material.dart';
import '../models/target_model.dart';

class TargetProvider extends ChangeNotifier {
  late TargetPlanSummary _monthlyTarget;
  late TargetPlanSummary _quarterlyTarget;
  late TargetPlanSummary _annualTarget;

  final List<ProductTargetItem> _productTargets = [];
  final List<TerritoryTargetItem> _territoryTargets = [];
  final List<LeaderboardRankItem> _leaderboard = [];

  TargetProvider() {
    _seedInitialTargets();
  }

  TargetPlanSummary get monthlyTarget => _monthlyTarget;
  TargetPlanSummary get quarterlyTarget => _quarterlyTarget;
  TargetPlanSummary get annualTarget => _annualTarget;

  List<ProductTargetItem> get productTargets => List.unmodifiable(_productTargets);
  List<TerritoryTargetItem> get territoryTargets => List.unmodifiable(_territoryTargets);
  List<LeaderboardRankItem> get leaderboard => List.unmodifiable(_leaderboard);

  int get currentMrLeaderboardRank {
    final idx = _leaderboard.indexWhere((r) => r.isCurrentMr);
    return idx != -1 ? _leaderboard[idx].rank : 2;
  }

  void _seedInitialTargets() {
    _monthlyTarget = TargetPlanSummary(
      periodName: 'August 2026 (Monthly Target)',
      assignedByManagerName: 'Rajesh Sharma (ASM - Mumbai West)',
      assignedDate: DateTime(2026, 8, 1),
      totalSalesTarget: 5000.0,
      totalSalesAchieved: 4870.0,
      doctorCallTarget: 160,
      doctorCallsDone: 142,
      chemistCallTarget: 50,
      chemistCallsDone: 48,
      pobOrderTarget: 1800.0,
      pobOrdersBooked: 1725.0,
      managerStrategyNotes: 'Focus on CardioVasc-AM and GlycoSmart-D10 in Phnom Penh Central Zone KOL cardiologists to cross the \$5,000 milestone before month-end.',
      incentiveSlabDescription: '100% Target Hit = \$250 Cash Incentive + 105% Super-Achiever Club Bonus.',
    );

    _quarterlyTarget = TargetPlanSummary(
      periodName: 'Q2 FY2026-27 (Jul - Sep)',
      assignedByManagerName: 'Dr. Chan Sopheap (RSM - Cambodia)',
      assignedDate: DateTime(2026, 7, 1),
      totalSalesTarget: 15000.0,
      totalSalesAchieved: 14220.0,
      doctorCallTarget: 480,
      doctorCallsDone: 456,
      chemistCallTarget: 150,
      chemistCallsDone: 144,
      pobOrderTarget: 5400.0,
      pobOrdersBooked: 5120.0,
      managerStrategyNotes: 'Territory Q2 target tracking at 94.8%. Strong performance in Daun Penh and Toul Kork patches.',
      incentiveSlabDescription: 'Quarterly Mega Incentive: \$750 on achieving 100% cumulative quarterly secondary sales.',
    );

    _annualTarget = TargetPlanSummary(
      periodName: 'Annual FY2026-27 (Apr 2026 - Mar 2027)',
      assignedByManagerName: 'Regional Head Office (SE Asia)',
      assignedDate: DateTime(2026, 4, 1),
      totalSalesTarget: 60000.0,
      totalSalesAchieved: 24800.0,
      doctorCallTarget: 1920,
      doctorCallsDone: 810,
      chemistCallTarget: 600,
      chemistCallsDone: 258,
      pobOrderTarget: 21600.0,
      pobOrdersBooked: 9140.0,
      managerStrategyNotes: 'Annual growth target set at +22% YoY. Phnom Penh Central HQ projected to be in Top 3 HQs regionally.',
      incentiveSlabDescription: 'Annual Regional Conclave Trip (Japan) for Annual 100%+ achievers.',
    );

    _productTargets.addAll([
      ProductTargetItem(
        productId: 'prod_1',
        productName: 'CardioVasc-AM',
        category: 'Cardiology',
        targetAmount: 1900.0,
        achievedAmount: 1850.0,
        targetUnits: 1200,
        achievedUnits: 1140,
      ),
      ProductTargetItem(
        productId: 'prod_2',
        productName: 'GlycoSmart-D10',
        category: 'Diabetology',
        targetAmount: 1250.0,
        achievedAmount: 1200.0,
        targetUnits: 900,
        achievedUnits: 860,
      ),
      ProductTargetItem(
        productId: 'prod_3',
        productName: 'Neurolin-Plus',
        category: 'Neurology',
        targetAmount: 1000.0,
        achievedAmount: 950.0,
        targetUnits: 650,
        achievedUnits: 615,
      ),
      ProductTargetItem(
        productId: 'prod_4',
        productName: 'GastroShield-D',
        category: 'Gastroenterology',
        targetAmount: 550.0,
        achievedAmount: 550.0,
        targetUnits: 500,
        achievedUnits: 500,
      ),
      ProductTargetItem(
        productId: 'prod_5',
        productName: 'PulmoClear-Mont',
        category: 'Pulmonology',
        targetAmount: 300.0,
        achievedAmount: 320.0,
        targetUnits: 300,
        achievedUnits: 320,
      ),
    ]);

    _territoryTargets.addAll([
      TerritoryTargetItem(
        patchId: 'patch_a',
        patchName: 'Phnom Penh Central Patch A (Super Core)',
        mappedDoctors: 58,
        mappedChemists: 18,
        targetAmount: 2200.0,
        achievedAmount: 2100.0,
      ),
      TerritoryTargetItem(
        patchId: 'patch_b',
        patchName: 'Daun Penh Medical Patch B (Core)',
        mappedDoctors: 44,
        mappedChemists: 14,
        targetAmount: 1700.0,
        achievedAmount: 1650.0,
      ),
      TerritoryTargetItem(
        patchId: 'patch_c',
        patchName: 'Toul Kork Commercial Patch C (Commercial)',
        mappedDoctors: 38,
        mappedChemists: 12,
        targetAmount: 1100.0,
        achievedAmount: 1120.0,
      ),
    ]);

    _leaderboard.addAll([
      LeaderboardRankItem(
        rank: 1,
        mrName: 'Sophea Lim',
        territory: 'Siem Reap HQ',
        targetAmount: 5200.0,
        achievedAmount: 5418.0,
        achievementPercentage: 104.2,
        isCurrentMr: false,
        badge: '👑 Gold Champion',
      ),
      LeaderboardRankItem(
        rank: 2,
        mrName: 'Sokha Chea',
        territory: 'Phnom Penh Central HQ (You)',
        targetAmount: 5000.0,
        achievedAmount: 4870.0,
        achievementPercentage: 97.4,
        isCurrentMr: true,
        badge: '🥈 Silver Runner-Up',
      ),
      LeaderboardRankItem(
        rank: 3,
        mrName: 'Dara Vong',
        territory: 'Battambang HQ',
        targetAmount: 4800.0,
        achievedAmount: 4598.0,
        achievementPercentage: 95.8,
        isCurrentMr: false,
        badge: '🥉 Bronze Achiever',
      ),
      LeaderboardRankItem(
        rank: 4,
        mrName: 'Kosal Meas',
        territory: 'Sihanoukville HQ',
        targetAmount: 4500.0,
        achievedAmount: 4185.0,
        achievementPercentage: 93.0,
        isCurrentMr: false,
        badge: '⭐ Star Performer',
      ),
      LeaderboardRankItem(
        rank: 5,
        mrName: 'Chann Vathana',
        territory: 'Kampot HQ',
        targetAmount: 4200.0,
        achievedAmount: 3720.0,
        achievementPercentage: 88.5,
        isCurrentMr: false,
        badge: '📈 Rising Star',
      ),
    ]);
  }
}
