import 'package:flutter/material.dart';
import '../models/expense_model.dart';
import '../services/mock_data_service.dart';

class ExpenseProvider extends ChangeNotifier {
  final List<DailyExpenseClaim> _expenses = MockDataService.getSampleExpenses();
  String _selectedStatusFilter = 'All';

  // Fixed Policy Allowance Rates (USD)
  double _managerHqDa = 15.0;
  double _managerExHqDa = 20.0;
  double _managerOutstationDa = 35.0;
  double _managerTaRatePerKm = 0.25;

  List<DailyExpenseClaim> get expenses => _expenses;
  String get selectedStatusFilter => _selectedStatusFilter;

  double get managerHqDa => _managerHqDa;
  double get managerExHqDa => _managerExHqDa;
  double get managerOutstationDa => _managerOutstationDa;
  double get managerTaRatePerKm => _managerTaRatePerKm;

  double getDaForWorkPlace(WorkPlaceType type) {
    switch (type) {
      case WorkPlaceType.hq:
        return _managerHqDa;
      case WorkPlaceType.exHq:
        return _managerExHqDa;
      case WorkPlaceType.outstation:
        return _managerOutstationDa;
    }
  }

  void updateManagerAllowanceRates({
    double? hqDa,
    double? exHqDa,
    double? outstationDa,
    double? taRate,
  }) {
    if (hqDa != null) _managerHqDa = hqDa;
    if (exHqDa != null) _managerExHqDa = exHqDa;
    if (outstationDa != null) _managerOutstationDa = outstationDa;
    if (taRate != null) _managerTaRatePerKm = taRate;
    notifyListeners();
  }

  List<DailyExpenseClaim> get filteredExpenses {
    if (_selectedStatusFilter == 'All') return _expenses;
    if (_selectedStatusFilter == 'Pending') {
      return _expenses.where((e) => e.status == 'Submitted' || e.status == 'Draft').toList();
    }
    return _expenses.where((e) => e.status == _selectedStatusFilter).toList();
  }

  void setStatusFilter(String filter) {
    _selectedStatusFilter = filter;
    notifyListeners();
  }

  double get currentMonthExpenseTotal =>
      _expenses.fold(0.0, (sum, claim) => sum + claim.grandTotal);

  double get approvedExpenseTotal => _expenses
      .where((e) => e.status == 'Approved' || e.status == 'Settled')
      .fold(0.0, (sum, claim) => sum + claim.grandTotal);

  double get pendingExpenseTotal => _expenses
      .where((e) => e.status == 'Submitted' || e.status == 'Draft')
      .fold(0.0, (sum, claim) => sum + claim.grandTotal);

  Map<String, double> get categoryBreakdown {
    double fuel = 0, taxi = 0, hotel = 0, food = 0, train = 0, flight = 0, da = 0, misc = 0;
    for (var e in _expenses) {
      fuel += e.fuelAmount;
      taxi += e.taxiAmount;
      hotel += e.hotelLodging;
      food += e.foodAmount;
      train += e.trainAmount;
      flight += e.flightAmount;
      da += e.dailyAllowance + e.travelAllowance;
      misc += e.totalMiscExpense;
    }
    return {
      'Fuel ⛽': fuel,
      'Taxi 🚕': taxi,
      'Hotel 🏨': hotel,
      'Food 🍲': food,
      'Train 🚆': train,
      'Flight ✈️': flight,
      'Daily Allowance (DA/TA) 🛵': da,
      'Miscellaneous 📦': misc,
    };
  }

  void addExpenseClaim(DailyExpenseClaim claim) {
    _expenses.insert(0, claim);
    notifyListeners();
  }

  void approveExpense(String claimId, {String? remarks}) {
    final index = _expenses.indexWhere((e) => e.id == claimId);
    if (index != -1) {
      _expenses[index] = _expenses[index].copyWith(
        status: 'Approved',
        managerRemarks: remarks ?? 'Approved by ASM Rajesh Sharma for accounts reimbursement processing.',
      );
      notifyListeners();
    }
  }

  void rejectExpense(String claimId, String remarks) {
    final index = _expenses.indexWhere((e) => e.id == claimId);
    if (index != -1) {
      _expenses[index] = _expenses[index].copyWith(
        status: 'Rejected',
        managerRemarks: remarks.trim().isNotEmpty ? remarks.trim() : 'Rejected: Supporting tax invoice/bill missing or invalid head.',
      );
      notifyListeners();
    }
  }

  void settleExpense(String claimId) {
    final index = _expenses.indexWhere((e) => e.id == claimId);
    if (index != -1) {
      _expenses[index] = _expenses[index].copyWith(
        status: 'Settled',
        managerRemarks: 'Reimbursement amount credited to salary account via NEFT.',
      );
      notifyListeners();
    }
  }

  /// MR can resubmit a rejected claim with updated data
  void resubmitExpenseClaim(DailyExpenseClaim updatedClaim) {
    final index = _expenses.indexWhere((e) => e.id == updatedClaim.id);
    if (index != -1) {
      _expenses[index] = updatedClaim.copyWith(
        status: 'Submitted',
        submittedAt: DateTime.now(),
        managerRemarks: null, // clear previous rejection remark
      );
      notifyListeners();
    }
  }
}
