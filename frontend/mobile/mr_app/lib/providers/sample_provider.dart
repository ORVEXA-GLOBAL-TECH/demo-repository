import 'package:flutter/material.dart';
import '../models/sample_inventory_model.dart';

class SampleProvider extends ChangeNotifier {
  final List<SampleInventoryItem> _inventory = [];
  final List<SampleDistributionRecord> _distributionHistory = [];
  final List<SampleStockRequest> _stockRequests = [];
  final List<SampleInwardChallan> _inwardChallans = [];

  SampleProvider() {
    _seedInitialSampleData();
  }

  List<SampleInventoryItem> get inventory => List.unmodifiable(_inventory);
  List<SampleDistributionRecord> get distributionHistory => List.unmodifiable(_distributionHistory);
  List<SampleStockRequest> get stockRequests => List.unmodifiable(_stockRequests);
  List<SampleInwardChallan> get inwardChallans => List.unmodifiable(_inwardChallans);

  List<SampleInventoryItem> get drugSamples =>
      _inventory.where((i) => i.type == ItemType.sample).toList();

  List<SampleInventoryItem> get promoGifts =>
      _inventory.where((i) => i.type == ItemType.promoGift).toList();

  int get totalBagStockCount =>
      _inventory.fold(0, (sum, item) => sum + item.currentBalance);

  int get totalDistributedCount =>
      _inventory.fold(0, (sum, item) => sum + item.distributedQuantity);

  int get totalReceivedCount =>
      _inventory.fold(0, (sum, item) => sum + item.receivedQuantity);

  int get nearExpiryItemsCount =>
      _inventory.where((i) => i.isNearExpiry).length;

  void distributeSampleToDoctor({
    required String sampleItemId,
    required String doctorId,
    required String doctorName,
    required String doctorSpecialty,
    required String clinicName,
    required int quantity,
    String ackType = 'Doctor Digital Sign',
    String? signatureText,
    String? remarks,
  }) {
    final idx = _inventory.indexWhere((i) => i.id == sampleItemId);
    if (idx != -1) {
      final item = _inventory[idx];
      _inventory[idx] = item.copyWith(
        distributedQuantity: item.distributedQuantity + quantity,
      );

      final record = SampleDistributionRecord(
        id: 'dist_${DateTime.now().millisecondsSinceEpoch}',
        sampleItemId: item.id,
        sampleName: item.itemName,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        doctorId: doctorId,
        doctorName: doctorName,
        doctorSpecialty: doctorSpecialty,
        clinicName: clinicName,
        distributionDate: DateTime.now(),
        quantityDistributed: quantity,
        acknowledgmentType: ackType,
        doctorAckSign: signatureText ?? 'Dr. $doctorName (Ack Verified)',
        remarks: remarks ?? 'Physician trial sample handed over during clinical call.',
      );

      _distributionHistory.insert(0, record);
      notifyListeners();
    }
  }

  void distributeSample(String productId, int quantity, String recipientName) {
    final idx = _inventory.indexWhere((i) => i.id == productId || i.productId == productId || i.itemName.toLowerCase().contains(productId.toLowerCase()));
    if (idx != -1) {
      final item = _inventory[idx];
      _inventory[idx] = item.copyWith(
        distributedQuantity: item.distributedQuantity + quantity,
      );
      notifyListeners();
    }
  }

  void submitStockRequest({
    required String sampleName,
    required int quantity,
    String priority = 'Normal',
  }) {
    final req = SampleStockRequest(
      id: 'req_${DateTime.now().millisecondsSinceEpoch}',
      requestNumber: 'REQ-SMP-${(DateTime.now().millisecondsSinceEpoch % 10000).toString().padLeft(4, "0")}',
      requestDate: DateTime.now(),
      sampleName: sampleName,
      quantityRequested: quantity,
      priority: priority,
      status: 'Pending ASM Approval',
      asmRemarks: 'Request forwarded to C&F Depot for allocation.',
    );

    _stockRequests.insert(0, req);
    notifyListeners();
  }

  void confirmStockReceived({
    required String sampleItemId,
    required String challanNumber,
    required String sourceDepot,
    required int quantity,
  }) {
    final idx = _inventory.indexWhere((i) => i.id == sampleItemId);
    if (idx != -1) {
      final item = _inventory[idx];
      _inventory[idx] = item.copyWith(
        receivedQuantity: item.receivedQuantity + quantity,
      );

      final challan = SampleInwardChallan(
        id: 'inw_${DateTime.now().millisecondsSinceEpoch}',
        challanNumber: challanNumber,
        receivedDate: DateTime.now(),
        sourceDepot: sourceDepot,
        sampleName: item.itemName,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        quantityReceived: quantity,
      );

      _inwardChallans.insert(0, challan);
      notifyListeners();
    }
  }

  void deductSample({
    required String productId,
    required String recipientName,
    required int quantity,
  }) {
    final index = _inventory.indexWhere((i) => i.productId == productId && i.type == ItemType.sample);
    if (index != -1) {
      final item = _inventory[index];
      _inventory[index] = item.copyWith(
        distributedQuantity: item.distributedQuantity + quantity,
      );

      _distributionHistory.insert(
        0,
        SampleDistributionRecord(
          id: 'dist_${DateTime.now().millisecondsSinceEpoch}',
          sampleItemId: item.id,
          sampleName: item.itemName,
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate,
          doctorId: 'doc_dcr',
          doctorName: recipientName,
          doctorSpecialty: 'Specialist Physician',
          clinicName: 'Chamber Call Visit',
          distributionDate: DateTime.now(),
          quantityDistributed: quantity,
          acknowledgmentType: 'Doctor Digital Sign',
          doctorAckSign: '$recipientName (Ack Verified)',
          remarks: 'DCR Visit Physician Sample Handover',
        ),
      );

      notifyListeners();
    }
  }

  void deductGift({
    required String giftName,
    required String recipientName,
    int quantity = 1,
  }) {
    final index = _inventory.indexWhere((i) => i.itemName.contains(giftName) || giftName.contains(i.itemName));
    if (index != -1) {
      final item = _inventory[index];
      _inventory[index] = item.copyWith(
        distributedQuantity: item.distributedQuantity + quantity,
      );
      notifyListeners();
    }
  }

  void _seedInitialSampleData() {
    final now = DateTime.now();

    _inventory.addAll([
      SampleInventoryItem(
        id: 'smp_1',
        productId: 'prod_1',
        itemName: 'CardioVasc-AM Sample',
        molecule: 'Telmisartan 40mg + Amlodipine 5mg',
        batchNumber: 'CV26A14',
        mfgDate: '01/2026',
        expiryDate: '12/2027',
        isNearExpiry: false,
        type: ItemType.sample,
        openingBalance: 40,
        receivedQuantity: 30,
        distributedQuantity: 18,
        unit: 'Strips',
      ),
      SampleInventoryItem(
        id: 'smp_2',
        productId: 'prod_2',
        itemName: 'GlycoSmart-D10 Sample',
        molecule: 'Dapagliflozin 10mg + Metformin 500mg',
        batchNumber: 'GS26B09',
        mfgDate: '02/2026',
        expiryDate: '11/2027',
        isNearExpiry: false,
        type: ItemType.sample,
        openingBalance: 30,
        receivedQuantity: 25,
        distributedQuantity: 16,
        unit: 'Strips',
      ),
      SampleInventoryItem(
        id: 'smp_3',
        productId: 'prod_3',
        itemName: 'Neurolin-Plus Sample',
        molecule: 'Pregabalin 75mg + Methylcobalamin 1500mcg',
        batchNumber: 'NP26C02',
        mfgDate: '11/2025',
        expiryDate: '10/2026',
        isNearExpiry: true, // Near expiry alert
        type: ItemType.sample,
        openingBalance: 25,
        receivedQuantity: 15,
        distributedQuantity: 12,
        unit: 'Strips',
      ),
      SampleInventoryItem(
        id: 'smp_4',
        productId: 'prod_4',
        itemName: 'GastroShield-D Sample',
        molecule: 'Rabeprazole 20mg + Domperidone 30mg',
        batchNumber: 'GS26D18',
        mfgDate: '03/2026',
        expiryDate: '02/2028',
        isNearExpiry: false,
        type: ItemType.sample,
        openingBalance: 35,
        receivedQuantity: 20,
        distributedQuantity: 10,
        unit: 'Strips',
      ),
      SampleInventoryItem(
        id: 'smp_5',
        productId: 'prod_5',
        itemName: 'PulmoClear-Mont Sample',
        molecule: 'Montelukast 10mg + Levocetirizine 5mg',
        batchNumber: 'PC26E05',
        mfgDate: '02/2026',
        expiryDate: '01/2028',
        isNearExpiry: false,
        type: ItemType.sample,
        openingBalance: 20,
        receivedQuantity: 15,
        distributedQuantity: 8,
        unit: 'Strips',
      ),
      SampleInventoryItem(
        id: 'gift_1',
        productId: 'gift_01',
        itemName: 'Digital Blood Pressure Monitor Promo Kit',
        molecule: 'Cardio Brand Promotional Gift',
        batchNumber: 'GFT26K01',
        expiryDate: 'N/A',
        type: ItemType.promoGift,
        openingBalance: 5,
        receivedQuantity: 3,
        distributedQuantity: 2,
        unit: 'Kits',
      ),
      SampleInventoryItem(
        id: 'gift_2',
        productId: 'gift_02',
        itemName: 'Executive Medical Pen & Notepad Set',
        molecule: 'Physician Detailing Input',
        batchNumber: 'GFT26P04',
        expiryDate: 'N/A',
        type: ItemType.promoGift,
        openingBalance: 20,
        receivedQuantity: 10,
        distributedQuantity: 6,
        unit: 'Sets',
      ),
    ]);

    _distributionHistory.addAll([
      SampleDistributionRecord(
        id: 'dist_1',
        sampleItemId: 'smp_1',
        sampleName: 'CardioVasc-AM Sample',
        batchNumber: 'CV26A14',
        expiryDate: '12/2027',
        doctorId: 'doc_1',
        doctorName: 'Dr. Sameer Kulkarni',
        doctorSpecialty: 'Cardiologist',
        clinicName: 'Apex Heart Clinic, Hill Road',
        distributionDate: now.subtract(const Duration(hours: 5)),
        quantityDistributed: 4,
        acknowledgmentType: 'Doctor Digital Sign',
        doctorAckSign: 'Dr. S. Kulkarni (Digitally Signed)',
        remarks: 'Sample given for newly diagnosed hypertensive patients.',
      ),
      SampleDistributionRecord(
        id: 'dist_2',
        sampleItemId: 'smp_2',
        sampleName: 'GlycoSmart-D10 Sample',
        batchNumber: 'GS26B09',
        expiryDate: '11/2027',
        doctorId: 'doc_2',
        doctorName: 'Dr. Meera Nambiar',
        doctorSpecialty: 'Diabetologist',
        clinicName: 'LifeCare Diabetes Center, Linking Road',
        distributionDate: now.subtract(const Duration(hours: 3)),
        quantityDistributed: 4,
        acknowledgmentType: 'Stamp Verified',
        doctorAckSign: 'Chamber Stamp #784 Verified',
        remarks: 'Handed over trial pack for T2DM combination study.',
      ),
      SampleDistributionRecord(
        id: 'dist_3',
        sampleItemId: 'smp_3',
        sampleName: 'Neurolin-Plus Sample',
        batchNumber: 'NP26C02',
        expiryDate: '10/2026',
        doctorId: 'doc_3',
        doctorName: 'Dr. Vikram Sethi',
        doctorSpecialty: 'Neurologist',
        clinicName: 'NeuroCare Clinic, Bandra',
        distributionDate: now.subtract(const Duration(days: 1)),
        quantityDistributed: 3,
        acknowledgmentType: 'Doctor Digital Sign',
        doctorAckSign: 'Dr. V. Sethi (Verified)',
        remarks: 'Trial for diabetic neuropathy patient follow-up.',
      ),
    ]);

    _stockRequests.addAll([
      SampleStockRequest(
        id: 'req_1',
        requestNumber: 'REQ-SMP-8421',
        requestDate: now.subtract(const Duration(days: 2)),
        sampleName: 'CardioVasc-AM Sample (50 Strips)',
        quantityRequested: 50,
        priority: 'Urgent',
        status: 'Dispatched from C&F',
        asmRemarks: 'Approved by Rajesh Sharma (ASM). Dispatched via Courier #TRK8841.',
      ),
      SampleStockRequest(
        id: 'req_2',
        requestNumber: 'REQ-SMP-8410',
        requestDate: now.subtract(const Duration(days: 5)),
        sampleName: 'GlycoSmart-D10 Sample (40 Strips)',
        quantityRequested: 40,
        priority: 'Normal',
        status: 'Received by MR',
        asmRemarks: 'Delivered & acknowledged.',
      ),
    ]);

    _inwardChallans.addAll([
      SampleInwardChallan(
        id: 'inw_1',
        challanNumber: 'CHL-CF-9810',
        receivedDate: now.subtract(const Duration(days: 4)),
        sourceDepot: 'Alleviare Central C&F Depot, Bhiwandi',
        sampleName: 'CardioVasc-AM Sample',
        batchNumber: 'CV26A14',
        expiryDate: '12/2027',
        quantityReceived: 30,
      ),
      SampleInwardChallan(
        id: 'inw_2',
        challanNumber: 'CHL-CF-9788',
        receivedDate: now.subtract(const Duration(days: 7)),
        sourceDepot: 'Alleviare Central C&F Depot, Bhiwandi',
        sampleName: 'GlycoSmart-D10 Sample',
        batchNumber: 'GS26B09',
        expiryDate: '11/2027',
        quantityReceived: 25,
      ),
    ]);
  }
}
