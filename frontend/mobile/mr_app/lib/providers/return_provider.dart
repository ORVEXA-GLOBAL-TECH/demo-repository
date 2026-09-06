import 'package:flutter/material.dart';
import '../models/return_model.dart';

class ReturnProvider extends ChangeNotifier {
  final List<ReturnClaimModel> _returns = [
    ReturnClaimModel(
      id: 'RET-2026-081',
      date: DateTime.now().subtract(const Duration(days: 1)),
      entityType: ReturnEntityType.chemist,
      entityId: 'chem_1',
      entityName: 'Apollo Pharmacy Bandra',
      patch: 'Central Hospital Zone Hub',
      isSampleReturn: false,
      productId: 'p_1',
      productName: 'CardioSafe 50mg Tablets (Telmisartan)',
      batchNumber: 'CS-2024-B102',
      expiryDate: '10/2026',
      quantity: 15,
      unit: 'Strips',
      unitPrice: 185.0,
      reason: ReturnReason.nearExpiry,
      reasonDescription: 'Near-expiry stock with under 75 days remaining. Chemist requesting credit note.',
      settlementPreference: ReturnSettlement.creditNote,
      status: 'Approved',
      managerRemarks: 'Verified by MR Rohan Deshmukh. Stock picked up for depot credit note.',
      billPhotoName: 'Apollo_Return_Invoice_884.jpg',
      creditNoteNumber: 'CN-MUM-2026-042',
      pickupDate: DateTime.now().subtract(const Duration(hours: 18)),
    ),
    ReturnClaimModel(
      id: 'RET-2026-082',
      date: DateTime.now().subtract(const Duration(days: 2)),
      entityType: ReturnEntityType.stockist,
      entityId: 'stk_1',
      entityName: 'Metro Pharma Distributors',
      patch: 'Industrial Sector 4 Depot',
      isSampleReturn: false,
      productId: 'p_3',
      productName: 'GlucoFit 500mg (Metformin SR)',
      batchNumber: 'GF-2025-A44',
      expiryDate: '03/2027',
      quantity: 40,
      unit: 'Bottles',
      unitPrice: 240.0,
      reason: ReturnReason.transitDamage,
      reasonDescription: 'Outer carton crushed during truck transit. 8 bottles seal broken with leakage.',
      settlementPreference: ReturnSettlement.stockReplacement,
      status: 'Depot Received',
      managerRemarks: 'Received at Central Bhiwandi Depot. Replacement stock scheduled for next billing cycle.',
      billPhotoName: 'Transit_Damage_Stockist_LR_991.jpg',
      creditNoteNumber: 'REP-DEPOT-1092',
      pickupDate: DateTime.now().subtract(const Duration(days: 1)),
    ),
    ReturnClaimModel(
      id: 'RET-2026-083',
      date: DateTime.now().subtract(const Duration(days: 4)),
      entityType: ReturnEntityType.hospitalClinic,
      entityId: 'fac_1',
      entityName: 'Lilavati Hospital & Research Centre',
      patch: 'Central Hospital Zone Hub',
      isSampleReturn: false,
      productId: 'p_6',
      productName: 'PulmoClear Inhaler (Budesonide)',
      batchNumber: 'PC-2024-X90',
      expiryDate: '07/2026',
      quantity: 25,
      unit: 'Inhalers',
      unitPrice: 42.0,
      reason: ReturnReason.expiredStock,
      reasonDescription: 'Institutional ward stock expired last month. Full credit note requested.',
      settlementPreference: ReturnSettlement.creditNote,
      status: 'Credit Settled',
      managerRemarks: 'RSM approved. Credit note \$1,050 adjusted in August institutional invoice.',
      billPhotoName: 'Royal_Phnom_Penh_Pharmacy_Return_GatePass.pdf',
      creditNoteNumber: 'CN-INST-2026-883',
      pickupDate: DateTime.now().subtract(const Duration(days: 3)),
    ),
    ReturnClaimModel(
      id: 'RET-2026-084',
      date: DateTime.now().subtract(const Duration(days: 5)),
      entityType: ReturnEntityType.doctor,
      entityId: 'doc_1',
      entityName: 'Dr. Rohan Deshmukh (Cardiologist)',
      patch: 'Central Hospital Zone Hub',
      isSampleReturn: true,
      productId: 'p_2',
      productName: 'NeuroCalm Plus (Pregabalin Sample Packs)',
      batchNumber: 'NC-SMP-2025-99',
      expiryDate: '12/2026',
      quantity: 12,
      unit: 'Sample Packs',
      unitPrice: 0.0,
      reason: ReturnReason.doctorSampleRecall,
      reasonDescription: 'Excess physician samples returned by doctor due to protocol switch to higher dosage.',
      settlementPreference: ReturnSettlement.stockReplacement,
      status: 'Submitted',
      managerRemarks: 'Physician sample returned to MR sample bag. Awaiting ASM sign-off in portal.',
      billPhotoName: 'Doctor_Sample_Return_Ack.jpg',
      pickupDate: DateTime.now().subtract(const Duration(days: 5)),
    ),
    ReturnClaimModel(
      id: 'RET-2026-085',
      date: DateTime.now().subtract(const Duration(days: 7)),
      entityType: ReturnEntityType.chemist,
      entityId: 'chem_2',
      entityName: 'MedPlus Pharmacy Linking Road',
      patch: 'Linking Road North Sector',
      isSampleReturn: false,
      productId: 'p_5',
      productName: 'OrthoFlex Joint Support (Glucosamine)',
      batchNumber: 'OF-2025-C11',
      expiryDate: '11/2027',
      quantity: 30,
      unit: 'Packs',
      unitPrice: 310.0,
      reason: ReturnReason.slowMovingExcess,
      reasonDescription: 'Slow moving retail stock exceeding 120 days shelf holding.',
      settlementPreference: ReturnSettlement.creditNote,
      status: 'Rejected',
      managerRemarks: 'Return rejected: Batch has over 15 months remaining shelf life. Recommended secondary chemist push.',
      billPhotoName: 'MedPlus_Inventory_Slip.jpg',
    ),
  ];

  String _selectedEntityFilter = 'All';
  String _selectedStatusFilter = 'All';
  String _searchQuery = '';

  List<ReturnClaimModel> get returns => _returns;
  String get selectedEntityFilter => _selectedEntityFilter;
  String get selectedStatusFilter => _selectedStatusFilter;
  String get searchQuery => _searchQuery;

  List<ReturnClaimModel> get filteredReturns {
    return _returns.where((item) {
      // Entity Filter
      if (_selectedEntityFilter != 'All') {
        if (_selectedEntityFilter == 'Chemist' && item.entityType != ReturnEntityType.chemist) return false;
        if (_selectedEntityFilter == 'Stockist' && item.entityType != ReturnEntityType.stockist) return false;
        if (_selectedEntityFilter == 'Hospital / Clinic' && item.entityType != ReturnEntityType.hospitalClinic) return false;
        if (_selectedEntityFilter == 'Doctor Sample' && item.entityType != ReturnEntityType.doctor) return false;
      }

      // Status Filter
      if (_selectedStatusFilter != 'All') {
        if (_selectedStatusFilter == 'Pending' && item.status != 'Submitted') return false;
        if (_selectedStatusFilter == 'Approved' && item.status != 'Approved') return false;
        if (_selectedStatusFilter == 'Depot Received' && item.status != 'Depot Received') return false;
        if (_selectedStatusFilter == 'Credit Settled' && item.status != 'Credit Settled') return false;
        if (_selectedStatusFilter == 'Rejected' && item.status != 'Rejected') return false;
      }

      // Search Query
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchParty = item.entityName.toLowerCase().contains(q);
        final matchProd = item.productName.toLowerCase().contains(q);
        final matchBatch = item.batchNumber.toLowerCase().contains(q);
        final matchId = item.id.toLowerCase().contains(q);
        if (!matchParty && !matchProd && !matchBatch && !matchId) return false;
      }

      return true;
    }).toList();
  }

  // Summary Metrics
  int get totalReturnsCount => _returns.length;
  double get totalReturnValue => _returns.fold(0.0, (sum, r) => sum + r.totalClaimValue);
  int get pendingReturnsCount => _returns.where((r) => r.status == 'Submitted').length;
  int get approvedReturnsCount => _returns.where((r) => r.status == 'Approved' || r.status == 'Depot Received' || r.status == 'Credit Settled').length;
  double get settledCreditValue => _returns.where((r) => r.status == 'Credit Settled').fold(0.0, (sum, r) => sum + r.totalClaimValue);

  void setEntityFilter(String filter) {
    _selectedEntityFilter = filter;
    notifyListeners();
  }

  void setStatusFilter(String filter) {
    _selectedStatusFilter = filter;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void addReturnClaim(ReturnClaimModel claim) {
    _returns.insert(0, claim);
    notifyListeners();
  }

  void updateClaimStatus(String id, String newStatus, {String? remarks, String? creditNote}) {
    final idx = _returns.indexWhere((r) => r.id == id);
    if (idx != -1) {
      _returns[idx] = _returns[idx].copyWith(
        status: newStatus,
        managerRemarks: remarks ?? _returns[idx].managerRemarks,
        creditNoteNumber: creditNote ?? _returns[idx].creditNoteNumber,
      );
      notifyListeners();
    }
  }
}
