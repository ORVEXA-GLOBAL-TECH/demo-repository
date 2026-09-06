import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'api_service.dart';

/// Periodic Background Geolocation Beacon for MR App
class LocationStreamService extends ChangeNotifier {
  static final LocationStreamService _instance = LocationStreamService._internal();
  factory LocationStreamService() => _instance;
  LocationStreamService._internal();

  Timer? _beaconTimer;
  bool _isStreaming = false;
  double _currentLat = 18.9820;
  double _currentLng = 72.8340;
  double _currentSpeed = 22.4;
  final int _batteryLevel = 88;
  String? _lastPingTime;

  bool get isStreaming => _isStreaming;
  double get latitude => _currentLat;
  double get longitude => _currentLng;
  double get speed => _currentSpeed;
  int get batteryLevel => _batteryLevel;
  String? get lastPingTime => _lastPingTime;

  /// Start periodic GPS beacon
  void startStreaming({Duration interval = const Duration(seconds: 20)}) {
    if (_isStreaming) return;

    _isStreaming = true;
    notifyListeners();

    // Send immediate ping
    _sendLocationPing();

    _beaconTimer = Timer.periodic(interval, (_) => _sendLocationPing());
  }

  /// Stop periodic GPS beacon
  void stopStreaming() {
    _beaconTimer?.cancel();
    _beaconTimer = null;
    _isStreaming = false;
    notifyListeners();
  }

  /// Send single coordinate ping to API Gateway / WebSocket bridge
  Future<void> _sendLocationPing() async {
    final user = ApiService().currentUser;
    final mrId = user?['userId'] ?? '22222222-2222-2222-2222-222222222208';
    final mrName = user?['fullName'] ?? 'Rahul Verma';

    // Simulate minor movement for field demonstration
    _currentLat += (0.0001 * (DateTime.now().second % 3 - 1));
    _currentLng += (0.0001 * (DateTime.now().second % 2 == 0 ? 1 : -1));
    _currentSpeed = 15.0 + (DateTime.now().second % 20);
    _lastPingTime = "${DateTime.now().hour}:${DateTime.now().minute.toString().padLeft(2, '0')}:${DateTime.now().second.toString().padLeft(2, '0')}";

    final payload = {
      'mrId': mrId,
      'mrName': mrName,
      'latitude': _currentLat,
      'longitude': _currentLng,
      'speed': _currentSpeed,
      'batteryLevel': _batteryLevel,
      'accuracy': 3.5,
      'timestamp': DateTime.now().toIso8601String(),
    };

    try {
      final endpoint = '${ApiService.baseUrl}/visits/location-ping';
      await http
          .post(
            Uri.parse(endpoint),
            headers: {
              'Content-Type': 'application/json',
              if (ApiService().token != null) 'Authorization': 'Bearer ${ApiService().token}',
            },
            body: jsonEncode(payload),
          )
          .timeout(const Duration(seconds: 5));
    } catch (e) {
      debugPrint('[LocationStreamService] Ping local simulation active: $e');
    }

    notifyListeners();
  }
}
