import 'package:flutter/material.dart';
import '../models/doctor_model.dart';
import '../models/chemist_model.dart';
import '../models/stockist_model.dart';
import '../models/facility_model.dart';
import '../services/mock_data_service.dart';

class DoctorProvider extends ChangeNotifier {
  final List<DoctorModel> _doctors = MockDataService.getDoctors();
  final List<ChemistModel> _chemists = MockDataService.getChemists();
  final List<StockistModel> _stockists = MockDataService.getStockists();
  final List<FacilityModel> _facilities = MockDataService.getFacilities();

  String _searchQuery = '';
  String _selectedSpecialty = 'All';
  String _selectedClass = 'All';
  String _selectedPatch = 'All';
  String _selectedSector = 'All'; // All, Private, Government
  String _selectedPracticeType = 'All'; // All, Hospital, Clinic, Pvt, Govt

  List<DoctorModel> get doctors => _doctors;
  List<ChemistModel> get chemists => _chemists;
  List<StockistModel> get stockists => _stockists;
  List<FacilityModel> get facilities => _facilities;

  // Convenience getters for doctor types
  List<DoctorModel> get hospitalDoctors => _doctors.where((d) => d.practiceType == DoctorPracticeType.hospitalDoctor || d.practiceType == DoctorPracticeType.govtDoctor).toList();
  List<DoctorModel> get clinicDoctors => _doctors.where((d) => d.practiceType == DoctorPracticeType.clinicDoctor).toList();
  List<DoctorModel> get pvtDoctors => _doctors.where((d) => d.practiceType == DoctorPracticeType.pvtDoctor).toList();
  List<DoctorModel> get govtDoctors => _doctors.where((d) => d.practiceType == DoctorPracticeType.govtDoctor).toList();

  String get searchQuery => _searchQuery;
  String get selectedSpecialty => _selectedSpecialty;
  String get selectedClass => _selectedClass;
  String get selectedPatch => _selectedPatch;
  String get selectedSector => _selectedSector;
  String get selectedPracticeType => _selectedPracticeType;

  List<String> get specialties {
    final list = _doctors.map((d) => d.specialty).toSet().toList();
    list.sort();
    return ['All', ...list];
  }

  List<String> get patches {
    final list = {
      ..._doctors.map((d) => d.patch),
      ..._chemists.map((c) => c.patch),
      ..._facilities.map((f) => f.patch),
    }.toList();
    list.sort();
    return ['All', ...list];
  }

  List<DoctorModel> get filteredDoctors {
    return _doctors.where((doctor) {
      final matchesSearch = doctor.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          doctor.clinicName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          doctor.practiceType.label.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesSpecialty = _selectedSpecialty == 'All' || doctor.specialty == _selectedSpecialty;
      final matchesClass = _selectedClass == 'All' || doctor.doctorClass.shortCode == _selectedClass;
      final matchesPatch = _selectedPatch == 'All' || doctor.patch == _selectedPatch;
      final matchesPractice = _selectedPracticeType == 'All' ||
          doctor.practiceType.label == _selectedPracticeType ||
          (_selectedPracticeType == 'Hospital' && (doctor.practiceType == DoctorPracticeType.hospitalDoctor || doctor.practiceType == DoctorPracticeType.govtDoctor)) ||
          (_selectedPracticeType == 'Clinic' && doctor.practiceType == DoctorPracticeType.clinicDoctor) ||
          (_selectedPracticeType == 'Pvt Doctor' && doctor.practiceType == DoctorPracticeType.pvtDoctor) ||
          (_selectedPracticeType == 'Govt Doctor' && doctor.practiceType == DoctorPracticeType.govtDoctor);

      return matchesSearch && matchesSpecialty && matchesClass && matchesPatch && matchesPractice;
    }).toList();
  }

  List<ChemistModel> get filteredChemists {
    return _chemists.where((chemist) {
      final matchesSearch = chemist.shopName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          chemist.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          chemist.address.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesPatch = _selectedPatch == 'All' || chemist.patch == _selectedPatch;
      return matchesSearch && matchesPatch;
    }).toList();
  }

  List<StockistModel> get filteredStockists {
    return _stockists.where((stockist) {
      final matchesSearch = stockist.agencyName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          stockist.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          stockist.address.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesSearch;
    }).toList();
  }

  List<FacilityModel> get filteredFacilities {
    return _facilities.where((facility) {
      final matchesSearch = facility.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          facility.contactPerson.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          facility.address.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesPatch = _selectedPatch == 'All' || facility.patch == _selectedPatch;
      final matchesSector = _selectedSector == 'All' || facility.sector.label == _selectedSector;
      return matchesSearch && matchesPatch && matchesSector;
    }).toList();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setSpecialtyFilter(String specialty) {
    _selectedSpecialty = specialty;
    notifyListeners();
  }

  void setClassFilter(String cls) {
    _selectedClass = cls;
    notifyListeners();
  }

  void setPatchFilter(String patch) {
    _selectedPatch = patch;
    notifyListeners();
  }

  void setSectorFilter(String sector) {
    _selectedSector = sector;
    notifyListeners();
  }

  void setPracticeTypeFilter(String practiceType) {
    _selectedPracticeType = practiceType;
    notifyListeners();
  }

  // ==========================================
  // DOCTORS: ADD & EDIT (NO DELETE FOR MR)
  // ==========================================
  void addDoctor(DoctorModel newDoctor) {
    _doctors.insert(0, newDoctor);
    notifyListeners();
  }

  void updateDoctor(DoctorModel updatedDoctor) {
    final idx = _doctors.indexWhere((d) => d.id == updatedDoctor.id);
    if (idx != -1) {
      _doctors[idx] = updatedDoctor;
      notifyListeners();
    }
  }

  // ==========================================
  // CHEMISTS / RETAILERS: ADD & EDIT (NO DELETE FOR MR)
  // ==========================================
  void addChemist(ChemistModel newChemist) {
    _chemists.insert(0, newChemist);
    notifyListeners();
  }

  void updateChemist(ChemistModel updatedChemist) {
    final idx = _chemists.indexWhere((c) => c.id == updatedChemist.id);
    if (idx != -1) {
      _chemists[idx] = updatedChemist;
      notifyListeners();
    }
  }

  // ==========================================
  // STOCKISTS: ADD & EDIT (NO DELETE FOR MR)
  // ==========================================
  void addStockist(StockistModel newStockist) {
    _stockists.insert(0, newStockist);
    notifyListeners();
  }

  void updateStockist(StockistModel updatedStockist) {
    final idx = _stockists.indexWhere((s) => s.id == updatedStockist.id);
    if (idx != -1) {
      _stockists[idx] = updatedStockist;
      notifyListeners();
    }
  }

  // ==========================================
  // CLINICS & HOSPITALS: ADD & EDIT (NO DELETE FOR MR)
  // ==========================================
  void addFacility(FacilityModel newFacility) {
    _facilities.insert(0, newFacility);
    notifyListeners();
  }

  void updateFacility(FacilityModel updatedFacility) {
    final idx = _facilities.indexWhere((f) => f.id == updatedFacility.id);
    if (idx != -1) {
      _facilities[idx] = updatedFacility;
      notifyListeners();
    }
  }

  void recordDoctorVisit(String doctorId) {
    final index = _doctors.indexWhere((d) => d.id == doctorId);
    if (index != -1) {
      final current = _doctors[index];
      _doctors[index] = current.copyWith(
        completedVisitsThisMonth: current.completedVisitsThisMonth + 1,
        lastVisitedDate: DateTime.now(),
      );
      notifyListeners();
    }
  }

  void recordChemistVisit(String chemistId) {
    final index = _chemists.indexWhere((c) => c.id == chemistId);
    if (index != -1) {
      final current = _chemists[index];
      _chemists[index] = current.copyWith(
        lastVisitedDate: DateTime.now(),
      );
      notifyListeners();
    }
  }

  DoctorModel? getDoctorById(String id) {
    try {
      return _doctors.firstWhere((d) => d.id == id);
    } catch (_) {
      return null;
    }
  }

  ChemistModel? getChemistById(String id) {
    try {
      return _chemists.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  StockistModel? getStockistById(String id) {
    try {
      return _stockists.firstWhere((s) => s.id == id);
    } catch (_) {
      return null;
    }
  }

  FacilityModel? getFacilityById(String id) {
    try {
      return _facilities.firstWhere((f) => f.id == id);
    } catch (_) {
      return null;
    }
  }
}
