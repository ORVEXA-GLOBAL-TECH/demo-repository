import 'package:flutter/material.dart';
import '../models/leave_model.dart';

class LeaveProvider extends ChangeNotifier {
  final Map<LeaveType, LeaveBalanceItem> _balances = {};
  final List<LeaveApplication> _applications = [];
  final List<LeaveNotificationItem> _notifications = [];
  final List<CompanyHolidayItem> _holidays = [];

  LeaveProvider() {
    _seedInitialLeaveData();
  }

  Map<LeaveType, LeaveBalanceItem> get balances => Map.unmodifiable(_balances);
  List<LeaveApplication> get applications => List.unmodifiable(_applications);
  List<LeaveNotificationItem> get notifications => List.unmodifiable(_notifications);
  List<CompanyHolidayItem> get holidays => List.unmodifiable(_holidays);

  int get totalAvailableLeaves =>
      _balances.values.fold(0, (sum, b) => sum + b.availableBalance);

  int get totalUsedLeaves =>
      _balances.values.fold(0, (sum, b) => sum + b.usedDays);

  int get pendingApplicationsCount =>
      _applications.where((a) => a.status == 'Pending Approval').length;

  int get unreadNotificationsCount =>
      _notifications.where((n) => !n.isRead).length;

  void applyLeave({
    required LeaveType leaveType,
    required DateTime startDate,
    required DateTime endDate,
    required int totalDays,
    bool isHalfDay = false,
    required String reason,
    String emergencyContact = '+91 98201 55432',
  }) {
    final application = LeaveApplication(
      id: 'lv_${DateTime.now().millisecondsSinceEpoch}',
      applicationNumber: 'LV-2026-${(DateTime.now().millisecondsSinceEpoch % 10000).toString().padLeft(4, "0")}',
      leaveType: leaveType,
      startDate: startDate,
      endDate: endDate,
      totalDays: totalDays,
      isHalfDay: isHalfDay,
      reason: reason,
      emergencyContact: emergencyContact,
      appliedDate: DateTime.now(),
      status: 'Pending Approval',
      approvedByManager: 'Rajesh Sharma (ASM)',
    );

    _applications.insert(0, application);

    // Update pending days in balance
    final curBal = _balances[leaveType];
    if (curBal != null) {
      _balances[leaveType] = curBal.copyWith(pendingDays: curBal.pendingDays + totalDays);
    }

    // Add notification
    _notifications.insert(
      0,
      LeaveNotificationItem(
        id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
        title: 'Leave Application Submitted',
        message: 'Your ${leaveType.displayName} for $totalDays day(s) has been forwarded to Rajesh Sharma (ASM).',
        timestamp: DateTime.now(),
        type: 'Balance',
      ),
    );

    notifyListeners();
  }

  void managerApproveLeave(String applicationId, {String? remarks}) {
    final idx = _applications.indexWhere((a) => a.id == applicationId);
    if (idx != -1) {
      final app = _applications[idx];
      _applications[idx] = app.copyWith(
        status: 'Approved',
        managerRemarks: remarks ?? 'Approved. Ensure emergency coverage and beat rescheduling.',
        actionDate: DateTime.now(),
      );

      // Deduct from pending and add to used
      final curBal = _balances[app.leaveType];
      if (curBal != null) {
        _balances[app.leaveType] = curBal.copyWith(
          pendingDays: (curBal.pendingDays - app.totalDays).clamp(0, 999),
          usedDays: curBal.usedDays + app.totalDays,
        );
      }

      // Add approval notification
      _notifications.insert(
        0,
        LeaveNotificationItem(
          id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
          title: '✅ Leave Approved by Manager',
          message: '${app.leaveType.displayName} for ${app.totalDays} day(s) approved by Rajesh Sharma (ASM).',
          timestamp: DateTime.now(),
          type: 'Approval',
        ),
      );

      notifyListeners();
    }
  }

  void managerRejectLeave(String applicationId, {required String reason}) {
    final idx = _applications.indexWhere((a) => a.id == applicationId);
    if (idx != -1) {
      final app = _applications[idx];
      _applications[idx] = app.copyWith(
        status: 'Rejected',
        managerRemarks: reason,
        actionDate: DateTime.now(),
      );

      // Revert pending days
      final curBal = _balances[app.leaveType];
      if (curBal != null) {
        _balances[app.leaveType] = curBal.copyWith(
          pendingDays: (curBal.pendingDays - app.totalDays).clamp(0, 999),
        );
      }

      // Add rejection notification
      _notifications.insert(
        0,
        LeaveNotificationItem(
          id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
          title: '❌ Leave Rejected by Manager',
          message: 'Leave (${app.applicationNumber}) rejected. Reason: $reason',
          timestamp: DateTime.now(),
          type: 'Rejection',
        ),
      );

      notifyListeners();
    }
  }

  void markNotificationRead(String notifId) {
    final idx = _notifications.indexWhere((n) => n.id == notifId);
    if (idx != -1) {
      final n = _notifications[idx];
      _notifications[idx] = LeaveNotificationItem(
        id: n.id,
        title: n.title,
        message: n.message,
        timestamp: n.timestamp,
        type: n.type,
        isRead: true,
      );
      notifyListeners();
    }
  }

  void _seedInitialLeaveData() {
    final now = DateTime.now();

    // 1. Leave Balances
    _balances[LeaveType.casual] = LeaveBalanceItem(leaveType: LeaveType.casual, totalQuota: 12, usedDays: 4, pendingDays: 1);
    _balances[LeaveType.sick] = LeaveBalanceItem(leaveType: LeaveType.sick, totalQuota: 10, usedDays: 2, pendingDays: 0);
    _balances[LeaveType.paid] = LeaveBalanceItem(leaveType: LeaveType.paid, totalQuota: 15, usedDays: 3, pendingDays: 0);
    _balances[LeaveType.emergency] = LeaveBalanceItem(leaveType: LeaveType.emergency, totalQuota: 5, usedDays: 1, pendingDays: 0);

    // 2. Initial Leave Applications
    _applications.addAll([
      LeaveApplication(
        id: 'lv_01',
        applicationNumber: 'LV-2026-8812',
        leaveType: LeaveType.casual,
        startDate: now.add(const Duration(days: 4)),
        endDate: now.add(const Duration(days: 4)),
        totalDays: 1,
        reason: 'Personal family event in Pune. DCR coverage pre-planned.',
        appliedDate: now.subtract(const Duration(hours: 3)),
        status: 'Pending Approval',
        approvedByManager: 'Rajesh Sharma (ASM)',
      ),
      LeaveApplication(
        id: 'lv_02',
        applicationNumber: 'LV-2026-8740',
        leaveType: LeaveType.sick,
        startDate: now.subtract(const Duration(days: 6)),
        endDate: now.subtract(const Duration(days: 5)),
        totalDays: 2,
        reason: 'Viral fever and medical rest advised by physician.',
        appliedDate: now.subtract(const Duration(days: 7)),
        status: 'Approved',
        approvedByManager: 'Rajesh Sharma (ASM)',
        managerRemarks: 'Approved with medical certificate.',
        actionDate: now.subtract(const Duration(days: 6)),
      ),
      LeaveApplication(
        id: 'lv_03',
        applicationNumber: 'LV-2026-8610',
        leaveType: LeaveType.paid,
        startDate: now.subtract(const Duration(days: 20)),
        endDate: now.subtract(const Duration(days: 18)),
        totalDays: 3,
        reason: 'Annual family vacation trip.',
        appliedDate: now.subtract(const Duration(days: 25)),
        status: 'Approved',
        approvedByManager: 'Rajesh Sharma (ASM)',
        managerRemarks: 'Approved. Advance beat plans completed.',
        actionDate: now.subtract(const Duration(days: 22)),
      ),
      LeaveApplication(
        id: 'lv_04',
        applicationNumber: 'LV-2026-8502',
        leaveType: LeaveType.casual,
        startDate: now.subtract(const Duration(days: 35)),
        endDate: now.subtract(const Duration(days: 35)),
        totalDays: 1,
        reason: 'Urgent banking work.',
        appliedDate: now.subtract(const Duration(days: 36)),
        status: 'Rejected',
        approvedByManager: 'Rajesh Sharma (ASM)',
        managerRemarks: 'Rejected due to scheduled regional product launch review on that date.',
        actionDate: now.subtract(const Duration(days: 35)),
      ),
    ]);

    // 3. Notifications
    _notifications.addAll([
      LeaveNotificationItem(
        id: 'notif_1',
        title: '✅ Sick Leave Approved',
        message: 'Your 2-day Sick Leave (LV-2026-8740) was approved by Rajesh Sharma (ASM).',
        timestamp: now.subtract(const Duration(days: 6)),
        type: 'Approval',
        isRead: false,
      ),
      LeaveNotificationItem(
        id: 'notif_2',
        title: '🏖️ Upcoming Company Holiday',
        message: 'Upcoming Statutory Holiday: Aug 15, 2026 (Independence Day - Field Off).',
        timestamp: now.subtract(const Duration(days: 4)),
        type: 'Holiday',
        isRead: false,
      ),
      LeaveNotificationItem(
        id: 'notif_3',
        title: '📊 Mid-Year Leave Balance Audit',
        message: 'You have 24 total available leave days remaining in FY 2026-27.',
        timestamp: now.subtract(const Duration(days: 10)),
        type: 'Balance',
        isRead: true,
      ),
    ]);

    // 4. Company Holidays Calendar
    _holidays.addAll([
      CompanyHolidayItem(
        holidayName: 'Independence Day',
        date: DateTime(2026, 8, 15),
        dayOfWeek: 'Saturday',
        type: 'Mandatory National',
      ),
      CompanyHolidayItem(
        holidayName: 'Ganesh Chaturthi',
        date: DateTime(2026, 9, 14),
        dayOfWeek: 'Monday',
        type: 'Regional Festival (Maharashtra)',
      ),
      CompanyHolidayItem(
        holidayName: 'Mahatma Gandhi Jayanti',
        date: DateTime(2026, 10, 2),
        dayOfWeek: 'Friday',
        type: 'Mandatory National',
      ),
      CompanyHolidayItem(
        holidayName: 'Dussehra (Vijayadashami)',
        date: DateTime(2026, 10, 20),
        dayOfWeek: 'Tuesday',
        type: 'National Festival',
      ),
      CompanyHolidayItem(
        holidayName: 'Diwali (Laxmi Pujan)',
        date: DateTime(2026, 11, 8),
        dayOfWeek: 'Sunday',
        type: 'National Festival',
      ),
      CompanyHolidayItem(
        holidayName: 'Christmas Day',
        date: DateTime(2026, 12, 25),
        dayOfWeek: 'Friday',
        type: 'Mandatory National',
      ),
    ]);
  }
}
