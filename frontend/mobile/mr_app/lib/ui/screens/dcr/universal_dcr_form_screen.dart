import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/dcr_model.dart';
import '../../../models/doctor_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../providers/dcr_provider.dart';
import '../../../providers/sample_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class UniversalDcrFormScreen extends StatefulWidget {
  final String? preselectedCategory;
  final String? preselectedId;
  final String? preselectedName;
  final String? preselectedPatch;
  final String? planIdToComplete;
  final DoctorCallReport? initialCall;
  final String? dcrId;

  const UniversalDcrFormScreen({
    super.key,
    this.preselectedCategory,
    this.preselectedId,
    this.preselectedName,
    this.preselectedPatch,
    this.planIdToComplete,
    this.initialCall,
    this.dcrId,
  });

  @override
  State<UniversalDcrFormScreen> createState() => _UniversalDcrFormScreenState();
}

class _UniversalDcrFormScreenState extends State<UniversalDcrFormScreen> {
  final _formKey = GlobalKey<FormState>();

  late String _selectedCategory;
  String? _selectedEntityId;
  String _entityDisplayName = '';
  String _entitySubDetails = '';
  String _entityAddress = '';
  String _entityPatch = 'Central Hospital Zone Hub';

  String _workType = 'Solo';
  String? _accompaniedPerson;

  List<String> _selectedProductIds = ['prod_1', 'prod_2'];
  Map<String, String> _productFocusMap = {'prod_1': 'Primary', 'prod_2': 'Secondary'};

  List<SampleGivenEntry> _samplesGiven = [];

  String _rxCommitment = 'Moderate (2-4 Rx/day)';
  final _feedbackController = TextEditingController(text: 'Customer showed strong interest in Alleviare product range.');
  final _competitorController = TextEditingController();

  List<DcrAttachment> _attachments = [
    DcrAttachment(
      fileName: 'Visit_Photo_01.jpg',
      fileType: DcrFileType.photo,
      filePathOrUrl: 'mock://photos/chamber_01.jpg',
      sizeKb: 420,
    ),
  ];

  DateTime _nextScheduleDate = DateTime.now().add(const Duration(days: 7));
  final _nextObjectiveController = TextEditingController(text: 'Follow-up on patient trial feedback & replenish samples');

  bool get isDoctor => _selectedCategory == 'Doctor';
  bool get isEditing => widget.initialCall != null;

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.preselectedCategory ?? 'Hospital Doctor';
    if (_selectedCategory == 'Doctor') _selectedCategory = 'Hospital Doctor';
    _selectedEntityId = widget.preselectedId;
    if (widget.preselectedName != null) _entityDisplayName = widget.preselectedName!;
    if (widget.preselectedPatch != null) _entityPatch = widget.preselectedPatch!;

    if (widget.initialCall != null) {
      final call = widget.initialCall!;
      _selectedEntityId = call.doctorId;
      _entityDisplayName = call.doctorName;
      _entitySubDetails = call.doctorSpecialty;
      _entityAddress = call.clinicName;
      _workType = call.visitType;
      _accompaniedPerson = call.jointWithPerson;
      _selectedProductIds = call.productsPromoted.map((p) => p.productId).toList();
      _productFocusMap = {for (var p in call.productsPromoted) p.productId: p.focusLevel};
      _samplesGiven = List.from(call.samplesGiven);
      _rxCommitment = call.prescriptionCommitment;
      _feedbackController.text = call.doctorFeedback;
      _nextScheduleDate = call.nextVisitDate;
      if (call.attachedDocuments.isNotEmpty) {
        _attachments = List.from(call.attachedDocuments);
      }
    } else {
      WidgetsBinding.instance.addPostFrameCallback((_) => _loadEntityDefaults());
    }
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    _competitorController.dispose();
    _nextObjectiveController.dispose();
    super.dispose();
  }

  void _loadEntityDefaults() {
    final docProvider = context.read<DoctorProvider>();
    final productProvider = context.read<ProductProvider>();

    if (_selectedEntityId != null) {
      final doc = docProvider.getDoctorById(_selectedEntityId!);
      if (doc != null) {
        setState(() {
          _entityDisplayName = doc.name;
          _entitySubDetails = '${doc.specialty} (${doc.doctorClass.shortCode}) • ${doc.degree}';
          _entityAddress = '${doc.clinicName}, ${doc.address}';
          _entityPatch = doc.patch;
        });
      }
    } else {
      _onCategoryChanged(_selectedCategory);
    }

    if (productProvider.products.isNotEmpty && _samplesGiven.isEmpty) {
      final p1 = productProvider.products.first;
      _samplesGiven.add(SampleGivenEntry(productId: p1.id, brandName: p1.brandName, batchNumber: 'CV-2026-A1', quantity: 2));
    }
  }

  void _onCategoryChanged(String newCat) {
    final docProvider = context.read<DoctorProvider>();
    setState(() {
      _selectedCategory = newCat;
      if (docProvider.doctors.isNotEmpty) {
        final isHospital = newCat.contains('Hospital') || newCat.contains('Govt');
        final filtered = docProvider.doctors.where((d) => isHospital ? d.clinicName.toLowerCase().contains('hospital') : true).toList();
        final doc = filtered.isNotEmpty ? filtered.first : docProvider.doctors.first;
        _selectedEntityId = doc.id;
        _entityDisplayName = doc.name;
        _entitySubDetails = '${doc.specialty} (${doc.doctorClass.shortCode}) • ${doc.degree}';
        _entityAddress = '${doc.clinicName}, ${doc.address}';
        _entityPatch = doc.patch;
        _feedbackController.text = 'Doctor showed strong interest in Alleviare molecules. Sample distributed.';
      }
    });
  }

  void _showAddSampleModal() {
    final productProvider = context.read<ProductProvider>();
    String selectedProdId = productProvider.products.first.id;
    int quantity = 2;
    final batchCtrl = TextEditingController(text: 'CV-2026-A1');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => StatefulBuilder(
        builder: (modalCtx, setModalState) {
          final prod = productProvider.products.firstWhere((p) => p.id == selectedProdId, orElse: () => productProvider.products.first);
          return Padding(
            padding: EdgeInsets.only(top: 20, left: 20, right: 20, bottom: MediaQuery.of(modalCtx).viewInsets.bottom + 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Distribute Physician Sample', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                  ],
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: selectedProdId,
                  isExpanded: true,
                  decoration: InputDecoration(
                    labelText: 'Select Molecule / Brand',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                  items: productProvider.products.map((p) {
                    return DropdownMenuItem(value: p.id, child: Text('${p.brandName} (${p.therapeuticCategory})', overflow: TextOverflow.ellipsis));
                  }).toList(),
                  onChanged: (val) => val != null ? setModalState(() => selectedProdId = val) : null,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: batchCtrl,
                  decoration: InputDecoration(
                    labelText: 'Batch Number',
                    hintText: 'e.g. CV-2026-A1',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Quantity (Units):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline, color: Color(0xFF64748B)),
                          onPressed: () => setModalState(() => quantity = (quantity > 1 ? quantity - 1 : 1)),
                        ),
                        Text('$quantity', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline, color: AppColors.primary),
                          onPressed: () => setModalState(() => quantity++),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      setState(() {
                        _samplesGiven.removeWhere((s) => s.productId == selectedProdId);
                        _samplesGiven.add(SampleGivenEntry(
                          productId: selectedProdId,
                          brandName: prod.brandName,
                          batchNumber: batchCtrl.text.trim().isNotEmpty ? batchCtrl.text.trim() : 'CV-2026-A1',
                          quantity: quantity,
                        ));
                      });
                      Navigator.pop(ctx);
                    },
                    child: Text('Confirm $quantity Sample Unit(s)', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _saveAndSubmitDcr() {
    if (_selectedEntityId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select an entity to record DCR.'), backgroundColor: AppColors.error));
      return;
    }

    final dcrProvider = context.read<DcrProvider>();
    final productProvider = context.read<ProductProvider>();
    final sampleProvider = context.read<SampleProvider>();
    final docProvider = context.read<DoctorProvider>();

    final promotedList = _selectedProductIds.map((id) {
      final p = productProvider.products.firstWhere((prod) => prod.id == id, orElse: () => productProvider.products.first);
      return ProductPromotionEntry(
        productId: p.id,
        brandName: p.brandName,
        focusLevel: _productFocusMap[p.id] ?? 'Primary',
      );
    }).toList();

    for (final s in _samplesGiven) {
      sampleProvider.distributeSample(s.productId, s.quantity, _entityDisplayName);
    }

    if (isEditing) {
      final updatedCall = DoctorCallReport(
        id: widget.initialCall!.id,
        doctorId: _selectedEntityId!,
        doctorName: _entityDisplayName,
        doctorSpecialty: _entitySubDetails,
        clinicName: _entityAddress,
        doctorClass: widget.initialCall!.doctorClass,
        callTime: widget.initialCall!.callTime,
        visitType: _workType,
        jointWithPerson: _accompaniedPerson,
        productsPromoted: promotedList,
        samplesGiven: _samplesGiven,
        giftsGiven: widget.initialCall!.giftsGiven,
        prescriptionCommitment: _rxCommitment,
        doctorFeedback: '${_feedbackController.text.trim()}${_competitorController.text.trim().isNotEmpty ? '\nCompetitor: ${_competitorController.text.trim()}' : ''}',
        nextVisitDate: _nextScheduleDate,
        isGeoVerified: widget.initialCall!.isGeoVerified,
        latitude: widget.initialCall!.latitude,
        longitude: widget.initialCall!.longitude,
        locationAddress: _entityAddress,
        attachedDocuments: _attachments,
      );

      dcrProvider.updateDoctorCall(updatedCall, dcrId: widget.dcrId);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Doctor DCR for $_entityDisplayName successfully updated!'), backgroundColor: AppColors.success),
      );
    } else {
      final entryId = 'dcr_${DateTime.now().millisecondsSinceEpoch}';
      docProvider.recordDoctorVisit(_selectedEntityId!);
      dcrProvider.addDoctorCall(DoctorCallReport(
        id: entryId,
        doctorId: _selectedEntityId!,
        doctorName: _entityDisplayName,
        doctorSpecialty: _entitySubDetails,
        clinicName: _entityAddress,
        doctorClass: 'A+',
        callTime: DateTime.now(),
        visitType: _workType,
        jointWithPerson: _accompaniedPerson,
        productsPromoted: promotedList,
        samplesGiven: _samplesGiven,
        prescriptionCommitment: _rxCommitment,
        doctorFeedback: '${_feedbackController.text.trim()}${_competitorController.text.trim().isNotEmpty ? '\nCompetitor: ${_competitorController.text.trim()}' : ''}',
        nextVisitDate: _nextScheduleDate,
        locationAddress: _entityAddress,
        attachedDocuments: _attachments,
      ));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Doctor DCR Successfully Saved & Synced for $_entityDisplayName!'), backgroundColor: AppColors.success),
      );
    }

    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    final docProvider = context.watch<DoctorProvider>();
    final productProvider = context.watch<ProductProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              isEditing ? 'Edit Doctor Detailing' : 'Log Doctor Visit',
              style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            Text(
              'Doctor Category: $_selectedCategory',
              style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w600),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Chip(
              backgroundColor: isEditing ? const Color(0xFFFEF3C7) : const Color(0xFFE0F2FE),
              avatar: Icon(
                isEditing ? Icons.edit_note_rounded : Icons.verified_rounded,
                size: 16,
                color: isEditing ? const Color(0xFFB45309) : const Color(0xFF0369A1),
              ),
              label: Text(
                isEditing ? 'EDIT MODE' : 'GPS LOGGED',
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.bold,
                  color: isEditing ? const Color(0xFFB45309) : const Color(0xFF0369A1),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(14),
          children: [
            // Category Selector Chips (Hospital Doctor, Clinic Doctor, Pvt Consultant, Govt Doctor)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: Row(
                children: [
                  {'name': 'Hospital Doctor', 'icon': '🏥'},
                  {'name': 'Clinic Doctor', 'icon': '🩺'},
                  {'name': 'Pvt Consultant', 'icon': '💼'},
                  {'name': 'Govt Doctor', 'icon': '🏛️'},
                ].map((item) {
                  final cat = item['name']!;
                  final iconStr = item['icon']!;
                  final sel = _selectedCategory == cat || (_selectedCategory == 'Doctor' && cat == 'Hospital Doctor');
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      selected: sel,
                      avatar: Text(iconStr, style: const TextStyle(fontSize: 13)),
                      label: Text(cat),
                      selectedColor: AppColors.primary,
                      labelStyle: TextStyle(
                        color: sel ? Colors.white : const Color(0xFF334155),
                        fontWeight: sel ? FontWeight.bold : FontWeight.w500,
                        fontSize: 12,
                      ),
                      onSelected: (val) {
                        if (val) _onCategoryChanged(cat);
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 12),

            // 1. Doctor Entity Header & Dropdown
            AppSectionCard(
              title: 'Doctor & Practice Details',
              subtitle: 'Select healthcare provider & territory beat',
              icon: Icons.person_pin_circle_rounded,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  DropdownButtonFormField<String>(
                    initialValue: _selectedEntityId,
                    isExpanded: true,
                    decoration: InputDecoration(
                      labelText: 'Select Doctor from Master List',
                      prefixIcon: const Icon(Icons.medical_services_rounded, color: AppColors.primary),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    ),
                    items: docProvider.doctors.map((d) {
                      return DropdownMenuItem(
                        value: d.id,
                        child: Text('${d.name} (${d.specialty}) • ${d.doctorClass.shortCode}', overflow: TextOverflow.ellipsis),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        final d = docProvider.getDoctorById(val);
                        if (d != null) {
                          setState(() {
                            _selectedEntityId = d.id;
                            _entityDisplayName = d.name;
                            _entitySubDetails = '${d.specialty} (${docProvider.getDoctorById(val)!.doctorClass.shortCode}) • ${d.degree}';
                            _entityAddress = '${d.clinicName}, ${d.address}';
                            _entityPatch = d.patch;
                          });
                        }
                      }
                    },
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _entityDisplayName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A)),
                          textAlign: TextAlign.left,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _entitySubDetails,
                          style: const TextStyle(fontSize: 11.5, color: AppColors.primary, fontWeight: FontWeight.w600),
                          textAlign: TextAlign.left,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '📍 $_entityAddress • Beat: $_entityPatch',
                          style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                          textAlign: TextAlign.left,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // 2. Work / Joint Accompaniment
            AppSectionCard(
              title: 'Work / Joint Detailing Type',
              subtitle: 'Specify field accompaniment for visit',
              icon: Icons.groups_rounded,
              child: Row(
                children: [
                  _workTypeBtn('Solo', 'Solo Visit', 'Field MR Call', Icons.person_rounded),
                  const SizedBox(width: 8),
                  _workTypeBtn('With ASM', 'Joint ASM', 'Rajesh Sharma', Icons.supervisor_account_rounded),
                  const SizedBox(width: 8),
                  _workTypeBtn('With RSM', 'Joint RSM', 'Vikram Malhotra', Icons.stars_rounded),
                ],
              ),
            ),

            // 3. Products Promoted & Focus Levels
            AppSectionCard(
              title: 'Products Promoted & Focus Priority',
              subtitle: 'Select molecules detailed & priority pitch level',
              icon: Icons.medical_information_rounded,
              child: Column(
                children: productProvider.products.map((p) {
                  final isSelected = _selectedProductIds.contains(p.id);
                  final focus = _productFocusMap[p.id] ?? 'Primary';
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFEFF6FF) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: isSelected ? const Color(0xFF93C5FD) : const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Checkbox(
                          value: isSelected,
                          activeColor: AppColors.primary,
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          onChanged: (val) {
                            setState(() {
                              if (val == true) {
                                _selectedProductIds.add(p.id);
                                _productFocusMap[p.id] = 'Primary';
                              } else {
                                _selectedProductIds.remove(p.id);
                                _productFocusMap.remove(p.id);
                              }
                            });
                          },
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                p.brandName,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                textAlign: TextAlign.left,
                              ),
                              Text(
                                '${p.genericName} • ${p.therapeuticCategory}',
                                style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                                textAlign: TextAlign.left,
                              ),
                            ],
                          ),
                        ),
                        if (isSelected)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFF93C5FD)),
                            ),
                            child: DropdownButton<String>(
                              value: focus,
                              isDense: true,
                              underline: const SizedBox(),
                              items: ['Primary', 'Secondary', 'New Launch', 'Reminder'].map((f) {
                                return DropdownMenuItem(
                                  value: f,
                                  child: Text(f, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1E88E5))),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _productFocusMap[p.id] = val);
                              },
                            ),
                          ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),

            // 4. Physician Sampling Distributed
            AppSectionCard(
              title: 'Physician Sampling & Compliance',
              subtitle: 'Distribute doctor trial units with batch tracking',
              icon: Icons.medication_liquid_rounded,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Sample Units Distributed',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: Color(0xFF0F172A)),
                        textAlign: TextAlign.left,
                      ),
                      TextButton.icon(
                        onPressed: _showAddSampleModal,
                        icon: const Icon(Icons.add, size: 16),
                        label: const Text('Add Sample', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  _samplesGiven.isEmpty
                      ? const Padding(
                          padding: EdgeInsets.symmetric(vertical: 8),
                          child: Text(
                            'No samples logged yet. Tap "+ Add Sample" to distribute trial packs.',
                            style: TextStyle(fontSize: 11.5, color: Colors.grey, fontStyle: FontStyle.italic),
                            textAlign: TextAlign.left,
                          ),
                        )
                      : Column(
                          children: _samplesGiven.map((s) {
                            return Container(
                              margin: const EdgeInsets.only(bottom: 6),
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF0FDF4),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: const Color(0xFFBBF7D0)),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          s.brandName,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: Color(0xFF166534)),
                                          textAlign: TextAlign.left,
                                        ),
                                        Text(
                                          'Batch: ${s.batchNumber} • ${s.quantity} Unit(s)',
                                          style: const TextStyle(fontSize: 11, color: Color(0xFF15803D), fontWeight: FontWeight.w600),
                                          textAlign: TextAlign.left,
                                        ),
                                      ],
                                    ),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.delete_outline_rounded, size: 18, color: Color(0xFFDC2626)),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                    onPressed: () => setState(() => _samplesGiven.remove(s)),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                ],
              ),
            ),

            // 5. Clinical Feedback & Prescription Commitment
            AppSectionCard(
              title: 'Prescription Potential & Clinical Notes',
              subtitle: 'Record doctor Rx commitments & feedback',
              icon: Icons.rate_review_outlined,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Prescription (Rx) Commitment Tier',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A)),
                    textAlign: TextAlign.left,
                  ),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: _rxCommitment,
                    isExpanded: true,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'High (5+ Rx/day)', child: Text('High Potential (5+ Rx/day)')),
                      DropdownMenuItem(value: 'Moderate (2-4 Rx/day)', child: Text('Moderate Potential (2-4 Rx/day)')),
                      DropdownMenuItem(value: 'Low (1 Rx/day)', child: Text('Low Potential (1 Rx/day)')),
                      DropdownMenuItem(value: 'Formulary Listing Approved', child: Text('Hospital Formulary Listing Approved')),
                    ],
                    onChanged: (val) => val != null ? setState(() => _rxCommitment = val) : null,
                  ),
                  const SizedBox(height: 12),
                  AppTextField(
                    controller: _feedbackController,
                    label: 'Doctor Clinical Feedback & Discussion',
                    hint: 'Enter detailing discussion, clinical trial questions, or objections...',
                    maxLines: 3,
                  ),
                  const SizedBox(height: 10),
                  AppTextField(
                    controller: _competitorController,
                    label: 'Competitor Molecules Observed (Optional)',
                    hint: 'Mention competitor molecules/brands observed in doctor chamber...',
                    maxLines: 2,
                  ),
                ],
              ),
            ),

            // 6. Follow-up Planning
            AppSectionCard(
              title: 'Next Follow-up Call Planning',
              subtitle: 'Schedule next visit & target objectives',
              icon: Icons.event_available_outlined,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppDatePickerField(
                    label: 'Next Follow-up Visit Date',
                    selectedDate: _nextScheduleDate,
                    onDateSelected: (d) => setState(() => _nextScheduleDate = d),
                  ),
                  const SizedBox(height: 10),
                  AppTextField(
                    controller: _nextObjectiveController,
                    label: 'Follow-up Call Objective',
                    hint: 'e.g. Check patient trial efficacy & replenish sample stock',
                    maxLines: 1,
                  ),
                ],
              ),
            ),

            // Submit / Update Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Changes discarded.')));
                      Navigator.pop(context);
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Cancel', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: _saveAndSubmitDcr,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isEditing ? const Color(0xFF1E88E5) : AppColors.success,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      isEditing ? 'SAVE & UPDATE DOCTOR CALL' : 'SAVE & SUBMIT DCR',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _workTypeBtn(String type, String title, String subtitle, IconData icon) {
    final sel = _workType == type;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() {
          _workType = type;
          _accompaniedPerson = type == 'With ASM' ? 'Rajesh Sharma (ASM)' : (type == 'With RSM' ? 'Vikram Malhotra (RSM)' : null);
        }),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
          decoration: BoxDecoration(
            color: sel ? const Color(0xFF0B172E) : const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: sel ? const Color(0xFF0B172E) : const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: sel ? AppColors.gold : const Color(0xFF64748B), size: 20),
              const SizedBox(height: 5),
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.bold,
                  color: sel ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 9,
                  color: sel ? Colors.white70 : const Color(0xFF94A3B8),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
