import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../models/doctor_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/sample_provider.dart';
import '../../widgets/report_export_sheet.dart';

// =========================================================================
// 1. DOCTOR REPORT SCREEN
// =========================================================================
class DoctorReportScreen extends StatelessWidget {
  const DoctorReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final docProvider = context.watch<DoctorProvider>();
    final doctors = docProvider.doctors;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Doctor Coverage & Call Report', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Doctor Call & Coverage Report',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Total Listed Doctors': '${doctors.length}',
                  'Completed Calls': '142 Calls',
                  'Coverage Rate': '94.2%',
                  'Call Average': '11.8 calls/day',
                },
                headers: ['Doctor Name', 'Specialty', 'Class', 'Clinic/Hospital', 'Visits This Month', 'Coverage Status'],
                rows: doctors.map((d) {
                  return [
                    d.name,
                    d.specialty,
                    d.doctorClass.shortCode,
                    d.clinicName,
                    '3 Calls',
                    'Covered',
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // KPI Metric Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0B172E), Color(0xFF1E3A8A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('DOCTOR CALL METRICS (MTD)', style: TextStyle(color: Color(0xFF38BDF8), fontSize: 11.5, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    Text('Target: 12 calls/day', style: TextStyle(color: Colors.white70, fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _kpiStat('Listed Docs', '${doctors.length}', const Color(0xFF38BDF8)),
                    Container(width: 1, height: 32, color: Colors.white24),
                    _kpiStat('Calls Done', '142', const Color(0xFF10B981)),
                    Container(width: 1, height: 32, color: Colors.white24),
                    _kpiStat('Coverage', '94.2%', const Color(0xFFF59E0B)),
                    Container(width: 1, height: 32, color: Colors.white24),
                    _kpiStat('Call Avg', '11.8', const Color(0xFFC084FC)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Class Breakdown
          const Text('Doctor Classification Coverage', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _classRow('Class A+ (Key Opinion Leaders)', '24 Doctors', '98% Met', const Color(0xFFD97706), 0.98),
                const Divider(height: 16),
                _classRow('Class A (Core Prescribers)', '62 Doctors', '93% Met', const Color(0xFF1D4ED8), 0.93),
                const Divider(height: 16),
                _classRow('Class B (Regular Prescribers)', '38 Doctors', '86% Met', const Color(0xFF0284C7), 0.86),
                const Divider(height: 16),
                _classRow('Class C (Occasional Prescribers)', '10 Doctors', '72% Met', const Color(0xFF64748B), 0.72),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Doctor List Call Log
          const Text('Recent Doctor Call Records', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          ...doctors.take(8).map((doc) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: const Color(0xFFE0F2FE),
                    child: Text(doc.doctorClass.shortCode, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0288D1))),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(doc.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                        const SizedBox(height: 2),
                        Text('${doc.specialty} • ${doc.clinicName}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(8)),
                    child: const Text('Covered 3x', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF059669))),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _kpiStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 10)),
      ],
    );
  }

  Widget _classRow(String title, String count, String met, Color color, double progress) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: color)),
            Text(met, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: color)),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(value: progress, backgroundColor: color.withValues(alpha: 0.15), valueColor: AlwaysStoppedAnimation<Color>(color), minHeight: 6),
        ),
      ],
    );
  }
}

// =========================================================================
// 2. CHEMIST REPORT SCREEN
// =========================================================================
class ChemistReportScreen extends StatelessWidget {
  const ChemistReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final docProvider = context.watch<DoctorProvider>();
    final chemists = docProvider.chemists;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Chemist & Pharmacy Report', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Chemist Retail & POB Report',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Active Chemists': '${chemists.length} Pharmacies',
                  'Total POB Value': '\$1,482.00',
                  'POB Order Ratio': '82.4%',
                  'Product Availability': '96%',
                },
                headers: ['Pharmacy Store Name', 'Contact Person', 'Mapped Stockist', 'Address', 'Avg Monthly Order', 'POB Status'],
                rows: chemists.map((ch) {
                  return [
                    ch.shopName,
                    ch.name,
                    ch.mappedStockistName,
                    ch.address,
                    '\$${ch.avgMonthlyOrderValue.toStringAsFixed(0)}',
                    'Active POB',
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // KPI Metric Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF065F46), Color(0xFF047857)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('RETAIL PHARMACY OVERVIEW (MTD)', style: TextStyle(color: Color(0xFFA7F3D0), fontSize: 11.5, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    Text('44 Active Stores', style: TextStyle(color: Colors.white70, fontSize: 11)),
                  ],
                ),
                SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _ChemistKpi('POB Orders', '88 Calls', Color(0xFFA7F3D0)),
                    _ChemistKpi('Total POB', '\$1,482', Color(0xFFFDE68A)),
                    _ChemistKpi('Order Ratio', '82.4%', Color(0xFF93C5FD)),
                    _ChemistKpi('Availability', '96%', Color(0xFFFBCFE8)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          const Text('Chemist Order Performance', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          ...chemists.map((ch) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(12)),
                    child: const Icon(Icons.local_pharmacy_rounded, color: Color(0xFF059669), size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(ch.shopName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                        const SizedBox(height: 2),
                        Text('${ch.name} • Stockist: ${ch.mappedStockistName}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('\$${ch.avgMonthlyOrderValue.toStringAsFixed(0)}/mo', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF059669))),
                      const SizedBox(height: 2),
                      const Text('POB Active', style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _ChemistKpi extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _ChemistKpi(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 15)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 10)),
      ],
    );
  }
}

// =========================================================================
// 3. OTHER REPORT SCREEN (Hospital, Clinic, Stockists, Govt/Pvt)
// =========================================================================
class OtherInstitutionsReportScreen extends StatelessWidget {
  const OtherInstitutionsReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final institutions = [
      {'name': 'Calmette National Referral Hospital', 'type': 'Government Referral Hospital', 'visits': '4 Visits', 'order': '\$3,500 (Tender Order)', 'icon': Icons.local_hospital_rounded, 'color': const Color(0xFFE53935)},
      {'name': 'Royal Phnom Penh Multi-Specialty Hospital', 'type': 'Private Multi-Specialty', 'visits': '6 Visits', 'order': '\$2,800 (Direct Pharmacy)', 'icon': Icons.apartment_rounded, 'color': const Color(0xFF0288D1)},
      {'name': 'Ang Duong Advanced Poly-Clinic', 'type': 'Private Clinic', 'visits': '3 Visits', 'order': '\$1,200 (POB Routed)', 'icon': Icons.medical_services_rounded, 'color': const Color(0xFF10B981)},
      {'name': 'Apollo Pharma Wholesale Depot', 'type': 'Primary Stockist Depot', 'visits': '8 Visits', 'order': '\$4,850 (Primary Indents)', 'icon': Icons.warehouse_rounded, 'color': const Color(0xFF8E24AA)},
      {'name': 'MediHealth Central Distribution', 'type': 'Authorized Distributor', 'visits': '5 Visits', 'order': '\$3,190 (Primary Indents)', 'icon': Icons.storefront_rounded, 'color': const Color(0xFFFB8C00)},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Other Reports (Hospitals & Stockists)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Institutional & Stockist Coverage Report',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Government Hospitals': '3 Active',
                  'Private Polyclinics': '14 Active',
                  'Stockist Depots': '4 Mapped',
                  'Institutional Indents': '\$15,540',
                },
                headers: ['Facility / Agency Name', 'Institution Category', 'Monthly Visits', 'Order Volume / Value', 'Status'],
                rows: institutions.map((inst) {
                  return [
                    inst['name'] as String,
                    inst['type'] as String,
                    inst['visits'] as String,
                    inst['order'] as String,
                    'Active Contract',
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _InstKpi('Govt Hospitals', '3 Active', Color(0xFFE53935)),
                _InstKpi('Private Clinics', '14 Active', Color(0xFF0288D1)),
                _InstKpi('Stockist Depots', '4 Mapped', Color(0xFF8E24AA)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Institutional Coverage & Commercial Records', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          ...institutions.map((inst) {
            final col = inst['color'] as Color;
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(color: col.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)),
                    child: Icon(inst['icon'] as IconData, color: col, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(inst['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                        const SizedBox(height: 2),
                        Text('${inst['type']} • ${inst['visits']}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Text(inst['order'] as String, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5, color: col)),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _InstKpi extends StatelessWidget {
  final String label;
  final String val;
  final Color col;
  const _InstKpi(this.label, this.val, this.col);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(val, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: col)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
      ],
    );
  }
}

// =========================================================================
// 4. PRIMARY SALES REPORT SCREEN (Product sales to clinic, Stockist invoices)
// =========================================================================
class PrimarySalesReportScreen extends StatelessWidget {
  const PrimarySalesReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final invoices = [
      {'inv': 'INV-2026-8812', 'entity': 'Apollo Pharma Wholesale Depot', 'date': '19 Aug 2026', 'amount': '\$1,245.00', 'items': 'CardioVasc-AM (200), GlycoSmart-D10 (150)', 'status': 'Dispatched', 'statusColor': const Color(0xFF10B981)},
      {'inv': 'INV-2026-8809', 'entity': 'Royal Phnom Penh Hospital Direct OT', 'date': '18 Aug 2026', 'amount': '\$480.00', 'items': 'PanSafe-DSR (100), CardioVasc-AM (80)', 'status': 'Delivered', 'statusColor': const Color(0xFF0288D1)},
      {'inv': 'INV-2026-8798', 'entity': 'MediHealth Central Distribution', 'date': '16 Aug 2026', 'amount': '\$960.00', 'items': 'OsteoFlex-D3 (120), Cefomax-CV (100)', 'status': 'Payment Cleared', 'statusColor': const Color(0xFF10B981)},
      {'inv': 'INV-2026-8780', 'entity': 'Ang Duong Poly-Clinic Direct Supply', 'date': '14 Aug 2026', 'amount': '\$215.00', 'items': 'PulmoBreathe-FB (50)', 'status': 'Delivered', 'statusColor': const Color(0xFF0288D1)},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Primary Sales & Invoices', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Primary Sales & Invoices Ledger',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'MTD Primary Sales': '\$2,900.00',
                  'Monthly Target': '\$3,500.00',
                  'Achievement': '82.8%',
                  'Invoices Issued': '${invoices.length} Invoices',
                },
                headers: ['Invoice Number', 'Customer / Depot Entity', 'Invoice Date', 'Products & Quantities', 'Invoice Amount', 'Fulfillment Status'],
                rows: invoices.map((inv) {
                  return [
                    inv['inv'] as String,
                    inv['entity'] as String,
                    inv['date'] as String,
                    inv['items'] as String,
                    inv['amount'] as String,
                    inv['status'] as String,
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0B172E), Color(0xFF1E293B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _ChemistKpi('MTD Primary Sales', '\$2,900', Color(0xFF38BDF8)),
                _ChemistKpi('Target', '\$3,500', Color(0xFFFDE68A)),
                _ChemistKpi('Achievement', '82.8%', Color(0xFFA7F3D0)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Stockist & Institutional Invoices', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          ...invoices.map((inv) {
            final col = inv['statusColor'] as Color;
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(inv['inv'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0288D1))),
                      Text(inv['amount'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(inv['entity'] as String, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12.5, color: Color(0xFF334155))),
                  const SizedBox(height: 2),
                  Text('Items: ${inv['items']}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                  const Divider(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Invoice Date: ${inv['date']}', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: col.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                        child: Text(inv['status'] as String, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: col)),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

// =========================================================================
// 5. SAMPLE REPORT SCREEN
// =========================================================================
class SampleReportScreen extends StatelessWidget {
  const SampleReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final sampleProvider = context.watch<SampleProvider>();
    final inventory = sampleProvider.inventory;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Sample Issue & Stock Report', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Sample Distribution & Inventory Report',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Allocated Samples': '120 Units',
                  'Issued to Doctors': '84 Units',
                  'Remaining Bag Balance': '${sampleProvider.totalBagStockCount} Units',
                },
                headers: ['Brand / Molecule Name', 'Batch Number', 'Expiry Date', 'Bag Stock Balance', 'Distribution Status'],
                rows: inventory.map((item) {
                  return [
                    item.itemName,
                    item.batchNumber,
                    item.expiryDate,
                    '${item.currentBalance} Units',
                    item.currentBalance > 0 ? 'In Stock' : 'Depleted',
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF581C87), Color(0xFF7E22CE)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                const _ChemistKpi('Allocated', '120 Units', Color(0xFFF3E8FF)),
                const _ChemistKpi('Issued to Docs', '84 Units', Color(0xFFA7F3D0)),
                _ChemistKpi('In MR Bag', '${sampleProvider.totalBagStockCount} Units', const Color(0xFFFDE68A)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Product-Wise Sample Ledger', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          ...inventory.map((item) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(color: const Color(0xFFF3E8FF), borderRadius: BorderRadius.circular(12)),
                    child: const Icon(Icons.medication_rounded, color: Color(0xFF9333EA), size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item.itemName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                        const SizedBox(height: 2),
                        Text('Batch: ${item.batchNumber} • Expiry: ${item.expiryDate}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('${item.currentBalance} Left', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF9333EA))),
                      const SizedBox(height: 2),
                      const Text('In Sample Bag', style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

// =========================================================================
// 6. ORDER HISTORY SCREEN (Comprehensive POB & Commercial Orders)
// =========================================================================
class OrderHistoryScreen extends StatelessWidget {
  const OrderHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mockOrders = [
      {'orderNo': 'ORD-POB-9901', 'customer': 'Sai Medicos & Pharmacy Depot', 'date': '20 Aug 2026', 'amount': '\$380.00', 'stockist': 'Apollo Pharma Wholesale Depot', 'status': 'Approved by ASM', 'statusColor': const Color(0xFF10B981)},
      {'orderNo': 'ORD-POB-9892', 'customer': 'Central City Chemist & Pharmacy', 'date': '19 Aug 2026', 'amount': '\$540.00', 'stockist': 'MediHealth Central Distribution', 'status': 'Dispatched', 'statusColor': const Color(0xFF0288D1)},
      {'orderNo': 'ORD-POB-9884', 'customer': 'Care & Cure Medical Hall', 'date': '18 Aug 2026', 'amount': '\$290.00', 'stockist': 'Apollo Pharma Wholesale Depot', 'status': 'Delivered', 'statusColor': const Color(0xFF059669)},
      {'orderNo': 'ORD-POB-9871', 'customer': 'Ang Duong Poly-Clinic Direct', 'date': '17 Aug 2026', 'amount': '\$650.00', 'stockist': 'Apollo Pharma Wholesale Depot', 'status': 'Delivered', 'statusColor': const Color(0xFF059669)},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Complete Order Booking History', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Customer Order Booking History',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Total Orders Logged': '${mockOrders.length} Orders',
                  'Cumulative Booking Value': '\$1,840.00',
                  'Fulfillment Rate': '98.5%',
                },
                headers: ['Order Ref Number', 'Customer / Chemist Name', 'Booking Date', 'Mapped Stockist Depot', 'Order Value', 'Status'],
                rows: mockOrders.map((ord) {
                  return [
                    ord['orderNo'] as String,
                    ord['customer'] as String,
                    ord['date'] as String,
                    ord['stockist'] as String,
                    ord['amount'] as String,
                    ord['status'] as String,
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _ChemistKpi('Total Orders', '48 Orders', Color(0xFF38BDF8)),
                _ChemistKpi('Total Value', '\$1,840', Color(0xFFFDE68A)),
                _ChemistKpi('Fulfillment', '98.5%', Color(0xFFA7F3D0)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Customer Product Orders (POB)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          ...mockOrders.map((ord) {
            final col = ord['statusColor'] as Color;
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(ord['orderNo'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0288D1))),
                      Text(ord['amount'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(ord['customer'] as String, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF334155))),
                  const SizedBox(height: 2),
                  Text('Mapped Stockist: ${ord['stockist']}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                  const Divider(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Booking Date: ${ord['date']}', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: col.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                        child: Text(ord['status'] as String, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: col)),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

// =========================================================================
// 7. ATTENDANCE REPORT SCREEN
// =========================================================================
class AttendanceReportScreen extends StatelessWidget {
  const AttendanceReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final records = [
      {'date': '20 Aug 2026 (Today)', 'punchIn': '09:15 AM', 'punchOut': '--:--', 'hours': 'In Field', 'status': 'Present', 'loc': 'Monivong Blvd Beat'},
      {'date': '19 Aug 2026', 'punchIn': '09:05 AM', 'punchOut': '06:40 PM', 'hours': '9h 35m', 'status': 'Present', 'loc': 'Toul Kork Medical Hub'},
      {'date': '18 Aug 2026', 'punchIn': '09:30 AM', 'punchOut': '06:15 PM', 'hours': '8h 45m', 'status': 'Present', 'loc': 'Russian Federation Blvd'},
      {'date': '17 Aug 2026', 'punchIn': '09:00 AM', 'punchOut': '07:10 PM', 'hours': '10h 10m', 'status': 'Present', 'loc': 'Central City Zone'},
      {'date': '16 Aug 2026 (Sunday)', 'punchIn': '--:--', 'punchOut': '--:--', 'hours': '--', 'status': 'Weekly Off', 'loc': '--'},
      {'date': '15 Aug 2026', 'punchIn': '--:--', 'punchOut': '--:--', 'hours': '--', 'status': 'Holiday', 'loc': '--'},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('MR Field Attendance & Punch Report', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Monthly Field Attendance & Punch Report',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Total Working Days': '22 Days',
                  'Days Present': '20 Days',
                  'Leaves Taken': '2 Days',
                  'Total Field Hours': '182 hrs',
                },
                headers: ['Date', 'Punch In Time', 'Punch Out Time', 'Field Hours', 'Field Beat Location', 'Attendance Status'],
                rows: records.map((r) {
                  return [
                    r['date']!,
                    r['punchIn']!,
                    r['punchOut']!,
                    r['hours']!,
                    r['loc']!,
                    r['status']!,
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0B172E), Color(0xFF0284C7)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _ChemistKpi('Working Days', '22 Days', Color(0xFFE0F2FE)),
                _ChemistKpi('Days Present', '20 Days', Color(0xFFA7F3D0)),
                _ChemistKpi('Leaves Taken', '2 Days', Color(0xFFFDE68A)),
                _ChemistKpi('Field Hours', '182 hrs', Color(0xFFFBCFE8)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Daily Field Attendance Logs', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          ...records.map((r) {
            final isPresent = r['status'] == 'Present';
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: isPresent ? const Color(0xFFECFDF5) : const Color(0xFFF1F5F9),
                    child: Icon(
                      isPresent ? Icons.check_circle_rounded : Icons.event_busy_rounded,
                      color: isPresent ? const Color(0xFF059669) : const Color(0xFF64748B),
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(r['date']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                        const SizedBox(height: 2),
                        Text('In: ${r['punchIn']} • Out: ${r['punchOut']} (${r['hours']})', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isPresent ? const Color(0xFFECFDF5) : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      r['status']!,
                      style: TextStyle(
                        color: isPresent ? const Color(0xFF059669) : const Color(0xFF64748B),
                        fontSize: 10.5,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

// =========================================================================
// 8. TOTAL MATRIX SCREEN (Consolidated Master Analytics Hub)
// =========================================================================
class TotalMatrixScreen extends StatelessWidget {
  const TotalMatrixScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Total Performance Matrix (360°)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: '360 Total Performance Matrix',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Doctor Coverage': '94.2%',
                  'Chemist POB Active': '96.0%',
                  'Primary Sales Run Rate': '82.8%',
                  'Joint Work Index': '24.0%',
                },
                headers: ['Analysis Dimension', 'Category / Molecule', 'Performance Metric', 'Coverage / Share %', 'Benchmark Status'],
                rows: const [
                  ['Doctor Coverage Matrix', 'Class A+ Key Opinion Leaders', '24 Doctors (4 calls/mo)', '98%', 'Exceeds Goal'],
                  ['Doctor Coverage Matrix', 'Class A Core Prescribers', '62 Doctors (3 calls/mo)', '93%', 'On Track'],
                  ['Doctor Coverage Matrix', 'Class B Regular Doctors', '38 Doctors (2 calls/mo)', '86%', 'Normal'],
                  ['Chemist Matrix', 'Top Tier (> \$500/mo)', '18 Pharmacies', '100%', 'Exceeds Goal'],
                  ['Chemist Matrix', 'Mid Tier (\$250 - \$500)', '20 Pharmacies', '88%', 'On Track'],
                  ['Product Rx Share', 'CardioVasc-AM', '68 Prescriptions/Day', '38%', 'Category Leader'],
                  ['Product Rx Share', 'GlycoSmart-D10', '52 Prescriptions/Day', '29%', 'Fast Growing'],
                  ['Field Structure', 'Solo MR Field Calls', '108 Calls', '76%', 'Compliant'],
                  ['Field Structure', 'Joint with ASM / RSM', '34 Calls', '24%', 'Compliant'],
                ],
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 1. Doctor Class Matrix
          _matrixHeader('1. Doctor Call & Frequency Matrix', Icons.medical_information_rounded, const Color(0xFF1E88E5)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _matrixItem('Class A+ KOL Doctors (4 calls/mo)', '24 Doctors', '98% Met', const Color(0xFFD97706), 0.98),
                const Divider(height: 14),
                _matrixItem('Class A Core Prescribers (3 calls/mo)', '62 Doctors', '93% Met', const Color(0xFF1D4ED8), 0.93),
                const Divider(height: 14),
                _matrixItem('Class B Regular Prescribers (2 calls/mo)', '38 Doctors', '86% Met', const Color(0xFF0284C7), 0.86),
                const Divider(height: 14),
                _matrixItem('Class C Occasional Doctors (1 call/mo)', '10 Doctors', '72% Met', const Color(0xFF64748B), 0.72),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // 2. Chemist Retail Matrix
          _matrixHeader('2. Chemist Retail & POB Matrix', Icons.local_pharmacy_rounded, const Color(0xFF059669)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _matrixItem('Top Tier Retailers (> \$500/mo)', '18 Chemists', '100% Active', const Color(0xFF059669), 1.0),
                const Divider(height: 14),
                _matrixItem('Mid Tier Pharmacies (\$250 - \$500/mo)', '20 Chemists', '88% Active', const Color(0xFF10B981), 0.88),
                const Divider(height: 14),
                _matrixItem('Neighborhood Chemists (< \$250/mo)', '6 Chemists', '75% Active', const Color(0xFF34D399), 0.75),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // 3. Brand & Molecule Prescription Matrix
          _matrixHeader('3. Brand Prescription Share Matrix', Icons.pie_chart_rounded, const Color(0xFF9333EA)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _matrixItem('CardioVasc-AM (Amlodipine + Telmisartan)', '68 Rx/Day', '38% Share', const Color(0xFF9333EA), 0.78),
                const Divider(height: 14),
                _matrixItem('GlycoSmart-D10 (Dapagliflozin)', '52 Rx/Day', '29% Share', const Color(0xFFA855F7), 0.65),
                const Divider(height: 14),
                _matrixItem('NeuroCalm-Plus (Pregabalin)', '34 Rx/Day', '19% Share', const Color(0xFFC084FC), 0.48),
                const Divider(height: 14),
                _matrixItem('OrthoFlex-D (Calcium + Vit D3)', '26 Rx/Day', '14% Share', const Color(0xFFE9D5FF), 0.35),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // 4. Joint Work vs Solo Work Matrix
          _matrixHeader('4. Field Work Structure Matrix', Icons.groups_rounded, const Color(0xFFE11D48)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _matrixItem('Solo MR Field Calls', '108 Calls', '76% Total', const Color(0xFF0288D1), 0.76),
                const Divider(height: 14),
                _matrixItem('Joint with ASM (Rajesh Sharma)', '26 Calls', '18% Total', const Color(0xFFE11D48), 0.18),
                const Divider(height: 14),
                _matrixItem('Joint with RSM (Vikram Malhotra)', '8 Calls', '6% Total', const Color(0xFFF59E0B), 0.06),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _matrixHeader(String title, IconData icon, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
          child: Icon(icon, color: color, size: 16),
        ),
        const SizedBox(width: 8),
        Text(title, style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
      ],
    );
  }

  Widget _matrixItem(String label, String value, String rate, Color color, double progress) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: Color(0xFF0F172A)))),
            Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: color)),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: color.withValues(alpha: 0.12),
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}
