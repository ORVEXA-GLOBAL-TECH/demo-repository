import 'package:flutter/foundation.dart';

class DeviceBindingInfo {
  final String deviceId;
  final String deviceModel;
  final String osVersion;
  final DateTime boundAt;
  final bool isCurrentlyBound;
  final String boundUserEmpId;

  DeviceBindingInfo({
    required this.deviceId,
    required this.deviceModel,
    required this.osVersion,
    required this.boundAt,
    required this.isCurrentlyBound,
    required this.boundUserEmpId,
  });

  DeviceBindingInfo copyWith({
    String? deviceId,
    String? deviceModel,
    String? osVersion,
    DateTime? boundAt,
    bool? isCurrentlyBound,
    String? boundUserEmpId,
  }) {
    return DeviceBindingInfo(
      deviceId: deviceId ?? this.deviceId,
      deviceModel: deviceModel ?? this.deviceModel,
      osVersion: osVersion ?? this.osVersion,
      boundAt: boundAt ?? this.boundAt,
      isCurrentlyBound: isCurrentlyBound ?? this.isCurrentlyBound,
      boundUserEmpId: boundUserEmpId ?? this.boundUserEmpId,
    );
  }
}

class DeviceSecurityService {
  static final DeviceSecurityService _instance = DeviceSecurityService._internal();
  factory DeviceSecurityService() => _instance;
  DeviceSecurityService._internal();

  DeviceBindingInfo _currentDevice = DeviceBindingInfo(
    deviceId: 'ALV-DEV-7842-SEC',
    deviceModel: kIsWeb ? 'Chrome Web App (Secure Instance)' : 'Samsung Galaxy Enterprise (SM-S918B)',
    osVersion: kIsWeb ? 'Web Browser Engine' : 'Android 14 (Security Patch 2026.08)',
    boundAt: DateTime.now().subtract(const Duration(days: 14)),
    isCurrentlyBound: true,
    boundUserEmpId: 'EMP-7842',
  );

  DeviceBindingInfo get currentDevice => _currentDevice;

  /// Check if the incoming employee ID matches the device's bound user
  bool verifyDeviceBinding(String empId) {
    return _currentDevice.isCurrentlyBound && _currentDevice.boundUserEmpId == empId;
  }

  /// Request transfer of device binding to current device
  Future<bool> transferDeviceBinding(String empId, String transferOtp) async {
    // In production, verifies OTP with Backend User Service / Device Registry
    if (transferOtp == '7842' || transferOtp.length == 4) {
      _currentDevice = _currentDevice.copyWith(
        isCurrentlyBound: true,
        boundUserEmpId: empId,
        boundAt: DateTime.now(),
      );
      return true;
    }
    return false;
  }

  /// Reset / Unbind device
  void unbindDevice() {
    _currentDevice = _currentDevice.copyWith(isCurrentlyBound: false);
  }
}
