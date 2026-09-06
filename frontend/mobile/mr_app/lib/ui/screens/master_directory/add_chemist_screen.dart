import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/chemist_model.dart';
import '../../../models/stockist_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class AddChemistScreen extends StatefulWidget {
  final ChemistModel? initialChemist;
  const AddChemistScreen({super.key, this.initialChemist});

  @override
  State<AddChemistScreen> createState() => _AddChemistScreenState();
}

class _AddChemistScreenState extends State<AddChemistScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _shopNameController;
  late TextEditingController _contactPersonController;
  late TextEditingController _addressController;
  late TextEditingController _phoneController;
  late TextEditingController _licenseController;
  late TextEditingController _avgOrderController;

  late String _selectedPatch;
  StockistModel? _selectedStockist;

  bool get isEditing => widget.initialChemist != null;

  @override
  void initState() {
    super.initState();
    final chem = widget.initialChemist;
    _shopNameController = TextEditingController(text: chem?.shopName ?? '');
    _contactPersonController = TextEditingController(text: chem?.name ?? '');
    _addressController = TextEditingController(text: chem?.address ?? '');
    _phoneController = TextEditingController(text: chem?.phone ?? '');
    _licenseController = TextEditingController(text: chem?.drugLicenseNo ?? 'DL-CAM-2026-');
    _avgOrderController = TextEditingController(text: chem?.avgMonthlyOrderValue.toInt().toString() ?? '500');
    _selectedPatch = chem?.patch ?? 'Central Hospital Zone Hub';
  }

  @override
  void dispose() {
    _shopNameController.dispose();
    _contactPersonController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _licenseController.dispose();
    _avgOrderController.dispose();
    super.dispose();
  }

  void _saveChemist() {
    if (!_formKey.currentState!.validate()) return;
    final doctorProvider = context.read<DoctorProvider>();
    final stockists = doctorProvider.stockists;
    final stockist = _selectedStockist ?? (stockists.isNotEmpty ? stockists.first : null);

    final chemist = ChemistModel(
      id: widget.initialChemist?.id ?? 'chem_${DateTime.now().millisecondsSinceEpoch}',
      name: _contactPersonController.text.trim(),
      shopName: _shopNameController.text.trim(),
      address: _addressController.text.trim(),
      patch: _selectedPatch,
      phone: _phoneController.text.trim(),
      drugLicenseNo: _licenseController.text.trim(),
      mappedStockistId: stockist?.id ?? 'stk_1',
      mappedStockistName: stockist?.agencyName ?? 'Apollo Pharma Wholesale Depot',
      avgMonthlyOrderValue: double.tryParse(_avgOrderController.text.trim()) ?? 0,
    );

    if (isEditing) {
      doctorProvider.updateChemist(chemist);
    } else {
      doctorProvider.addChemist(chemist);
    }

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final doctorProvider = context.watch<DoctorProvider>();
    final stockists = doctorProvider.stockists;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary), onPressed: () => Navigator.pop(context)),
        title: Text(isEditing ? 'Edit Chemist' : 'Add Chemist Store', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Color(0xFF0F172A))),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            AppSectionCard(
              title: 'Pharmacy Information',
              subtitle: 'Store name, pharmacist in charge and drug license',
              icon: Icons.storefront_rounded,
              child: Column(
                children: [
                  AppTextField(controller: _shopNameController, label: 'Medical Store Name *', validator: (v) => v == null || v.isEmpty ? 'Required' : null),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _contactPersonController, label: 'Pharmacist Name')),
                      const SizedBox(width: 10),
                      Expanded(child: AppTextField(controller: _licenseController, label: 'Drug License No')),
                    ],
                  ),
                ],
              ),
            ),

            AppSectionCard(
              title: 'Address & Commercial Mapping',
              subtitle: 'Store location and servicing stockist distributor',
              icon: Icons.map_outlined,
              child: Column(
                children: [
                  AppTextField(controller: _addressController, label: 'Full Store Address'),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _phoneController, label: 'Phone Number', keyboardType: TextInputType.phone)),
                      const SizedBox(width: 10),
                      Expanded(child: AppTextField(controller: _avgOrderController, label: 'Avg Monthly POB (\$)', keyboardType: TextInputType.number)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  AppDropdownField<StockistModel>(
                    label: 'Servicing Stockist / Distributor',
                    value: _selectedStockist ?? (stockists.isNotEmpty ? stockists.first : null),
                    items: stockists.map((s) => DropdownMenuItem(value: s, child: Text(s.agencyName))).toList(),
                    onChanged: (s) => setState(() => _selectedStockist = s),
                  ),
                ],
              ),
            ),

            ElevatedButton(
              onPressed: _saveChemist,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(isEditing ? 'UPDATE CHEMIST STORE' : 'SAVE CHEMIST STORE', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
