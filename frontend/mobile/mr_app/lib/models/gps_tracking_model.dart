enum MovementStatus {
  moving,
  stationary,
  inClinic,
  inPharmacy,
  idleHalt,
}

extension MovementStatusExtension on MovementStatus {
  String get label {
    switch (this) {
      case MovementStatus.moving:
        return 'In Transit (Moving)';
      case MovementStatus.stationary:
        return 'Stationary (Field Active)';
      case MovementStatus.inClinic:
        return 'In Doctor Clinic Call';
      case MovementStatus.inPharmacy:
        return 'In Chemist Store Call';
      case MovementStatus.idleHalt:
        return 'Idle Stoppage Detected';
    }
  }
}

class GpsBreadcrumbPoint {
  final String id;
  final double latitude;
  final double longitude;
  final String locationName;
  final DateTime timestamp;
  final double speedKmh;
  final String activity; // 'Transit', 'Doctor Visit', 'Chemist Visit', 'Idle Halt'
  final bool isGeoVerified;

  GpsBreadcrumbPoint({
    required this.id,
    required this.latitude,
    required this.longitude,
    required this.locationName,
    required this.timestamp,
    this.speedKmh = 0.0,
    required this.activity,
    this.isGeoVerified = true,
  });
}

class FieldCheckInOutEvent {
  final String id;
  final String entityId;
  final String entityName;
  final String entityType; // 'Doctor', 'Chemist', 'Stockist'
  final String locationAddress;
  final DateTime checkInTime;
  final DateTime? checkOutTime;
  final double latitude;
  final double longitude;
  final bool isGeofenceVerified;
  final String? outcomeNotes;

  FieldCheckInOutEvent({
    required this.id,
    required this.entityId,
    required this.entityName,
    required this.entityType,
    required this.locationAddress,
    required this.checkInTime,
    this.checkOutTime,
    required this.latitude,
    required this.longitude,
    this.isGeofenceVerified = true,
    this.outcomeNotes,
  });

  int get durationMinutes {
    if (checkOutTime == null) {
      return DateTime.now().difference(checkInTime).inMinutes;
    }
    return checkOutTime!.difference(checkInTime).inMinutes;
  }
}

class IdleTimeEvent {
  final String id;
  final String locationName;
  final DateTime startTime;
  final DateTime endTime;
  final int durationMinutes;
  final String reason; // 'Traffic Congestion', 'Doctor Waiting Room', 'Lunch Break'

  IdleTimeEvent({
    required this.id,
    required this.locationName,
    required this.startTime,
    required this.endTime,
    required this.durationMinutes,
    required this.reason,
  });
}

class DailyGpsRouteReport {
  final String id;
  final DateTime date;
  final String mrName;
  final String empCode;
  final String territory;
  final DateTime startDayTime;
  final String startLocation;
  final double startOdometer;
  final DateTime? endDayTime;
  final String? endLocation;
  final double? endOdometer;
  final double totalDistanceKm;
  final int totalShiftMinutes;
  final int totalTransitMinutes;
  final int totalClinicMinutes;
  final int totalIdleMinutes;
  final List<FieldCheckInOutEvent> checkInOutEvents;
  final List<IdleTimeEvent> idleEvents;
  final List<GpsBreadcrumbPoint> breadcrumbs;
  final int complianceScore; // e.g., 98%

  DailyGpsRouteReport({
    required this.id,
    required this.date,
    required this.mrName,
    required this.empCode,
    required this.territory,
    required this.startDayTime,
    required this.startLocation,
    required this.startOdometer,
    this.endDayTime,
    this.endLocation,
    this.endOdometer,
    required this.totalDistanceKm,
    required this.totalShiftMinutes,
    required this.totalTransitMinutes,
    required this.totalClinicMinutes,
    required this.totalIdleMinutes,
    required this.checkInOutEvents,
    required this.idleEvents,
    required this.breadcrumbs,
    this.complianceScore = 98,
  });
}
