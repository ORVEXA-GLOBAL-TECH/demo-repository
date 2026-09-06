enum DoctorClass { aPlus, a, b, c }

extension DoctorClassExtension on DoctorClass {
  String get label {
    switch (this) {
      case DoctorClass.aPlus:
        return 'A+ (Super Core)';
      case DoctorClass.a:
        return 'A (Core)';
      case DoctorClass.b:
        return 'B (Secondary)';
      case DoctorClass.c:
        return 'C (Routine)';
    }
  }

  String get shortCode {
    switch (this) {
      case DoctorClass.aPlus:
        return 'A+';
      case DoctorClass.a:
        return 'A';
      case DoctorClass.b:
        return 'B';
      case DoctorClass.c:
        return 'C';
    }
  }
}

enum DoctorPracticeType {
  hospitalDoctor,
  clinicDoctor,
  pvtDoctor,
  govtDoctor,
}

extension DoctorPracticeTypeExtension on DoctorPracticeType {
  String get label {
    switch (this) {
      case DoctorPracticeType.hospitalDoctor:
        return 'Hospital Doctor';
      case DoctorPracticeType.clinicDoctor:
        return 'Clinic Doctor';
      case DoctorPracticeType.pvtDoctor:
        return 'Pvt Doctor';
      case DoctorPracticeType.govtDoctor:
        return 'Govt Doctor';
    }
  }

  String get categoryBadge {
    switch (this) {
      case DoctorPracticeType.hospitalDoctor:
        return '🏥 Hospital Doctor';
      case DoctorPracticeType.clinicDoctor:
        return '🩺 Clinic Doctor';
      case DoctorPracticeType.pvtDoctor:
        return '🏢 Pvt Doctor';
      case DoctorPracticeType.govtDoctor:
        return '🏛️ Govt Doctor';
    }
  }
}

class DoctorModel {
  final String id;
  final String name;
  final String degree; // e.g. "MBBS, MD (Cardiology)"
  final String specialty; // e.g. "Cardiologist", "Diabetologist", "Consultant Physician"
  final DoctorClass doctorClass;
  final DoctorPracticeType practiceType;
  final String clinicName;
  final String address;
  final String patch; // Route / Patch name e.g. "Central Hospital Zone Hub"
  final String phone;
  final String email;
  final String preferredTime; // e.g. "11:00 AM - 01:00 PM"
  final int plannedVisitsPerMonth;
  final int completedVisitsThisMonth;
  final double rxPotentialMonthly; // Estimated Rx potential
  final List<String> taggedProductIds;
  final List<String> keyCompetitorBrands;
  final DateTime? lastVisitedDate;
  final String? birthday;
  final String? anniversary;
  final bool isListed;
  final double latitude;
  final double longitude;

  DoctorModel({
    required this.id,
    required this.name,
    required this.degree,
    required this.specialty,
    required this.doctorClass,
    this.practiceType = DoctorPracticeType.hospitalDoctor,
    required this.clinicName,
    required this.address,
    required this.patch,
    required this.phone,
    this.email = '',
    required this.preferredTime,
    this.plannedVisitsPerMonth = 2,
    this.completedVisitsThisMonth = 0,
    this.rxPotentialMonthly = 50000,
    this.taggedProductIds = const [],
    this.keyCompetitorBrands = const [],
    this.lastVisitedDate,
    this.birthday,
    this.anniversary,
    this.isListed = true,
    this.latitude = 19.0760,
    this.longitude = 72.8777,
  });

  DoctorModel copyWith({
    String? id,
    String? name,
    String? degree,
    String? specialty,
    DoctorClass? doctorClass,
    DoctorPracticeType? practiceType,
    String? clinicName,
    String? address,
    String? patch,
    String? phone,
    String? email,
    String? preferredTime,
    int? plannedVisitsPerMonth,
    int? completedVisitsThisMonth,
    double? rxPotentialMonthly,
    List<String>? taggedProductIds,
    List<String>? keyCompetitorBrands,
    DateTime? lastVisitedDate,
    String? birthday,
    String? anniversary,
    bool? isListed,
    double? latitude,
    double? longitude,
  }) {
    return DoctorModel(
      id: id ?? this.id,
      name: name ?? this.name,
      degree: degree ?? this.degree,
      specialty: specialty ?? this.specialty,
      doctorClass: doctorClass ?? this.doctorClass,
      practiceType: practiceType ?? this.practiceType,
      clinicName: clinicName ?? this.clinicName,
      address: address ?? this.address,
      patch: patch ?? this.patch,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      preferredTime: preferredTime ?? this.preferredTime,
      plannedVisitsPerMonth: plannedVisitsPerMonth ?? this.plannedVisitsPerMonth,
      completedVisitsThisMonth: completedVisitsThisMonth ?? this.completedVisitsThisMonth,
      rxPotentialMonthly: rxPotentialMonthly ?? this.rxPotentialMonthly,
      taggedProductIds: taggedProductIds ?? this.taggedProductIds,
      keyCompetitorBrands: keyCompetitorBrands ?? this.keyCompetitorBrands,
      lastVisitedDate: lastVisitedDate ?? this.lastVisitedDate,
      birthday: birthday ?? this.birthday,
      anniversary: anniversary ?? this.anniversary,
      isListed: isListed ?? this.isListed,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
    );
  }
}
