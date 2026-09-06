import 'package:flutter/material.dart';

enum ReturnEntityType {
  chemist,
  stockist,
  hospitalClinic,
  doctor,
}

extension ReturnEntityTypeExtension on ReturnEntityType {
  String get label {
    switch (this) {
      case ReturnEntityType.chemist:
        return 'Chemist / Retailer';
      case ReturnEntityType.stockist:
        return 'Stockist / Distributor';
      case ReturnEntityType.hospitalClinic:
        return 'Hospital / Clinic';
      case ReturnEntityType.doctor:
        return 'Doctor Sample Return';
    }
  }

  String get iconEmoji {
    switch (this) {
      case ReturnEntityType.chemist:
        return '🏪';
      case ReturnEntityType.stockist:
        return '🏢';
      case ReturnEntityType.hospitalClinic:
        return '🏥';
      case ReturnEntityType.doctor:
        return '👨‍⚕️';
    }
  }

  Color get badgeColor {
    switch (this) {
      case ReturnEntityType.chemist:
        return const Color(0xFF10B981);
      case ReturnEntityType.stockist:
        return const Color(0xFF0288D1);
      case ReturnEntityType.hospitalClinic:
        return const Color(0xFF8E24AA);
      case ReturnEntityType.doctor:
        return const Color(0xFFE65100);
    }
  }
}

enum ReturnReason {
  expiredStock,
  nearExpiry,
  transitDamage,
  slowMovingExcess,
  qualityRecall,
  doctorSampleRecall,
}

extension ReturnReasonExtension on ReturnReason {
  String get label {
    switch (this) {
      case ReturnReason.expiredStock:
        return 'Expired Stock';
      case ReturnReason.nearExpiry:
        return 'Near Expiry (< 90 Days)';
      case ReturnReason.transitDamage:
        return 'Breakage / Transit Damage';
      case ReturnReason.slowMovingExcess:
        return 'Slow Moving / Excess Stock';
      case ReturnReason.qualityRecall:
        return 'Quality Defect / Batch Recall';
      case ReturnReason.doctorSampleRecall:
        return 'Physician Sample Recall / Return';
    }
  }

  Color get color {
    switch (this) {
      case ReturnReason.expiredStock:
        return const Color(0xFFDC2626);
      case ReturnReason.nearExpiry:
        return const Color(0xFFF59E0B);
      case ReturnReason.transitDamage:
        return const Color(0xFFEA580C);
      case ReturnReason.slowMovingExcess:
        return const Color(0xFF6366F1);
      case ReturnReason.qualityRecall:
        return const Color(0xFFB91C1C);
      case ReturnReason.doctorSampleRecall:
        return const Color(0xFF0284C7);
    }
  }
}

enum ReturnSettlement {
  creditNote,
  stockReplacement,
  debitAdjustment,
}

extension ReturnSettlementExtension on ReturnSettlement {
  String get label {
    switch (this) {
      case ReturnSettlement.creditNote:
        return 'Credit Note Issued';
      case ReturnSettlement.stockReplacement:
        return 'Direct Stock Replacement';
      case ReturnSettlement.debitAdjustment:
        return 'Account Ledger Adjustment';
    }
  }
}

class ReturnClaimModel {
  final String id;
  final DateTime date;
  final ReturnEntityType entityType;
  final String entityId;
  final String entityName;
  final String patch;
  final bool isSampleReturn;
  final String productId;
  final String productName;
  final String batchNumber;
  final String expiryDate;
  final int quantity;
  final String unit;
  final double unitPrice;
  final ReturnReason reason;
  final String? reasonDescription;
  final ReturnSettlement settlementPreference;
  final String status; // 'Submitted', 'Approved', 'Depot Received', 'Credit Settled', 'Rejected'
  final String? managerRemarks;
  final String? billPhotoName;
  final String? creditNoteNumber;
  final DateTime? pickupDate;

  ReturnClaimModel({
    required this.id,
    required this.date,
    required this.entityType,
    required this.entityId,
    required this.entityName,
    required this.patch,
    this.isSampleReturn = false,
    required this.productId,
    required this.productName,
    required this.batchNumber,
    required this.expiryDate,
    required this.quantity,
    this.unit = 'Packs',
    required this.unitPrice,
    required this.reason,
    this.reasonDescription,
    this.settlementPreference = ReturnSettlement.creditNote,
    this.status = 'Submitted',
    this.managerRemarks,
    this.billPhotoName,
    this.creditNoteNumber,
    this.pickupDate,
  });

  double get totalClaimValue => quantity * unitPrice;

  ReturnClaimModel copyWith({
    String? id,
    DateTime? date,
    ReturnEntityType? entityType,
    String? entityId,
    String? entityName,
    String? patch,
    bool? isSampleReturn,
    String? productId,
    String? productName,
    String? batchNumber,
    String? expiryDate,
    int? quantity,
    String? unit,
    double? unitPrice,
    ReturnReason? reason,
    String? reasonDescription,
    ReturnSettlement? settlementPreference,
    String? status,
    String? managerRemarks,
    String? billPhotoName,
    String? creditNoteNumber,
    DateTime? pickupDate,
  }) {
    return ReturnClaimModel(
      id: id ?? this.id,
      date: date ?? this.date,
      entityType: entityType ?? this.entityType,
      entityId: entityId ?? this.entityId,
      entityName: entityName ?? this.entityName,
      patch: patch ?? this.patch,
      isSampleReturn: isSampleReturn ?? this.isSampleReturn,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      batchNumber: batchNumber ?? this.batchNumber,
      expiryDate: expiryDate ?? this.expiryDate,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      unitPrice: unitPrice ?? this.unitPrice,
      reason: reason ?? this.reason,
      reasonDescription: reasonDescription ?? this.reasonDescription,
      settlementPreference: settlementPreference ?? this.settlementPreference,
      status: status ?? this.status,
      managerRemarks: managerRemarks ?? this.managerRemarks,
      billPhotoName: billPhotoName ?? this.billPhotoName,
      creditNoteNumber: creditNoteNumber ?? this.creditNoteNumber,
      pickupDate: pickupDate ?? this.pickupDate,
    );
  }
}
