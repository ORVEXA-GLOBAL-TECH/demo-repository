class PlannedVisitItem {
  final String entityId;
  final String entityName;
  final String entityType; // Doctor, Chemist, Stockist
  final String specialtyOrClass; // Cardiologist / Class A+ / A / B
  final String plannedObjective; // Primary Detailing / POB / RCPA Audit
  final List<String> focusProducts;
  final bool isExecuted;
  final DateTime? executedTime;

  PlannedVisitItem({
    required this.entityId,
    required this.entityName,
    required this.entityType,
    required this.specialtyOrClass,
    this.plannedObjective = 'Product Detailing & POB Booking',
    this.focusProducts = const ['CardioVasc-AM', 'GlycoNorm-M', 'LipidCare-TG'],
    this.isExecuted = false,
    this.executedTime,
  });

  PlannedVisitItem copyWith({
    String? entityId,
    String? entityName,
    String? entityType,
    String? specialtyOrClass,
    String? plannedObjective,
    List<String>? focusProducts,
    bool? isExecuted,
    DateTime? executedTime,
  }) {
    return PlannedVisitItem(
      entityId: entityId ?? this.entityId,
      entityName: entityName ?? this.entityName,
      entityType: entityType ?? this.entityType,
      specialtyOrClass: specialtyOrClass ?? this.specialtyOrClass,
      plannedObjective: plannedObjective ?? this.plannedObjective,
      focusProducts: focusProducts ?? this.focusProducts,
      isExecuted: isExecuted ?? this.isExecuted,
      executedTime: executedTime ?? this.executedTime,
    );
  }
}

class TourPlanDay {
  final String id;
  final String mrId;
  final String mrName;
  final DateTime date;
  final String dayType; // HQ, Ex-Station, Outstation, Non-Field / Conference, Sunday/Holiday
  final String patchCode; // B1, K2, S3
  final String patchName; // Route / Territory patch
  final String assignedByManager; // Rajesh Sharma (Area Sales Manager)
  final DateTime? assignedDate;
  final String status; // Approved, Assigned by Manager, Deviation Requested, Rescheduled, Completed
  final String? managerRemarks;
  final String? deviationReason;
  final DateTime? rescheduledToDate;
  final String? replacementPatch;
  final List<PlannedVisitItem> plannedVisits;
  final bool isJointWork;
  final String? jointWithManager;

  TourPlanDay({
    required this.id,
    this.mrId = 'mr_101',
    this.mrName = 'Rohan Deshmukh',
    required this.date,
    required this.dayType,
    this.patchCode = 'P-01',
    required this.patchName,
    this.assignedByManager = 'Rajesh Sharma (Area Sales Manager)',
    this.assignedDate,
    this.status = 'Approved',
    this.managerRemarks,
    this.deviationReason,
    this.rescheduledToDate,
    this.replacementPatch,
    this.plannedVisits = const [],
    this.isJointWork = false,
    this.jointWithManager,
  });

  int get totalCalls => plannedVisits.length;
  int get executedCalls => plannedVisits.where((v) => v.isExecuted).length;
  double get completionProgress => totalCalls == 0 ? 0.0 : executedCalls / totalCalls;

  bool get isApproved => status == 'Approved' || status == 'Completed';
  bool get isRejected => status == 'Rejected' || status.toLowerCase().contains('reject');
  bool get isPending => status.toLowerCase().contains('pending');
  bool get isDeviationRequested => status.toLowerCase().contains('deviation');

  TourPlanDay copyWith({
    String? id,
    String? mrId,
    String? mrName,
    DateTime? date,
    String? dayType,
    String? patchCode,
    String? patchName,
    String? assignedByManager,
    DateTime? assignedDate,
    String? status,
    String? managerRemarks,
    String? deviationReason,
    DateTime? rescheduledToDate,
    String? replacementPatch,
    List<PlannedVisitItem>? plannedVisits,
    bool? isJointWork,
    String? jointWithManager,
  }) {
    return TourPlanDay(
      id: id ?? this.id,
      mrId: mrId ?? this.mrId,
      mrName: mrName ?? this.mrName,
      date: date ?? this.date,
      dayType: dayType ?? this.dayType,
      patchCode: patchCode ?? this.patchCode,
      patchName: patchName ?? this.patchName,
      assignedByManager: assignedByManager ?? this.assignedByManager,
      assignedDate: assignedDate ?? this.assignedDate,
      status: status ?? this.status,
      managerRemarks: managerRemarks ?? this.managerRemarks,
      deviationReason: deviationReason ?? this.deviationReason,
      rescheduledToDate: rescheduledToDate ?? this.rescheduledToDate,
      replacementPatch: replacementPatch ?? this.replacementPatch,
      plannedVisits: plannedVisits ?? this.plannedVisits,
      isJointWork: isJointWork ?? this.isJointWork,
      jointWithManager: jointWithManager ?? this.jointWithManager,
    );
  }
}
