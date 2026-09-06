import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/facility_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class AddFacilityScreen extends StatefulWidget {
  final FacilityModel? initialFacility;
  const AddFacilityScreen({super.key, this.initialFacility});

  @override
  State<AddFacilityScreen> createState() => _AddFacilityScreenState();
}

class _AddFacilityScreenState extends State<AddFacilityScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _nameController;
  late TextEditingController _contactPersonController;
  late TextEditingController _designationController;
  late TextEditingController _addressController;
  late TextEditingController _phoneController;
  late TextEditingController _bedsController;
  late TextEditingController _notesController;

  late FacilityCategory _category;
  late FacilitySector _sector;
  late String _selectedPatch;

  bool get isEditing => widget.initialFacility != null;

  @override
  void initState() {
    super.initState();
    final fac = widget.initialFacility;
    _nameController = TextEditingController(text: fac?.name ?? '');
    _contactPersonController = TextEditingController(text: fac?.contactPerson ?? '');
    _designationController = TextEditingController(text: fac?.designation ?? 'Superintendent / Purchase Head');
    _addressController = TextEditingController(text: fac?.address ?? '');
    _phoneController = TextEditingController(text: fac?.phone ?? '');
    _bedsController = TextEditingController(text: fac?.totalBeds.toString() ?? '50');
    _notesController = TextEditingController(text: fac?.notes ?? '');

    _category = fac?.category ?? FacilityCategory.hospital;
    _sector = fac?.sector ?? FacilitySector.private;
    _selectedPatch = fac?.patch ?? 'Central Hospital Zone Hub';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _contactPersonController.dispose();
    _designationController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _bedsController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _saveFacility() {
    if (!_formKey.currentState!.validate()) return;
    final doctorProvider = context.read<DoctorProvider>();

    final facility = FacilityModel(
      id: widget.initialFacility?.id ?? 'fac_${DateTime.now().millisecondsSinceEpoch}',
      name: _nameController.text.trim(),
      category: _category,
      sector: _sector,
      contactPerson: _contactPersonController.text.trim(),
      designation: _designationController.text.trim(),
      address: _addressController.text.trim(),
      patch: _selectedPatch,
      phone: _phoneController.text.trim(),
      totalBeds: int.tryParse(_bedsController.text.trim()) ?? 0,
      notes: _notesController.text.trim(),
    );

    if (isEditing) {
      doctorProvider.updateFacility(facility);
    } else {
      doctorProvider.addFacility(facility);
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
        title: Text(isEditing ? 'Edit Facility' : 'Add Healthcare Facility', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Color(0xFF0F172A))),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            AppSectionCard(
              title: 'Institution Profile',
              subtitle: 'Hospital / Clinic entity designation and sector classification',
              icon: Icons.local_hospital_rounded,
              child: Column(
                children: [
                  AppTextField(controller: _nameController, label: 'Institution / Hospital Name *', validator: (v) => v == null || v.isEmpty ? 'Required' : null),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: AppDropdownField<FacilityCategory>(
                          label: 'Facility Type',
                          value: _category,
                          items: FacilityCategory.values.map((c) => DropdownMenuItem(value: c, child: Text(c.label))).toList(),
                          onChanged: (c) {
                            if (c != null) setState(() => _category = c);
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: AppDropdownField<FacilitySector>(
                          label: 'Sector',
                          value: _sector,
                          items: FacilitySector.values.map((s) => DropdownMenuItem(value: s, child: Text(s.label))).toList(),
                          onChanged: (s) {
                            if (s != null) setState(() => _sector = s);
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            AppSectionCard(
              title: 'Key Contact & Capacity',
              subtitle: 'Purchase in-charge officer, total beds and address',
              icon: Icons.contact_mail_outlined,
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _contactPersonController, label: 'Purchase / RMO Contact')),
                      const SizedBox(width: 10),
                      Expanded(child: AppTextField(controller: _designationController, label: 'Designation')),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _phoneController, label: 'Phone Number', keyboardType: TextInputType.phone)),
                      const SizedBox(width: 10),
                      Expanded(child: AppTextField(controller: _bedsController, label: 'Total Inpatient Beds', keyboardType: TextInputType.number)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  AppTextField(controller: _addressController, label: 'Full Facility Address'),
                  const SizedBox(height: 10),
                  AppTextField(controller: _notesController, label: 'Formulary / Tender Notes', maxLines: 2),
                ],
              ),
            ),

            ElevatedButton(
              onPressed: _saveFacility,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(isEditing ? 'UPDATE FACILITY' : 'SAVE HEALTHCARE FACILITY', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
