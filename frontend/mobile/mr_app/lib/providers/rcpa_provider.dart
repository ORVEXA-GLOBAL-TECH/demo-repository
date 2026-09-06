import 'package:flutter/material.dart';
import '../models/rcpa_model.dart';
import '../services/mock_data_service.dart';

class RcpaProvider extends ChangeNotifier {
  final List<RcpaModel> _audits = MockDataService.getSampleRcpa();

  List<RcpaModel> get audits => _audits;

  int get totalAuditsCount => _audits.length;

  void addAudit(RcpaModel audit) {
    _audits.insert(0, audit);
    notifyListeners();
  }

  double calculateDoctorMarketShare(String doctorId) {
    final doctorAudits = _audits.where((a) => a.doctorId == doctorId);
    if (doctorAudits.isEmpty) return 0.0;

    int totalOwn = 0;
    int totalComp = 0;
    for (var audit in doctorAudits) {
      totalOwn += audit.totalOwnRx;
      totalComp += audit.totalCompetitorRx;
    }

    final grand = totalOwn + totalComp;
    return grand > 0 ? (totalOwn / grand) * 100 : 0.0;
  }
}
