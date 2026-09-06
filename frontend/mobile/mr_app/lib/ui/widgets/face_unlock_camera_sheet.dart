import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class FaceUnlockCameraSheet extends StatefulWidget {
  final VoidCallback onSuccess;

  const FaceUnlockCameraSheet({
    super.key,
    required this.onSuccess,
  });

  @override
  State<FaceUnlockCameraSheet> createState() => _FaceUnlockCameraSheetState();
}

class _FaceUnlockCameraSheetState extends State<FaceUnlockCameraSheet>
    with SingleTickerProviderStateMixin {
  late AnimationController _scanController;
  late Animation<double> _scanAnimation;

  bool _isVerified = false;
  String _statusText = 'Activating Front Selfie Camera...';
  Timer? _authTimer;
  Timer? _stepTimer;
  int _scanStep = 0;

  final List<String> _scanSteps = [
    'Front camera active • Center your face in the oval',
    'Analyzing 3D facial topology & depth mesh...',
    'Matching MR credentials with Alleviare server...',
    '✓ Face match confirmed: Rohan Deshmukh (Senior MR)',
  ];

  @override
  void initState() {
    super.initState();

    _scanController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);

    _scanAnimation = Tween<double>(begin: 0.08, end: 0.92).animate(
      CurvedAnimation(parent: _scanController, curve: Curves.easeInOut),
    );

    // Progressive biometric scanning sequence
    _stepTimer = Timer.periodic(const Duration(milliseconds: 700), (timer) {
      if (!mounted) return;
      if (_scanStep < _scanSteps.length - 1) {
        setState(() {
          _scanStep++;
          _statusText = _scanSteps[_scanStep];
        });
      } else {
        timer.cancel();
      }
    });

    _authTimer = Timer(const Duration(milliseconds: 2600), () {
      if (!mounted) return;
      setState(() {
        _isVerified = true;
        _statusText = '✓ Face ID Verified • Access Granted';
      });

      Timer(const Duration(milliseconds: 700), () {
        if (mounted) {
          widget.onSuccess();
        }
      });
    });
  }

  @override
  void dispose() {
    _stepTimer?.cancel();
    _authTimer?.cancel();
    _scanController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.78,
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            width: 44,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),

          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.face_retouching_natural_rounded, color: Color(0xFF009CBF), size: 24),
                  SizedBox(width: 8),
                  Text(
                    'Alleviare Face ID Unlock',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: AppColors.lightTextPrimary,
                    ),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close_rounded, color: Colors.grey),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Viewfinder Container (Live Front Camera Stream + Biometric Scanner Overlay)
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF0F172A),
                    Color(0xFF1E293B),
                    Color(0xFF0F172A),
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: _isVerified ? AppColors.success : const Color(0xFF009CBF),
                  width: 2.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: (_isVerified ? AppColors.success : const Color(0xFF009CBF))
                        .withValues(alpha: 0.25),
                    blurRadius: 20,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // High-tech Camera Simulator Background Grid
                  CustomPaint(
                    painter: _CameraGridPainter(),
                  ),

                  // Center User Silhouette
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _isVerified
                              ? Icons.verified_user_rounded
                              : Icons.face_retouching_natural_rounded,
                          size: 110,
                          color: _isVerified
                              ? AppColors.success
                              : const Color(0xFF009CBF).withValues(alpha: 0.7),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _isVerified ? 'Rohan Deshmukh' : 'FRONT CAMERA LIVE',
                          style: TextStyle(
                            color: _isVerified ? AppColors.success : const Color(0xFF38BDF8),
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Biometric Face Reticle & Scanning Laser Line
                  AnimatedBuilder(
                    animation: _scanAnimation,
                    builder: (context, child) {
                      return Stack(
                        fit: StackFit.expand,
                        children: [
                          // Target Oval Viewfinder
                          Center(
                            child: Container(
                              width: 220,
                              height: 270,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(110),
                                border: Border.all(
                                  color: _isVerified
                                      ? AppColors.success
                                      : const Color(0xFF00E5FF).withValues(alpha: 0.8),
                                  width: 2.5,
                                ),
                              ),
                            ),
                          ),

                          // Moving Biometric Laser Bar
                          if (!_isVerified)
                            Positioned(
                              top: 60 + (_scanAnimation.value * 200),
                              left: 30,
                              right: 30,
                              child: Container(
                                height: 3.5,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [
                                      Colors.transparent,
                                      Color(0xFF26C6DA),
                                      Color(0xFF00E5FF),
                                      Color(0xFF26C6DA),
                                      Colors.transparent,
                                    ],
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF00E5FF).withValues(alpha: 0.9),
                                      blurRadius: 12,
                                      spreadRadius: 2,
                                    ),
                                  ],
                                ),
                              ),
                            ),

                          // Verified Success Overlay
                          if (_isVerified)
                            Container(
                              color: AppColors.success.withValues(alpha: 0.35),
                              child: const Center(
                                child: Icon(
                                  Icons.check_circle_rounded,
                                  size: 84,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                        ],
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Status Message Box
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: _isVerified ? AppColors.successContainer : const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: _isVerified
                    ? AppColors.success
                    : const Color(0xFF009CBF).withValues(alpha: 0.3),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  _isVerified ? Icons.check_circle_rounded : Icons.camera_alt_rounded,
                  size: 18,
                  color: _isVerified ? AppColors.success : const Color(0xFF009CBF),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    _statusText,
                    style: TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.bold,
                      color: _isVerified ? AppColors.success : AppColors.lightTextPrimary,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Instant Unlock / Cancel Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () => widget.onSuccess(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF009CBF),
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(44),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: const Text('Instant Face Match', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(44),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Cancel'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CameraGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF00E5FF).withValues(alpha: 0.08)
      ..strokeWidth = 1.0;

    const step = 28.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
