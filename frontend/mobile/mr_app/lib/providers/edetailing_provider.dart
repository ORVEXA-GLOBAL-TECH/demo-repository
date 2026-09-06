import 'package:flutter/material.dart';
import '../models/edetailing_model.dart';

class EdetailingProvider extends ChangeNotifier {
  final List<EdetailingSessionRecord> _sessions = [];
  final List<DigitalLeaveBehindItem> _leaveBehinds = [];
  final List<MedicalVideoAssetItem> _videoAssets = [];

  EdetailingProvider() {
    _seedInitialEdetailingData();
  }

  List<EdetailingSessionRecord> get sessions => List.unmodifiable(_sessions);
  List<DigitalLeaveBehindItem> get leaveBehinds => List.unmodifiable(_leaveBehinds);
  List<MedicalVideoAssetItem> get videoAssets => List.unmodifiable(_videoAssets);

  int get totalSessionsDone => _sessions.length;

  double get averageDurationMinutes {
    if (_sessions.isEmpty) return 4.5;
    final totalSec = _sessions.fold(0, (sum, s) => sum + s.totalDurationSeconds);
    return (totalSec / _sessions.length) / 60;
  }

  int get totalLBLsShared =>
      _sessions.where((s) => s.leaveBehindShared).length;

  int get averageEngagementScore {
    if (_sessions.isEmpty) return 95;
    final total = _sessions.fold(0, (sum, s) => sum + s.engagementScore);
    return (total / _sessions.length).round();
  }

  void recordPresentationSession({
    required String doctorId,
    required String doctorName,
    required String doctorSpecialty,
    required String productId,
    required String productName,
    required int totalDurationSeconds,
    required int slidesCoveredCount,
    required String physicianInterestRating,
    required String physicianFeedback,
    bool leaveBehindShared = true,
  }) {
    final session = EdetailingSessionRecord(
      id: 'edt_${DateTime.now().millisecondsSinceEpoch}',
      doctorId: doctorId,
      doctorName: doctorName,
      doctorSpecialty: doctorSpecialty,
      productId: productId,
      productName: productName,
      sessionDate: DateTime.now(),
      totalDurationSeconds: totalDurationSeconds,
      slidesCoveredCount: slidesCoveredCount,
      physicianInterestRating: physicianInterestRating,
      physicianFeedback: physicianFeedback,
      leaveBehindShared: leaveBehindShared,
      engagementScore: physicianInterestRating.contains('High') ? 98 : (physicianInterestRating.contains('Interested') ? 92 : 80),
    );

    _sessions.insert(0, session);
    notifyListeners();
  }

  List<ClinicalStudyItem> getClinicalStudiesForProduct(String productId) {
    return [
      ClinicalStudyItem(
        studyName: 'TARGET-HTN Landmark Multicenter Trial',
        journalReference: 'Journal of the American College of Cardiology (JACC) 2025; 85(4): 412-421',
        sampleSize: 'n = 2,450 Patients across 48 Centers',
        primaryEndpoint: '24-hour ambulatory systolic blood pressure (SBP) reduction at Week 12',
        statisticalResult: 'Mean -24.8 mmHg reduction vs -16.2 mmHg standard therapy (p < 0.001)',
        keyConclusion: 'Dual ARB + CCB synergy achieves superior nocturnal BP dipping and 38% reduction in microalbuminuria without peripheral edema.',
      ),
      ClinicalStudyItem(
        studyName: 'DAPA-PROTECT Cardiovascular & Renal Safety Study',
        journalReference: 'New England Journal of Medicine (NEJM) 2025; 392: 108-119',
        sampleSize: 'n = 4,120 Type-2 Diabetes Patients',
        primaryEndpoint: 'Composite outcome of CV death, HF hospitalization, or renal composite endpoint',
        statisticalResult: 'Hazard Ratio: 0.68 (95% CI 0.58-0.79, p < 0.0001)',
        keyConclusion: '32% relative risk reduction in CV mortality with preserved eGFR slope over 24 months follow-up.',
      ),
      ClinicalStudyItem(
        studyName: 'NEURO-RELIEF Neuropathy Functional Recovery Study',
        journalReference: 'The Lancet Neurology 2024; 23(9): 884-895',
        sampleSize: 'n = 1,280 Diabetic Peripheral Neuropathy Patients',
        primaryEndpoint: 'Visual Analogue Scale (VAS) pain score reduction and nerve conduction velocity (NCV)',
        statisticalResult: '64% patients achieved >50% pain relief at Week 4 (p < 0.001)',
        keyConclusion: 'Pregabalin + Methylcobalamin restored sensory nerve amplitude with significantly lower somnolence compared to standard gabapentin.',
      ),
    ];
  }

  List<MoleculeComparisonItem> getDrugComparisonsForProduct(String productId) {
    return [
      MoleculeComparisonItem(
        feature: '24-Hour Plasma Half-Life (T1/2)',
        ourBrandValue: '24 Hours (True Once-Daily Coverage)',
        competitorValue: '9 - 12 Hours (Requires BID Dosing)',
        isOurBrandSuperior: true,
      ),
      MoleculeComparisonItem(
        feature: 'Pedal / Ankle Edema Incidence',
        ourBrandValue: '< 1.8% (Minimal due to balanced vasodilation)',
        competitorValue: '8.4% (Common CCB-induced side effect)',
        isOurBrandSuperior: true,
      ),
      MoleculeComparisonItem(
        feature: 'Cardio-Renal Protection Evidence',
        ourBrandValue: 'Proven Reduction in Proteinuria & eGFR Slope',
        competitorValue: 'BP lowering only, limited renal endpoint trial',
        isOurBrandSuperior: true,
      ),
      MoleculeComparisonItem(
        feature: 'Metabolic Neutrality / Lipid Profile',
        ourBrandValue: 'No adverse impact on serum glucose or lipids',
        competitorValue: 'May increase serum triglycerides over time',
        isOurBrandSuperior: true,
      ),
      MoleculeComparisonItem(
        feature: 'Patient Compliance & Packaging',
        ourBrandValue: 'Alu-Alu Moisture Barrier Pack with Day Markers',
        competitorValue: 'Standard Blister Pack without day markers',
        isOurBrandSuperior: true,
      ),
    ];
  }

  List<ClinicalFaqItem> getFaqsForProduct(String productId) {
    return [
      ClinicalFaqItem(
        question: 'When is the best time of day to administer this formulation?',
        answer: 'Due to its long elimination half-life of 24 hours, it can be administered either in the morning or evening with or without food. Evening administration is particularly advantageous for non-dipper hypertensive patients to control early morning blood pressure surge.',
        evidenceReference: 'Clin Pharmacokinet 2025; 64(2): 145-156',
      ),
      ClinicalFaqItem(
        question: 'Is dosage adjustment required in elderly or mild-to-moderate renal impairment?',
        answer: 'No dosage adjustment is required in elderly patients or patients with mild to moderate renal impairment (eGFR 30-60 mL/min). Clinical trials demonstrated consistent pharmacokinetics without drug accumulation.',
        evidenceReference: 'Kidney Int 2024; 106(5): 912-920',
      ),
      ClinicalFaqItem(
        question: 'What is the onset of action and time to peak therapeutic response?',
        answer: 'Significant therapeutic blood pressure and glycemic reduction is observed within 24 to 48 hours of initiation, with full steady-state maximal clinical efficacy achieved within 2 to 4 weeks of continuous once-daily therapy.',
        evidenceReference: 'Circulation 2025; 151(8): 620-631',
      ),
    ];
  }

  void _seedInitialEdetailingData() {
    final now = DateTime.now();

    _sessions.addAll([
      EdetailingSessionRecord(
        id: 'edt_1',
        doctorId: 'doc_1',
        doctorName: 'Dr. Sameer Kulkarni',
        doctorSpecialty: 'Cardiologist',
        productId: 'prod_1',
        productName: 'CardioVasc-AM',
        sessionDate: now.subtract(const Duration(hours: 4)),
        totalDurationSeconds: 290,
        slidesCoveredCount: 5,
        physicianInterestRating: 'High - Rx Committed',
        physicianFeedback: 'Impressed by the TARGET-HTN 24hr ambulatory BP data and low edema profile. Committed 3 Rx/day for stage-2 hypertensive patients.',
        leaveBehindShared: true,
        engagementScore: 98,
      ),
      EdetailingSessionRecord(
        id: 'edt_2',
        doctorId: 'doc_2',
        doctorName: 'Dr. Meera Nambiar',
        doctorSpecialty: 'Diabetologist',
        productId: 'prod_2',
        productName: 'GlycoSmart-D10',
        sessionDate: now.subtract(const Duration(hours: 2, minutes: 30)),
        totalDurationSeconds: 320,
        slidesCoveredCount: 4,
        physicianInterestRating: 'Interested - Trial Pack',
        physicianFeedback: 'Reviewed the DAPA-PROTECT renal trial outcomes. Requested 4 sample strips and patient diet charts for counter trial.',
        leaveBehindShared: true,
        engagementScore: 94,
      ),
      EdetailingSessionRecord(
        id: 'edt_3',
        doctorId: 'doc_3',
        doctorName: 'Dr. Vikram Sethi',
        doctorSpecialty: 'Neurologist',
        productId: 'prod_3',
        productName: 'Neurolin-Plus',
        sessionDate: now.subtract(const Duration(days: 1)),
        totalDurationSeconds: 240,
        slidesCoveredCount: 4,
        physicianInterestRating: 'High - Rx Committed',
        physicianFeedback: 'Agreed with NCV recovery data over standard gabapentin. Will initiate in post-herpetic and diabetic neuropathy cases.',
        leaveBehindShared: true,
        engagementScore: 96,
      ),
    ]);

    _leaveBehinds.addAll([
      DigitalLeaveBehindItem(
        id: 'lbl_1',
        title: 'CardioVasc-AM Comprehensive Physician Clinical Monograph',
        type: 'Clinical Whitepaper (JACC 2025)',
        fileSize: '2.4 MB PDF',
      ),
      DigitalLeaveBehindItem(
        id: 'lbl_2',
        title: 'GlycoSmart-D10 Evidence-Based Prescribing & Dosage Guide',
        type: 'Dosage Guide & Renal Chart',
        fileSize: '1.8 MB PDF',
      ),
      DigitalLeaveBehindItem(
        id: 'lbl_3',
        title: 'Hypertension & Diabetes Patient Dietary Lifestyle Chart',
        type: 'Patient Education Brochure',
        fileSize: '3.1 MB PDF',
      ),
      DigitalLeaveBehindItem(
        id: 'lbl_4',
        title: 'Neurolin-Plus Peripheral Neuropathy Nerve Recovery Monograph',
        type: 'Clinical Trial Whitepaper',
        fileSize: '2.0 MB PDF',
      ),
    ]);

    _videoAssets.addAll([
      MedicalVideoAssetItem(
        id: 'vid_1',
        title: 'CardioVasc-AM 3D Mechanism of Dual Vasodilation',
        duration: '01:45',
        category: '3D MoA Animation',
      ),
      MedicalVideoAssetItem(
        id: 'vid_2',
        title: 'SGLT2 + Metformin Synergistic Glucose Excretion 3D Video',
        duration: '02:10',
        category: '3D MoA Animation',
      ),
      MedicalVideoAssetItem(
        id: 'vid_3',
        title: 'KOL Expert Interview: Managing Refractory Hypertension (Dr. A. Mehta)',
        duration: '03:25',
        category: 'KOL Expert Review',
      ),
    ]);
  }
}
