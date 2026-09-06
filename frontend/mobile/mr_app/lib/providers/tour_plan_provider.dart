import 'package:flutter/material.dart';
import '../models/tour_plan_model.dart';
import '../services/mock_data_service.dart';

enum TourPlanViewMode { perDay, perWeek, perMonth, history }

class TourPlanProvider extends ChangeNotifier {
  final List<TourPlanDay> _tourPlans = MockDataService.getTourPlans();
  TourPlanViewMode _viewMode = TourPlanViewMode.perDay;
  DateTime _selectedDate = DateTime.now();

  List<TourPlanDay> get tourPlans => _tourPlans;
  TourPlanViewMode get viewMode => _viewMode;
  DateTime get selectedDate => _selectedDate;

  void setViewMode(TourPlanViewMode mode) {
    _viewMode = mode;
    notifyListeners();
  }

  void setSelectedDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
  }

  /// All Plans History (sorted newest first)
  List<TourPlanDay> get allPlansHistory {
    final list = List<TourPlanDay>.from(_tourPlans);
    list.sort((a, b) => b.date.compareTo(a.date));
    return list;
  }

  /// Day View Plan (Matching selected date)
  TourPlanDay? get selectedDayPlan {
    try {
      return _tourPlans.firstWhere(
        (plan) =>
            plan.date.year == _selectedDate.year &&
            plan.date.month == _selectedDate.month &&
            plan.date.day == _selectedDate.day,
      );
    } catch (_) {
      return null;
    }
  }

  /// Weekly Plans (Monday to Sunday for selected date's week)
  List<TourPlanDay> get currentWeekPlans {
    final startOfWeek = _selectedDate.subtract(Duration(days: _selectedDate.weekday - 1));
    final endOfWeek = startOfWeek.add(const Duration(days: 6));

    return _tourPlans.where((plan) {
      final pDate = DateTime(plan.date.year, plan.date.month, plan.date.day);
      final sDate = DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day);
      final eDate = DateTime(endOfWeek.year, endOfWeek.month, endOfWeek.day);
      return !pDate.isBefore(sDate) && !pDate.isAfter(eDate);
    }).toList()
      ..sort((a, b) => a.date.compareTo(b.date));
  }

  /// Monthly Plans (All plans in selected month)
  List<TourPlanDay> get currentMonthPlans {
    return _tourPlans.where((plan) {
      return plan.date.year == _selectedDate.year && plan.date.month == _selectedDate.month;
    }).toList()
      ..sort((a, b) => a.date.compareTo(b.date));
  }

  TourPlanDay? get todayPlan {
    final now = DateTime.now();
    try {
      return _tourPlans.firstWhere(
        (plan) => plan.date.year == now.year && plan.date.month == now.month && plan.date.day == now.day,
      );
    } catch (_) {
      return _tourPlans.isNotEmpty ? _tourPlans.first : null;
    }
  }

  /// MR Submits/Schedules a New Tour Plan (Status: Pending ASM Approval)
  void scheduleTourPlanByMr({
    required DateTime date,
    required String patchCode,
    required String patchName,
    required String dayType,
    required List<PlannedVisitItem> visits,
    String? mrRemarks,
    bool isJointWork = false,
  }) {
    final newPlan = TourPlanDay(
      id: 'tp_mr_${DateTime.now().millisecondsSinceEpoch}',
      mrId: 'mr_101',
      mrName: 'G Anand',
      date: date,
      dayType: dayType,
      patchCode: patchCode,
      patchName: patchName,
      assignedByManager: 'Self-Scheduled (Awaiting ASM Review)',
      assignedDate: DateTime.now(),
      status: 'Pending Manager Approval',
      managerRemarks: mrRemarks ?? 'Submitted by MR for upcoming month/week schedule approval',
      plannedVisits: visits,
      isJointWork: isJointWork,
      jointWithManager: isJointWork ? 'Rajesh Sharma (ASM)' : null,
    );

    final existingIndex = _tourPlans.indexWhere((p) =>
        p.date.year == date.year &&
        p.date.month == date.month &&
        p.date.day == date.day);

    if (existingIndex != -1) {
      _tourPlans[existingIndex] = newPlan;
    } else {
      _tourPlans.add(newPlan);
      _tourPlans.sort((a, b) => a.date.compareTo(b.date));
    }
    notifyListeners();
  }

  /// MR Edits & Resubmits a Rejected / Pending Tour Plan
  void resubmitTourPlan({
    required String planId,
    required DateTime date,
    required String patchCode,
    required String patchName,
    required String dayType,
    required List<PlannedVisitItem> visits,
    String? mrRemarks,
    bool isJointWork = false,
  }) {
    final index = _tourPlans.indexWhere((p) => p.id == planId);
    if (index != -1) {
      final old = _tourPlans[index];
      _tourPlans[index] = old.copyWith(
        date: date,
        patchCode: patchCode,
        patchName: patchName,
        dayType: dayType,
        plannedVisits: visits,
        status: 'Pending Manager Approval',
        managerRemarks: mrRemarks != null && mrRemarks.isNotEmpty
            ? 'Resubmitted by MR: $mrRemarks'
            : 'Resubmitted with revised route and customer targets for ASM approval',
        assignedByManager: 'Self-Scheduled (Awaiting ASM Review)',
        assignedDate: DateTime.now(),
        isJointWork: isJointWork,
        jointWithManager: isJointWork ? 'Rajesh Sharma (ASM)' : null,
      );
      notifyListeners();
    } else {
      scheduleTourPlanByMr(
        date: date,
        patchCode: patchCode,
        patchName: patchName,
        dayType: dayType,
        visits: visits,
        mrRemarks: mrRemarks,
        isJointWork: isJointWork,
      );
    }
  }

  /// Update entire TourPlanDay object
  void updateTourPlan(TourPlanDay updatedPlan) {
    final index = _tourPlans.indexWhere((p) => p.id == updatedPlan.id);
    if (index != -1) {
      _tourPlans[index] = updatedPlan;
      notifyListeners();
    }
  }

  /// MR Executes a Planned Visit (Doctor / Chemist / Stockist)
  void executeVisitItem({
    required String planId,
    required String entityId,
  }) {
    final planIndex = _tourPlans.indexWhere((p) => p.id == planId);
    if (planIndex != -1) {
      final plan = _tourPlans[planIndex];
      final updatedVisits = plan.plannedVisits.map((v) {
        if (v.entityId == entityId) {
          return v.copyWith(
            isExecuted: true,
            executedTime: DateTime.now(),
          );
        }
        return v;
      }).toList();

      final allExecuted = updatedVisits.every((v) => v.isExecuted);

      _tourPlans[planIndex] = plan.copyWith(
        plannedVisits: updatedVisits,
        status: allExecuted ? 'Completed' : plan.status,
      );
      notifyListeners();
    }
  }

  /// MR Submits a Route Deviation / Rescheduling Request to ASM
  void requestDeviation({
    required String planId,
    required String reason,
    required String remarks,
    DateTime? rescheduledDate,
    String? replacementPatch,
  }) {
    final index = _tourPlans.indexWhere((p) => p.id == planId);
    if (index != -1) {
      _tourPlans[index] = _tourPlans[index].copyWith(
        status: 'Deviation Requested',
        deviationReason: reason,
        managerRemarks: remarks,
        rescheduledToDate: rescheduledDate,
        replacementPatch: replacementPatch,
      );
      notifyListeners();
    }
  }
}
