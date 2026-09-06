import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/doctor_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/product_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class AddDoctorScreen extends StatefulWidget {
  final DoctorModel? initialDoctor;
  const AddDoctorScreen({super.key, this.initialDoctor});

  @override
  State<AddDoctorScreen> createState() => _AddDoctorScreenState();
}

class _AddDoctorScreenState extends State<AddDoctorScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _nameController;
  late TextEditingController _degreeController;
  late TextEditingController _specialtyController;
  late TextEditingController _clinicController;
  late TextEditingController _addressController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;
  late TextEditingController _preferredTimeController;
  late TextEditingController _potentialController;

  late DoctorClass _doctorClass;
  late DoctorPracticeType _practiceType;
  late String _selectedPatch;
  late int _plannedVisits;
  final List<String> _selectedProductIds = [];

  bool get isEditing => widget.initialDoctor != null;

  @override
  void initState() {
    super.initState();
    final doc = widget.initialDoctor;
    _nameController = TextEditingController(text: doc?.name ?? '');
    _degreeController = TextEditingController(text: doc?.degree ?? 'MBBS, MD');
    _specialtyController = TextEditingController(text: doc?.specialty ?? 'Cardiologist');
    _clinicController = TextEditingController(text: doc?.clinicName ?? '');
    _addressController = TextEditingController(text: doc?.address ?? '');
    _phoneController = TextEditingController(text: doc?.phone ?? '');
    _emailController = TextEditingController(text: doc?.email ?? '');
    _preferredTimeController = TextEditingController(text: doc?.preferredTime ?? '05:00 PM - 07:00 PM');
    _potentialController = TextEditingController(text: doc?.rxPotentialMonthly.toInt().toString() ?? '850');

    _doctorClass = doc?.doctorClass ?? DoctorClass.a;
    _practiceType = doc?.practiceType ?? DoctorPracticeType.hospitalDoctor;
    _selectedPatch = doc?.patch ?? 'Central Hospital Zone Hub';
    _plannedVisits = doc?.plannedVisitsPerMonth ?? 2;
    if (doc?.taggedProductIds != null) _selectedProductIds.addAll(doc!.taggedProductIds);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _degreeController.dispose();
    _specialtyController.dispose();
    _clinicController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _preferredTimeController.dispose();
    _potentialController.dispose();
    super.dispose();
  }

  void _saveDoctor() {
    if (!_formKey.currentState!.validate()) return;

    final provider = context.read<DoctorProvider>();
    final doc = DoctorModel(
      id: widget.initialDoctor?.id ?? 'doc_${DateTime.now().millisecondsSinceEpoch}',
      name: _nameController.text.trim(),
      degree: _degreeController.text.trim(),
      specialty: _specialtyController.text.trim(),
      clinicName: _clinicController.text.trim(),
      address: _addressController.text.trim(),
      patch: _selectedPatch,
      phone: _phoneController.text.trim(),
      email: _emailController.text.trim(),
      doctorClass: _doctorClass,
      practiceType: _practiceType,
      rxPotentialMonthly: double.tryParse(_potentialController.text.trim()) ?? 0,
      plannedVisitsPerMonth: _plannedVisits,
      completedVisitsThisMonth: widget.initialDoctor?.completedVisitsThisMonth ?? 0,
      taggedProductIds: _selectedProductIds,
      preferredTime: _preferredTimeController.text.trim(),
    );

    if (isEditing) {
      provider.updateDoctor(doc);
    } else {
      provider.addDoctor(doc);
    }

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary), onPressed: () => Navigator.pop(context)),
        title: Text(isEditing ? 'Edit Doctor Master' : 'Add New Doctor', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Color(0xFF0F172A))),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            // Basic Info
            AppSectionCard(
              title: 'Doctor Profile & Qualifications',
              subtitle: 'Doctor full name, degrees and clinical specialty',
              icon: Icons.person_outline,
              child: Column(
                children: [
                  AppTextField(controller: _nameController, label: 'Doctor Full Name *', hint: 'e.g. Dr. Chan Sopheap', validator: (v) => v == null || v.isEmpty ? 'Required' : null),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _degreeController, label: 'Degrees / Qualifications', hint: 'e.g. MBBS, MD')),
                      const SizedBox(width: 10),
                      Expanded(child: AppTextField(controller: _specialtyController, label: 'Medical Specialty', hint: 'e.g. Cardiologist')),
                    ],
                  ),
                ],
              ),
            ),

            // Practice Type & Channel (Hospital, Clinic, Pvt, Govt)
            AppSectionCard(
              title: 'Practice Type & Detailing Channel',
              subtitle: 'Select Hospital, Clinic, Private or Government classification',
              icon: Icons.domain_rounded,
              child: Column(
                children: [
                  AppDropdownField<DoctorPracticeType>(
                    label: 'Doctor Practice Category',
                    value: _practiceType,
                    items: DoctorPracticeType.values.map((p) => DropdownMenuItem(value: p, child: Text(p.categoryBadge))).toList(),
                    onChanged: (p) {
                      if (p != null) setState(() => _practiceType = p);
                    },
                  ),
                ],
              ),
            ),

            // Clinic & Territory
            AppSectionCard(
              title: 'Clinic & Geo Territory',
              subtitle: 'Hospital address, route patch & consultation timings',
              icon: Icons.local_hospital_outlined,
              child: Column(
                children: [
                  AppTextField(controller: _clinicController, label: 'Hospital / Clinic / Chamber Name', hint: 'e.g. Calmette Hospital / LifeCare Clinic'),
                  const SizedBox(height: 10),
                  AppTextField(controller: _addressController, label: 'Chamber Address', hint: 'Street & room number'),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _phoneController, label: 'Contact Phone', keyboardType: TextInputType.phone)),
                      const SizedBox(width: 10),
                      Expanded(child: AppTextField(controller: _preferredTimeController, label: 'Visiting Window', hint: 'e.g. 11:00 AM - 01:00 PM')),
                    ],
                  ),
                ],
              ),
            ),

            // Classification & Commercial Potential
            AppSectionCard(
              title: 'Segmentation & Rx Potential',
              subtitle: 'Core doctor classification (A+, A, B, C) and monthly revenue',
              icon: Icons.star_border_rounded,
              child: Column(
                children: [
                  AppDropdownField<DoctorClass>(
                    label: 'Doctor Class',
                    value: _doctorClass,
                    items: DoctorClass.values.map((c) => DropdownMenuItem(value: c, child: Text(c.label))).toList(),
                    onChanged: (c) {
                      if (c != null) setState(() => _doctorClass = c);
                    },
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(child: AppTextField(controller: _potentialController, label: 'Monthly Rx Potential (\$)', keyboardType: TextInputType.number)),
                      const SizedBox(width: 10),
                      Expanded(
                        child: AppDropdownField<int>(
                          label: 'Monthly Visit Frequency',
                          value: _plannedVisits,
                          items: const [
                            DropdownMenuItem(value: 1, child: Text('1 Call / Month')),
                            DropdownMenuItem(value: 2, child: Text('2 Calls / Month')),
                            DropdownMenuItem(value: 4, child: Text('4 Calls / Month (Weekly)')),
                          ],
                          onChanged: (v) {
                            if (v != null) setState(() => _plannedVisits = v);
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Tagged Products
            AppSectionCard(
              title: 'Tagged Promotion Molecules',
              subtitle: 'Select focus brands for this physician profile',
              icon: Icons.medication_outlined,
              child: Wrap(
                spacing: 8,
                runSpacing: 4,
                children: productProvider.products.map((p) {
                  final sel = _selectedProductIds.contains(p.id);
                  return FilterChip(
                    label: Text(p.brandName, style: TextStyle(fontSize: 12, fontWeight: sel ? FontWeight.bold : FontWeight.normal)),
                    selected: sel,
                    selectedColor: AppColors.primaryContainer,
                    onSelected: (v) => setState(() => v ? _selectedProductIds.add(p.id) : _selectedProductIds.remove(p.id)),
                  );
                }).toList(),
              ),
            ),

            // Save Button
            ElevatedButton(
              onPressed: _saveDoctor,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(isEditing ? 'UPDATE DOCTOR PROFILE' : 'SAVE DOCTOR MASTER', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
