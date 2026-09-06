enum WorkPlaceType { hq, exHq, outstation }

extension WorkPlaceTypeExtension on WorkPlaceType {
  String get label {
    switch (this) {
      case WorkPlaceType.hq:
        return 'HQ (Headquarters)';
      case WorkPlaceType.exHq:
        return 'Ex-HQ (>40 km)';
      case WorkPlaceType.outstation:
        return 'Outstation (Night Stay)';
    }
  }

  double get standardDaRate {
    switch (this) {
      case WorkPlaceType.hq:
        return 350.0;
      case WorkPlaceType.exHq:
        return 550.0;
      case WorkPlaceType.outstation:
        return 950.0;
    }
  }
}

enum ExpenseCategory {
  fuel,
  taxi,
  hotel,
  food,
  train,
  flight,
  misc,
}

extension ExpenseCategoryExtension on ExpenseCategory {
  String get label {
    switch (this) {
      case ExpenseCategory.fuel:
        return 'Fuel';
      case ExpenseCategory.taxi:
        return 'Taxi';
      case ExpenseCategory.hotel:
        return 'Hotel';
      case ExpenseCategory.food:
        return 'Food';
      case ExpenseCategory.train:
        return 'Train';
      case ExpenseCategory.flight:
        return 'Flight';
      case ExpenseCategory.misc:
        return 'Miscellaneous';
    }
  }

  String get iconEmoji {
    switch (this) {
      case ExpenseCategory.fuel:
        return '⛽';
      case ExpenseCategory.taxi:
        return '🚕';
      case ExpenseCategory.hotel:
        return '🏨';
      case ExpenseCategory.food:
        return '🍲';
      case ExpenseCategory.train:
        return '🚆';
      case ExpenseCategory.flight:
        return '✈️';
      case ExpenseCategory.misc:
        return '📦';
    }
  }
}

class MiscExpenseItem {
  final String title;
  final double amount;
  final ExpenseCategory category;
  final String receiptMockUrl;

  MiscExpenseItem({
    required this.title,
    required this.amount,
    this.category = ExpenseCategory.misc,
    this.receiptMockUrl = 'receipt_bill.jpg',
  });
}

class DailyExpenseClaim {
  final String id;
  final DateTime date;
  final WorkPlaceType workPlaceType;
  final String routeCovered;
  final double travelDistanceKm;
  final double ratePerKm;
  final double dailyAllowance;
  final double fuelAmount;
  final double taxiAmount;
  final double hotelLodging;
  final double foodAmount;
  final double trainAmount;
  final double flightAmount;
  final List<MiscExpenseItem> miscExpenses;
  final String status; // 'Submitted', 'Approved', 'Rejected', 'Settled'
  final String? managerRemarks;
  final DateTime? submittedAt;
  final String? billPhotoName;

  DailyExpenseClaim({
    required this.id,
    required this.date,
    required this.workPlaceType,
    required this.routeCovered,
    this.travelDistanceKm = 0.0,
    this.ratePerKm = 4.50,
    required this.dailyAllowance,
    this.fuelAmount = 0.0,
    this.taxiAmount = 0.0,
    this.hotelLodging = 0.0,
    this.foodAmount = 0.0,
    this.trainAmount = 0.0,
    this.flightAmount = 0.0,
    this.miscExpenses = const [],
    this.status = 'Submitted',
    this.managerRemarks,
    this.submittedAt,
    this.billPhotoName = 'Fuel_Toll_Receipt_9842.jpg',
  });

  double get travelAllowance => travelDistanceKm * ratePerKm;
  double get totalMiscExpense => miscExpenses.fold(0.0, (sum, item) => sum + item.amount);

  double get grandTotal =>
      travelAllowance +
      dailyAllowance +
      fuelAmount +
      taxiAmount +
      hotelLodging +
      foodAmount +
      trainAmount +
      flightAmount +
      totalMiscExpense;

  bool get isApproved => status == 'Approved';
  bool get isSettled => status == 'Settled';
  bool get isRejected => status == 'Rejected';
  bool get isPending => status == 'Submitted' || status == 'Draft';
  bool get isLocked => isApproved || isSettled;

  DailyExpenseClaim copyWith({
    String? id,
    DateTime? date,
    WorkPlaceType? workPlaceType,
    String? routeCovered,
    double? travelDistanceKm,
    double? ratePerKm,
    double? dailyAllowance,
    double? fuelAmount,
    double? taxiAmount,
    double? hotelLodging,
    double? foodAmount,
    double? trainAmount,
    double? flightAmount,
    List<MiscExpenseItem>? miscExpenses,
    String? status,
    String? managerRemarks,
    DateTime? submittedAt,
    String? billPhotoName,
  }) {
    return DailyExpenseClaim(
      id: id ?? this.id,
      date: date ?? this.date,
      workPlaceType: workPlaceType ?? this.workPlaceType,
      routeCovered: routeCovered ?? this.routeCovered,
      travelDistanceKm: travelDistanceKm ?? this.travelDistanceKm,
      ratePerKm: ratePerKm ?? this.ratePerKm,
      dailyAllowance: dailyAllowance ?? this.dailyAllowance,
      fuelAmount: fuelAmount ?? this.fuelAmount,
      taxiAmount: taxiAmount ?? this.taxiAmount,
      hotelLodging: hotelLodging ?? this.hotelLodging,
      foodAmount: foodAmount ?? this.foodAmount,
      trainAmount: trainAmount ?? this.trainAmount,
      flightAmount: flightAmount ?? this.flightAmount,
      miscExpenses: miscExpenses ?? this.miscExpenses,
      status: status ?? this.status,
      managerRemarks: managerRemarks ?? this.managerRemarks,
      submittedAt: submittedAt ?? this.submittedAt,
      billPhotoName: billPhotoName ?? this.billPhotoName,
    );
  }
}
