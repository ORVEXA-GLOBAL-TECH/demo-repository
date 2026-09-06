import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

enum AppCurrency {
  usd('USD', '\$', 'US Dollar', 1.0),
  khr('KHR', '៛', 'Cambodian Riel', 4100.0);

  final String code;
  final String symbol;
  final String name;
  final double exchangeRateFromUsd; // 1 USD = 4,100 KHR

  const AppCurrency(this.code, this.symbol, this.name, this.exchangeRateFromUsd);
}

class CurrencyProvider extends ChangeNotifier {
  AppCurrency _currentCurrency = AppCurrency.usd;

  AppCurrency get currentCurrency => _currentCurrency;
  bool get isUsd => _currentCurrency == AppCurrency.usd;
  bool get isKhr => _currentCurrency == AppCurrency.khr;
  bool get isInr => false;
  String get symbol => _currentCurrency.symbol;
  String get code => _currentCurrency.code;

  void setCurrency(AppCurrency currency) {
    if (_currentCurrency != currency) {
      _currentCurrency = currency;
      notifyListeners();
    }
  }

  void toggleCurrency() {
    if (_currentCurrency == AppCurrency.usd) {
      _currentCurrency = AppCurrency.khr;
    } else {
      _currentCurrency = AppCurrency.usd;
    }
    notifyListeners();
  }

  /// Converts a base USD amount to the currently selected currency and formats it cleanly
  String format(double usdAmount) {
    if (_currentCurrency == AppCurrency.usd) {
      final formatter = NumberFormat.currency(
        symbol: '\$',
        decimalDigits: usdAmount % 1 == 0 ? 0 : 2,
      );
      return formatter.format(usdAmount);
    } else {
      final khrAmount = usdAmount * AppCurrency.khr.exchangeRateFromUsd;
      final formatter = NumberFormat.currency(
        symbol: '៛',
        locale: 'km_KH',
        decimalDigits: 0,
      );
      return formatter.format(khrAmount);
    }
  }

  /// Converts a base USD amount to a compact readable string (e.g. $1.2k or ៛4.9M)
  String formatCompact(double usdAmount) {
    if (_currentCurrency == AppCurrency.usd) {
      if (usdAmount >= 1000000) {
        return '\$${(usdAmount / 1000000).toStringAsFixed(1)}M';
      } else if (usdAmount >= 1000) {
        return '\$${(usdAmount / 1000).toStringAsFixed(1)}k';
      }
      return '\$${usdAmount.toStringAsFixed(0)}';
    } else {
      final khrAmount = usdAmount * AppCurrency.khr.exchangeRateFromUsd;
      if (khrAmount >= 1000000000) {
        return '៛${(khrAmount / 1000000000).toStringAsFixed(1)}B';
      } else if (khrAmount >= 1000000) {
        return '៛${(khrAmount / 1000000).toStringAsFixed(1)}M';
      } else if (khrAmount >= 1000) {
        return '៛${(khrAmount / 1000).toStringAsFixed(0)}k';
      }
      return '៛${khrAmount.toStringAsFixed(0)}';
    }
  }
}
