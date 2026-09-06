enum LeaveType {
  casual,
  sick,
  paid,
  emergency,
}

extension LeaveTypeExtension on LeaveType {
  String get displayName {
    switch (this) {
      case LeaveType.casual:
        return 'Casual Leave (CL)';
      case LeaveType.sick:
        return 'Sick Leave (SL)';
      case LeaveType.paid:
        return 'Paid Leave (PL)';
      case LeaveType.emergency:
        return 'Emergency Leave (EL)';
    }
  }

  String get shortCode {
    switch (this) {
      case LeaveType.casual:
        return 'CL';
      case LeaveType.sick:
        return 'SL';
      case LeaveType.paid:
        return 'PL';
      case LeaveType.emergency:
        return 'EL';
    }
  }
}

class LeaveBalanceItem {
  final LeaveType leaveType;
  final int totalQuota;
  final int usedDays;
  final int pendingDays;

  LeaveBalanceItem({
    required this.leaveType,
    required this.totalQuota,
    required this.usedDays,
    this.pendingDays = 0,
  });

  int get availableBalance => totalQuota - usedDays - pendingDays;

  LeaveBalanceItem copyWith({
    LeaveType? leaveType,
    int? totalQuota,
    int? usedDays,
    int? pendingDays,
  }) {
    return LeaveBalanceItem(
      leaveType: leaveType ?? this.leaveType,
      totalQuota: totalQuota ?? this.totalQuota,
      usedDays: usedDays ?? this.usedDays,
      pendingDays: pendingDays ?? this.pendingDays,
    );
  }
}

class LeaveApplication {
  final String id;
  final String applicationNumber;
  final LeaveType leaveType;
  final DateTime startDate;
  final DateTime endDate;
  final int totalDays;
  final bool isHalfDay;
  final String reason;
  final String emergencyContact;
  final DateTime appliedDate;
  final String status; // 'Pending Approval', 'Approved', 'Rejected', 'Cancelled'
  final String? approvedByManager;
  final String? managerRemarks;
  final DateTime? actionDate;

  LeaveApplication({
    required this.id,
    required this.applicationNumber,
    required this.leaveType,
    required this.startDate,
    required this.endDate,
    required this.totalDays,
    this.isHalfDay = false,
    required this.reason,
    this.emergencyContact = '+91 98201 55432',
    required this.appliedDate,
    this.status = 'Pending Approval',
    this.approvedByManager = 'Rajesh Sharma (ASM)',
    this.managerRemarks,
    this.actionDate,
  });

  LeaveApplication copyWith({
    String? id,
    String? applicationNumber,
    LeaveType? leaveType,
    DateTime? startDate,
    DateTime? endDate,
    int? totalDays,
    bool? isHalfDay,
    String? reason,
    String? emergencyContact,
    DateTime? appliedDate,
    String? status,
    String? approvedByManager,
    String? managerRemarks,
    DateTime? actionDate,
  }) {
    return LeaveApplication(
      id: id ?? this.id,
      applicationNumber: applicationNumber ?? this.applicationNumber,
      leaveType: leaveType ?? this.leaveType,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      totalDays: totalDays ?? this.totalDays,
      isHalfDay: isHalfDay ?? this.isHalfDay,
      reason: reason ?? this.reason,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      appliedDate: appliedDate ?? this.appliedDate,
      status: status ?? this.status,
      approvedByManager: approvedByManager ?? this.approvedByManager,
      managerRemarks: managerRemarks ?? this.managerRemarks,
      actionDate: actionDate ?? this.actionDate,
    );
  }
}

class LeaveNotificationItem {
  final String id;
  final String title;
  final String message;
  final DateTime timestamp;
  final String type; // 'Approval', 'Rejection', 'Holiday', 'Balance'
  final bool isRead;

  LeaveNotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.timestamp,
    required this.type,
    this.isRead = false,
  });
}

class CompanyHolidayItem {
  final String holidayName;
  final DateTime date;
  final String dayOfWeek;
  final String type; // 'Mandatory National', 'Regional Festival'

  CompanyHolidayItem({
    required this.holidayName,
    required this.date,
    required this.dayOfWeek,
    this.type = 'Mandatory National',
  });
}
