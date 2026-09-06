enum DcrFileType { photo, pdf, document }

class DcrAttachment {
  final String fileName;
  final DcrFileType fileType;
  final String filePathOrUrl;
  final int sizeKb;
  final DateTime uploadedAt;

  DcrAttachment({
    required this.fileName,
    required this.fileType,
    required this.filePathOrUrl,
    this.sizeKb = 320,
    DateTime? uploadedAt,
  }) : uploadedAt = uploadedAt ?? DateTime.now();
}

class ProductPromotionEntry {
  final String productId;
  final String brandName;
  final String focusLevel; // Primary, Secondary, Launch, Reminder
  final int timeSpentSeconds;

  ProductPromotionEntry({
    required this.productId,
    required this.brandName,
    this.focusLevel = 'Primary',
    this.timeSpentSeconds = 120,
  });
}

class SampleGivenEntry {
  final String productId;
  final String brandName;
  final String batchNumber;
  final int quantity;

  SampleGivenEntry({
    required this.productId,
    required this.brandName,
    required this.batchNumber,
    required this.quantity,
  });
}

class PobOrderItem {
  final String productId;
  final String brandName;
  final int quantity;
  final int freeUnits;
  final double unitPrice;

  PobOrderItem({
    required this.productId,
    required this.brandName,
    required this.quantity,
    this.freeUnits = 0,
    required this.unitPrice,
  });

  double get itemTotal => quantity * unitPrice;
}

class UniversalDcrCall {
  final String id;
  final String entityCategory; // Doctor, Retailer / Chemist, Stockist, Clinic, Hospital, Other Private/Govt
  final String entityId;
  final String entityName;
  final String contactPerson;
  final String address;
  final String patch;
  final DateTime callTime;
  final String workType; // Solo, With ASM, With RSM
  final String? accompaniedByName;
  final List<ProductPromotionEntry> productsPromoted;
  final List<SampleGivenEntry> samplesDistributed;
  final List<PobOrderItem> pobOrderItems;
  final double pobTotalAmount;
  final String? mappedStockist;
  final String prescriptionCommitment; // High (5+ Rx/day), Moderate (2-4 Rx/day), Trial/Regular, Formulary Approved
  final String remarksFeedback;
  final List<DcrAttachment> attachedDocuments;
  final DateTime? nextScheduleDate;
  final String? nextScheduleObjective;
  final bool isGeoVerified;
  final String locationAddress;

  UniversalDcrCall({
    required this.id,
    required this.entityCategory,
    required this.entityId,
    required this.entityName,
    required this.contactPerson,
    required this.address,
    required this.patch,
    required this.callTime,
    this.workType = 'Solo',
    this.accompaniedByName,
    this.productsPromoted = const [],
    this.samplesDistributed = const [],
    this.pobOrderItems = const [],
    this.pobTotalAmount = 0.0,
    this.mappedStockist,
    this.prescriptionCommitment = 'Moderate (2-4 Rx/day)',
    this.remarksFeedback = '',
    this.attachedDocuments = const [],
    this.nextScheduleDate,
    this.nextScheduleObjective,
    this.isGeoVerified = true,
    this.locationAddress = 'Central Hospital Zone Hub, Phnom Penh',
  });
}

class DoctorCallReport {
  final String id;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialty;
  final String clinicName;
  final String doctorClass;
  final DateTime callTime;
  final String visitType; // Solo, With ASM, With RSM
  final String? jointWithPerson;
  final List<ProductPromotionEntry> productsPromoted;
  final List<SampleGivenEntry> samplesGiven;
  final List<String> giftsGiven;
  final String prescriptionCommitment;
  final String doctorFeedback;
  final DateTime nextVisitDate;
  final bool isGeoVerified;
  final double latitude;
  final double longitude;
  final String locationAddress;
  final List<DcrAttachment> attachedDocuments;

  DoctorCallReport({
    required this.id,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialty,
    required this.clinicName,
    required this.doctorClass,
    required this.callTime,
    this.visitType = 'Solo',
    this.jointWithPerson,
    required this.productsPromoted,
    this.samplesGiven = const [],
    this.giftsGiven = const [],
    this.prescriptionCommitment = 'Moderate (2-4 Rx/day)',
    this.doctorFeedback = '',
    required this.nextVisitDate,
    this.isGeoVerified = true,
    this.latitude = 11.5564,
    this.longitude = 104.9282,
    this.locationAddress = 'Calmette National Referral Hospital, Daun Penh, Phnom Penh',
    this.attachedDocuments = const [],
  });
}

class ChemistCallReport {
  final String id;
  final String chemistId;
  final String chemistName;
  final String shopName;
  final DateTime callTime;
  final String visitType;
  final bool pobBooked;
  final double pobAmount;
  final String mappedStockistName;
  final String competitorFeedback;
  final bool isGeoVerified;
  final String locationAddress;
  final List<DcrAttachment> attachedDocuments;

  ChemistCallReport({
    required this.id,
    required this.chemistId,
    required this.chemistName,
    required this.shopName,
    required this.callTime,
    this.visitType = 'Solo',
    this.pobBooked = false,
    this.pobAmount = 0.0,
    required this.mappedStockistName,
    this.competitorFeedback = '',
    this.isGeoVerified = true,
    this.locationAddress = 'Sai Medicos & Pharmacy Depot, Preah Norodom Blvd, Phnom Penh',
    this.attachedDocuments = const [],
  });
}

class StockistCallReport {
  final String id;
  final String stockistId;
  final String agencyName;
  final String contactPerson;
  final DateTime callTime;
  final String visitType;
  final double orderValue;
  final double paymentCollected;
  final String remarks;
  final List<DcrAttachment> attachedDocuments;

  StockistCallReport({
    required this.id,
    required this.stockistId,
    required this.agencyName,
    required this.contactPerson,
    required this.callTime,
    this.visitType = 'Solo',
    this.orderValue = 0.0,
    this.paymentCollected = 0.0,
    this.remarks = '',
    this.attachedDocuments = const [],
  });
}

class DailyDcrSummary {
  final String id;
  final DateTime date;
  final String workType; // Field Work, Non-Field, Leave, Conference
  final String routePatch;
  final String status; // Draft, Submitted, Approved, Rejected, Resubmitted
  final List<UniversalDcrCall> universalCalls;
  final List<DoctorCallReport> doctorCalls;
  final List<ChemistCallReport> chemistCalls;
  final List<StockistCallReport> stockistCalls;
  final double totalPobValue;
  final String dayRemarks;
  final DateTime? submittedAt;
  final String? managerRemark;
  final String? reviewedByManager;
  final DateTime? reviewedAt;
  final int resubmissionCount;
  final DateTime? resubmittedAt;
  final String? resubmissionNote;

  DailyDcrSummary({
    required this.id,
    required this.date,
    this.workType = 'Field Work',
    this.routePatch = 'Central Hospital Zone Hub',
    this.status = 'Draft',
    this.universalCalls = const [],
    this.doctorCalls = const [],
    this.chemistCalls = const [],
    this.stockistCalls = const [],
    this.totalPobValue = 0.0,
    this.dayRemarks = '',
    this.submittedAt,
    this.managerRemark,
    this.reviewedByManager,
    this.reviewedAt,
    this.resubmissionCount = 0,
    this.resubmittedAt,
    this.resubmissionNote,
  });

  bool get isApproved => status == 'Approved';
  bool get isRejected => status == 'Rejected';
  bool get isSubmitted => status == 'Submitted' || status == 'Resubmitted';
  bool get isDraft => status == 'Draft';

  int get totalSamplesGiven => doctorCalls.fold(0, (sum, call) => sum + call.samplesGiven.fold(0, (sSum, s) => sSum + s.quantity));

  DailyDcrSummary copyWith({
    String? id,
    DateTime? date,
    String? workType,
    String? routePatch,
    String? status,
    List<UniversalDcrCall>? universalCalls,
    List<DoctorCallReport>? doctorCalls,
    List<ChemistCallReport>? chemistCalls,
    List<StockistCallReport>? stockistCalls,
    double? totalPobValue,
    String? dayRemarks,
    DateTime? submittedAt,
    String? managerRemark,
    String? reviewedByManager,
    DateTime? reviewedAt,
    int? resubmissionCount,
    DateTime? resubmittedAt,
    String? resubmissionNote,
  }) {
    return DailyDcrSummary(
      id: id ?? this.id,
      date: date ?? this.date,
      workType: workType ?? this.workType,
      routePatch: routePatch ?? this.routePatch,
      status: status ?? this.status,
      universalCalls: universalCalls ?? this.universalCalls,
      doctorCalls: doctorCalls ?? this.doctorCalls,
      chemistCalls: chemistCalls ?? this.chemistCalls,
      stockistCalls: stockistCalls ?? this.stockistCalls,
      totalPobValue: totalPobValue ?? this.totalPobValue,
      dayRemarks: dayRemarks ?? this.dayRemarks,
      submittedAt: submittedAt ?? this.submittedAt,
      managerRemark: managerRemark ?? this.managerRemark,
      reviewedByManager: reviewedByManager ?? this.reviewedByManager,
      reviewedAt: reviewedAt ?? this.reviewedAt,
      resubmissionCount: resubmissionCount ?? this.resubmissionCount,
      resubmittedAt: resubmittedAt ?? this.resubmittedAt,
      resubmissionNote: resubmissionNote ?? this.resubmissionNote,
    );
  }
}
