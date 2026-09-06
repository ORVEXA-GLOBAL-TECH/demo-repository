import 'package:flutter/material.dart';
import '../models/dcr_model.dart';
import '../services/mock_data_service.dart';

class DcrProvider extends ChangeNotifier {
  late DailyDcrSummary _todayDcr;
  final List<DailyDcrSummary> _dcrHistory = MockDataService.getSampleDcrHistory();

  // Target constants for MR KPIs
  final int targetDoctorCalls = 12;
  final int targetChemistCalls = 6;
  final int targetRcpa = 4;
  final double targetPobAmount = 25000.0;

  DcrProvider() {
    _initTodayDcr();
  }

  void _initTodayDcr() {
    _todayDcr = DailyDcrSummary(
      id: 'dcr_${DateTime.now().year}_${DateTime.now().month}_${DateTime.now().day}',
      date: DateTime.now(),
      workType: 'Field Work',
      routePatch: 'Central Hospital Zone Hub',
      status: 'Draft',
      universalCalls: [],
      doctorCalls: [],
      chemistCalls: [],
      stockistCalls: [],
      totalPobValue: 0.0,
    );
  }

  DailyDcrSummary get todayDcr => _todayDcr;
  List<DailyDcrSummary> get dcrHistory => _dcrHistory;

  int get completedDoctorCallsCount =>
      _todayDcr.doctorCalls.length +
      _todayDcr.universalCalls.where((c) => c.entityCategory == 'Doctor').length;

  int get completedChemistCallsCount =>
      _todayDcr.chemistCalls.length +
      _todayDcr.universalCalls.where((c) => c.entityCategory.contains('Chemist') || c.entityCategory.contains('Retailer')).length;

  int get completedStockistCallsCount =>
      _todayDcr.stockistCalls.length +
      _todayDcr.universalCalls.where((c) => c.entityCategory.contains('Stockist')).length;

  int get completedHospitalClinicCallsCount =>
      _todayDcr.universalCalls.where((c) => c.entityCategory.contains('Hospital') || c.entityCategory.contains('Clinic')).length;

  int get totalCallsCount =>
      _todayDcr.universalCalls.length +
      _todayDcr.doctorCalls.length +
      _todayDcr.chemistCalls.length +
      _todayDcr.stockistCalls.length;

  double get todayPobTotal => _todayDcr.totalPobValue;

  double get doctorCallProgress => (completedDoctorCallsCount / targetDoctorCalls).clamp(0.0, 1.0);
  double get chemistCallProgress => (completedChemistCallsCount / targetChemistCalls).clamp(0.0, 1.0);

  bool isEntityVisitedToday(String entityId) {
    final inUniversal = _todayDcr.universalCalls.any((c) => c.entityId == entityId);
    final inDoc = _todayDcr.doctorCalls.any((c) => c.doctorId == entityId);
    final inChem = _todayDcr.chemistCalls.any((c) => c.chemistId == entityId);
    final inStk = _todayDcr.stockistCalls.any((c) => c.stockistId == entityId);
    return inUniversal || inDoc || inChem || inStk;
  }

  bool isDoctorVisitedToday(String doctorId) => isEntityVisitedToday(doctorId);
  bool isChemistVisitedToday(String chemistId) => isEntityVisitedToday(chemistId);

  void addUniversalCall(UniversalDcrCall call) {
    final updatedCalls = List<UniversalDcrCall>.from(_todayDcr.universalCalls)..insert(0, call);
    final newPobTotal = _todayDcr.totalPobValue + call.pobTotalAmount;
    _todayDcr = _todayDcr.copyWith(
      universalCalls: updatedCalls,
      totalPobValue: newPobTotal,
    );
    notifyListeners();
  }

  void addDoctorCall(DoctorCallReport call) {
    final updatedCalls = List<DoctorCallReport>.from(_todayDcr.doctorCalls)..insert(0, call);
    _todayDcr = _todayDcr.copyWith(doctorCalls: updatedCalls);
    notifyListeners();
  }

  void addChemistCall(ChemistCallReport call) {
    final updatedCalls = List<ChemistCallReport>.from(_todayDcr.chemistCalls)..insert(0, call);
    final newTotalPob = _todayDcr.totalPobValue + call.pobAmount;
    _todayDcr = _todayDcr.copyWith(
      chemistCalls: updatedCalls,
      totalPobValue: newTotalPob,
    );
    notifyListeners();
  }

  void addStockistCall(StockistCallReport call) {
    final updatedCalls = List<StockistCallReport>.from(_todayDcr.stockistCalls)..insert(0, call);
    _todayDcr = _todayDcr.copyWith(stockistCalls: updatedCalls);
    notifyListeners();
  }

  void updateRoutePatch(String patch) {
    _todayDcr = _todayDcr.copyWith(routePatch: patch);
    notifyListeners();
  }

  void updateDayRemarks(String remarks) {
    _todayDcr = _todayDcr.copyWith(dayRemarks: remarks);
    notifyListeners();
  }

  void submitTodayDcr() {
    _todayDcr = _todayDcr.copyWith(
      status: 'Submitted',
      submittedAt: DateTime.now(),
      managerRemark: '⏳ Pending Review by Reporting Manager (ASM)',
    );
    final idx = _dcrHistory.indexWhere((d) => d.id == _todayDcr.id);
    if (idx != -1) {
      _dcrHistory[idx] = _todayDcr;
    } else {
      _dcrHistory.insert(0, _todayDcr);
    }
    notifyListeners();
  }

  /// Resubmit a rejected or drafted DCR to Manager with MR correction note
  void resubmitDcr(String dcrId, {String? resubmissionNote}) {
    for (int i = 0; i < _dcrHistory.length; i++) {
      if (_dcrHistory[i].id == dcrId) {
        final dcr = _dcrHistory[i];
        final updated = dcr.copyWith(
          status: 'Resubmitted',
          resubmissionCount: dcr.resubmissionCount + 1,
          resubmittedAt: DateTime.now(),
          resubmissionNote: resubmissionNote ?? 'Updated and resubmitted with doctor call clarifications.',
          managerRemark: '⏳ Resubmitted: Waiting for ASM re-review.',
        );
        _dcrHistory[i] = updated;
        if (_todayDcr.id == dcrId) {
          _todayDcr = updated;
        }
        notifyListeners();
        return;
      }
    }
  }

  /// Update entire DCR summary after submission
  void updateDcrSummary(DailyDcrSummary updated) {
    if (_todayDcr.id == updated.id) {
      _todayDcr = updated;
    }
    final histIdx = _dcrHistory.indexWhere((d) => d.id == updated.id);
    if (histIdx != -1) {
      _dcrHistory[histIdx] = updated;
    } else {
      _dcrHistory.insert(0, updated);
    }
    notifyListeners();
  }

  /// Update an individual Doctor Call in today's DCR or in a past submitted DCR
  void updateDoctorCall(DoctorCallReport updatedCall, {String? dcrId}) {
    // 1. Update in today's DCR
    final todayIdx = _todayDcr.doctorCalls.indexWhere((c) => c.id == updatedCall.id);
    if (todayIdx != -1) {
      final updatedList = List<DoctorCallReport>.from(_todayDcr.doctorCalls);
      updatedList[todayIdx] = updatedCall;
      _todayDcr = _todayDcr.copyWith(doctorCalls: updatedList);
    }

    // 2. Update in history
    for (int i = 0; i < _dcrHistory.length; i++) {
      final dcr = _dcrHistory[i];
      if (dcrId == null || dcr.id == dcrId) {
        final cIdx = dcr.doctorCalls.indexWhere((c) => c.id == updatedCall.id);
        if (cIdx != -1) {
          final updatedList = List<DoctorCallReport>.from(dcr.doctorCalls);
          updatedList[cIdx] = updatedCall;
          _dcrHistory[i] = dcr.copyWith(doctorCalls: updatedList);
          break;
        }
      }
    }
    notifyListeners();
  }

  /// Remove a Doctor Call from a DCR report
  void removeDoctorCallFromDcr(String callId, {String? dcrId}) {
    // 1. Remove from today's DCR
    final todayIdx = _todayDcr.doctorCalls.indexWhere((c) => c.id == callId);
    if (todayIdx != -1) {
      final updatedList = List<DoctorCallReport>.from(_todayDcr.doctorCalls)..removeAt(todayIdx);
      _todayDcr = _todayDcr.copyWith(doctorCalls: updatedList);
    }

    // 2. Remove from history
    for (int i = 0; i < _dcrHistory.length; i++) {
      final dcr = _dcrHistory[i];
      if (dcrId == null || dcr.id == dcrId) {
        final cIdx = dcr.doctorCalls.indexWhere((c) => c.id == callId);
        if (cIdx != -1) {
          final updatedList = List<DoctorCallReport>.from(dcr.doctorCalls)..removeAt(cIdx);
          _dcrHistory[i] = dcr.copyWith(doctorCalls: updatedList);
          break;
        }
      }
    }
    notifyListeners();
  }

  /// Add a Doctor Call to an existing DCR report
  void addDoctorCallToDcr(DoctorCallReport call, {String? dcrId}) {
    if (dcrId == null || _todayDcr.id == dcrId) {
      final updatedList = List<DoctorCallReport>.from(_todayDcr.doctorCalls)..add(call);
      _todayDcr = _todayDcr.copyWith(doctorCalls: updatedList);
    }

    for (int i = 0; i < _dcrHistory.length; i++) {
      final dcr = _dcrHistory[i];
      if (dcr.id == dcrId) {
        final updatedList = List<DoctorCallReport>.from(dcr.doctorCalls)..add(call);
        _dcrHistory[i] = dcr.copyWith(doctorCalls: updatedList);
        break;
      }
    }
    notifyListeners();
  }

  /// Update an individual Chemist Call in today's DCR or in a past submitted DCR
  void updateChemistCall(ChemistCallReport updatedCall, {String? dcrId}) {
    // 1. Update in today's DCR
    final todayIdx = _todayDcr.chemistCalls.indexWhere((c) => c.id == updatedCall.id);
    if (todayIdx != -1) {
      final updatedList = List<ChemistCallReport>.from(_todayDcr.chemistCalls);
      updatedList[todayIdx] = updatedCall;
      final newPob = updatedList.fold(0.0, (sum, c) => sum + c.pobAmount) +
          _todayDcr.universalCalls.fold(0.0, (sum, c) => sum + c.pobTotalAmount);
      _todayDcr = _todayDcr.copyWith(chemistCalls: updatedList, totalPobValue: newPob);
    }

    // 2. Update in history
    for (int i = 0; i < _dcrHistory.length; i++) {
      final dcr = _dcrHistory[i];
      if (dcrId == null || dcr.id == dcrId) {
        final cIdx = dcr.chemistCalls.indexWhere((c) => c.id == updatedCall.id);
        if (cIdx != -1) {
          final updatedList = List<ChemistCallReport>.from(dcr.chemistCalls);
          updatedList[cIdx] = updatedCall;
          final newPob = updatedList.fold(0.0, (sum, c) => sum + c.pobAmount) +
              dcr.universalCalls.fold(0.0, (sum, c) => sum + c.pobTotalAmount);
          _dcrHistory[i] = dcr.copyWith(chemistCalls: updatedList, totalPobValue: newPob);
          break;
        }
      }
    }
    notifyListeners();
  }

  /// Update an individual Stockist Call
  void updateStockistCall(StockistCallReport updatedCall, {String? dcrId}) {
    final todayIdx = _todayDcr.stockistCalls.indexWhere((c) => c.id == updatedCall.id);
    if (todayIdx != -1) {
      final updatedList = List<StockistCallReport>.from(_todayDcr.stockistCalls);
      updatedList[todayIdx] = updatedCall;
      _todayDcr = _todayDcr.copyWith(stockistCalls: updatedList);
    }

    for (int i = 0; i < _dcrHistory.length; i++) {
      final dcr = _dcrHistory[i];
      if (dcrId == null || dcr.id == dcrId) {
        final cIdx = dcr.stockistCalls.indexWhere((c) => c.id == updatedCall.id);
        if (cIdx != -1) {
          final updatedList = List<StockistCallReport>.from(dcr.stockistCalls);
          updatedList[cIdx] = updatedCall;
          _dcrHistory[i] = dcr.copyWith(stockistCalls: updatedList);
          break;
        }
      }
    }
    notifyListeners();
  }

  /// Reopen submitted DCR to Draft
  void reopenDcrToDraft(String dcrId) {
    if (_todayDcr.id == dcrId) {
      _todayDcr = _todayDcr.copyWith(status: 'Draft');
    }
    final idx = _dcrHistory.indexWhere((d) => d.id == dcrId);
    if (idx != -1) {
      _dcrHistory[idx] = _dcrHistory[idx].copyWith(status: 'Draft');
    }
    notifyListeners();
  }
}
