import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/chemist_model.dart';
import '../../../models/dcr_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../providers/dcr_provider.dart';
import '../../widgets/receipt_photo_uploader.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class ChemistCallFormScreen extends StatefulWidget {
  final ChemistModel? selectedChemist;
  const ChemistCallFormScreen({super.key, this.selectedChemist});

  @override
  State<ChemistCallFormScreen> createState() => _ChemistCallFormScreenState();
}

class _ChemistCallFormScreenState extends State<ChemistCallFormScreen> {
  final _formKey = GlobalKey<FormState>();
  ChemistModel? _currentChemist;
  String _entityType = 'Retail Chemist';
  final Map<String, int> _orderQuantities = {'prod_1': 10, 'prod_2': 5};
  String _rxDemandFlow = 'Steady Prescriptions (Regular)';
  String _prescribingDoctor = 'Dr. Sameer Kulkarni (Cardiology)';

  final _feedbackController = TextEditingController(
    text: 'Chemist reported regular Rx generation from Dr. Kulkarni. Requested 10+1 promotional bonus for CardioVasc-AM.',
  );

  final _entityTypes = ['Retail Chemist', 'Stockist / Distributor', 'Hospital / Clinic Pharmacy', 'Private Dispensing Unit'];
  final _rxFlowOptions = ['Steady Prescriptions (Regular)', 'High Rx Demand (Fast Moving)', 'Competitor Substitution Observed', 'New Rx Trial Initiated'];
  final _topDoctors = ['Dr. Sameer Kulkarni (Cardiology)', 'Dr. Arvind Singhania (Orthopedics)', 'Dr. Priya Nair (Diabetology)', 'Dr. Farhan Rizvi (Pediatrics)'];

  @override
  void initState() {
    super.initState();
    _currentChemist = widget.selectedChemist;
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }


  void _submitChemistCall() {
    if (_currentChemist == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a chemist store.'), backgroundColor: AppColors.error));
      return;
    }

    final dcrProvider = context.read<DcrProvider>();
    final doctorProvider = context.read<DoctorProvider>();

    final call = ChemistCallReport(
      id: 'chem_call_${DateTime.now().millisecondsSinceEpoch}',
      chemistId: _currentChemist!.id,
      chemistName: _currentChemist!.name,
      shopName: _currentChemist!.shopName,
      callTime: DateTime.now(),
      pobBooked: false,
      pobAmount: 0.0,
      mappedStockistName: _currentChemist!.mappedStockistName,
      competitorFeedback: 'Rx Demand: $_rxDemandFlow | Key Prescriber: $_prescribingDoctor\n${_feedbackController.text.trim()}',
    );

    dcrProvider.addChemistCall(call);
    doctorProvider.recordChemistVisit(_currentChemist!.id);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Chemist Visit & Prescription Audit Logged for ${_currentChemist!.shopName}!'), backgroundColor: AppColors.success),
    );
    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    final doctorProvider = context.watch<DoctorProvider>();
    final productProvider = context.watch<ProductProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Chemist & Retailer DCR', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Store Selection
            AppSectionCard(
              title: 'Chemist Details',
              subtitle: 'Select retail pharmacy and category classification',
              icon: Icons.storefront_rounded,
              child: Column(
                children: [
                  AppDropdownField<String>(
                    label: 'Store Name',
                    value: _currentChemist?.id,
                    items: doctorProvider.chemists.map((c) => DropdownMenuItem(value: c.id, child: Text(c.shopName))).toList(),
                    onChanged: (id) {
                      if (id != null) setState(() => _currentChemist = doctorProvider.getChemistById(id));
                    },
                  ),
                  const SizedBox(height: 10),
                  AppDropdownField<String>(
                    label: 'Category Type',
                    value: _entityType,
                    items: _entityTypes.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _entityType = val);
                    },
                  ),
                ],
              ),
            ),

            // Product Availability & RCPA Audit
            AppSectionCard(
              title: 'Prescription Audit & Stock Availability (RCPA)',
              subtitle: 'Verify product availability & prescriber demand in store',
              icon: Icons.fact_check_outlined,
              child: Column(
                children: [
                  ...productProvider.products.map((prod) {
                    final qty = _orderQuantities[prod.id] ?? 1;
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(prod.brandName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                Text('${prod.genericName} • ${prod.packing}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: qty > 0 ? const Color(0xFFF0FDF4) : const Color(0xFFFEF2F2),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: qty > 0 ? const Color(0xFFBBF7D0) : const Color(0xFFFECACA)),
                            ),
                            child: Text(
                              qty > 0 ? '✓ Available in Stock' : '⚠ Low Stock / Reorder',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: qty > 0 ? AppColors.success : AppColors.error),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),

            // Market Intelligence
            AppSectionCard(
              title: 'Market & Prescriber Intelligence',
              subtitle: 'Track prescription movement and linked physicians',
              icon: Icons.insights_rounded,
              child: Column(
                children: [
                  AppDropdownField<String>(
                    label: 'Rx Demand Status',
                    value: _rxDemandFlow,
                    items: _rxFlowOptions.map((o) => DropdownMenuItem(value: o, child: Text(o))).toList(),
                    onChanged: (v) {
                      if (v != null) setState(() => _rxDemandFlow = v);
                    },
                  ),
                  const SizedBox(height: 10),
                  AppDropdownField<String>(
                    label: 'Primary Prescribing Doctor',
                    value: _prescribingDoctor,
                    items: _topDoctors.map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
                    onChanged: (v) {
                      if (v != null) setState(() => _prescribingDoctor = v);
                    },
                  ),
                  const SizedBox(height: 10),
                  AppTextField(
                    controller: _feedbackController,
                    label: 'Chemist Feedback & Competitor Notes',
                    maxLines: 2,
                  ),
                  const SizedBox(height: 12),
                  const ReceiptPhotoUploader(title: 'Store Front / Shelf Photo Verification (Optional)'),
                ],
              ),
            ),

            // Submit Button
            ElevatedButton(
              onPressed: _submitChemistCall,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('SUBMIT CHEMIST VISIT REPORT', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 0.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
