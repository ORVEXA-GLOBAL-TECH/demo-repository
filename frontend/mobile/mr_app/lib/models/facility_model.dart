enum FacilitySector { private, government, trust }

enum FacilityCategory {
  clinic,
  hospital,
  polyClinic,
  nursingHome,
  govtDispensary,
  medicalCollege,
}

extension FacilitySectorExt on FacilitySector {
  String get label {
    switch (this) {
      case FacilitySector.private:
        return 'Private';
      case FacilitySector.government:
        return 'Government';
      case FacilitySector.trust:
        return 'Trust / Semi-Govt';
    }
  }
}

extension FacilityCategoryExt on FacilityCategory {
  String get label {
    switch (this) {
      case FacilityCategory.clinic:
        return 'Private Clinic';
      case FacilityCategory.hospital:
        return 'Multi-Specialty Hospital';
      case FacilityCategory.polyClinic:
        return 'Poly-Clinic';
      case FacilityCategory.nursingHome:
        return 'Nursing Home';
      case FacilityCategory.govtDispensary:
        return 'Govt PHC / Dispensary';
      case FacilityCategory.medicalCollege:
        return 'Medical College Hospital';
    }
  }
}

class FacilityModel {
  final String id;
  final String name; // Facility name e.g. "Royal Phnom Penh Hospital" or "Ang Duong Poly Clinic"
  final FacilityCategory category;
  final FacilitySector sector;
  final String address;
  final String patch; // Beat / Route
  final String phone;
  final String contactPerson; // e.g. Dr. Superintendent / Purchase In-charge
  final String designation; // e.g. "Chief Medical Officer", "Hospital Administrator"
  final int totalBeds;
  final List<String> visitingDoctorNames;
  final double monthlyPotential;
  final DateTime? lastVisitedDate;
  final bool isListed;
  final String notes;

  FacilityModel({
    required this.id,
    required this.name,
    required this.category,
    required this.sector,
    required this.address,
    required this.patch,
    required this.phone,
    required this.contactPerson,
    required this.designation,
    this.totalBeds = 25,
    this.visitingDoctorNames = const [],
    this.monthlyPotential = 80000,
    this.lastVisitedDate,
    this.isListed = true,
    this.notes = '',
  });

  FacilityModel copyWith({
    String? id,
    String? name,
    FacilityCategory? category,
    FacilitySector? sector,
    String? address,
    String? patch,
    String? phone,
    String? contactPerson,
    String? designation,
    int? totalBeds,
    List<String>? visitingDoctorNames,
    double? monthlyPotential,
    DateTime? lastVisitedDate,
    bool? isListed,
    String? notes,
  }) {
    return FacilityModel(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      sector: sector ?? this.sector,
      address: address ?? this.address,
      patch: patch ?? this.patch,
      phone: phone ?? this.phone,
      contactPerson: contactPerson ?? this.contactPerson,
      designation: designation ?? this.designation,
      totalBeds: totalBeds ?? this.totalBeds,
      visitingDoctorNames: visitingDoctorNames ?? this.visitingDoctorNames,
      monthlyPotential: monthlyPotential ?? this.monthlyPotential,
      lastVisitedDate: lastVisitedDate ?? this.lastVisitedDate,
      isListed: isListed ?? this.isListed,
      notes: notes ?? this.notes,
    );
  }
}
