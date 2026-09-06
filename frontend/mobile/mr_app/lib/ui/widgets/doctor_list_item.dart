import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../models/doctor_model.dart';
import 'status_badge.dart';

class DoctorListItem extends StatelessWidget {
  final DoctorModel doctor;
  final bool isVisitedToday;
  final VoidCallback onTap;
  final VoidCallback onStartCall;
  final VoidCallback onDetailProduct;

  const DoctorListItem({
    super.key,
    required this.doctor,
    required this.isVisitedToday,
    required this.onTap,
    required this.onStartCall,
    required this.onDetailProduct,
  });

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

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Ink(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isVisitedToday
                  ? AppColors.success.withValues(alpha: 0.5)
                  : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
              width: isVisitedToday ? 1.5 : 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: classColor.withValues(alpha: 0.15),
                    child: Text(
                      doctor.name.substring(4, 5), // Character after "Dr. "
                      style: TextStyle(
                        color: classColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                doctor.name,
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14.5,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            StatusBadge(
                              label: doctor.doctorClass.shortCode,
                              color: classColor,
                            ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          doctor.specialty,
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          doctor.clinicName,
                          style: TextStyle(
                            fontSize: 12,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.access_time_rounded,
                          size: 14,
                          color: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
                        ),
                        const SizedBox(width: 5),
                        Text(
                          doctor.preferredTime,
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w500,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Icon(
                          Icons.event_repeat_rounded,
                          size: 14,
                          color: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
                        ),
                        const SizedBox(width: 5),
                        Text(
                          '${doctor.completedVisitsThisMonth}/${doctor.plannedVisitsPerMonth} Visits',
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w600,
                            color: doctor.completedVisitsThisMonth >= doctor.plannedVisitsPerMonth
                                ? AppColors.success
                                : AppColors.warning,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onDetailProduct,
                      icon: const Icon(Icons.slideshow_rounded, size: 16, color: AppColors.goldDark),
                      label: const Text('e-Detailing', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.goldDark)),
                      style: OutlinedButton.styleFrom(
                        backgroundColor: AppColors.goldContainer.withValues(alpha: 0.4),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        visualDensity: VisualDensity.compact,
                        side: const BorderSide(color: AppColors.gold, width: 1.2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: isVisitedToday
                        ? Container(
                            height: 36,
                            decoration: BoxDecoration(
                              color: AppColors.successContainer,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            alignment: Alignment.center,
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.check_circle_rounded, size: 16, color: AppColors.success),
                                SizedBox(width: 6),
                                Text(
                                  'Visited Today',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.success,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ElevatedButton.icon(
                            onPressed: onStartCall,
                            icon: const Icon(Icons.add_task_rounded, size: 16),
                            label: const Text('Report Call', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              visualDensity: VisualDensity.compact,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              elevation: 0,
                            ),
                          ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
