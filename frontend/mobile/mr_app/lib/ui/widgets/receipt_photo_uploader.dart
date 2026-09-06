import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class ReceiptPhotoUploader extends StatefulWidget {
  final String title;
  final String subtitle;
  final String defaultFileName;
  final ValueChanged<String?>? onPhotoChanged;

  const ReceiptPhotoUploader({
    super.key,
    this.title = 'Invoice / Receipt / Slip Photo',
    this.subtitle = 'Attach signed PO, doctor prescription, or payment bill',
    this.defaultFileName = 'Receipt_INV_98421.jpg',
    this.onPhotoChanged,
  });

  @override
  State<ReceiptPhotoUploader> createState() => _ReceiptPhotoUploaderState();
}

class _ReceiptPhotoUploaderState extends State<ReceiptPhotoUploader> {
  bool _hasPhoto = false;
  String? _photoName;
  String? _uploadSource;

  @override
  void initState() {
    super.initState();
    // Default to an initial sample attachment
    _hasPhoto = true;
    _photoName = widget.defaultFileName;
    _uploadSource = 'Camera Capture';
  }

  void _showSourcePicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
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
              Text(
                widget.title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Choose image capture source to attach proof',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primaryContainer,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.camera_alt_rounded, color: AppColors.primary, size: 22),
                ),
                title: const Text(
                  'Take Photo with Camera',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                subtitle: const Text('Capture live physical receipt or invoice bill', style: TextStyle(fontSize: 11.5)),
                trailing: const Icon(Icons.chevron_right_rounded, color: Colors.grey),
                onTap: () {
                  Navigator.pop(ctx);
                  _simulateCapture('Camera Photo');
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.goldContainer,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.photo_library_rounded, color: AppColors.goldDark, size: 22),
                ),
                title: const Text(
                  'Upload from Gallery / Files',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                subtitle: const Text('Select saved JPG, PNG image or PDF document', style: TextStyle(fontSize: 11.5)),
                trailing: const Icon(Icons.chevron_right_rounded, color: Colors.grey),
                onTap: () {
                  Navigator.pop(ctx);
                  _simulateCapture('Gallery Upload');
                },
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  void _simulateCapture(String source) {
    final timestamp = DateTime.now().millisecondsSinceEpoch.toString().substring(7);
    setState(() {
      _hasPhoto = true;
      _photoName = 'Invoice_Receipt_$timestamp.jpg';
      _uploadSource = source;
    });
    if (widget.onPhotoChanged != null) {
      widget.onPhotoChanged!(_photoName);
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
            const SizedBox(width: 8),
            Text('Receipt photo attached from $source!'),
          ],
        ),
        backgroundColor: AppColors.success,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _removePhoto() {
    setState(() {
      _hasPhoto = false;
      _photoName = null;
      _uploadSource = null;
    });
    if (widget.onPhotoChanged != null) {
      widget.onPhotoChanged!(null);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_hasPhoto) {
      return InkWell(
        onTap: _showSourcePicker,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: const Color(0xFFCBD5E1),
              width: 1.5,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.add_a_photo_rounded, size: 28, color: AppColors.primary),
              ),
              const SizedBox(height: 10),
              const Text(
                'Tap to Upload Receipt / Invoice Photo',
                style: TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 3),
              const Text(
                'Camera Photo or Gallery Image (JPG, PNG, PDF)',
                style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
              ),
            ],
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.success.withValues(alpha: 0.5), width: 1.5),
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Receipt visual thumbnail preview
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFCBD5E1)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Icon(Icons.receipt_rounded, size: 30, color: Colors.blueGrey.shade400),
                    Positioned(
                      bottom: 4,
                      right: 4,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: const BoxDecoration(
                          color: AppColors.success,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.check, size: 10, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.verified_rounded, size: 15, color: AppColors.success),
                        const SizedBox(width: 4),
                        const Text(
                          'Photo Attached',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.success),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(color: Colors.green.shade300),
                          ),
                          child: Text(
                            _uploadSource ?? 'Camera',
                            style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Colors.green.shade800),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(
                      _photoName ?? 'Receipt_Invoice.jpg',
                      style: const TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Text(
                      '1.6 MB • Verified High Resolution Document',
                      style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Divider(height: 1, color: Color(0xFFCBD5E1)),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: _showSourcePicker,
                icon: const Icon(Icons.cameraswitch_rounded, size: 16, color: AppColors.primary),
                label: const Text('Re-take / Change Photo', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
              ),
              TextButton.icon(
                onPressed: _removePhoto,
                icon: const Icon(Icons.delete_outline_rounded, size: 16, color: AppColors.error),
                label: const Text('Remove', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: AppColors.error)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
