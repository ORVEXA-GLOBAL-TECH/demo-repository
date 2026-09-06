class RcpaBrandComparison {
  final String ownBrandId;
  final String ownBrandName;
  final int ownBrandRxCount; // Number of Rx per month
  final double ownBrandPrice;
  final String competitorBrandName;
  final String competitorCompany;
  final int competitorRxCount;
  final double competitorPrice;

  RcpaBrandComparison({
    required this.ownBrandId,
    required this.ownBrandName,
    required this.ownBrandRxCount,
    required this.ownBrandPrice,
    required this.competitorBrandName,
    required this.competitorCompany,
    required this.competitorRxCount,
    required this.competitorPrice,
  });

  int get totalRx => ownBrandRxCount + competitorRxCount;
  double get ownMarketSharePercent => totalRx > 0 ? (ownBrandRxCount / totalRx) * 100 : 0.0;
  double get competitorMarketSharePercent => totalRx > 0 ? (competitorRxCount / totalRx) * 100 : 0.0;
}

class RcpaModel {
  final String id;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialty;
  final String chemistId;
  final String chemistShopName;
  final DateTime auditDate;
  final List<RcpaBrandComparison> comparisons;
  final String observations;

  RcpaModel({
    required this.id,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialty,
    required this.chemistId,
    required this.chemistShopName,
    required this.auditDate,
    required this.comparisons,
    this.observations = '',
  });

  int get totalOwnRx => comparisons.fold(0, (sum, c) => sum + c.ownBrandRxCount);
  int get totalCompetitorRx => comparisons.fold(0, (sum, c) => sum + c.competitorRxCount);
  double get overallMarketSharePercent {
    final total = totalOwnRx + totalCompetitorRx;
    return total > 0 ? (totalOwnRx / total) * 100 : 0.0;
  }
}
