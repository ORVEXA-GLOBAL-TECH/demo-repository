import 'package:flutter/material.dart';

/// Responsive utility for all screen types:
/// - Compact phones  (width < 360)
/// - Regular phones  (360 – 599)
/// - Large phones    (600 – 719)
/// - Tablets         (≥ 720)
class Responsive {
  Responsive._();

  // ── Breakpoints ────────────────────────────────────────────────────
  static bool isCompact(BuildContext context) =>
      MediaQuery.sizeOf(context).width < 360;

  static bool isPhone(BuildContext context) =>
      MediaQuery.sizeOf(context).width < 600;

  static bool isLargePhone(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    return w >= 600 && w < 720;
  }

  static bool isTablet(BuildContext context) =>
      MediaQuery.sizeOf(context).width >= 720;

  // ── Screen dimensions ──────────────────────────────────────────────
  static double screenWidth(BuildContext context) =>
      MediaQuery.sizeOf(context).width;

  static double screenHeight(BuildContext context) =>
      MediaQuery.sizeOf(context).height;

  // ── Percentage-based sizing ────────────────────────────────────────
  /// Returns [percent]% of screen width (0.0 – 1.0)
  static double wp(BuildContext context, double percent) =>
      MediaQuery.sizeOf(context).width * percent;

  /// Returns [percent]% of screen height (0.0 – 1.0)
  static double hp(BuildContext context, double percent) =>
      MediaQuery.sizeOf(context).height * percent;

  // ── Adaptive font size ─────────────────────────────────────────────
  /// Scales a base font size proportionally to screen width.
  /// Reference width = 390 (iPhone 14). Clamped for safety.
  static double sp(BuildContext context, double baseSize) {
    final width = MediaQuery.sizeOf(context).width;
    final scale = (width / 390).clamp(0.75, 1.4);
    return baseSize * scale;
  }

  // ── Adaptive padding ───────────────────────────────────────────────
  /// Returns a screen-aware horizontal padding (12 phone → 24 tablet)
  static double horizontalPadding(BuildContext context) {
    if (isTablet(context)) return 24;
    if (isLargePhone(context)) return 18;
    if (isCompact(context)) return 10;
    return 14;
  }

  /// Returns a screen-aware vertical padding (12 phone → 20 tablet)
  static double verticalPadding(BuildContext context) {
    if (isTablet(context)) return 20;
    if (isLargePhone(context)) return 16;
    return 12;
  }

  // ── Adaptive card radius ───────────────────────────────────────────
  static double cardRadius(BuildContext context) =>
      isTablet(context) ? 20 : 14;

  // ── Column count for grid layouts ─────────────────────────────────
  static int gridColumns(BuildContext context) =>
      isTablet(context) ? 3 : isLargePhone(context) ? 2 : 2;

  // ── Max content width (centre-constrain on tablets) ───────────────
  static double maxContentWidth(BuildContext context) =>
      isTablet(context) ? 700 : double.infinity;

  // ── Adaptive icon size ────────────────────────────────────────────
  static double iconSize(BuildContext context, {double base = 20}) {
    if (isTablet(context)) return base * 1.2;
    if (isCompact(context)) return base * 0.9;
    return base;
  }
}

/// A widget that constrains and centres content on wide screens (tablets)
class ResponsiveContent extends StatelessWidget {
  final Widget child;
  const ResponsiveContent({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: Responsive.maxContentWidth(context)),
        child: child,
      ),
    );
  }
}
