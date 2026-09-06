import 'dart:async';
import 'package:flutter/material.dart';
import '../services/biometric_service.dart';

class SessionProvider extends ChangeNotifier {
  static const int sessionTimeoutSeconds = 300; // 5 Minutes (300 seconds)
  static const int warningThresholdSeconds = 30; // Warning shown at last 30s

  int _remainingSeconds = sessionTimeoutSeconds;
  bool _isLocked = false;
  bool _isWarningActive = false;
  bool _isTrackingActive = false;
  Timer? _countdownTimer;

  int get remainingSeconds => _remainingSeconds;
  bool get isLocked => _isLocked;
  bool get isWarningActive => _isWarningActive;
  bool get isTrackingActive => _isTrackingActive;

  String get formattedRemainingTime {
    final minutes = _remainingSeconds ~/ 60;
    final seconds = _remainingSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  /// Start 5-minute inactivity watcher after successful MR login
  void startSessionTracking() {
    _isTrackingActive = true;
    _isLocked = false;
    _isWarningActive = false;
    _remainingSeconds = sessionTimeoutSeconds;
    _startTimer();
    notifyListeners();
  }

  /// Stop inactivity watcher (e.g. on logout)
  void stopSessionTracking() {
    _isTrackingActive = false;
    _isLocked = false;
    _isWarningActive = false;
    _countdownTimer?.cancel();
    notifyListeners();
  }

  /// Record user interaction (called by global pointer/touch listener)
  void recordUserActivity() {
    if (!_isTrackingActive || _isLocked) return;

    final wasWarning = _isWarningActive;
    _remainingSeconds = sessionTimeoutSeconds;
    _isWarningActive = false;

    if (wasWarning) {
      notifyListeners();
    }
  }

  void _startTimer() {
    _countdownTimer?.cancel();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!_isTrackingActive || _isLocked) return;

      if (_remainingSeconds > 0) {
        _remainingSeconds--;
        if (_remainingSeconds <= warningThresholdSeconds && !_isWarningActive) {
          _isWarningActive = true;
          notifyListeners();
        } else if (_remainingSeconds % 10 == 0 || _isWarningActive) {
          notifyListeners();
        }
      } else {
        // 5 Minutes Elapsed -> Lock Session
        _isLocked = true;
        _isWarningActive = false;
        timer.cancel();
        notifyListeners();
      }
    });
  }

  /// Manually lock session
  void lockSessionNow() {
    if (!_isTrackingActive) return;
    _isLocked = true;
    _isWarningActive = false;
    _countdownTimer?.cancel();
    notifyListeners();
  }

  /// Unlock session with fingerprint biometric verification
  Future<bool> unlockWithFingerprint() async {
    final success = await BiometricService.authenticate(
      isFaceId: false,
      reason: 'Scan your Fingerprint to resume your Alleviare MR session',
    );

    if (success) {
      _isLocked = false;
      _isWarningActive = false;
      _remainingSeconds = sessionTimeoutSeconds;
      _startTimer();
      notifyListeners();
      return true;
    }
    return false;
  }

  /// Unlock session with password
  bool unlockWithPassword(String password) {
    if (password == 'pharma123' || password == 'admin123' || password.length >= 6) {
      _isLocked = false;
      _isWarningActive = false;
      _remainingSeconds = sessionTimeoutSeconds;
      _startTimer();
      notifyListeners();
      return true;
    }
    return false;
  }
}
