import 'package:flutter/material.dart';

/// Official Alleviare Brand Color Tokens & Theme Constants
class AppColors {
  // 4 Official Alleviare Brand Colors
  static const Color brandCream = Color(0xFFECF4D6); // rgb(236, 244, 214) - Light Card / Background
  static const Color brandMint = Color(0xFF9AD0C2);  // rgb(154, 208, 194) - Highlights & Borders
  static const Color brandTeal = Color(0xFF2D9596);  // rgb(45, 149, 150)  - Primary CTA / Verified
  static const Color brandNavy = Color(0xFF265073);  // rgb(38, 80, 115)   - Deep Navbars / Dark Surfaces
  static const Color brandCoral = Color(0xFFEF4444); // Signature Red Trajectory Dots & Tagline

  // Primary Palette
  static const Color primary = brandTeal;
  static const Color primaryDark = brandNavy;
  static const Color primaryLight = brandMint;
  static const Color primaryContainer = brandCream;
  static const Color onPrimaryContainer = brandNavy;

  // Secondary & Accents
  static const Color secondary = brandNavy;
  static const Color secondaryDark = Color(0xFF1B3B54);
  static const Color secondaryLight = brandTeal;
  static const Color secondaryContainer = Color(0xFFD4ECE7);

  // Gold & Amber Accents (Mapped harmoniously to Brand Palette)
  static const Color gold = Color(0xFFD97706);
  static const Color goldDark = Color(0xFFB45309);
  static const Color goldLight = Color(0xFFFBBF24);
  static const Color goldContainer = Color(0xFFFEF3C7);
  static const Color onGoldContainer = Color(0xFF78350F);

  // Status & Geofence Indicators
  static const Color success = Color(0xFF10B981);
  static const Color successContainer = Color(0xFFD1FAE5);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningContainer = Color(0xFFFEF3C7);
  static const Color error = brandCoral;
  static const Color errorContainer = Color(0xFFFEE2E2);
  static const Color info = Color(0xFF0284C7);
  static const Color infoContainer = Color(0xFFE0F2FE);

  // Priority Doctor Classes
  static const Color classAPlus = brandCoral;
  static const Color classA = brandTeal;
  static const Color classB = brandNavy;
  static const Color classC = Color(0xFF64748B);

  // Neutral Background & Surfaces
  static const Color lightBackground = Color(0xFFF7FBF9);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceVariant = Color(0xFFF0F7F4);
  static const Color lightBorder = Color(0xFFE2EBE6);
  static const Color lightDivider = Color(0xFFEDF4F0);

  // Text Colors (Light Mode)
  static const Color lightTextPrimary = Color(0xFF162A3B);
  static const Color lightTextSecondary = Color(0xFF3B566E);
  static const Color lightTextTertiary = Color(0xFF70899F);

  // Dark Mode Colors
  static const Color darkBackground = Color(0xFF0C1924);
  static const Color darkSurface = Color(0xFF162838);
  static const Color darkSurfaceVariant = Color(0xFF1E354A);
  static const Color darkBorder = Color(0xFF2D4B66);
  static const Color darkTextPrimary = Color(0xFFF8FAFC);
  static const Color darkTextSecondary = Color(0xFF9AD0C2);
  static const Color darkTextTertiary = Color(0xFF70899F);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [brandNavy, brandTeal],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient tealMintGradient = LinearGradient(
    colors: [brandTeal, brandMint],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient brandCardGradient = LinearGradient(
    colors: [brandNavy, Color(0xFF1D425F)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient creamGradient = LinearGradient(
    colors: [brandCream, Colors.white],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [Color(0xFFB45309), Color(0xFFF59E0B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient blueGoldGradient = LinearGradient(
    colors: [brandNavy, brandTeal],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient royalGradient = LinearGradient(
    colors: [brandNavy, brandTeal],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient accentGradient = LinearGradient(
    colors: [brandTeal, brandCoral],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient emeraldGradient = LinearGradient(
    colors: [brandTeal, brandMint],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient warmGradient = LinearGradient(
    colors: [Color(0xFFD97706), Color(0xFFFBBF24)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkCardGradient = LinearGradient(
    colors: [Color(0xFF162838), Color(0xFF0C1924)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
