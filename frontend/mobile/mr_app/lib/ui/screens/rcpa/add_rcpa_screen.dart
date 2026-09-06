import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/doctor_model.dart';
import '../../../models/chemist_model.dart';
import '../../../models/product_model.dart';
import '../../../models/rcpa_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../providers/rcpa_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class AddRcpaScreen extends StatefulWidget {
  final DoctorModel? initialDoctor;
  final ChemistModel? initialChemist;
  const AddRcpaScreen({super.key, this.initialDoctor, this.initialChemist});

  @override
  State<AddRcpaScreen> createState() => _AddRcpaScreenState();
}

class _AddRcpaScreenState extends State<AddRcpaScreen> {
  DoctorModel? _selectedDoctor;
  ChemistModel? _selectedChemist;
  ProductModel? _selectedProduct;

  final _ownRxController = TextEditingController(text: '35');
  final _competitorBrandController = TextEditingController(text: 'Telma-AM');
  final _competitorCompanyController = TextEditingController(text: 'Glenmark');
  final _competitorRxController = TextEditingController(text: '25');
  final _competitorPriceController = TextEditingController(text: '165.00');
  final _observationsController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _selectedDoctor = widget.initialDoctor;
    _selectedChemist = widget.initialChemist;
  }

  @override
  void dispose() {
    _ownRxController.dispose();
    _competitorBrandController.dispose();
    _competitorCompanyController.dispose();
    _competitorRxController.dispose();
    _competitorPriceController.dispose();
    _observationsController.dispose();
    super.dispose();
  }

  double get _calculatedMarketShare {
    final own = int.tryParse(_ownRxController.text) ?? 0;
    final comp = int.tryParse(_competitorRxController.text) ?? 0;
    final total = own + comp;
    if (total == 0) return 0.0;
    return (own / total) * 100;
  }

  void _submitRcpa() {
    if (_selectedDoctor == null || _selectedChemist == null || _selectedProduct == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select Doctor, Chemist and Own Product!'), backgroundColor: AppColors.error));
      return;
    }

    final comparison = RcpaBrandComparison(
      ownBrandId: _selectedProduct!.id,
      ownBrandName: _selectedProduct!.brandName,
      ownBrandRxCount: int.tryParse(_ownRxController.text) ?? 0,
      ownBrandPrice: _selectedProduct!.mrp,
      competitorBrandName: _competitorBrandController.text.trim(),
      competitorCompany: _competitorCompanyController.text.trim(),
      competitorRxCount: int.tryParse(_competitorRxController.text) ?? 0,
      competitorPrice: double.tryParse(_competitorPriceController.text) ?? 0.0,
    );

    final rcpa = RcpaModel(
      id: 'rcpa_${DateTime.now().millisecondsSinceEpoch}',
      doctorId: _selectedDoctor!.id,
      doctorName: _selectedDoctor!.name,
      doctorSpecialty: _selectedDoctor!.specialty,
      chemistId: _selectedChemist!.id,
      chemistShopName: _selectedChemist!.shopName,
      auditDate: DateTime.now(),
      comparisons: [comparison],
      observations: _observationsController.text.trim(),
    );

    context.read<RcpaProvider>().addAudit(rcpa);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('RCPA Audit for ${_selectedProduct!.brandName} vs ${_competitorBrandController.text} Saved!'), backgroundColor: AppColors.success),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final doctorProvider = context.watch<DoctorProvider>();
    final productProvider = context.watch<ProductProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary), onPressed: () => Navigator.pop(context)),
        title: const Text('Add RCPA Audit Entry', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Color(0xFF0F172A))),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          // Target Physician & Store
          AppSectionCard(
            title: 'Audit Stakeholders',
            subtitle: 'Doctor whose prescription is audited at Chemist counter',
            icon: Icons.people_outline,
            child: Column(
              children: [
                AppDropdownField<DoctorModel>(
                  label: 'Prescribing Physician',
                  value: _selectedDoctor,
                  items: doctorProvider.doctors.map((d) => DropdownMenuItem(value: d, child: Text('${d.name} (${d.specialty})'))).toList(),
                  onChanged: (d) => setState(() => _selectedDoctor = d),
                ),
                const SizedBox(height: 10),
                AppDropdownField<ChemistModel>(
                  label: 'Audit Pharmacy Store',
                  value: _selectedChemist,
                  items: doctorProvider.chemists.map((c) => DropdownMenuItem(value: c, child: Text(c.shopName))).toList(),
                  onChanged: (c) => setState(() => _selectedChemist = c),
                ),
              ],
            ),
          ),

          // Own Product
          AppSectionCard(
            title: 'Alleviare Promoted Molecule',
            subtitle: 'Select company brand and monthly Rx volume',
            icon: Icons.medication_outlined,
            child: Column(
              children: [
                AppDropdownField<ProductModel>(
                  label: 'Alleviare Brand Name',
                  value: _selectedProduct,
                  items: productProvider.products.map((p) => DropdownMenuItem(value: p, child: Text('${p.brandName} (${p.packing})'))).toList(),
                  onChanged: (p) => setState(() => _selectedProduct = p),
                ),
                const SizedBox(height: 10),
                AppTextField(
                  controller: _ownRxController,
                  label: 'Our Monthly Prescriptions (Units)',
                  keyboardType: TextInputType.number,
                  onChanged: (_) => setState(() {}),
                ),
              ],
            ),
          ),

          // Competitor Brand
          AppSectionCard(
            title: 'Competitor Brand & Substitution',
            subtitle: 'Competing molecule dispensing at this chemist',
            icon: Icons.compare_arrows_rounded,
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(child: AppTextField(controller: _competitorBrandController, label: 'Competitor Brand Name')),
                    const SizedBox(width: 10),
                    Expanded(child: AppTextField(controller: _competitorCompanyController, label: 'Company / Manufacturer')),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: AppTextField(
                        controller: _competitorRxController,
                        label: 'Competitor Units / Mo',
                        keyboardType: TextInputType.number,
                        onChanged: (_) => setState(() {}),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(child: AppTextField(controller: _competitorPriceController, label: 'MRP Price (\$)', keyboardType: TextInputType.number)),
                  ],
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(10)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Our Market Share:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
                      Text('${_calculatedMarketShare.toStringAsFixed(1)}%', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.primary)),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                AppTextField(controller: _observationsController, label: 'Substitution Reason / Scheme Notes', maxLines: 2),
              ],
            ),
          ),

          // Submit
          ElevatedButton(
            onPressed: _submitRcpa,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('SAVE RCPA AUDIT ENTRY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
