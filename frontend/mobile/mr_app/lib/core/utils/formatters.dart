import 'package:intl/intl.dart';

class DateFormatter {
  static String formatDisplayDate(DateTime date) {
    return DateFormat('EEE, dd MMM yyyy').format(date);
  }

  static String formatShortDate(DateTime date) {
    return DateFormat('dd MMM').format(date);
  }

  static String formatTime(DateTime time) {
    return DateFormat('hh:mm a').format(time);
  }

  static String formatMonthYear(DateTime date) {
    return DateFormat('MMMM yyyy').format(date);
  }

  static String formatIsoDate(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }
}

class CurrencyFormatter {
  static String formatUsd(double amount) {
    final format = NumberFormat.currency(
      locale: 'en_US',
      symbol: '\$',
      decimalDigits: amount % 1 == 0 ? 0 : 2,
    );
    return format.format(amount);
  }

  static String formatKhr(double amount) {
    final format = NumberFormat.currency(
      locale: 'km_KH',
      symbol: '៛',
      decimalDigits: 0,
    );
    return format.format(amount * 4100.0);
  }

  static String formatInr(double amount) => formatUsd(amount);

  static String formatCompactInr(double amount) => formatCompactUsd(amount);

  static String formatCompactUsd(double amount) {
    if (amount >= 1000000) {
      return '\$${(amount / 1000000).toStringAsFixed(1)}M';
    } else if (amount >= 1000) {
      return '\$${(amount / 1000).toStringAsFixed(1)}k';
    }
    return '\$${amount.toStringAsFixed(0)}';
  }

  static String formatCompactKhr(double amount) {
    final khr = amount * 4100.0;
    if (khr >= 1000000000) {
      return '៛${(khr / 1000000000).toStringAsFixed(1)}B';
    } else if (khr >= 1000000) {
      return '៛${(khr / 1000000).toStringAsFixed(1)}M';
    } else if (khr >= 1000) {
      return '៛${(khr / 1000).toStringAsFixed(0)}k';
    }
    return '៛${khr.toStringAsFixed(0)}';
  }
}
