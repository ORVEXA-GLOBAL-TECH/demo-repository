class ProductTargetItem {
  final String productId;
  final String productName;
  final String category;
  final double targetAmount;
  final double achievedAmount;
  final int targetUnits;
  final int achievedUnits;

  ProductTargetItem({
    required this.productId,
    required this.productName,
    required this.category,
    required this.targetAmount,
    required this.achievedAmount,
    required this.targetUnits,
    required this.achievedUnits,
  });

  double get achievementPercentage => targetAmount > 0 ? (achievedAmount / targetAmount) * 100 : 0.0;
  double get remainingAmount => (targetAmount - achievedAmount).clamp(0.0, double.infinity);
  bool get isTargetMet => achievedAmount >= targetAmount;
}

class TerritoryTargetItem {
  final String patchId;
  final String patchName;
  final int mappedDoctors;
  final int mappedChemists;
  final double targetAmount;
  final double achievedAmount;

  TerritoryTargetItem({
    required this.patchId,
    required this.patchName,
    required this.mappedDoctors,
    required this.mappedChemists,
    required this.targetAmount,
    required this.achievedAmount,
  });

  double get achievementPercentage => targetAmount > 0 ? (achievedAmount / targetAmount) * 100 : 0.0;
  double get remainingAmount => (targetAmount - achievedAmount).clamp(0.0, double.infinity);
  bool get isTargetMet => achievedAmount >= targetAmount;
}

class LeaderboardRankItem {
  final int rank;
  final String mrName;
  final String territory;
  final double targetAmount;
  final double achievedAmount;
  final double achievementPercentage;
  final bool isCurrentMr;
  final String badge;

  LeaderboardRankItem({
    required this.rank,
    required this.mrName,
    required this.territory,
    required this.targetAmount,
    required this.achievedAmount,
    required this.achievementPercentage,
    this.isCurrentMr = false,
    this.badge = 'Star Performer',
  });
}

class TargetPlanSummary {
  final String periodName; // "August 2026", "Q2 FY2026-27", "Annual FY2026-27"
  final String assignedByManagerName; // "Rajesh Sharma (ASM)"
  final DateTime assignedDate;
  final double totalSalesTarget;
  final double totalSalesAchieved;
  final int doctorCallTarget;
  final int doctorCallsDone;
  final int chemistCallTarget;
  final int chemistCallsDone;
  final double pobOrderTarget;
  final double pobOrdersBooked;
  final String managerStrategyNotes;
  final String incentiveSlabDescription;

  TargetPlanSummary({
    required this.periodName,
    required this.assignedByManagerName,
    required this.assignedDate,
    required this.totalSalesTarget,
    required this.totalSalesAchieved,
    required this.doctorCallTarget,
    required this.doctorCallsDone,
    required this.chemistCallTarget,
    required this.chemistCallsDone,
    required this.pobOrderTarget,
    required this.pobOrdersBooked,
    required this.managerStrategyNotes,
    required this.incentiveSlabDescription,
  });

  double get salesAchievementPercentage => totalSalesTarget > 0 ? (totalSalesAchieved / totalSalesTarget) * 100 : 0.0;
  double get doctorCallAchievementPercentage => doctorCallTarget > 0 ? (doctorCallsDone / doctorCallTarget) * 100 : 0.0;
  double get chemistCallAchievementPercentage => chemistCallTarget > 0 ? (chemistCallsDone / chemistCallTarget) * 100 : 0.0;
  double get remainingSalesTarget => (totalSalesTarget - totalSalesAchieved).clamp(0.0, double.infinity);
}
