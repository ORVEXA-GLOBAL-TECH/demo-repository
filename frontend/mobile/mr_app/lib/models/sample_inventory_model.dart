enum ItemType { sample, promoGift, visualMaterial }

class SampleInventoryItem {
  final String id;
  final String productId;
  final String itemName;
  final String molecule;
  final String batchNumber;
  final String mfgDate;
  final String expiryDate;
  final bool isNearExpiry;
  final ItemType type;
  final int openingBalance;
  final int receivedQuantity;
  final int distributedQuantity;
  final String unit; // "Strips", "Vials", "Boxes", "Pcs"

  SampleInventoryItem({
    required this.id,
    required this.productId,
    required this.itemName,
    this.molecule = 'Pharmaceutical Formulation',
    required this.batchNumber,
    this.mfgDate = '01/2026',
    required this.expiryDate,
    this.isNearExpiry = false,
    required this.type,
    required this.openingBalance,
    int? receivedQuantity,
    int? allocatedQuantity,
    this.distributedQuantity = 0,
    this.unit = 'Strips',
  }) : receivedQuantity = receivedQuantity ?? allocatedQuantity ?? 0;

  int get allocatedQuantity => openingBalance + receivedQuantity;
  int get currentBalance => (openingBalance + receivedQuantity) - distributedQuantity;

  SampleInventoryItem copyWith({
    String? id,
    String? productId,
    String? itemName,
    String? molecule,
    String? batchNumber,
    String? mfgDate,
    String? expiryDate,
    bool? isNearExpiry,
    ItemType? type,
    int? openingBalance,
    int? receivedQuantity,
    int? distributedQuantity,
    String? unit,
  }) {
    return SampleInventoryItem(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      itemName: itemName ?? this.itemName,
      molecule: molecule ?? this.molecule,
      batchNumber: batchNumber ?? this.batchNumber,
      mfgDate: mfgDate ?? this.mfgDate,
      expiryDate: expiryDate ?? this.expiryDate,
      isNearExpiry: isNearExpiry ?? this.isNearExpiry,
      type: type ?? this.type,
      openingBalance: openingBalance ?? this.openingBalance,
      receivedQuantity: receivedQuantity ?? this.receivedQuantity,
      distributedQuantity: distributedQuantity ?? this.distributedQuantity,
      unit: unit ?? this.unit,
    );
  }
}

class SampleDistributionRecord {
  final String id;
  final String sampleItemId;
  final String sampleName;
  final String batchNumber;
  final String expiryDate;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialty;
  final String clinicName;
  final DateTime distributionDate;
  final int quantityDistributed;
  final String acknowledgmentType; // 'Doctor Digital Sign', 'Stamp Verified', 'OTP Verified'
  final String? doctorAckSign;
  final String? remarks;

  SampleDistributionRecord({
    required this.id,
    required this.sampleItemId,
    required this.sampleName,
    required this.batchNumber,
    required this.expiryDate,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialty,
    required this.clinicName,
    required this.distributionDate,
    required this.quantityDistributed,
    this.acknowledgmentType = 'Doctor Digital Sign',
    this.doctorAckSign,
    this.remarks,
  });
}

class SampleStockRequest {
  final String id;
  final String requestNumber;
  final DateTime requestDate;
  final String sampleName;
  final int quantityRequested;
  final String priority; // 'Normal', 'Urgent'
  final String status; // 'Pending ASM Approval', 'Dispatched from C&F', 'Received by MR'
  final String? asmRemarks;

  SampleStockRequest({
    required this.id,
    required this.requestNumber,
    required this.requestDate,
    required this.sampleName,
    required this.quantityRequested,
    this.priority = 'Normal',
    this.status = 'Pending ASM Approval',
    this.asmRemarks,
  });
}

class SampleInwardChallan {
  final String id;
  final String challanNumber;
  final DateTime receivedDate;
  final String sourceDepot;
  final String sampleName;
  final String batchNumber;
  final String expiryDate;
  final int quantityReceived;
  final String status; // 'Acknowledged & Stocked'

  SampleInwardChallan({
    required this.id,
    required this.challanNumber,
    required this.receivedDate,
    required this.sourceDepot,
    required this.sampleName,
    required this.batchNumber,
    required this.expiryDate,
    required this.quantityReceived,
    this.status = 'Acknowledged & Stocked',
  });
}
