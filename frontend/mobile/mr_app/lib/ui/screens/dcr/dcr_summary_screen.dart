import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/dcr_model.dart';
import '../../../providers/dcr_provider.dart';
import 'universal_dcr_form_screen.dart';

class DcrSummaryScreen extends StatefulWidget {
  final DailyDcrSummary summary;

  const DcrSummaryScreen({super.key, required this.summary});

  @override
  State<DcrSummaryScreen> createState() => _DcrSummaryScreenState();
}

class _DcrSummaryScreenState extends State<DcrSummaryScreen> {
  late DailyDcrSummary _summary;

  @override
  void initState() {
    super.initState();
    _summary = widget.summary;
  }

  void _syncSummary() {
    final dcrProvider = context.read<DcrProvider>();
    if (dcrProvider.todayDcr.id == _summary.id) {
      setState(() => _summary = dcrProvider.todayDcr);
    } else {
      final hist = dcrProvider.dcrHistory.firstWhere(
        (d) => d.id == _summary.id,
        orElse: () => _summary,
      );
      setState(() => _summary = hist);
    }
  }

  // ==========================================
  // 1. EDIT DCR OVERVIEW & REMARKS MODAL
  // ==========================================
  void _showEditDcrOverviewModal() {
    final patchCtrl = TextEditingController(text: _summary.routePatch);
    final remarksCtrl = TextEditingController(text: _summary.dayRemarks);
    String workType = _summary.workType;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetCtx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: EdgeInsets.only(
            top: 20,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.edit_note_rounded, color: Color(0xFF1E88E5), size: 24),
                        SizedBox(width: 8),
                        Text('Edit DCR Overview', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      ],
                    ),
                    IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(sheetCtx)),
                  ],
                ),
                const SizedBox(height: 4),
                const Text(
                  'Update report patch, work type, or detailed day remarks.',
                  style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 16),

                // Patch / Route Field
                const Text('Route Patch / Beat', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                TextField(
                  controller: patchCtrl,
                  style: const TextStyle(fontSize: 13),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                ),
                const SizedBox(height: 12),

                // Work Type Dropdown
                const Text('Day Work Type', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: workType,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'Field Work', child: Text('Field Work (Territory Detailing)')),
                    DropdownMenuItem(value: 'Ex-Station Tour', child: Text('Ex-Station Tour')),
                    DropdownMenuItem(value: 'Outstation Tour', child: Text('Outstation Tour')),
                    DropdownMenuItem(value: 'Non-Field / Review', child: Text('Non-Field / Review')),
                  ],
                  onChanged: (v) => v != null ? setModalState(() => workType = v) : null,
                ),
                const SizedBox(height: 12),

                // Day Remarks Field
                const Text('MR Detailed Day Remarks', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                TextField(
                  controller: remarksCtrl,
                  maxLines: 3,
                  style: const TextStyle(fontSize: 13),
                  decoration: InputDecoration(
                    hintText: 'Enter call highlights, competitor observations, etc.',
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.all(12),
                  ),
                ),
                const SizedBox(height: 18),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(sheetCtx),
                        child: const Text('Cancel'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.check_circle_rounded, size: 16),
                        label: const Text('Save DCR Overview'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1E88E5),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          final updated = _summary.copyWith(
                            routePatch: patchCtrl.text.trim(),
                            workType: workType,
                            dayRemarks: remarksCtrl.text.trim(),
                          );
                          context.read<DcrProvider>().updateDcrSummary(updated);
                          Navigator.pop(sheetCtx);
                          _syncSummary();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('DCR Overview updated!'),
                              backgroundColor: AppColors.success,
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ==========================================
  // 2. DELETE DOCTOR CALL CONFIRMATION
  // ==========================================
  void _confirmDeleteDoctorCall(DoctorCallReport call) {
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.delete_outline_rounded, color: Color(0xFFDC2626)),
            SizedBox(width: 8),
            Text('Remove Doctor Call', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Text('Are you sure you want to remove the detailing visit report for ${call.doctorName}?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogCtx), child: const Text('Cancel', style: TextStyle(color: Colors.grey))),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFDC2626), foregroundColor: Colors.white),
            onPressed: () {
              context.read<DcrProvider>().removeDoctorCallFromDcr(call.id, dcrId: _summary.id);
              Navigator.pop(dialogCtx);
              _syncSummary();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Doctor visit for ${call.doctorName} removed from DCR.'),
                  backgroundColor: const Color(0xFFDC2626),
                ),
              );
            },
            child: const Text('Remove Call'),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 4. RESUBMIT DCR DIALOG WITH MR EXPLANATION
  // ==========================================
  void _showResubmitDialog() {
    final noteCtrl = TextEditingController(text: 'Updated doctor detailing notes, sampling quantities, and batch numbers as requested.');

    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Row(
          children: [
            Icon(Icons.published_with_changes_rounded, color: Color(0xFF0288D1)),
            SizedBox(width: 8),
            Text('Resubmit DCR to Manager', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('DCR Date: ${DateFormatter.formatDisplayDate(_summary.date)} • ${_summary.routePatch}', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12.5, color: Color(0xFF334155))),
            const SizedBox(height: 10),
            const Text('MR Resubmission Explanation Note:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
            const SizedBox(height: 6),
            TextField(
              controller: noteCtrl,
              maxLines: 3,
              style: const TextStyle(fontSize: 12.5),
              decoration: InputDecoration(
                hintText: 'Describe changes made before resubmitting...',
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                contentPadding: const EdgeInsets.all(10),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogCtx), child: const Text('Cancel', style: TextStyle(color: Colors.grey))),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0288D1), foregroundColor: Colors.white),
            onPressed: () {
              context.read<DcrProvider>().resubmitDcr(_summary.id, resubmissionNote: noteCtrl.text.trim());
              Navigator.pop(dialogCtx);
              _syncSummary();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('DCR successfully RE-SUBMITTED to Manager!'),
                  backgroundColor: AppColors.success,
                ),
              );
              Navigator.pop(context);
            },
            child: const Text('Confirm & Resubmit', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final dcrProvider = context.watch<DcrProvider>();
    final isDraft = _summary.status == 'Draft';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('DCR Report (${DateFormatter.formatShortDate(_summary.date)})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
        actions: [
          if (!_summary.isApproved)
            IconButton(
              icon: const Icon(Icons.edit_note_rounded),
              tooltip: 'Edit DCR Overview',
              onPressed: _showEditDcrOverviewModal,
            )
          else
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 6),
              child: Icon(Icons.lock_rounded, size: 18, color: Color(0xFF10B981)),
            ),
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: _summary.isApproved
                  ? AppColors.successContainer
                  : (_summary.isRejected ? const Color(0xFFFEE2E2) : AppColors.infoContainer),
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Text(
              _summary.status,
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.bold,
                color: _summary.isApproved
                    ? AppColors.success
                    : (_summary.isRejected ? const Color(0xFFDC2626) : AppColors.info),
              ),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          // Manager Review Status Banner (Approved / Rejected with Remark / Pending)
          if (_summary.managerRemark != null && _summary.managerRemark!.isNotEmpty) ...[
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _summary.isRejected
                    ? const Color(0xFFFEF2F2)
                    : (_summary.isApproved ? const Color(0xFFF0FDF4) : const Color(0xFFF0F9FF)),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: _summary.isRejected
                      ? const Color(0xFFF87171)
                      : (_summary.isApproved ? const Color(0xFF86EFAC) : const Color(0xFFBAE6FD)),
                  width: 1.5,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        _summary.isRejected
                            ? Icons.error_outline_rounded
                            : (_summary.isApproved ? Icons.verified_rounded : Icons.pending_actions_rounded),
                        color: _summary.isRejected
                            ? const Color(0xFFDC2626)
                            : (_summary.isApproved ? const Color(0xFF16A34A) : const Color(0xFF0288D1)),
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        _summary.isRejected
                            ? 'Manager Rejection Notice (Action Required)'
                            : (_summary.isApproved ? 'Manager Approval Note (Locked & Finalized)' : 'Manager Review Status'),
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: _summary.isRejected
                              ? const Color(0xFFDC2626)
                              : (_summary.isApproved ? const Color(0xFF16A34A) : const Color(0xFF0288D1)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _summary.managerRemark!,
                    style: TextStyle(
                      fontSize: 12,
                      height: 1.35,
                      color: _summary.isRejected
                          ? const Color(0xFF991B1B)
                          : (_summary.isApproved ? const Color(0xFF166534) : const Color(0xFF0C4A6E)),
                    ),
                  ),
                  if (_summary.reviewedByManager != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      'Reviewed & Approved by: ${_summary.reviewedByManager}',
                      style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontStyle: FontStyle.italic),
                    ),
                  ],
                ],
              ),
            ),
          ],

          // Route & Overview Card
          Container(
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
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _summary.routePatch,
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${_summary.workType} • ${DateFormatter.formatDisplayDate(_summary.date)}',
                            style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                    if (!_summary.isApproved)
                      IconButton(
                        icon: const Icon(Icons.edit_outlined, size: 18, color: Color(0xFF1E88E5)),
                        tooltip: 'Edit Route & Remarks',
                        onPressed: _showEditDcrOverviewModal,
                      )
                    else
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.lock_outline_rounded, size: 13, color: Color(0xFF64748B)),
                            SizedBox(width: 4),
                            Text('Locked', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                          ],
                        ),
                      ),
                  ],
                ),
                if (_summary.dayRemarks.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Remarks: ${_summary.dayRemarks}',
                      style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Color(0xFF334155)),
                    ),
                  ),
                ],
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _metricCol('Doctor Calls', '${_summary.doctorCalls.length}', AppColors.primary),
                    _metricCol('Specialists', '${_summary.doctorCalls.where((d) => d.doctorClass.contains('A')).length}', AppColors.secondary),
                    _metricCol('Samples Given', '${_summary.totalSamplesGiven} Units', AppColors.success),
                    _metricCol('Rx Coverage', 'Optimal', AppColors.warning),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Doctor Calls Section Header + Add Doctor Call Button (Only if not approved)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Doctor Detailing Calls (${_summary.doctorCalls.length})',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
              ),
              if (!_summary.isApproved)
                OutlinedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => UniversalDcrFormScreen(
                          preselectedCategory: 'Doctor',
                          preselectedPatch: _summary.routePatch,
                        ),
                      ),
                    ).then((_) => _syncSummary());
                  },
                  icon: const Icon(Icons.add, size: 14),
                  label: const Text('Add Doctor Call', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    minimumSize: const Size(0, 30),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),

          if (_summary.doctorCalls.isEmpty)
            _emptyNote('No doctor calls logged in this report.')
          else
            ..._summary.doctorCalls.map((call) => _doctorCallTile(call, isDark)),
          const SizedBox(height: 24),

          // Submission / Resubmission / Locked Action Buttons
          if (_summary.isApproved) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF86EFAC), width: 1.5),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.lock_rounded, color: Color(0xFF16A34A), size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Approved by Manager • Locked & Audit Compliant',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF166534)),
                  ),
                ],
              ),
            ),
          ] else if (isDraft) ...[
            ElevatedButton.icon(
              onPressed: () {
                dcrProvider.submitTodayDcr();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Today’s DCR successfully submitted for Area Manager approval!'),
                    backgroundColor: AppColors.success,
                  ),
                );
                Navigator.pop(context);
              },
              icon: const Icon(Icons.send_rounded),
              label: const Text('Lock & Submit DCR to Manager', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ] else if (_summary.isRejected) ...[
            ElevatedButton.icon(
              onPressed: _showResubmitDialog,
              icon: const Icon(Icons.published_with_changes_rounded),
              label: const Text('Confirm Changes & Resubmit DCR', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0288D1),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ] else ...[
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.edit_rounded, size: 16),
                    label: const Text('Edit Overview'),
                    style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                    onPressed: _showEditDcrOverviewModal,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.sync_rounded, size: 18),
                    label: const Text('Update Submitted DCR', style: TextStyle(fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      final updated = _summary.copyWith(
                        status: 'Submitted',
                        submittedAt: DateTime.now(),
                      );
                      dcrProvider.updateDcrSummary(updated);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Submitted DCR successfully updated!'),
                          backgroundColor: AppColors.success,
                        ),
                      );
                      Navigator.pop(context);
                    },
                  ),
                ),
              ],
            ),
          ],
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _metricCol(String title, String val, Color color) {
    return Column(
      children: [
        Text(val, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 2),
        Text(title, style: const TextStyle(fontSize: 10.5, color: Colors.grey)),
      ],
    );
  }

  Widget _emptyNote(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(text, style: const TextStyle(color: Colors.grey, fontSize: 12, fontStyle: FontStyle.italic)),
    );
  }

  Widget _doctorCallTile(DoctorCallReport call, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 4, offset: const Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Text(call.doctorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A)), overflow: TextOverflow.ellipsis),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(DateFormatter.formatTime(call.callTime), style: const TextStyle(fontSize: 11, color: Colors.grey)),
                  const SizedBox(width: 6),
                  if (!_summary.isApproved) ...[
                    IconButton(
                      icon: const Icon(Icons.edit_outlined, size: 18, color: Color(0xFF1E88E5)),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      tooltip: 'Edit Call Details',
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => UniversalDcrFormScreen(
                              initialCall: call,
                              dcrId: _summary.id,
                              preselectedCategory: 'Doctor',
                              preselectedId: call.doctorId,
                              preselectedName: call.doctorName,
                              preselectedPatch: _summary.routePatch,
                            ),
                          ),
                        ).then((_) => _syncSummary());
                      },
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.delete_outline_rounded, size: 18, color: Color(0xFFDC2626)),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      tooltip: 'Remove Call',
                      onPressed: () => _confirmDeleteDoctorCall(call),
                    ),
                  ] else ...[
                    const Icon(Icons.check_circle_rounded, size: 16, color: Color(0xFF10B981)),
                  ],
                ],
              ),
            ],
          ),
          Text('${call.doctorSpecialty} • ${call.clinicName}', style: const TextStyle(fontSize: 11.5, color: AppColors.primary, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Text('Products: ${call.productsPromoted.map((p) => '${p.brandName} (${p.focusLevel})').join(', ')}', style: const TextStyle(fontSize: 11, color: Color(0xFF334155))),
          if (call.samplesGiven.isNotEmpty) ...[
            const SizedBox(height: 2),
            Text(
              'Samples: ${call.samplesGiven.map((s) => '${s.brandName} (${s.quantity} units, Batch: ${s.batchNumber})').join(', ')}',
              style: const TextStyle(fontSize: 11, color: AppColors.success, fontWeight: FontWeight.bold),
            ),
          ],
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Rx Potential: ${call.prescriptionCommitment}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF0F172A))),
              Text('Next: ${DateFormatter.formatShortDate(call.nextVisitDate)}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
            ],
          ),
          if (call.doctorFeedback.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text('Feedback: ${call.doctorFeedback}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontStyle: FontStyle.italic)),
          ],
        ],
      ),
    );
  }
}
