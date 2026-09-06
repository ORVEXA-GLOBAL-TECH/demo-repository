import 'package:flutter/material.dart';
import '../models/sales_entry_model.dart';

class SalesProvider extends ChangeNotifier {
  final List<ProductSalesInvoice> _invoices = [];
  final double _monthlyTarget = 5000.0; // $5,000 Target for MR
  String _selectedPeriodFilter = 'Current Month (August)';

  SalesProvider() {
    _seedMockSalesData();
  }

  double get monthlyTarget => _monthlyTarget;
  String get selectedPeriodFilter => _selectedPeriodFilter;
  List<ProductSalesInvoice> get invoices => List.unmodifiable(_invoices);

  double get currentMonthAchievedSales =>
      _invoices.fold(0.0, (sum, inv) => sum + inv.grandTotal);

  double get targetAchievementPercentage =>
      (_monthlyTarget > 0) ? (currentMonthAchievedSales / _monthlyTarget) * 100 : 0.0;

  int get totalInvoicesCount => _invoices.length;
  int get totalUnitsSold => _invoices.fold(0, (sum, inv) => sum + inv.totalUnits);

  void setPeriodFilter(String filter) {
    _selectedPeriodFilter = filter;
    notifyListeners();
  }

  void addSalesInvoice(ProductSalesInvoice invoice) {
    _invoices.insert(0, invoice);
    notifyListeners();
  }

  List<ProductWiseSalesSummary> get productWiseSales {
    final Map<String, int> productUnits = {};
    final Map<String, double> productRevenues = {};
    final Map<String, String> productMolecules = {
      'CardioVasc-AM': 'Telmisartan 40mg + Amlodipine 5mg',
      'GlycoSmart-D10': 'Dapagliflozin 10mg + Metformin 500mg',
      'Neurolin-Plus': 'Pregabalin 75mg + Methylcobalamin 1500mcg',
      'GastroShield-D': 'Rabeprazole 20mg + Domperidone 30mg',
      'PulmoClear-Mont': 'Montelukast 10mg + Levocetirizine 5mg',
    };

    for (final inv in _invoices) {
      for (final item in inv.items) {
        productUnits[item.productName] = (productUnits[item.productName] ?? 0) + item.quantity;
        productRevenues[item.productName] = (productRevenues[item.productName] ?? 0.0) + item.totalAmount;
      }
    }

    final double totalRevenue = currentMonthAchievedSales;

    return productUnits.entries.map((e) {
      final rev = productRevenues[e.key] ?? 0.0;
      final share = (totalRevenue > 0) ? (rev / totalRevenue) * 100 : 0.0;
      return ProductWiseSalesSummary(
        productId: 'prod_${e.key.hashCode}',
        productName: e.key,
        molecule: productMolecules[e.key] ?? 'Pharma Formulation',
        unitsSold: e.value,
        totalRevenue: rev,
        percentageShare: share,
        growthPercentage: 12.5,
      );
    }).toList();
  }

  List<TerritoryWiseSalesSummary> get territoryWiseSales {
    final Map<String, double> patchSales = {};
    for (final inv in _invoices) {
      patchSales[inv.territoryPatch] = (patchSales[inv.territoryPatch] ?? 0.0) + inv.grandTotal;
    }

    return [
      TerritoryWiseSalesSummary(
        patchName: 'Phnom Penh Central Patch A',
        achievedSales: patchSales['Phnom Penh Central Patch A'] ?? 2100.0,
        targetSales: 2200.0,
        chemistsCount: 14,
        stockistsCount: 2,
      ),
      TerritoryWiseSalesSummary(
        patchName: 'Daun Penh Medical Patch B',
        achievedSales: patchSales['Daun Penh Medical Patch B'] ?? 1650.0,
        targetSales: 1700.0,
        chemistsCount: 10,
        stockistsCount: 1,
      ),
      TerritoryWiseSalesSummary(
        patchName: 'Toul Kork Commercial Patch C',
        achievedSales: patchSales['Toul Kork Commercial Patch C'] ?? 1120.0,
        targetSales: 1100.0,
        chemistsCount: 8,
        stockistsCount: 1,
      ),
    ];
  }

  List<MonthlySalesTrendPoint> get monthlyTrends {
    return [
      MonthlySalesTrendPoint(monthLabel: 'Apr', achievedAmount: 4100, targetAmount: 4500),
      MonthlySalesTrendPoint(monthLabel: 'May', achievedAmount: 4350, targetAmount: 4600),
      MonthlySalesTrendPoint(monthLabel: 'Jun', achievedAmount: 4620, targetAmount: 4800),
      MonthlySalesTrendPoint(monthLabel: 'Jul', achievedAmount: 4780, targetAmount: 4900),
      MonthlySalesTrendPoint(monthLabel: 'Aug (MTD)', achievedAmount: currentMonthAchievedSales, targetAmount: _monthlyTarget, isCurrentMonth: true),
    ];
  }

  void _seedMockSalesData() {
    final now = DateTime.now();

    _invoices.addAll([
      ProductSalesInvoice(
        id: 'inv_101',
        invoiceNumber: 'INV-2026-0881',
        date: now.subtract(const Duration(days: 1)),
        buyerType: 'Chemist',
        buyerId: 'chem_1',
        buyerName: 'Sai Medicos & Pharmacy Depot (Preah Norodom)',
        territoryPatch: 'Phnom Penh Central Patch A',
        invoicePhotoName: 'invoice_saimedicos_0881.jpg',
        status: 'Billed',
        remarks: 'Secondary Chemist supply against Dr. Rajesh Sharma prescriptions.',
        items: [
          SalesLineItem(
            productId: 'prod_1',
            productName: 'CardioVasc-AM',
            batchNo: 'CV26A14',
            quantity: 120,
            freeQuantity: 12,
            unitPrice: 16.50,
            discountPercent: 5.0,
            gstPercent: 10.0,
          ),
          SalesLineItem(
            productId: 'prod_2',
            productName: 'GlycoSmart-D10',
            batchNo: 'GS26B09',
            quantity: 80,
            freeQuantity: 8,
            unitPrice: 19.50,
            discountPercent: 5.0,
            gstPercent: 10.0,
          ),
        ],
      ),
      ProductSalesInvoice(
        id: 'inv_102',
        invoiceNumber: 'INV-2026-0875',
        date: now.subtract(const Duration(days: 3)),
        buyerType: 'Stockist',
        buyerId: 'stk_1',
        buyerName: 'Apollo Pharma Wholesale Depot',
        territoryPatch: 'Daun Penh Medical Patch B',
        invoicePhotoName: 'challan_apollo_0875.jpg',
        status: 'Billed',
        remarks: 'Primary institutional supply for Phnom Penh Central corridor.',
        items: [
          SalesLineItem(
            productId: 'prod_1',
            productName: 'CardioVasc-AM',
            batchNo: 'CV26A14',
            quantity: 400,
            freeQuantity: 40,
            unitPrice: 16.50,
            discountPercent: 10.0,
            gstPercent: 10.0,
          ),
          SalesLineItem(
            productId: 'prod_3',
            productName: 'Neurolin-Plus',
            batchNo: 'NP26C02',
            quantity: 250,
            freeQuantity: 25,
            unitPrice: 22.00,
            discountPercent: 10.0,
            gstPercent: 10.0,
          ),
          SalesLineItem(
            productId: 'prod_4',
            productName: 'GastroShield-D',
            batchNo: 'GS26D18',
            quantity: 200,
            freeQuantity: 20,
            unitPrice: 14.50,
            discountPercent: 10.0,
            gstPercent: 10.0,
          ),
        ],
      ),
      ProductSalesInvoice(
        id: 'inv_103',
        invoiceNumber: 'INV-2026-0869',
        date: now.subtract(const Duration(days: 6)),
        buyerType: 'Chemist',
        buyerId: 'chem_2',
        buyerName: 'Royal Phnom Penh Care Chemist',
        territoryPatch: 'Phnom Penh Central Patch A',
        invoicePhotoName: 'royal_tax_inv_0869.png',
        status: 'Billed',
        remarks: 'Retail counter supply & campaign restock.',
        items: [
          SalesLineItem(
            productId: 'prod_2',
            productName: 'GlycoSmart-D10',
            batchNo: 'GS26B09',
            quantity: 150,
            freeQuantity: 15,
            unitPrice: 19.50,
            discountPercent: 6.0,
            gstPercent: 10.0,
          ),
          SalesLineItem(
            productId: 'prod_5',
            productName: 'PulmoClear-Mont',
            batchNo: 'PC26E05',
            quantity: 100,
            freeQuantity: 10,
            unitPrice: 13.50,
            discountPercent: 5.0,
            gstPercent: 10.0,
          ),
        ],
      ),
      ProductSalesInvoice(
        id: 'inv_104',
        invoiceNumber: 'INV-2026-0850',
        date: now.subtract(const Duration(days: 9)),
        buyerType: 'Chemist',
        buyerId: 'chem_3',
        buyerName: 'Ang Duong Pharmacy Counter',
        territoryPatch: 'Toul Kork Commercial Patch C',
        invoicePhotoName: 'angduong_inv_0850.jpg',
        status: 'Billed',
        remarks: 'Night counter supply.',
        items: [
          SalesLineItem(
            productId: 'prod_3',
            productName: 'Neurolin-Plus',
            batchNo: 'NP26C02',
            quantity: 110,
            freeQuantity: 10,
            unitPrice: 22.00,
            discountPercent: 5.0,
            gstPercent: 10.0,
          ),
          SalesLineItem(
            productId: 'prod_4',
            productName: 'GastroShield-D',
            batchNo: 'GS26D18',
            quantity: 90,
            freeQuantity: 9,
            unitPrice: 14.50,
            discountPercent: 5.0,
            gstPercent: 10.0,
          ),
        ],
      ),
    ]);
  }
}
