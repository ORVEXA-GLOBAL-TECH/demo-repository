import 'package:flutter/material.dart';
import '../core/localization/app_strings.dart';

class LocaleProvider extends ChangeNotifier {
  AppLanguage _currentLanguage = AppLanguage.english;
  double _fontScale = 1.0;

  AppLanguage get currentLanguage => _currentLanguage;
  Locale get currentLocale => Locale(_currentLanguage.code);
  bool get isKhmer => _currentLanguage == AppLanguage.khmer;
  double get fontScale => _fontScale;

  String get fontScaleLabel {
    if (_fontScale <= 0.88) return 'Compact (85%)';
    if (_fontScale <= 1.05) return 'Standard (100%)';
    if (_fontScale <= 1.18) return 'Comfortable (112%)';
    return 'Large (125%)';
  }

  void setFontScale(double scale) {
    final clamped = scale.clamp(0.85, 1.30);
    if (_fontScale != clamped) {
      _fontScale = clamped;
      notifyListeners();
    }
  }

  void setLanguage(AppLanguage language) {
    if (_currentLanguage != language) {
      _currentLanguage = language;
      notifyListeners();
    }
  }

  void toggleLanguage() {
    if (_currentLanguage == AppLanguage.english) {
      _currentLanguage = AppLanguage.khmer;
    } else {
      _currentLanguage = AppLanguage.english;
    }
    notifyListeners();
  }

  String translate(String key) {
    return AppStrings.get(key, _currentLanguage);
  }
}

// Convenient context extension for fast translations
extension LocalizationContext on BuildContext {
  String tr(String key) {
    // Attempt to get from LocaleProvider if available, else fallback to AppStrings default
    try {
      final provider = (this as dynamic).read<LocaleProvider>();
      return provider.translate(key);
    } catch (_) {
      return AppStrings.get(key, AppLanguage.english);
    }
  }
}
