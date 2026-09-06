import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/doctor_model.dart';
import '../../../models/tour_plan_model.dart';
import '../../../models/facility_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/tour_plan_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class AddTourPlanScreen extends StatefulWidget {
  final TourPlanDay? initialPlan;
  const AddTourPlanScreen({super.key, this.initialPlan});

  @override
  State<AddTourPlanScreen> createState() => _AddTourPlanScreenState();
}

class _AddTourPlanScreenState extends State<AddTourPlanScreen> with SingleTickerProviderStateMixin {
  late TabController _entityTabController;
  late DateTime _selectedDate;
  late String _dayType;
  late String _selectedPatch;
  late bool _isJointWork;

  final Set<String> _selectedDoctorIds = {};
  final Set<String> _selectedChemistIds = {};
  final Set<String> _selectedClinicIds = {};
  final Set<String> _selectedHospitalIds = {};
  final Set<String> _selectedStockistIds = {};
  late TextEditingController _objectiveController;

  bool get isEditing => widget.initialPlan != null;

  @override
  void initState() {
    super.initState();
    _entityTabController = TabController(length: 5, vsync: this);

    if (widget.initialPlan != null) {
      final p = widget.initialPlan!;
      _selectedDate = p.date;
      _dayType = p.dayType;
      _selectedPatch = p.patchName;
      _isJointWork = p.isJointWork;
      _objectiveController = TextEditingController(
        text: p.managerRemarks ?? 'Product Detailing, Physician Sample Distribution & POB Booking',
      );

      for (final v in p.plannedVisits) {
        final type = v.entityType.toLowerCase();
        if (type.contains('doctor')) {
          _selectedDoctorIds.add(v.entityId);
        } else if (type.contains('chemist') || type.contains('retail')) {
          _selectedChemistIds.add(v.entityId);
        } else if (type.contains('clinic') || type.contains('poly')) {
          _selectedClinicIds.add(v.entityId);
        } else if (type.contains('hospital')) {
          _selectedHospitalIds.add(v.entityId);
        } else {
          _selectedStockistIds.add(v.entityId);
        }
      }
    } else {
      _selectedDate = DateTime.now().add(const Duration(days: 1));
      _dayType = 'Field Work (HQ)';
      _selectedPatch = 'Central Hospital Zone Hub';
      _isJointWork = false;
      _objectiveController = TextEditingController(
        text: 'Product Detailing, Physician Sample Distribution & POB Booking',
      );
    }
  }

  @override
  void dispose() {
    _entityTabController.dispose();
    _objectiveController.dispose();
    super.dispose();
  }

  void _submitTourPlan() {
    final totalSelected = _selectedDoctorIds.length +
        _selectedChemistIds.length +
        _selectedClinicIds.length +
        _selectedHospitalIds.length +
        _selectedStockistIds.length;

    if (totalSelected == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select at least one customer (Doctor, Retailer, Clinic, Hospital, or Stockist)!'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final doctorProvider = context.read<DoctorProvider>();
    final tourProvider = context.read<TourPlanProvider>();

    final List<PlannedVisitItem> plannedVisits = [];

    // 1. Doctors
    for (final docId in _selectedDoctorIds) {
      final doc = doctorProvider.getDoctorById(docId);
      if (doc != null) {
        plannedVisits.add(PlannedVisitItem(
          entityId: doc.id,
          entityName: doc.name,
          entityType: 'Doctor',
          specialtyOrClass: '${doc.specialty} (${doc.doctorClass.shortCode})',
          plannedObjective: _objectiveController.text,
          focusProducts: const ['CardioVasc-AM', 'LipidCare-TG', 'PanSafe-DSR'],
        ));
      }
    }

    // 2. Retailers / Chemists
    for (final chemId in _selectedChemistIds) {
      final chem = doctorProvider.getChemistById(chemId);
      if (chem != null) {
        plannedVisits.add(PlannedVisitItem(
          entityId: chem.id,
          entityName: chem.shopName,
          entityType: 'Retailer (Chemist)',
          specialtyOrClass: 'Retail Pharmacy • Contact: ${chem.name}',
          plannedObjective: 'POB Order Booking, Stock Audit & Rx Movement',
          focusProducts: const ['CardioVasc-AM', 'GlycoSmart-D10', 'PanSafe-DSR'],
        ));
      }
    }

    // 3. Private Clinics
    for (final clinicId in _selectedClinicIds) {
      final fac = doctorProvider.getFacilityById(clinicId);
      if (fac != null) {
        plannedVisits.add(PlannedVisitItem(
          entityId: fac.id,
          entityName: fac.name,
          entityType: 'Private Clinic',
          specialtyOrClass: '${fac.category.label} (${fac.totalBeds} Beds)',
          plannedObjective: 'Detailing clinic doctors & formulary lock',
          focusProducts: const ['CardioVasc-AM', 'PanSafe-DSR'],
        ));
      }
    }

    // 4. Hospitals (Govt & Private)
    for (final hospId in _selectedHospitalIds) {
      final fac = doctorProvider.getFacilityById(hospId);
      if (fac != null) {
        final isGovt = fac.sector == FacilitySector.government;
        plannedVisits.add(PlannedVisitItem(
          entityId: fac.id,
          entityName: fac.name,
          entityType: isGovt ? 'Govt Hospital' : 'Hospital',
          specialtyOrClass: '${isGovt ? "Govt" : "Private"} • ${fac.category.label} (${fac.totalBeds} Beds)',
          plannedObjective: 'Institutional formulary supply, tenders & department doctor visits',
          focusProducts: const ['CardioVasc-AM', 'OsteoFlex-D3 Max', 'Cefomax-CV 325'],
        ));
      }
    }

    // 5. Stockists
    for (final stkId in _selectedStockistIds) {
      final stk = doctorProvider.getStockistById(stkId);
      if (stk != null) {
        plannedVisits.add(PlannedVisitItem(
          entityId: stk.id,
          entityName: stk.agencyName,
          entityType: 'Stockist',
          specialtyOrClass: 'Wholesale Depot • Contact: ${stk.name}',
          plannedObjective: 'Collection reconciliation, order dispatch & inventory audit',
          focusProducts: const ['All Brand Portfolio'],
        ));
      }
    }

    if (isEditing) {
      tourProvider.resubmitTourPlan(
        planId: widget.initialPlan!.id,
        date: _selectedDate,
        patchCode: 'HUB-01',
        patchName: _selectedPatch,
        dayType: _dayType,
        visits: plannedVisits,
        mrRemarks: _objectiveController.text,
        isJointWork: _isJointWork,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Tour Plan for ${_selectedDate.day}/${_selectedDate.month} successfully updated and resubmitted for Manager approval!'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      tourProvider.scheduleTourPlanByMr(
        date: _selectedDate,
        patchCode: 'HUB-01',
        patchName: _selectedPatch,
        dayType: _dayType,
        visits: plannedVisits,
        mrRemarks: _objectiveController.text,
        isJointWork: _isJointWork,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Tour Plan for ${_selectedDate.day}/${_selectedDate.month} submitted for Manager approval!'),
          backgroundColor: AppColors.success,
        ),
      );
    }

    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    final doctorProvider = context.watch<DoctorProvider>();
    final totalEntities = _selectedDoctorIds.length +
        _selectedChemistIds.length +
        _selectedClinicIds.length +
        _selectedHospitalIds.length +
        _selectedStockistIds.length;

    final clinics = doctorProvider.facilities.where((f) =>
        f.category == FacilityCategory.clinic ||
        f.category == FacilityCategory.polyClinic ||
        f.category == FacilityCategory.nursingHome).toList();

    final hospitals = doctorProvider.facilities.where((f) =>
        f.category == FacilityCategory.hospital ||
        f.category == FacilityCategory.govtDispensary ||
        f.category == FacilityCategory.medicalCollege ||
        f.sector == FacilitySector.government).toList();

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
              isEditing ? 'Edit & Resubmit Tour Plan' : 'Schedule Tour Plan (MTP)',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15.5, color: Color(0xFF0F172A)),
            ),
            Text(
              isEditing ? 'Revise itinerary for Manager approval' : 'Draft new proposal for upcoming schedule',
              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Chip(
              backgroundColor: isEditing ? const Color(0xFFFEF3C7) : const Color(0xFFE0F2FE),
              avatar: Icon(
                isEditing ? Icons.edit_note_rounded : Icons.calendar_month_rounded,
                size: 16,
                color: isEditing ? const Color(0xFFB45309) : const Color(0xFF0369A1),
              ),
              label: Text(
                isEditing ? 'EDIT MODE' : 'NEW MTP',
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
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          children: [
            // If editing a rejected plan, show manager remark banner
            if (isEditing && widget.initialPlan!.isRejected) ...[
              Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFF87171), width: 1.5),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626), size: 18),
                        SizedBox(width: 8),
                        Text(
                          'Manager Rejection Feedback (Action Required)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFDC2626)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      widget.initialPlan!.managerRemarks ?? 'Please revise your route beat and customer targets.',
                      style: const TextStyle(fontSize: 12, height: 1.35, color: Color(0xFF991B1B)),
                      textAlign: TextAlign.left,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Reviewed by: ${widget.initialPlan!.assignedByManager}',
                      style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontStyle: FontStyle.italic),
                    ),
                  ],
                ),
              ),
            ],

            // 1. Date & Route
            AppSectionCard(
              title: 'Schedule Date & Work Station',
              subtitle: 'Define itinerary date, patch route & manager accompaniment',
              icon: Icons.calendar_today_rounded,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppDatePickerField(
                    label: 'Planned Date',
                    selectedDate: _selectedDate,
                    onDateSelected: (d) => setState(() => _selectedDate = d),
                  ),
                  const SizedBox(height: 12),
                  AppDropdownField<String>(
                    label: 'Day Work Type',
                    value: _dayType,
                    items: const [
                      DropdownMenuItem(value: 'Field Work (HQ)', child: Text('Field Work (HQ)')),
                      DropdownMenuItem(value: 'Ex-Station Tour', child: Text('Ex-Station Tour')),
                      DropdownMenuItem(value: 'Out-Station Tour', child: Text('Out-Station Tour')),
                      DropdownMenuItem(value: 'Review Meeting / Transit', child: Text('Review Meeting / Transit')),
                    ],
                    onChanged: (v) {
                      if (v != null) setState(() => _dayType = v);
                    },
                  ),
                  const SizedBox(height: 12),
                  AppDropdownField<String>(
                    label: 'Territory Patch / Beat',
                    value: _selectedPatch,
                    items: const [
                      DropdownMenuItem(value: 'Central Hospital Zone Hub', child: Text('Central Hospital Zone Hub')),
                      DropdownMenuItem(value: 'North Medical Corridor Patch', child: Text('North Medical Corridor Patch')),
                      DropdownMenuItem(value: 'East Market Route Hub', child: Text('East Market Route Hub')),
                      DropdownMenuItem(value: 'South Zone Territory', child: Text('South Zone Territory')),
                    ],
                    onChanged: (v) {
                      if (v != null) setState(() => _selectedPatch = v);
                    },
                  ),
                  const SizedBox(height: 12),
                  AppTextField(
                    controller: _objectiveController,
                    label: isEditing ? 'Revised Objective / Remarks for ASM' : 'Core Call Objective',
                    hint: 'Enter your plan explanation or route justification for manager...',
                    maxLines: 2,
                  ),
                ],
              ),
            ),

            // 2. Target Selection (Doctors, Retailers, Clinics, Hospitals, Stockists)
            AppSectionCard(
              title: 'Target Customers Selected ($totalEntities)',
              subtitle: 'Select targets for route itinerary (Doctor, Retailer, Clinic, Hospital, Stockist)',
              icon: Icons.checklist_rounded,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TabBar(
                    controller: _entityTabController,
                    isScrollable: true,
                    labelColor: AppColors.primary,
                    unselectedLabelColor: const Color(0xFF64748B),
                    indicatorColor: AppColors.primary,
                    tabAlignment: TabAlignment.start,
                    labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 12),
                    tabs: [
                      Tab(text: 'Doctors (${_selectedDoctorIds.length})'),
                      Tab(text: 'Retailers (${_selectedChemistIds.length})'),
                      Tab(text: 'Pvt Clinics (${_selectedClinicIds.length})'),
                      Tab(text: 'Hospitals (${_selectedHospitalIds.length})'),
                      Tab(text: 'Stockists (${_selectedStockistIds.length})'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 280,
                    child: TabBarView(
                      controller: _entityTabController,
                      children: [
                        // 1. Doctors List
                        ListView.separated(
                          itemCount: doctorProvider.doctors.length,
                          separatorBuilder: (_, _) => const Divider(height: 1),
                          itemBuilder: (ctx, idx) {
                            final doc = doctorProvider.doctors[idx];
                            final sel = _selectedDoctorIds.contains(doc.id);
                            return CheckboxListTile(
                              dense: true,
                              value: sel,
                              controlAffinity: ListTileControlAffinity.leading,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                              activeColor: AppColors.primary,
                              title: Text(
                                doc.name,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                textAlign: TextAlign.left,
                              ),
                              subtitle: Text(
                                '${doc.specialty} • ${doc.clinicName}',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                textAlign: TextAlign.left,
                              ),
                              onChanged: (val) => setState(() => val == true ? _selectedDoctorIds.add(doc.id) : _selectedDoctorIds.remove(doc.id)),
                            );
                          },
                        ),

                        // 2. Retailers / Chemists List
                        ListView.separated(
                          itemCount: doctorProvider.chemists.length,
                          separatorBuilder: (_, _) => const Divider(height: 1),
                          itemBuilder: (ctx, idx) {
                            final chem = doctorProvider.chemists[idx];
                            final sel = _selectedChemistIds.contains(chem.id);
                            return CheckboxListTile(
                              dense: true,
                              value: sel,
                              controlAffinity: ListTileControlAffinity.leading,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                              activeColor: const Color(0xFF0D9488),
                              title: Text(
                                chem.shopName,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                textAlign: TextAlign.left,
                              ),
                              subtitle: Text(
                                'Pharmacist: ${chem.name} • ${chem.address}',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                textAlign: TextAlign.left,
                              ),
                              onChanged: (val) => setState(() => val == true ? _selectedChemistIds.add(chem.id) : _selectedChemistIds.remove(chem.id)),
                            );
                          },
                        ),

                        // 3. Private Clinics List
                        ListView.separated(
                          itemCount: clinics.length,
                          separatorBuilder: (_, _) => const Divider(height: 1),
                          itemBuilder: (ctx, idx) {
                            final fac = clinics[idx];
                            final sel = _selectedClinicIds.contains(fac.id);
                            return CheckboxListTile(
                              dense: true,
                              value: sel,
                              controlAffinity: ListTileControlAffinity.leading,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                              activeColor: const Color(0xFF6366F1),
                              title: Text(
                                fac.name,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                textAlign: TextAlign.left,
                              ),
                              subtitle: Text(
                                '${fac.category.label} (${fac.totalBeds} Beds) • ${fac.address}',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                textAlign: TextAlign.left,
                              ),
                              onChanged: (val) => setState(() => val == true ? _selectedClinicIds.add(fac.id) : _selectedClinicIds.remove(fac.id)),
                            );
                          },
                        ),

                        // 4. Hospitals List (Govt & Multi-Specialty)
                        ListView.separated(
                          itemCount: hospitals.length,
                          separatorBuilder: (_, _) => const Divider(height: 1),
                          itemBuilder: (ctx, idx) {
                            final fac = hospitals[idx];
                            final sel = _selectedHospitalIds.contains(fac.id);
                            final isGovt = fac.sector == FacilitySector.government;
                            return CheckboxListTile(
                              dense: true,
                              value: sel,
                              controlAffinity: ListTileControlAffinity.leading,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                              activeColor: isGovt ? const Color(0xFFD97706) : const Color(0xFF9333EA),
                              title: Text(
                                fac.name,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                textAlign: TextAlign.left,
                              ),
                              subtitle: Text(
                                '${isGovt ? "Govt" : "Private"} • ${fac.category.label} (${fac.totalBeds} Beds)',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                textAlign: TextAlign.left,
                              ),
                              onChanged: (val) => setState(() => val == true ? _selectedHospitalIds.add(fac.id) : _selectedHospitalIds.remove(fac.id)),
                            );
                          },
                        ),

                        // 5. Stockists List
                        ListView.separated(
                          itemCount: doctorProvider.stockists.length,
                          separatorBuilder: (_, _) => const Divider(height: 1),
                          itemBuilder: (ctx, idx) {
                            final stk = doctorProvider.stockists[idx];
                            final sel = _selectedStockistIds.contains(stk.id);
                            return CheckboxListTile(
                              dense: true,
                              value: sel,
                              controlAffinity: ListTileControlAffinity.leading,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                              activeColor: const Color(0xFFB45309),
                              title: Text(
                                stk.agencyName,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                textAlign: TextAlign.left,
                              ),
                              subtitle: Text(
                                'Contact: ${stk.name} • ${stk.address}',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                textAlign: TextAlign.left,
                              ),
                              onChanged: (val) => setState(() => val == true ? _selectedStockistIds.add(stk.id) : _selectedStockistIds.remove(stk.id)),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Submit / Resubmit Actions
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
                  child: ElevatedButton.icon(
                    onPressed: _submitTourPlan,
                    icon: Icon(isEditing ? Icons.published_with_changes_rounded : Icons.send_rounded, size: 18),
                    label: Text(
                      isEditing ? 'SAVE & RESUBMIT' : 'SUBMIT TOUR PLAN',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isEditing ? const Color(0xFF0288D1) : AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
}
