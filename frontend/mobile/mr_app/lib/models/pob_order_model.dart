class OrderItem {
  final String productId;
  final String brandName;
  final String packing;
  final double ptr;
  final int quantity;
  final int freeQuantity; // From scheme (e.g. 10 + 1 free)
  final double discountPercent;
  final double gstPercent;

  OrderItem({
    required this.productId,
    required this.brandName,
    required this.packing,
    required this.ptr,
    required this.quantity,
    this.freeQuantity = 0,
    this.discountPercent = 0.0,
    this.gstPercent = 12.0,
  });

  double get subtotal => quantity * ptr;
  double get discountAmount => subtotal * (discountPercent / 100);
  double get taxableAmount => subtotal - discountAmount;
  double get gstAmount => taxableAmount * (gstPercent / 100);
  double get totalAmount => taxableAmount + gstAmount;

  OrderItem copyWith({
    String? productId,
    String? brandName,
    String? packing,
    double? ptr,
    int? quantity,
    int? freeQuantity,
    double? discountPercent,
    double? gstPercent,
  }) {
    return OrderItem(
      productId: productId ?? this.productId,
      brandName: brandName ?? this.brandName,
      packing: packing ?? this.packing,
      ptr: ptr ?? this.ptr,
      quantity: quantity ?? this.quantity,
      freeQuantity: freeQuantity ?? this.freeQuantity,
      discountPercent: discountPercent ?? this.discountPercent,
      gstPercent: gstPercent ?? this.gstPercent,
    );
  }
}

class PobOrderModel {
  final String id;
  final String orderNumber;
  final String chemistId;
  final String chemistName;
  final String chemistShopName;
  final String stockistId;
  final String stockistAgencyName;
  final DateTime orderDate;
  final List<OrderItem> items;
  final String status; // Pending, Forwarded to Stockist, Dispatched, Delivered, Cancelled
  final String paymentTerms; // Cash, 15 Days Credit, 30 Days Credit
  final String remarks;

  PobOrderModel({
    required this.id,
    required this.orderNumber,
    required this.chemistId,
    required this.chemistName,
    required this.chemistShopName,
    required this.stockistId,
    required this.stockistAgencyName,
    required this.orderDate,
    required this.items,
    this.status = 'Forwarded to Stockist',
    this.paymentTerms = '15 Days Credit',
    this.remarks = '',
  });

  double get totalItemsCount => items.fold(0, (sum, item) => sum + item.quantity);
  double get totalFreeItemsCount => items.fold(0, (sum, item) => sum + item.freeQuantity);
  double get subtotal => items.fold(0, (sum, item) => sum + item.subtotal);
  double get totalDiscount => items.fold(0, (sum, item) => sum + item.discountAmount);
  double get totalGst => items.fold(0, (sum, item) => sum + item.gstAmount);
  double get grandTotal => items.fold(0, (sum, item) => sum + item.totalAmount);
}
