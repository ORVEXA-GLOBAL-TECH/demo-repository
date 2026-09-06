class ChemistModel {
  final String id;
  final String name; // Contact person
  final String shopName; // Pharmacy / Chemist Store name
  final String address;
  final String patch;
  final String phone;
  final String drugLicenseNo;
  final String mappedStockistId;
  final String mappedStockistName;
  final List<String> keyPrescribingDoctorIds;
  final double avgMonthlyOrderValue;
  final DateTime? lastVisitedDate;
  final bool isListed;
  final double latitude;
  final double longitude;

  ChemistModel({
    required this.id,
    required this.name,
    required this.shopName,
    required this.address,
    required this.patch,
    required this.phone,
    required this.drugLicenseNo,
    required this.mappedStockistId,
    required this.mappedStockistName,
    this.keyPrescribingDoctorIds = const [],
    this.avgMonthlyOrderValue = 35000,
    this.lastVisitedDate,
    this.isListed = true,
    this.latitude = 19.0760,
    this.longitude = 72.8777,
  });

  ChemistModel copyWith({
    String? id,
    String? name,
    String? shopName,
    String? address,
    String? patch,
    String? phone,
    String? drugLicenseNo,
    String? mappedStockistId,
    String? mappedStockistName,
    List<String>? keyPrescribingDoctorIds,
    double? avgMonthlyOrderValue,
    DateTime? lastVisitedDate,
    bool? isListed,
    double? latitude,
    double? longitude,
  }) {
    return ChemistModel(
      id: id ?? this.id,
      name: name ?? this.name,
      shopName: shopName ?? this.shopName,
      address: address ?? this.address,
      patch: patch ?? this.patch,
      phone: phone ?? this.phone,
      drugLicenseNo: drugLicenseNo ?? this.drugLicenseNo,
      mappedStockistId: mappedStockistId ?? this.mappedStockistId,
      mappedStockistName: mappedStockistName ?? this.mappedStockistName,
      keyPrescribingDoctorIds: keyPrescribingDoctorIds ?? this.keyPrescribingDoctorIds,
      avgMonthlyOrderValue: avgMonthlyOrderValue ?? this.avgMonthlyOrderValue,
      lastVisitedDate: lastVisitedDate ?? this.lastVisitedDate,
      isListed: isListed ?? this.isListed,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
    );
  }
}
