import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/doctor_model.dart';
import '../../widgets/status_badge.dart';
import '../dcr/universal_dcr_form_screen.dart';
import '../edetailing/edetailing_catalog_screen.dart';
import '../rcpa/add_rcpa_screen.dart';
import 'add_doctor_screen.dart';

class DoctorDetailScreen extends StatelessWidget {
  final DoctorModel doctor;

  const DoctorDetailScreen({super.key, required this.doctor});

  Color _getClassColor(DoctorClass cls) {
    switch (cls) {
      case DoctorClass.aPlus:
        return AppColors.classAPlus;
      case DoctorClass.a:
        return AppColors.classA;
      case DoctorClass.b:
        return AppColors.classB;
      case DoctorClass.c:
        return AppColors.classC;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final classColor = _getClassColor(doctor.doctorClass);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Doctor Profile & History'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_rounded),
            tooltip: 'Edit Doctor Details',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => AddDoctorScreen(initialDoctor: doctor)),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Doctor Header Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
            ),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: classColor.withValues(alpha: 0.15),
                  child: Text(
                    doctor.name.substring(4, 5),
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: classColor,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  doctor.name,
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 2),
                Text(
                  doctor.degree,
                  style: TextStyle(
                    fontSize: 12.5,
                    color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    StatusBadge(
                      label: doctor.doctorClass.label,
                      color: classColor,
                    ),
                    const SizedBox(width: 8),
                    StatusBadge(
                      label: doctor.specialty,
                      color: AppColors.primary,
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Visit & Potential KPI Strip
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  ),
                  child: Column(
                    children: [
                      Text(
                        '${doctor.completedVisitsThisMonth}/${doctor.plannedVisitsPerMonth}',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary),
                      ),
                      const SizedBox(height: 2),
                      const Text('Visits This Month', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  ),
                  child: Column(
                    children: [
                      Text(
                        CurrencyFormatter.formatCompactInr(doctor.rxPotentialMonthly),
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.success),
                      ),
                      const SizedBox(height: 2),
                      const Text('Monthly Rx Potential', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Clinic, Timings & Address
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Clinic & Visiting Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 12),
                _infoRow(Icons.local_hospital_outlined, 'Clinic', doctor.clinicName),
                const Divider(height: 16),
                _infoRow(Icons.place_outlined, 'Address', '${doctor.address} (${doctor.patch})'),
                const Divider(height: 16),
                _infoRow(Icons.access_time_rounded, 'Preferred Time', doctor.preferredTime),
                const Divider(height: 16),
                _infoRow(Icons.phone_outlined, 'Contact', doctor.phone),
                if (doctor.lastVisitedDate != null) ...[
                  const Divider(height: 16),
                  _infoRow(Icons.history_rounded, 'Last Visited', DateFormatter.formatDisplayDate(doctor.lastVisitedDate!)),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Tagged Products & Competitors
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Tagged Focus Products', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: doctor.taggedProductIds.map((pId) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: AppColors.primaryContainer,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        pId == 'prod_1' ? 'CardioVasc-AM' : (pId == 'prod_2' ? 'GlycoSmart-D10' : 'Cefomax-CV'),
                        style: const TextStyle(
                          color: AppColors.onPrimaryContainer,
                          fontWeight: FontWeight.bold,
                          fontSize: 11.5,
                        ),
                      ),
                    );
                  }).toList(),
                ),
                if (doctor.keyCompetitorBrands.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  const Text('Key Competitor Brands', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 6),
                  Text(
                    doctor.keyCompetitorBrands.join(' • '),
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Action Buttons
          ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => UniversalDcrFormScreen(
                    preselectedCategory: 'Doctor',
                    preselectedId: doctor.id,
                    preselectedName: doctor.name,
                    preselectedPatch: doctor.patch,
                  ),
                ),
              );
            },
            icon: const Icon(Icons.add_task_rounded),
            label: const Text('Log DCR Call for Doctor'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const EdetailingCatalogScreen(),
                      ),
                    );
                  },
                  icon: const Icon(Icons.slideshow_rounded, size: 16),
                  label: const Text('e-Detailing'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => AddRcpaScreen(initialDoctor: doctor),
                      ),
                    );
                  },
                  icon: const Icon(Icons.analytics_outlined, size: 16),
                  label: const Text('RCPA Audit'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppColors.primary),
        const SizedBox(width: 10),
        SizedBox(
          width: 100,
          child: Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
          ),
        ),
      ],
    );
  }
}
