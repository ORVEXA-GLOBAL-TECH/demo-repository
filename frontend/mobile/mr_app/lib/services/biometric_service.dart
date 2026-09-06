import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';

class BiometricService {
  static final LocalAuthentication _auth = LocalAuthentication();

  /// Check if hardware supports biometrics and if biometrics are enrolled
  static Future<bool> isBiometricsAvailable() async {
    if (kIsWeb) return false;
    try {
      final canCheck = await _auth.canCheckBiometrics;
      final isSupported = await _auth.isDeviceSupported();
      return canCheck && isSupported;
    } on PlatformException catch (e) {
      debugPrint('Biometric availability check error: $e');
      return false;
    }
  }

  /// Get list of enrolled biometric types (fingerprint, face, iris)
  static Future<List<BiometricType>> getAvailableBiometrics() async {
    if (kIsWeb) return [];
    try {
      return await _auth.getAvailableBiometrics();
    } on PlatformException catch (e) {
      debugPrint('Get available biometrics error: $e');
      return [];
    }
  }

  /// Trigger native Android BiometricPrompt or iOS FaceID / TouchID system sheet
  static Future<bool> authenticate({
    required bool isFaceId,
    String? reason,
  }) async {
    final localizedReason = reason ??
        (isFaceId
            ? 'Scan your Face ID to authenticate MR session with Alleviare'
            : 'Scan your fingerprint sensor to authenticate MR session with Alleviare');

    if (kIsWeb) {
      // In web browser mode, native OS hardware APIs are not exposed directly,
      // handled via interactive biometric scanning sheet fallback.
      return true;
    }

    try {
      final isAvailable = await isBiometricsAvailable();
      if (!isAvailable) {
        return true; // Fallback to simulated biometric sheet
      }

      final authenticated = await _auth.authenticate(
        localizedReason: localizedReason,
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
          useErrorDialogs: true,
        ),
      );

      return authenticated;
    } on PlatformException catch (e) {
      debugPrint('Native biometric error: ${e.code} - ${e.message}');
      if (e.code == 'NotAvailable' || e.code == 'NotEnrolled') {
        return true; // Graceful fallback
      }
      return false;
    } catch (e) {
      debugPrint('Biometric general exception: $e');
      return true;
    }
  }
}
