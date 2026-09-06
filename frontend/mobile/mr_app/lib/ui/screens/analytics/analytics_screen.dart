import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Performance & Field Analytics'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Monthly Compliance Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Monthly Call Compliance',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.successContainer,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        '92% High Rating',
                        style: TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 11),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _progressMetric('Doctor Call Coverage', 0.88, '142 / 160 Core Doctors Met', AppColors.primary),
                const SizedBox(height: 14),
                _progressMetric('Chemist Call Coverage', 0.94, '48 / 51 Chemist Counters Visited', AppColors.secondary),
                const SizedBox(height: 14),
                _progressMetric('Monthly Secondary Target', 0.76, '\$3,800 / \$5,000 Achieved', AppColors.success),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Core Doctor Class Visiting Ratio
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Doctor Class Calling Frequency',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 14),
                _classMetricRow('A+ (Super Core - 3x/Mo)', 0.95, '28 / 30 Calls Done', AppColors.classAPlus),
                const SizedBox(height: 10),
                _classMetricRow('A (Core - 2x/Mo)', 0.84, '42 / 50 Calls Done', AppColors.classA),
                const SizedBox(height: 10),
                _classMetricRow('B (Secondary - 1x/Mo)', 0.70, '21 / 30 Calls Done', AppColors.classB),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Top Contributing Brands
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Product-Wise Sales Contribution',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 14),
                _productContribution('CardioVasc-AM (Cardio)', '\$1,450', 0.38, AppColors.primary),
                const SizedBox(height: 10),
                _productContribution('GlycoSmart-D10 (Diabetech)', '\$1,100', 0.29, const Color(0xFF6366F1)),
                const SizedBox(height: 10),
                _productContribution('Cefomax-CV 325 (Anti-infective)', '\$750', 0.20, const Color(0xFFEA580C)),
                const SizedBox(height: 10),
                _productContribution('PanSafe-DSR & Others', '\$500', 0.13, const Color(0xFF059669)),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _progressMetric(String title, double value, String sub, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
            Text('${(value * 100).toInt()}%', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: color)),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: value,
            minHeight: 6,
            backgroundColor: color.withValues(alpha: 0.15),
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ),
        const SizedBox(height: 3),
        Text(sub, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ],
    );
  }

  Widget _classMetricRow(String label, double val, String sub, Color color) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(shape: BoxShape.circle, color: color),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(label, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
        ),
        Text(sub, style: TextStyle(fontSize: 11.5, color: color, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _productContribution(String name, String val, double share, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12.5)),
            Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: share,
            minHeight: 5,
            backgroundColor: color.withValues(alpha: 0.15),
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ),
      ],
    );
  }
}
