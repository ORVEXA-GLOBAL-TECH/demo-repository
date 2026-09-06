class ClinicalStudyItem {
  final String studyName;
  final String journalReference;
  final String sampleSize;
  final String primaryEndpoint;
  final String statisticalResult; // e.g. "p < 0.001 (Highly Significant)"
  final String keyConclusion;

  ClinicalStudyItem({
    required this.studyName,
    required this.journalReference,
    required this.sampleSize,
    required this.primaryEndpoint,
    required this.statisticalResult,
    required this.keyConclusion,
  });
}

class MoleculeComparisonItem {
  final String feature;
  final String ourBrandValue;
  final String competitorValue;
  final bool isOurBrandSuperior;

  MoleculeComparisonItem({
    required this.feature,
    required this.ourBrandValue,
    required this.competitorValue,
    this.isOurBrandSuperior = true,
  });
}

class ClinicalFaqItem {
  final String question;
  final String answer;
  final String evidenceReference;

  ClinicalFaqItem({
    required this.question,
    required this.answer,
    required this.evidenceReference,
  });
}

class DigitalLeaveBehindItem {
  final String id;
  final String title;
  final String type; // 'Clinical Whitepaper', 'Dosage Guide', 'Patient Diet Chart', 'E-Brochure'
  final String fileSize;
  final String iconType;

  DigitalLeaveBehindItem({
    required this.id,
    required this.title,
    required this.type,
    required this.fileSize,
    this.iconType = 'pdf',
  });
}

class MedicalVideoAssetItem {
  final String id;
  final String title;
  final String duration;
  final String category; // '3D MoA Animation', 'KOL Expert Review', 'Clinical Trial'
  final String thumbnailAsset;

  MedicalVideoAssetItem({
    required this.id,
    required this.title,
    required this.duration,
    required this.category,
    this.thumbnailAsset = 'video_thumb.jpg',
  });
}

class EdetailingSessionRecord {
  final String id;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialty;
  final String productId;
  final String productName;
  final DateTime sessionDate;
  final int totalDurationSeconds;
  final int slidesCoveredCount;
  final String physicianInterestRating; // 'High - Rx Committed', 'Interested - Trial Pack', 'Moderate', 'Low'
  final String physicianFeedback;
  final bool leaveBehindShared;
  final int engagementScore; // e.g. 96%

  EdetailingSessionRecord({
    required this.id,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialty,
    required this.productId,
    required this.productName,
    required this.sessionDate,
    required this.totalDurationSeconds,
    required this.slidesCoveredCount,
    required this.physicianInterestRating,
    required this.physicianFeedback,
    this.leaveBehindShared = true,
    this.engagementScore = 95,
  });
}
