import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../services/device_security_service.dart';

class DeviceBindingDialog extends StatefulWidget {
  final VoidCallback? onDeviceTransferConfirmed;

  const DeviceBindingDialog({
    super.key,
    this.onDeviceTransferConfirmed,
  });

  @override
  State<DeviceBindingDialog> createState() => _DeviceBindingDialogState();
}

class _DeviceBindingDialogState extends State<DeviceBindingDialog> {
  final _securityService = DeviceSecurityService();
  bool _isTransferring = false;
  final _transferOtpController = TextEditingController();

  @override
  void dispose() {
    _transferOtpController.dispose();
    super.dispose();
  }

  void _handleTransfer() async {
    final code = _transferOtpController.text.trim();
    if (code.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter the device transfer authorization code'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isTransferring = true);
    final success = await _securityService.transferDeviceBinding(
      'EMP-7842',
      code,
    );
    setState(() => _isTransferring = false);

    if (mounted) {
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Device binding transferred successfully! Previous session revoked.'),
            backgroundColor: AppColors.success,
          ),
        );
        widget.onDeviceTransferConfirmed?.call();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Invalid transfer authorization code!'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final dev = _securityService.currentDevice;

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
      backgroundColor: Colors.white,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Padding(
        padding: const EdgeInsets.all(22),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primaryContainer,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.phonelink_lock_rounded, color: AppColors.primary, size: 24),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Device Binding Security',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      Text(
                        'Single-Device Enforced Policy',
                        style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Policy Banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: const Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.shield_outlined, size: 18, color: Color(0xFF2563EB)),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Per Alleviare Enterprise Compliance, 1 MR can only be actively logged into a single dashboard/device at a time.',
                      style: TextStyle(fontSize: 12, color: Color(0xFF1E40AF), height: 1.35),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Hardware details
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  _buildDetailRow('Bound MR', 'Rohan Deshmukh (EMP-7842)'),
                  const Divider(height: 16, color: Color(0xFFE2E8F0)),
                  _buildDetailRow('Device Model', dev.deviceModel),
                  const Divider(height: 16, color: Color(0xFFE2E8F0)),
                  _buildDetailRow('Hardware ID', dev.deviceId),
                  const Divider(height: 16, color: Color(0xFFE2E8F0)),
                  _buildDetailRow('Binding Status', dev.isCurrentlyBound ? '🟢 Bound & Active' : '🔴 Unbound'),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Close'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isTransferring ? null : _handleTransfer,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                    child: _isTransferring
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : const Text('Verify Binding', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
        Text(value, style: const TextStyle(fontSize: 12.5, color: Color(0xFF0F172A), fontWeight: FontWeight.w700)),
      ],
    );
  }
}
