import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  static TextTheme lightTextTheme = TextTheme(
    displayLarge: GoogleFonts.plusJakartaSans(
      fontSize: 32,
      fontWeight: FontWeight.bold,
      color: AppColors.lightTextPrimary,
      letterSpacing: -0.5,
    ),
    displayMedium: GoogleFonts.plusJakartaSans(
      fontSize: 28,
      fontWeight: FontWeight.bold,
      color: AppColors.lightTextPrimary,
      letterSpacing: -0.5,
    ),
    displaySmall: GoogleFonts.plusJakartaSans(
      fontSize: 24,
      fontWeight: FontWeight.w700,
      color: AppColors.lightTextPrimary,
    ),
    headlineLarge: GoogleFonts.plusJakartaSans(
      fontSize: 22,
      fontWeight: FontWeight.w700,
      color: AppColors.lightTextPrimary,
    ),
    headlineMedium: GoogleFonts.plusJakartaSans(
      fontSize: 18,
      fontWeight: FontWeight.w600,
      color: AppColors.lightTextPrimary,
    ),
    headlineSmall: GoogleFonts.plusJakartaSans(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      color: AppColors.lightTextPrimary,
    ),
    titleLarge: GoogleFonts.plusJakartaSans(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      color: AppColors.lightTextPrimary,
    ),
    titleMedium: GoogleFonts.plusJakartaSans(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      color: AppColors.lightTextPrimary,
    ),
    titleSmall: GoogleFonts.plusJakartaSans(
      fontSize: 13,
      fontWeight: FontWeight.w500,
      color: AppColors.lightTextSecondary,
    ),
    bodyLarge: GoogleFonts.inter(
      fontSize: 15,
      fontWeight: FontWeight.normal,
      color: AppColors.lightTextPrimary,
      height: 1.5,
    ),
    bodyMedium: GoogleFonts.inter(
      fontSize: 13.5,
      fontWeight: FontWeight.normal,
      color: AppColors.lightTextSecondary,
      height: 1.4,
    ),
    bodySmall: GoogleFonts.inter(
      fontSize: 12,
      fontWeight: FontWeight.normal,
      color: AppColors.lightTextTertiary,
    ),
    labelLarge: GoogleFonts.plusJakartaSans(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.2,
    ),
    labelMedium: GoogleFonts.plusJakartaSans(
      fontSize: 12,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.2,
    ),
    labelSmall: GoogleFonts.plusJakartaSans(
      fontSize: 11,
      fontWeight: FontWeight.w500,
      letterSpacing: 0.3,
    ),
  );

  static TextTheme darkTextTheme = TextTheme(
    displayLarge: GoogleFonts.plusJakartaSans(
      fontSize: 32,
      fontWeight: FontWeight.bold,
      color: AppColors.darkTextPrimary,
      letterSpacing: -0.5,
    ),
    displayMedium: GoogleFonts.plusJakartaSans(
      fontSize: 28,
      fontWeight: FontWeight.bold,
      color: AppColors.darkTextPrimary,
      letterSpacing: -0.5,
    ),
    displaySmall: GoogleFonts.plusJakartaSans(
      fontSize: 24,
      fontWeight: FontWeight.w700,
      color: AppColors.darkTextPrimary,
    ),
    headlineLarge: GoogleFonts.plusJakartaSans(
      fontSize: 22,
      fontWeight: FontWeight.w700,
      color: AppColors.darkTextPrimary,
    ),
    headlineMedium: GoogleFonts.plusJakartaSans(
      fontSize: 18,
      fontWeight: FontWeight.w600,
      color: AppColors.darkTextPrimary,
    ),
    headlineSmall: GoogleFonts.plusJakartaSans(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      color: AppColors.darkTextPrimary,
    ),
    titleLarge: GoogleFonts.plusJakartaSans(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      color: AppColors.darkTextPrimary,
    ),
    titleMedium: GoogleFonts.plusJakartaSans(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      color: AppColors.darkTextPrimary,
    ),
    titleSmall: GoogleFonts.plusJakartaSans(
      fontSize: 13,
      fontWeight: FontWeight.w500,
      color: AppColors.darkTextSecondary,
    ),
    bodyLarge: GoogleFonts.inter(
      fontSize: 15,
      fontWeight: FontWeight.normal,
      color: AppColors.darkTextPrimary,
      height: 1.5,
    ),
    bodyMedium: GoogleFonts.inter(
      fontSize: 13.5,
      fontWeight: FontWeight.normal,
      color: AppColors.darkTextSecondary,
      height: 1.4,
    ),
    bodySmall: GoogleFonts.inter(
      fontSize: 12,
      fontWeight: FontWeight.normal,
      color: AppColors.darkTextTertiary,
    ),
    labelLarge: GoogleFonts.plusJakartaSans(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.2,
    ),
    labelMedium: GoogleFonts.plusJakartaSans(
      fontSize: 12,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.2,
    ),
    labelSmall: GoogleFonts.plusJakartaSans(
      fontSize: 11,
      fontWeight: FontWeight.w500,
      letterSpacing: 0.3,
    ),
  );

  // ==========================================
  // ELEGANT REUSABLE TEXT STYLES FOR USER INPUT & STATIC WORDS
  // ==========================================
  static TextStyle inputStyle({Color? color, double? fontSize, FontWeight? fontWeight}) {
    return GoogleFonts.inter(
      fontSize: fontSize ?? 14.0,
      fontWeight: fontWeight ?? FontWeight.w500,
      letterSpacing: 0.15,
      height: 1.35,
      color: color ?? AppColors.lightTextPrimary,
    );
  }

  static TextStyle inputHintStyle({Color? color, double? fontSize}) {
    return GoogleFonts.inter(
      fontSize: fontSize ?? 13.0,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.1,
      height: 1.3,
      color: color ?? const Color(0xFF94A3B8),
    );
  }

  static TextStyle inputLabelStyle({Color? color, double? fontSize, FontWeight? fontWeight}) {
    return GoogleFonts.plusJakartaSans(
      fontSize: fontSize ?? 12.5,
      fontWeight: fontWeight ?? FontWeight.w600,
      letterSpacing: 0.2,
      height: 1.25,
      color: color ?? const Color(0xFF334155),
    );
  }

  static TextStyle elegantHeader({Color? color, double? fontSize, FontWeight? fontWeight, double? letterSpacing}) {
    return GoogleFonts.plusJakartaSans(
      fontSize: fontSize ?? 16.0,
      fontWeight: fontWeight ?? FontWeight.bold,
      letterSpacing: letterSpacing ?? -0.2,
      height: 1.3,
      color: color ?? AppColors.lightTextPrimary,
    );
  }

  static TextStyle elegantSubtitle({Color? color, double? fontSize, FontWeight? fontWeight}) {
    return GoogleFonts.inter(
      fontSize: fontSize ?? 12.0,
      fontWeight: fontWeight ?? FontWeight.w500,
      letterSpacing: 0.1,
      height: 1.35,
      color: color ?? AppColors.lightTextSecondary,
    );
  }

  static TextStyle elegantBadge({Color? color, double? fontSize, FontWeight? fontWeight}) {
    return GoogleFonts.plusJakartaSans(
      fontSize: fontSize ?? 11.0,
      fontWeight: fontWeight ?? FontWeight.bold,
      letterSpacing: 0.3,
      color: color,
    );
  }
}
