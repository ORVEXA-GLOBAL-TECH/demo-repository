import 'dart:async';
import 'package:flutter/material.dart';
import '../models/gps_tracking_model.dart';

class GpsTrackingProvider extends ChangeNotifier {
  bool _isLiveTracking = true;
  MovementStatus _currentStatus = MovementStatus.moving;
  double _currentSpeedKmh = 24.5;
  final int _batteryLevelPercent = 88;
  String _currentAddress = 'Linking Road, Near Khar Telephone Exchange, Bandra West';
  final double _currentLatitude = 19.0600;
  final double _currentLongitude = 72.8360;

  // Day Tracking
  final DateTime _startDayTime = DateTime.now().subtract(const Duration(hours: 6, minutes: 20));
  final String _startLocation = 'Bandra West Railway Station (HQ Entry)';
  final double _startOdometer = 14230.0;

  DateTime? _endDayTime;
  String? _endLocation;
  double? _endOdometer;

  final double _totalDistanceKm = 38.4;
  Timer? _livePulseTimer;

  // Active check-in state
  FieldCheckInOutEvent? _activeCheckIn;

  // Events & Timeline
  final List<FieldCheckInOutEvent> _checkInOutEvents = [];
  final List<IdleTimeEvent> _idleEvents = [];
  final List<GpsBreadcrumbPoint> _breadcrumbs = [];

  GpsTrackingProvider() {
    _seedMockTimelineData();
    _startPulseSimulation();
  }

  @override
  void dispose() {
    _livePulseTimer?.cancel();
    super.dispose();
  }

  // Getters
  bool get isLiveTracking => _isLiveTracking;
  MovementStatus get currentStatus => _currentStatus;
  double get currentSpeedKmh => _currentSpeedKmh;
  int get batteryLevelPercent => _batteryLevelPercent;
  String get currentAddress => _currentAddress;
  double get currentLatitude => _currentLatitude;
  double get currentLongitude => _currentLongitude;

  DateTime get startDayTime => _startDayTime;
  String get startLocation => _startLocation;
  double get startOdometer => _startOdometer;
  DateTime? get endDayTime => _endDayTime;
  String? get endLocation => _endLocation;
  double? get endOdometer => _endOdometer;
  double get totalDistanceKm => _totalDistanceKm;

  FieldCheckInOutEvent? get activeCheckIn => _activeCheckIn;
  List<FieldCheckInOutEvent> get checkInOutEvents => List.unmodifiable(_checkInOutEvents);
  List<IdleTimeEvent> get idleEvents => List.unmodifiable(_idleEvents);
  List<GpsBreadcrumbPoint> get breadcrumbs => List.unmodifiable(_breadcrumbs);

  int get totalShiftMinutes => DateTime.now().difference(_startDayTime).inMinutes;

  int get totalInClinicMinutes => _checkInOutEvents
      .where((e) => e.entityType == 'Doctor')
      .fold(0, (sum, e) => sum + e.durationMinutes);

  int get totalInChemistMinutes => _checkInOutEvents
      .where((e) => e.entityType == 'Chemist' || e.entityType == 'Stockist')
      .fold(0, (sum, e) => sum + e.durationMinutes);

  int get totalIdleMinutes => _idleEvents.fold(0, (sum, e) => sum + e.durationMinutes);

  int get totalTransitMinutes {
    final net = totalShiftMinutes - totalInClinicMinutes - totalInChemistMinutes - totalIdleMinutes;
    return net > 0 ? net : 65;
  }

  void toggleLiveTracking() {
    _isLiveTracking = !_isLiveTracking;
    notifyListeners();
  }

  void _startPulseSimulation() {
    _livePulseTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (!_isLiveTracking) return;
      // Realistic GPS drift and speed pulse
      _currentSpeedKmh = (_currentSpeedKmh > 0) ? (_currentSpeedKmh == 24.5 ? 28.0 : 24.5) : 0.0;
      notifyListeners();
    });
  }

  void performCheckIn({
    required String entityId,
    required String entityName,
    required String entityType,
    required String address,
    required double lat,
    required double lng,
  }) {
    final event = FieldCheckInOutEvent(
      id: 'chk_${DateTime.now().millisecondsSinceEpoch}',
      entityId: entityId,
      entityName: entityName,
      entityType: entityType,
      locationAddress: address,
      checkInTime: DateTime.now(),
      latitude: lat,
      longitude: lng,
      isGeofenceVerified: true,
    );

    _activeCheckIn = event;
    _currentStatus = entityType == 'Doctor' ? MovementStatus.inClinic : MovementStatus.inPharmacy;
    _currentSpeedKmh = 0.0;
    _currentAddress = address;

    _breadcrumbs.insert(
      0,
      GpsBreadcrumbPoint(
        id: 'pt_${DateTime.now().millisecondsSinceEpoch}',
        latitude: lat,
        longitude: lng,
        locationName: '$entityName ($address)',
        timestamp: DateTime.now(),
        activity: '$entityType Check-In',
        speedKmh: 0.0,
      ),
    );

    notifyListeners();
  }

  void performCheckOut({String? notes}) {
    if (_activeCheckIn != null) {
      final finished = FieldCheckInOutEvent(
        id: _activeCheckIn!.id,
        entityId: _activeCheckIn!.entityId,
        entityName: _activeCheckIn!.entityName,
        entityType: _activeCheckIn!.entityType,
        locationAddress: _activeCheckIn!.locationAddress,
        checkInTime: _activeCheckIn!.checkInTime,
        checkOutTime: DateTime.now(),
        latitude: _activeCheckIn!.latitude,
        longitude: _activeCheckIn!.longitude,
        isGeofenceVerified: true,
        outcomeNotes: notes ?? 'Visit completed and logged.',
      );

      _checkInOutEvents.insert(0, finished);
      _activeCheckIn = null;
      _currentStatus = MovementStatus.moving;
      _currentSpeedKmh = 22.0;

      notifyListeners();
    }
  }

  void endDay({required String location, required double closingOdometer}) {
    _endDayTime = DateTime.now();
    _endLocation = location;
    _endOdometer = closingOdometer;
    _currentStatus = MovementStatus.stationary;
    _currentSpeedKmh = 0.0;
    _isLiveTracking = false;
    notifyListeners();
  }

  DailyGpsRouteReport generateDailyReport() {
    return DailyGpsRouteReport(
      id: 'gps_rep_${DateTime.now().millisecondsSinceEpoch}',
      date: DateTime.now(),
      mrName: 'Rohan Deshmukh',
      empCode: 'EMP-7842',
      territory: 'Bandra - Khar West Patch A',
      startDayTime: _startDayTime,
      startLocation: _startLocation,
      startOdometer: _startOdometer,
      endDayTime: _endDayTime ?? DateTime.now(),
      endLocation: _endLocation ?? _currentAddress,
      endOdometer: _endOdometer ?? (_startOdometer + _totalDistanceKm),
      totalDistanceKm: _totalDistanceKm,
      totalShiftMinutes: totalShiftMinutes,
      totalTransitMinutes: totalTransitMinutes,
      totalClinicMinutes: totalInClinicMinutes,
      totalIdleMinutes: totalIdleMinutes,
      checkInOutEvents: _checkInOutEvents,
      idleEvents: _idleEvents,
      breadcrumbs: _breadcrumbs,
      complianceScore: 98,
    );
  }

  void _seedMockTimelineData() {
    final now = DateTime.now();

    // Past check-in/out events for today
    _checkInOutEvents.addAll([
      FieldCheckInOutEvent(
        id: 'chk_1',
        entityId: 'doc_1',
        entityName: 'Dr. Rajesh Sharma',
        entityType: 'Doctor',
        locationAddress: 'Calmette National Referral Hospital, Daun Penh',
        checkInTime: now.subtract(const Duration(hours: 5, minutes: 30)),
        checkOutTime: now.subtract(const Duration(hours: 5, minutes: 2)),
        latitude: 11.5833,
        longitude: 104.9167,
        isGeofenceVerified: true,
        outcomeNotes: 'Primary molecule detailing done. Committed 3 Rx/day for CardioVasc-AM.',
      ),
      FieldCheckInOutEvent(
        id: 'chk_2',
        entityId: 'chem_1',
        entityName: 'Sai Medicos & Pharmacy Depot',
        entityType: 'Chemist',
        locationAddress: 'Preah Norodom Blvd, Daun Penh',
        checkInTime: now.subtract(const Duration(hours: 4, minutes: 45)),
        checkOutTime: now.subtract(const Duration(hours: 4, minutes: 25)),
        latitude: 11.5621,
        longitude: 104.9280,
        isGeofenceVerified: true,
        outcomeNotes: 'POB Booked: \$185. Verified stock of GlycoSmart-D10.',
      ),
      FieldCheckInOutEvent(
        id: 'chk_3',
        entityId: 'doc_2',
        entityName: 'Dr. Priya Nair',
        entityType: 'Doctor',
        locationAddress: 'Royal Phnom Penh Multi-Specialty Hospital, Russian Blvd',
        checkInTime: now.subtract(const Duration(hours: 3, minutes: 15)),
        checkOutTime: now.subtract(const Duration(hours: 2, minutes: 40)),
        latitude: 11.5685,
        longitude: 104.8907,
        isGeofenceVerified: true,
        outcomeNotes: 'Sample handed over: 4 strips GlycoSmart-D10. Doctor requested clinical trial paper.',
      ),
      FieldCheckInOutEvent(
        id: 'chk_4',
        entityId: 'stk_1',
        entityName: 'Apollo Pharma Wholesale Depot',
        entityType: 'Stockist',
        locationAddress: 'Russian Federation Blvd Wholesale Zone, Phnom Penh',
        checkInTime: now.subtract(const Duration(hours: 1, minutes: 40)),
        checkOutTime: now.subtract(const Duration(hours: 1, minutes: 10)),
        latitude: 11.5645,
        longitude: 104.8850,
        isGeofenceVerified: true,
        outcomeNotes: 'Primary order booked \$450. Cheque collected \$300.',
      ),
    ]);

    // Idle Time Stoppages Detected
    _idleEvents.addAll([
      IdleTimeEvent(
        id: 'idle_1',
        locationName: 'Monivong Blvd Traffic Junction / Signal Halt',
        startTime: now.subtract(const Duration(hours: 4, minutes: 0)),
        endTime: now.subtract(const Duration(hours: 3, minutes: 42)),
        durationMinutes: 18,
        reason: 'Peak traffic standstill at Monivong Junction',
      ),
      IdleTimeEvent(
        id: 'idle_2',
        locationName: 'Daun Penh Lunch Break & Non-Field Transit',
        startTime: now.subtract(const Duration(hours: 2, minutes: 25)),
        endTime: now.subtract(const Duration(hours: 1, minutes: 50)),
        durationMinutes: 35,
        reason: 'Lunch break and daily log review',
      ),
    ]);

    // Breadcrumb Points
    _breadcrumbs.addAll([
      GpsBreadcrumbPoint(
        id: 'pt_1',
        latitude: 11.5564,
        longitude: 104.9282,
        locationName: 'Phnom Penh Central HQ (Monivong Blvd Start)',
        timestamp: now.subtract(const Duration(hours: 6, minutes: 20)),
        speedKmh: 12.0,
        activity: 'Shift Start (Punch-In)',
      ),
      GpsBreadcrumbPoint(
        id: 'pt_2',
        latitude: 11.5833,
        longitude: 104.9167,
        locationName: 'Calmette National Referral Hospital',
        timestamp: now.subtract(const Duration(hours: 5, minutes: 30)),
        speedKmh: 0.0,
        activity: 'Doctor Call Check-In',
      ),
      GpsBreadcrumbPoint(
        id: 'pt_3',
        latitude: 11.5621,
        longitude: 104.9280,
        locationName: 'Sai Medicos & Pharmacy Depot',
        timestamp: now.subtract(const Duration(hours: 4, minutes: 45)),
        speedKmh: 0.0,
        activity: 'Chemist Call Check-In',
      ),
      GpsBreadcrumbPoint(
        id: 'pt_4',
        latitude: 11.5600,
        longitude: 104.9250,
        locationName: 'Monivong Blvd Signal Halt',
        timestamp: now.subtract(const Duration(hours: 4, minutes: 0)),
        speedKmh: 0.0,
        activity: 'Traffic Idle Stoppage',
      ),
      GpsBreadcrumbPoint(
        id: 'pt_5',
        latitude: 11.5685,
        longitude: 104.8907,
        locationName: 'Royal Phnom Penh Multi-Specialty Hospital',
        timestamp: now.subtract(const Duration(hours: 3, minutes: 15)),
        speedKmh: 0.0,
        activity: 'Doctor Call Check-In',
      ),
      GpsBreadcrumbPoint(
        id: 'pt_6',
        latitude: 11.5645,
        longitude: 104.8850,
        locationName: 'Apollo Pharma Wholesale Depot',
        timestamp: now.subtract(const Duration(hours: 1, minutes: 40)),
        speedKmh: 0.0,
        activity: 'Stockist Call Check-In',
      ),
      GpsBreadcrumbPoint(
        id: 'pt_7',
        latitude: 11.5580,
        longitude: 104.9150,
        locationName: 'Preah Norodom Blvd Active Transit',
        timestamp: now.subtract(const Duration(minutes: 5)),
        speedKmh: 24.5,
        activity: 'In Transit',
      ),
    ]);
  }
}
