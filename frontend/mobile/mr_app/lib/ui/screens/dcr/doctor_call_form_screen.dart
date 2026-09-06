import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/doctor_model.dart';
import '../../../models/dcr_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../providers/dcr_provider.dart';
import '../../../providers/sample_provider.dart';
import '../../widgets/receipt_photo_uploader.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class DoctorCallFormScreen extends StatefulWidget {
  final DoctorModel? selectedDoctor;
  const DoctorCallFormScreen({super.key, this.selectedDoctor});

  @override
  State<DoctorCallFormScreen> createState() => _DoctorCallFormScreenState();
}

class _DoctorCallFormScreenState extends State<DoctorCallFormScreen> {
  final _formKey = GlobalKey<FormState>();
  DoctorModel? _currentDoctor;
  String _visitType = 'Solo';
  String _jointManager = 'Rajesh Sharma (ASM)';

  final List<String> _selectedProductIds = [];
  final Map<String, String> _productFocusMap = {};
  final Map<String, int> _sampleQuantities = {};
  final List<String> _selectedGifts = [];
  String _prescriptionCommitment = 'Moderate (2-4 Rx/day)';

  final _writtenReviewController = TextEditingController(
    text: 'Detailed primary molecules with clinical efficacy trials. Doctor showed strong interest in CardioVasc-AM safety profile.',
  );
  final _feedbackController = TextEditingController(
    text: 'Doctor requested comparative trial study on GlycoSmart-D10 in next joint visit.',
  );
  DateTime _nextVisitDate = DateTime.now().add(const Duration(days: 14));

  @override
  void initState() {
    super.initState();
    _currentDoctor = widget.selectedDoctor;
    if (_currentDoctor != null && _currentDoctor!.taggedProductIds.isNotEmpty) {
      _selectedProductIds.addAll(_currentDoctor!.taggedProductIds);
      for (int i = 0; i < _currentDoctor!.taggedProductIds.length; i++) {
        _productFocusMap[_currentDoctor!.taggedProductIds[i]] = i == 0 ? 'Primary' : 'Secondary';
      }
    }
  }

  @override
  void dispose() {
    _writtenReviewController.dispose();
    _feedbackController.dispose();
    super.dispose();
  }

  void _submitDoctorCall() {
    if (_currentDoctor == null) return _toast('Please select a doctor to log this visit.', AppColors.error);
    if (_selectedProductIds.isEmpty) return _toast('Please select at least one product promoted/discussed.', AppColors.error);

    final productProvider = context.read<ProductProvider>();
    final dcrProvider = context.read<DcrProvider>();
    final doctorProvider = context.read<DoctorProvider>();
    final sampleProvider = context.read<SampleProvider>();

    final promotedList = _selectedProductIds.map((pId) {
      final product = productProvider.getProductById(pId);
      return ProductPromotionEntry(
        productId: pId,
        brandName: product?.brandName ?? 'Pharma Product',
        focusLevel: _productFocusMap[pId] ?? 'Primary',
      );
    }).toList();

    final List<SampleGivenEntry> samplesList = [];
    _sampleQuantities.forEach((pId, qty) {
      if (qty > 0) {
        final product = productProvider.getProductById(pId);
        samplesList.add(SampleGivenEntry(
          productId: pId,
          brandName: product?.brandName ?? 'Product Sample',
          batchNumber: 'BT-2026-${pId.substring(pId.length - 2)}',
          quantity: qty,
        ));
        sampleProvider.distributeSample(pId, qty, _currentDoctor!.name);
      }
    });

    for (var gift in _selectedGifts) {
      sampleProvider.distributeSample(gift, 1, _currentDoctor!.name);
    }

    final fullReview = '${_writtenReviewController.text.trim()}\nFeedback: ${_feedbackController.text.trim()}';

    final callReport = DoctorCallReport(
      id: 'doc_call_${DateTime.now().millisecondsSinceEpoch}',
      doctorId: _currentDoctor!.id,
      doctorName: _currentDoctor!.name,
      doctorSpecialty: _currentDoctor!.specialty,
      clinicName: _currentDoctor!.clinicName,
      doctorClass: _currentDoctor!.doctorClass.shortCode,
      callTime: DateTime.now(),
      visitType: _visitType,
      jointWithPerson: _visitType != 'Solo' ? _jointManager : null,
      productsPromoted: promotedList,
      samplesGiven: samplesList,
      giftsGiven: _selectedGifts,
      prescriptionCommitment: _prescriptionCommitment,
      doctorFeedback: fullReview,
      nextVisitDate: _nextVisitDate,
      locationAddress: _currentDoctor!.address,
    );

    dcrProvider.addDoctorCall(callReport);
    doctorProvider.recordDoctorVisit(_currentDoctor!.id);

    _toast('DCR Logged & Submitted for ${_currentDoctor!.name} ($_visitType)!', AppColors.success);
    Navigator.pop(context, true);
  }

  void _toast(String msg, Color bg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg), backgroundColor: bg));
  }

  Widget _buildTypeBtn(String type, String label, String desc, IconData icon, Color col) {
    final sel = _visitType == type;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() {
          _visitType = type;
          _jointManager = type == 'Joint with ASM' ? 'Rajesh Sharma (ASM)' : 'Vikram Malhotra (RSM)';
        }),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
          decoration: BoxDecoration(
            color: sel ? col.withValues(alpha: 0.08) : const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: sel ? col : const Color(0xFFCBD5E1), width: sel ? 2 : 1),
          ),
          child: Column(
            children: [
              Icon(icon, color: sel ? col : const Color(0xFF64748B), size: 20),
              const SizedBox(height: 4),
              Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: sel ? col : const Color(0xFF0F172A))),
              Text(desc, style: TextStyle(fontSize: 9.5, color: sel ? col.withValues(alpha: 0.8) : const Color(0xFF64748B))),
            ],
          ),
        ),
      ),
    );
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
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Execute Doctor DCR', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
            Text(_currentDoctor?.name ?? 'Doctor Call Report', style: const TextStyle(fontSize: 11.5, color: AppColors.primary, fontWeight: FontWeight.w600)),
          ],
        ),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 12),
            child: Chip(
              avatar: Icon(Icons.gps_fixed, size: 13, color: AppColors.success),
              label: Text('GPS Verified', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.success)),
              backgroundColor: Color(0xFFE8F5E9),
              padding: EdgeInsets.zero,
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            // Section 1: Doctor Profile
            AppSectionCard(
              title: 'Target Physician Info',
              subtitle: 'Doctor details & geo-tagged hospital location',
              icon: Icons.person_rounded,
              child: Column(
                children: [
                  AppDropdownField<String>(
                    label: 'Select Doctor',
                    value: _currentDoctor?.id,
                    items: doctorProvider.doctors.map((d) => DropdownMenuItem(value: d.id, child: Text('${d.name} (${d.specialty}) • ${d.doctorClass.shortCode}'))).toList(),
                    onChanged: (id) {
                      if (id != null) {
                        setState(() {
                          _currentDoctor = doctorProvider.getDoctorById(id);
                          if (_currentDoctor != null && _currentDoctor!.taggedProductIds.isNotEmpty) {
                            _selectedProductIds.clear();
                            _selectedProductIds.addAll(_currentDoctor!.taggedProductIds);
                          }
                        });
                      }
                    },
                  ),
                  if (_currentDoctor != null) ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(10)),
                      child: Row(
                        children: [
                          const Icon(Icons.location_on_outlined, size: 16, color: AppColors.primary),
                          const SizedBox(width: 8),
                          Expanded(child: Text('${_currentDoctor!.clinicName} • ${_currentDoctor!.address}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF334155)))),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // Section 2: Visit Type
            AppSectionCard(
              title: 'Work & Accompaniment Type',
              subtitle: 'Specify if solo or joint field work with management',
              icon: Icons.group_work_rounded,
              child: Row(
                children: [
                  _buildTypeBtn('Solo', 'Solo Visit', 'Self Execution', Icons.person_outline, AppColors.primary),
                  const SizedBox(width: 8),
                  _buildTypeBtn('Joint with ASM', 'With ASM', 'Area Sales Mgr', Icons.people_alt_outlined, const Color(0xFFD97706)),
                  const SizedBox(width: 8),
                  _buildTypeBtn('Joint with RSM', 'With RSM', 'Regional Mgr', Icons.badge_outlined, const Color(0xFF7C3AED)),
                ],
              ),
            ),

            // Section 3: Detailing & Promoted Products
            AppSectionCard(
              title: 'Products Promoted & Focused',
              subtitle: 'Tag core molecules detailed in this interaction',
              icon: Icons.medication_rounded,
              child: Column(
                children: productProvider.products.map((prod) {
                  final isSelected = _selectedProductIds.contains(prod.id);
                  final focus = _productFocusMap[prod.id] ?? 'Primary';
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFEFF6FF) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: isSelected ? AppColors.primaryLight : const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        Checkbox(
                          value: isSelected,
                          activeColor: AppColors.primary,
                          onChanged: (val) {
                            setState(() {
                              if (val == true) {
                                _selectedProductIds.add(prod.id);
                                _productFocusMap[prod.id] = 'Primary';
                              } else {
                                _selectedProductIds.remove(prod.id);
                                _productFocusMap.remove(prod.id);
                              }
                            });
                          },
                        ),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(prod.brandName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              Text('${prod.genericName} • ${prod.therapeuticCategory}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                            ],
                          ),
                        ),
                        if (isSelected)
                          DropdownButton<String>(
                            value: focus,
                            underline: const SizedBox(),
                            style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: AppColors.primary),
                            items: const [
                              DropdownMenuItem(value: 'Primary', child: Text('Primary Focus')),
                              DropdownMenuItem(value: 'Secondary', child: Text('Secondary')),
                              DropdownMenuItem(value: 'Reminder', child: Text('Reminder')),
                            ],
                            onChanged: (f) {
                              if (f != null) setState(() => _productFocusMap[prod.id] = f);
                            },
                          ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),

            // Section 4: Samples Distribution
            AppSectionCard(
              title: 'Physician Samples Distributed',
              subtitle: 'Stock deducted instantly from local sample bag',
              icon: Icons.inventory_2_outlined,
              child: Column(
                children: [
                  ...productProvider.products.map((prod) {
                    final qty = _sampleQuantities[prod.id] ?? 0;
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(prod.brandName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12.5)),
                                Text('In Stock: ${prod.sampleStock} units', style: const TextStyle(fontSize: 10.5, color: AppColors.success)),
                              ],
                            ),
                          ),
                          AppCounterWidget(
                            value: qty,
                            max: prod.sampleStock,
                            onChanged: (newQty) => setState(() => _sampleQuantities[prod.id] = newQty),
                          ),
                        ],
                      ),
                    );
                  }),
                  const Divider(height: 20),
                  AppDropdownField<String>(
                    label: 'Prescription Commitment Level',
                    value: _prescriptionCommitment,
                    items: const [
                      DropdownMenuItem(value: 'High (>5 Rx/day)', child: Text('High Support (>5 Rx/day)')),
                      DropdownMenuItem(value: 'Moderate (2-4 Rx/day)', child: Text('Moderate Support (2-4 Rx/day)')),
                      DropdownMenuItem(value: 'Low (1 Rx/day or Trial)', child: Text('Low / Trial Prescriptions')),
                      DropdownMenuItem(value: 'Non-Supportive / Competitor Loyal', child: Text('Competitor Loyal')),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _prescriptionCommitment = val);
                    },
                  ),
                ],
              ),
            ),

            // Section 5: Interaction Notes & Proof Photo
            AppSectionCard(
              title: 'Interaction Feedback & Chamber Photo',
              subtitle: 'Capture physician response & verification',
              icon: Icons.rate_review_outlined,
              child: Column(
                children: [
                  AppTextField(
                    controller: _writtenReviewController,
                    label: 'Discussion Key Highlights',
                    maxLines: 2,
                  ),
                  const SizedBox(height: 10),
                  AppTextField(
                    controller: _feedbackController,
                    label: 'Doctor Query / Next Action Item',
                    maxLines: 2,
                  ),
                  const SizedBox(height: 12),
                  const ReceiptPhotoUploader(title: 'Chamber / Visiting Card Selfie Verification (Optional)'),
                ],
              ),
            ),

            // Section 6: Next Visit Schedule
            AppSectionCard(
              title: 'Next Call Planning',
              subtitle: 'Set tentative follow-up date',
              icon: Icons.event_available_outlined,
              child: AppDatePickerField(
                label: 'Follow-up Call Date',
                selectedDate: _nextVisitDate,
                onDateSelected: (d) => setState(() => _nextVisitDate = d),
              ),
            ),

            // Action Button
            ElevatedButton(
              onPressed: _submitDoctorCall,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('SUBMIT DOCTOR CALL REPORT', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 0.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
