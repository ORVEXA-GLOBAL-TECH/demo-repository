class UserModel {
  final String id;
  final String empCode;
  final String name;
  final String email;
  final String phone;
  final String emergencyContact;
  final String designation; // e.g. "Senior Medical Representative"
  final String department;  // e.g. "Cardiovascular & Specialty Care"
  final String division;    // e.g. "Ethical Pharma Division"
  final String company;     // e.g. "Alleviare Life Sciences Pvt. Ltd."
  final String dateOfJoining; // e.g. "15 March 2022"
  final String employeeStatus; // "Active", "Inactive"
  final String regionZone;  // e.g. "South-East Asia / Phnom Penh Central Zone"
  final String headquarters;// e.g. "Phnom Penh Central HQ"
  final String territory;   // e.g. "Zone 1 - Central Hospital & Beat Patches"
  final String managerName; // e.g. "Rajesh Sharma (Area Sales Manager)"
  final String managerPhone;// e.g. "+855 23 999 111"
  final String avatarUrl;

  // Punch in / Attendance state
  final bool isPunchedIn;
  final DateTime? punchInTime;
  final DateTime? punchOutTime;
  final String? punchInLocation;
  final double? startOdometerKm;
  final double? endOdometerKm;
  final String workType; // Field Work, Non-Field, Leave, Conference, Joint Work

  UserModel({
    required this.id,
    required this.empCode,
    required this.name,
    required this.email,
    required this.phone,
    this.emergencyContact = 'Sophea Chea (Spouse) • +855 12 345 678',
    required this.designation,
    this.department = 'Cardiovascular & Specialty Care',
    required this.division,
    this.company = 'Alleviare Life Sciences Pvt. Ltd.',
    this.dateOfJoining = '15 March 2022',
    this.employeeStatus = 'Active',
    this.regionZone = 'South-East Asia / Phnom Penh Central Zone',
    required this.headquarters,
    required this.territory,
    required this.managerName,
    required this.managerPhone,
    required this.avatarUrl,
    this.isPunchedIn = false,
    this.punchInTime,
    this.punchOutTime,
    this.punchInLocation,
    this.startOdometerKm,
    this.endOdometerKm,
    this.workType = 'Field Work',
  });

  UserModel copyWith({
    String? id,
    String? empCode,
    String? name,
    String? email,
    String? phone,
    String? emergencyContact,
    String? designation,
    String? department,
    String? division,
    String? company,
    String? dateOfJoining,
    String? employeeStatus,
    String? regionZone,
    String? headquarters,
    String? territory,
    String? managerName,
    String? managerPhone,
    String? avatarUrl,
    bool? isPunchedIn,
    DateTime? punchInTime,
    DateTime? punchOutTime,
    String? punchInLocation,
    double? startOdometerKm,
    double? endOdometerKm,
    String? workType,
  }) {
    return UserModel(
      id: id ?? this.id,
      empCode: empCode ?? this.empCode,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      designation: designation ?? this.designation,
      department: department ?? this.department,
      division: division ?? this.division,
      company: company ?? this.company,
      dateOfJoining: dateOfJoining ?? this.dateOfJoining,
      employeeStatus: employeeStatus ?? this.employeeStatus,
      regionZone: regionZone ?? this.regionZone,
      headquarters: headquarters ?? this.headquarters,
      territory: territory ?? this.territory,
      managerName: managerName ?? this.managerName,
      managerPhone: managerPhone ?? this.managerPhone,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      isPunchedIn: isPunchedIn ?? this.isPunchedIn,
      punchInTime: punchInTime ?? this.punchInTime,
      punchOutTime: punchOutTime ?? this.punchOutTime,
      punchInLocation: punchInLocation ?? this.punchInLocation,
      startOdometerKm: startOdometerKm ?? this.startOdometerKm,
      endOdometerKm: endOdometerKm ?? this.endOdometerKm,
      workType: workType ?? this.workType,
    );
  }
}
