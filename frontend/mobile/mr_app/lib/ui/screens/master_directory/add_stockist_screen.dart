import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/stockist_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class AddStockistScreen extends StatefulWidget {
  final StockistModel? initialStockist;
  const AddStockistScreen({super.key, this.initialStockist});

  @override
  State<AddStockistScreen> createState() => _AddStockistScreenState();
}

class _AddStockistScreenState extends State<AddStockistScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _agencyNameController;
  late TextEditingController _contactPersonController;
  late TextEditingController _addressController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;
  late TextEditingController _gstController;
  late TextEditingController _creditLimitController;

  bool get isEditing => widget.initialStockist != null;

  @override
  void initState() {
    super.initState();
    final stk = widget.initialStockist;
    _agencyNameController = TextEditingController(text: stk?.agencyName ?? '');
    _contactPersonController = TextEditingController(text: stk?.name ?? '');
    _addressController = TextEditingController(text: stk?.address ?? '');
    _phoneController = TextEditingController(text: stk?.phone ?? '');
    _emailController = TextEditingController(text: stk?.email ?? '');
    _gstController = TextEditingController(text: stk?.gstNumber ?? 'GST-CAM-2026-');
    _creditLimitController = TextEditingController(text: stk?.creditLimit.toInt().toString() ?? '500000');
  }

  @override
  void dispose() {
    _agencyNameController.dispose();
    _contactPersonController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _gstController.dispose();
    _creditLimitController.dispose();
    super.dispose();
  }

  void _saveStockist() {
    if (!_formKey.currentState!.validate()) return;
    final doctorProvider = context.read<DoctorProvider>();
    final credit = double.tryParse(_creditLimitController.text) ?? 500000.0;

    if (isEditing) {
      final updated = widget.initialStockist!.copyWith(
        agencyName: _agencyNameController.text.trim(),
        name: _contactPersonController.text.trim(),
        address: _addressController.text.trim(),
        phone: _phoneController.text.trim(),
        email: _emailController.text.trim(),
        gstNumber: _gstController.text.trim(),
        creditLimit: credit,
      );
      doctorProvider.updateStockist(updated);
    } else {
      final newStk = StockistModel(
        id: 'stk_${DateTime.now().millisecondsSinceEpoch}',
        agencyName: _agencyNameController.text.trim(),
        name: _contactPersonController.text.trim(),
        address: _addressController.text.trim(),
        phone: _phoneController.text.trim(),
        email: _emailController.text.trim(),
        gstNumber: _gstController.text.trim(),
        creditLimit: credit,
      );
      doctorProvider.addStockist(newStk);
    }

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary), onPressed: () => Navigator.pop(context)),
        title: Text(isEditing ? 'Edit Distributor' : 'Add Stockist Agency', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Color(0xFF0F172A))),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            AppSectionCard(
              title: 'Agency & Commercial Details',
              subtitle: 'Distributor entity name, proprietor and GST number',
              icon: Icons.account_balance_outlined,
              child: Column(
                children: [
                  AppTextField(controller: _agencyNameController, label: 'Distributor / Agency Name *', validator: (v) => v == null || v.isEmpty ? 'Required' : null),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _contactPersonController, label: 'Proprietor / Contact')),
                      const SizedBox(width: 10),
                      Expanded(child: AppTextField(controller: _gstController, label: 'GST Number')),
                    ],
                  ),
                ],
              ),
            ),

            AppSectionCard(
              title: 'Contact & Credit Limit',
              subtitle: 'Warehouse address and company credit threshold',
              icon: Icons.payments_outlined,
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _phoneController, label: 'Phone Number', keyboardType: TextInputType.phone)),
                      const SizedBox(width: 10),
                      Expanded(child: AppTextField(controller: _creditLimitController, label: 'Credit Limit (\$)', keyboardType: TextInputType.number)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  AppTextField(controller: _emailController, label: 'Email Address', keyboardType: TextInputType.emailAddress),
                  const SizedBox(height: 10),
                  AppTextField(controller: _addressController, label: 'Godown / Office Address'),
                ],
              ),
            ),

            ElevatedButton(
              onPressed: _saveStockist,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(isEditing ? 'UPDATE STOCKIST' : 'SAVE STOCKIST DISTRIBUTOR', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
