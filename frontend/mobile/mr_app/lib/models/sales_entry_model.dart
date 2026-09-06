class SalesLineItem {
  final String productId;
  final String productName;
  final String batchNo;
  final int quantity;
  final int freeQuantity;
  final double unitPrice;
  final double discountPercent;
  final double gstPercent;

  SalesLineItem({
    required this.productId,
    required this.productName,
    required this.batchNo,
    required this.quantity,
    this.freeQuantity = 0,
    required this.unitPrice,
    this.discountPercent = 0.0,
    this.gstPercent = 12.0,
  });

  double get grossAmount => quantity * unitPrice;
  double get discountAmount => grossAmount * (discountPercent / 100);
  double get taxableAmount => grossAmount - discountAmount;
  double get gstAmount => taxableAmount * (gstPercent / 100);
  double get totalAmount => taxableAmount + gstAmount;
}

class ProductSalesInvoice {
  final String id;
  final String invoiceNumber;
  final DateTime date;
  final String buyerType; // 'Chemist' or 'Stockist'
  final String buyerId;
  final String buyerName;
  final String territoryPatch;
  final List<SalesLineItem> items;
  final String? invoicePhotoName;
  final String status; // 'Billed', 'Verified', 'Pending Sync'
  final String? remarks;

  ProductSalesInvoice({
    required this.id,
    required this.invoiceNumber,
    required this.date,
    required this.buyerType,
    required this.buyerId,
    required this.buyerName,
    required this.territoryPatch,
    required this.items,
    this.invoicePhotoName,
    this.status = 'Billed',
    this.remarks,
  });

  double get grossTotal => items.fold(0.0, (sum, item) => sum + item.grossAmount);
  double get totalDiscount => items.fold(0.0, (sum, item) => sum + item.discountAmount);
  double get totalGst => items.fold(0.0, (sum, item) => sum + item.gstAmount);
  double get grandTotal => items.fold(0.0, (sum, item) => sum + item.totalAmount);
  int get totalUnits => items.fold(0, (sum, item) => sum + item.quantity);
}

class ProductWiseSalesSummary {
  final String productId;
  final String productName;
  final String molecule;
  final int unitsSold;
  final double totalRevenue;
  final double percentageShare;
  final double growthPercentage;

  ProductWiseSalesSummary({
    required this.productId,
    required this.productName,
    required this.molecule,
    required this.unitsSold,
    required this.totalRevenue,
    required this.percentageShare,
    required this.growthPercentage,
  });
}

class TerritoryWiseSalesSummary {
  final String patchName;
  final double achievedSales;
  final double targetSales;
  final int chemistsCount;
  final int stockistsCount;

  TerritoryWiseSalesSummary({
    required this.patchName,
    required this.achievedSales,
    required this.targetSales,
    required this.chemistsCount,
    required this.stockistsCount,
  });

  double get achievementPercent => (targetSales > 0) ? (achievedSales / targetSales) * 100 : 0.0;
}

class MonthlySalesTrendPoint {
  final String monthLabel;
  final double achievedAmount;
  final double targetAmount;
  final bool isCurrentMonth;

  MonthlySalesTrendPoint({
    required this.monthLabel,
    required this.achievedAmount,
    required this.targetAmount,
    this.isCurrentMonth = false,
  });
}
