import 'package:flutter/material.dart';

class VisualAidSlide {
  final int slideNumber;
  final String title;
  final String subtitle;
  final String clinicalClaim;
  final List<String> bulletPoints;
  final String dosageInfo;
  final String mechanismOfAction;
  final String keyUsp;
  final Color slideThemeColor;
  final Map<String, String>? statsHighlight;

  VisualAidSlide({
    required this.slideNumber,
    required this.title,
    required this.subtitle,
    required this.clinicalClaim,
    required this.bulletPoints,
    required this.dosageInfo,
    required this.mechanismOfAction,
    required this.keyUsp,
    required this.slideThemeColor,
    this.statsHighlight,
  });
}

class ProductModel {
  final String id;
  final String brandName;
  final String genericName;
  final String therapeuticCategory; // Cardiology, Diabetology, Antibiotics, Pain Management, Gastroenterology
  final String dosageForm; // Tablet, Capsule, Syrup, Injection, Cream
  final String packing; // e.g. "10 x 10 Tablets Strip", "200 ml Bottle"
  final double mrp; // Maximum Retail Price
  final double ptr; // Price to Retailer
  final double pts; // Price to Stockist
  final double gstRate; // e.g. 12%
  final String currentScheme; // e.g. "10 + 1 Free"
  final String indication;
  final bool isFocusBrand;
  final bool isNewLaunch;
  final bool sampleAvailable;
  final int sampleStock;
  final List<VisualAidSlide> visualAidSlides;

  ProductModel({
    required this.id,
    required this.brandName,
    required this.genericName,
    required this.therapeuticCategory,
    required this.dosageForm,
    required this.packing,
    required this.mrp,
    required this.ptr,
    required this.pts,
    this.gstRate = 12.0,
    this.currentScheme = 'None',
    required this.indication,
    this.isFocusBrand = false,
    this.isNewLaunch = false,
    this.sampleAvailable = true,
    this.sampleStock = 20,
    required this.visualAidSlides,
  });

  ProductModel copyWith({
    String? id,
    String? brandName,
    String? genericName,
    String? therapeuticCategory,
    String? dosageForm,
    String? packing,
    double? mrp,
    double? ptr,
    double? pts,
    double? gstRate,
    String? currentScheme,
    String? indication,
    bool? isFocusBrand,
    bool? isNewLaunch,
    bool? sampleAvailable,
    int? sampleStock,
    List<VisualAidSlide>? visualAidSlides,
  }) {
    return ProductModel(
      id: id ?? this.id,
      brandName: brandName ?? this.brandName,
      genericName: genericName ?? this.genericName,
      therapeuticCategory: therapeuticCategory ?? this.therapeuticCategory,
      dosageForm: dosageForm ?? this.dosageForm,
      packing: packing ?? this.packing,
      mrp: mrp ?? this.mrp,
      ptr: ptr ?? this.ptr,
      pts: pts ?? this.pts,
      gstRate: gstRate ?? this.gstRate,
      currentScheme: currentScheme ?? this.currentScheme,
      indication: indication ?? this.indication,
      isFocusBrand: isFocusBrand ?? this.isFocusBrand,
      isNewLaunch: isNewLaunch ?? this.isNewLaunch,
      sampleAvailable: sampleAvailable ?? this.sampleAvailable,
      sampleStock: sampleStock ?? this.sampleStock,
      visualAidSlides: visualAidSlides ?? this.visualAidSlides,
    );
  }
}
