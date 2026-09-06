import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../providers/session_provider.dart';
import '../screens/auth/login_screen.dart';

class SessionTimeoutWrapper extends StatelessWidget {
  final Widget child;

  const SessionTimeoutWrapper({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Consumer2<SessionProvider, AuthProvider>(
      builder: (context, sessionProvider, authProvider, _) {
        return Listener(
          behavior: HitTestBehavior.translucent,
          onPointerDown: (_) => sessionProvider.recordUserActivity(),
          onPointerMove: (_) => sessionProvider.recordUserActivity(),
          onPointerUp: (_) => sessionProvider.recordUserActivity(),
          child: Stack(
            children: [
              child,

              // 30-Second Warning Toast Banner
              if (sessionProvider.isWarningActive && !sessionProvider.isLocked)
                Positioned(
                  top: MediaQuery.of(context).padding.top + 10,
                  left: 16,
                  right: 16,
                  child: Material(
                    color: Colors.transparent,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFF59E0B), width: 1.2),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.2),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.timer_outlined, color: Color(0xFFF59E0B), size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'Inactivity Warning: Auto-lock in ${sessionProvider.formattedRemainingTime}. Tap screen to continue.',
                              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

              // 5-Minute Inactivity Session Lock Overlay
              if (sessionProvider.isLocked)
                Positioned.fill(
                  child: Material(
                    color: Colors.transparent,
                    child: _SessionLockOverlay(),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

class _SessionLockOverlay extends StatefulWidget {
  @override
  State<_SessionLockOverlay> createState() => _SessionLockOverlayState();
}

class _SessionLockOverlayState extends State<_SessionLockOverlay> {
  final _passwordController = TextEditingController();
  bool _obscure = true;
  String? _error;
  bool _isVerifying = false;

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  void _handleFingerprintUnlock() async {
    setState(() => _isVerifying = true);
    final sessionProvider = context.read<SessionProvider>();
    final success = await sessionProvider.unlockWithFingerprint();
    if (mounted) {
      setState(() => _isVerifying = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Session restored via Fingerprint!'),
            backgroundColor: AppColors.success,
            duration: Duration(seconds: 2),
          ),
        );
      }
    }
  }

  void _handlePasswordUnlock() {
    final pass = _passwordController.text.trim();
    if (pass.isEmpty) {
      setState(() => _error = 'Please enter your password to unlock.');
      return;
    }

    final sessionProvider = context.read<SessionProvider>();
    final success = sessionProvider.unlockWithPassword(pass);
    if (!success) {
      setState(() => _error = 'Incorrect password. Please try again.');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Session unlocked successfully!'),
          backgroundColor: AppColors.success,
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  void _handleLogout() {
    context.read<SessionProvider>().stopSessionTracking();
    context.read<AuthProvider>().logout();
    Navigator.of(context, rootNavigator: true).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
      child: Container(
        color: const Color(0xFF0F172A).withValues(alpha: 0.88),
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Center(
          child: SingleChildScrollView(
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3),
                    blurRadius: 30,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Lock Icon
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF2F2),
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFFCA5A5), width: 2),
                    ),
                    child: const Icon(Icons.lock_clock_rounded, size: 38, color: Color(0xFFDC2626)),
                  ),
                  const SizedBox(height: 16),

                  const Text(
                    'Session Locked',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Your MR session was locked after 5 minutes of inactivity for enterprise security.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.3),
                  ),
                  const SizedBox(height: 18),

                  // MR Info Chip
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.person_rounded, size: 16, color: Color(0xFF475569)),
                        SizedBox(width: 8),
                        Text(
                          'MR Secure Session',
                          style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF1E293B)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Quick Fingerprint Unlock Button
                  ElevatedButton.icon(
                    onPressed: _isVerifying ? null : _handleFingerprintUnlock,
                    icon: const Icon(Icons.fingerprint_rounded, size: 22),
                    label: const Text('Unlock with Fingerprint', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(48),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                  ),
                  const SizedBox(height: 16),

                  Row(
                    children: [
                      Expanded(child: Divider(color: Colors.grey.shade300)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Text(
                          'OR ENTER PASSWORD',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey.shade500),
                        ),
                      ),
                      Expanded(child: Divider(color: Colors.grey.shade300)),
                    ],
                  ),
                  const SizedBox(height: 14),

                  if (_error != null) ...[
                    Text(
                      _error!,
                      style: const TextStyle(color: Color(0xFFDC2626), fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                  ],

                  TextField(
                    controller: _passwordController,
                    obscureText: _obscure,
                    cursorColor: AppColors.primary,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                    decoration: InputDecoration(
                      hintText: 'Enter your password',
                      hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      prefixIcon: const Icon(Icons.lock_outline_rounded, size: 18, color: Color(0xFF64748B)),
                      suffixIcon: IconButton(
                        icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 18),
                        onPressed: () => setState(() => _obscure = !_obscure),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                      ),
                    ),
                    onSubmitted: (_) => _handlePasswordUnlock(),
                  ),
                  const SizedBox(height: 12),

                  OutlinedButton(
                    onPressed: _handlePasswordUnlock,
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Unlock with Password', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 12),

                  TextButton.icon(
                    onPressed: _handleLogout,
                    icon: const Icon(Icons.logout_rounded, size: 16, color: Color(0xFFEF4444)),
                    label: const Text(
                      'Logout to Switch Account',
                      style: TextStyle(color: Color(0xFFEF4444), fontSize: 12.5, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
