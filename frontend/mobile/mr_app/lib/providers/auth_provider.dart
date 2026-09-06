import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/mock_data_service.dart';
import '../services/device_security_service.dart';
import '../services/biometric_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel _currentUser = MockDataService.getInitialUser();
  bool _isAuthenticated = true;
  bool _isMfaEnabled = true;

  UserModel get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;
  bool get isMfaEnabled => _isMfaEnabled;
  DeviceBindingInfo get deviceBinding => DeviceSecurityService().currentDevice;

  void toggleMfa(bool enabled) {
    _isMfaEnabled = enabled;
    notifyListeners();
  }

  void punchIn({
    String location = 'Field Area HQ - South Zone',
    double startOdometerKm = 14230.0,
    String workType = 'Field Work',
  }) {
    _currentUser = _currentUser.copyWith(
      isPunchedIn: true,
      punchInTime: DateTime.now(),
      punchInLocation: location,
      startOdometerKm: startOdometerKm,
      workType: workType,
    );
    notifyListeners();
  }

  void punchOut({
    double endOdometerKm = 14265.0,
  }) {
    _currentUser = _currentUser.copyWith(
      isPunchedIn: false,
      punchOutTime: DateTime.now(),
      endOdometerKm: endOdometerKm,
    );
    notifyListeners();
  }

  void updateWorkType(String workType) {
    _currentUser = _currentUser.copyWith(workType: workType);
    notifyListeners();
  }

  void updateUser(UserModel user) {
    _currentUser = user;
    notifyListeners();
  }

  void login(String username, String password) {
    _isAuthenticated = true;
    notifyListeners();
  }

  Future<bool> authenticateWithFingerprint() async {
    final success = await BiometricService.authenticate(
      isFaceId: false,
      reason: 'Scan your Fingerprint to login to Alleviare MR App',
    );
    if (success) {
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  void logout() {
    _isAuthenticated = false;
    notifyListeners();
  }
}
