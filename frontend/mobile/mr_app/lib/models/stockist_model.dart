class StockistModel {
  final String id;
  final String name; // Contact person
  final String agencyName; // e.g. "Apex Pharma Distributors"
  final String address;
  final String phone;
  final String email;
  final String gstNumber;
  final double creditLimit;
  final double outstandingBalance;
  final int paymentTermsDays;
  final DateTime? lastVisitedDate;

  StockistModel({
    required this.id,
    required this.name,
    required this.agencyName,
    required this.address,
    required this.phone,
    required this.email,
    required this.gstNumber,
    this.creditLimit = 500000,
    this.outstandingBalance = 85000,
    this.paymentTermsDays = 21,
    this.lastVisitedDate,
  });

  StockistModel copyWith({
    String? id,
    String? name,
    String? agencyName,
    String? address,
    String? phone,
    String? email,
    String? gstNumber,
    double? creditLimit,
    double? outstandingBalance,
    int? paymentTermsDays,
    DateTime? lastVisitedDate,
  }) {
    return StockistModel(
      id: id ?? this.id,
      name: name ?? this.name,
      agencyName: agencyName ?? this.agencyName,
      address: address ?? this.address,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      gstNumber: gstNumber ?? this.gstNumber,
      creditLimit: creditLimit ?? this.creditLimit,
      outstandingBalance: outstandingBalance ?? this.outstandingBalance,
      paymentTermsDays: paymentTermsDays ?? this.paymentTermsDays,
      lastVisitedDate: lastVisitedDate ?? this.lastVisitedDate,
    );
  }
}
