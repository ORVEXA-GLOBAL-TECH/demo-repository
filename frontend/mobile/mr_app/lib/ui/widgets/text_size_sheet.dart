import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/locale_provider.dart';

/// Interactive modal sheet to easily adjust letter and font sizing across the app
void showAdjustTextSizeModal(BuildContext context) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.white,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (ctx) => const _TextSizeSheetContent(),
  );
}

class _TextSizeSheetContent extends StatefulWidget {
  const _TextSizeSheetContent();

  @override
  State<_TextSizeSheetContent> createState() => _TextSizeSheetContentState();
}

class _TextSizeSheetContentState extends State<_TextSizeSheetContent> {
  final _testController = TextEditingController(text: 'Alleviare Pharma • CardioVasc 50mg');

  @override
  void dispose() {
    _testController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final localeProvider = context.watch<LocaleProvider>();

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(
          top: 16,
          left: 20,
          right: 20,
          bottom: MediaQuery.of(context).viewInsets.bottom + 20,
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
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0D9488).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.format_size_rounded, color: Color(0xFF0D9488), size: 20),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Adjust Text & Letter Size', style: AppTypography.elegantHeader(fontSize: 15)),
                          Text('Scale static text & written inputs', style: AppTypography.elegantSubtitle(fontSize: 11)),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDFA),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF99F6E4)),
                    ),
                    child: Text(
                      localeProvider.fontScaleLabel,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5, color: Color(0xFF0D9488)),
                    ),
                  ),
                ],
              ),
              const Divider(height: 20),

              // 4 Quick Presets
              Row(
                children: [
                  _presetChip('Compact', '85%', 0.85, localeProvider),
                  const SizedBox(width: 6),
                  _presetChip('Standard', '100%', 1.00, localeProvider),
                  const SizedBox(width: 6),
                  _presetChip('Comfort', '112%', 1.12, localeProvider),
                  const SizedBox(width: 6),
                  _presetChip('Large', '125%', 1.25, localeProvider),
                ],
              ),
              const SizedBox(height: 12),

              // Interactive Slider
              Row(
                children: [
                  const Text('A', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                  Expanded(
                    child: Slider(
                      value: localeProvider.fontScale,
                      min: 0.85,
                      max: 1.30,
                      divisions: 9,
                      activeColor: const Color(0xFF0D9488),
                      inactiveColor: const Color(0xFFE2E8F0),
                      onChanged: (val) => localeProvider.setFontScale(val),
                    ),
                  ),
                  const Text('A', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0D9488))),
                ],
              ),
              const SizedBox(height: 10),

              // Live Typing & Static Preview Box
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Static Word Alignment', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                          child: const Text('✓ Elegant', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    const Text('Words and numbers adapt seamlessly with crisp kerning.', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _testController,
                      style: AppTypography.inputStyle(fontSize: 13.5),
                      decoration: InputDecoration(
                        labelText: 'Live Editable Writing Test',
                        labelStyle: const TextStyle(fontSize: 11.5, color: Color(0xFF0D9488)),
                        prefixIcon: const Icon(Icons.edit_rounded, size: 16, color: Color(0xFF0D9488)),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF0D9488), width: 1.5)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Done Button
              SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D9488),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('APPLY & CLOSE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _presetChip(String name, String pct, double scale, LocaleProvider provider) {
    final isSelected = (provider.fontScale - scale).abs() < 0.04;
    return Expanded(
      child: InkWell(
        onTap: () => provider.setFontScale(scale),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 2),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF0D9488) : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isSelected ? const Color(0xFF0D9488) : const Color(0xFFE2E8F0)),
          ),
          child: Column(
            children: [
              Text(
                name,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.white : const Color(0xFF1E293B),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                pct,
                style: TextStyle(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? Colors.white70 : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
