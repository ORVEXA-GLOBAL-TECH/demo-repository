import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/session_provider.dart';
import '../../widgets/alleviare_logo.dart';
import '../main_navigation_screen.dart';
import 'forgot_password_sheet.dart';
import 'mfa_verification_sheet.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  int _selectedAuthTab = 0; // 0: Email Login, 1: Mobile Phone Number Login

  // Form Controllers initialized empty (no hardcoded pre-fills)
  final _emailController = TextEditingController();
  final _mobileController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _mobileController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    final password = _passwordController.text.trim();

    if (_selectedAuthTab == 0) {
      // Email Login Validation
      final email = _emailController.text.trim();
      if (email.isEmpty) {
        setState(() => _errorMessage = 'Please enter your Admin-assigned Email Address.');
        return;
      }
      if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email)) {
        setState(() => _errorMessage = 'Please enter a valid email format.');
        return;
      }
      if (password.isEmpty) {
        setState(() => _errorMessage = 'Please enter your Password.');
        return;
      }
      if (password.length < 6) {
        setState(() => _errorMessage = 'Password must be at least 6 characters long.');
        return;
      }

      setState(() => _errorMessage = null);
      _triggerMfaOrComplete(method: 'Email', identifier: email);
    } else {
      // Mobile Number Login Validation
      final mobile = _mobileController.text.trim().replaceAll(RegExp(r'[^0-9]'), '');
      if (mobile.isEmpty) {
        setState(() => _errorMessage = 'Please enter your Admin-assigned 10-digit Mobile Number.');
        return;
      }
      if (mobile.length != 10) {
        setState(() => _errorMessage = 'Mobile Number must be 10 digits.');
        return;
      }
      if (password.isEmpty) {
        setState(() => _errorMessage = 'Please enter your Password.');
        return;
      }
      if (password.length < 6) {
        setState(() => _errorMessage = 'Password must be at least 6 characters long.');
        return;
      }

      setState(() => _errorMessage = null);
      _triggerMfaOrComplete(method: 'Mobile Phone', identifier: mobile);
    }
  }

  void _triggerMfaOrComplete({required String method, required String identifier}) {
    final authProvider = context.read<AuthProvider>();

    if (authProvider.isMfaEnabled) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (ctx) => MfaVerificationSheet(
          userIdentifier: identifier,
          onVerified: () {
            Navigator.pop(ctx);
            _completeLogin(method: '$method + MFA');
          },
        ),
      );
    } else {
      _completeLogin(method: method);
    }
  }

  void _completeLogin({required String method}) {
    final identifier = _selectedAuthTab == 0
        ? _emailController.text.trim()
        : _mobileController.text.trim();

    context.read<AuthProvider>().login(
      identifier.isNotEmpty ? identifier : 'EMP-MR-SESSION',
      _passwordController.text.trim(),
    );
    context.read<SessionProvider>().startSessionTracking();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.verified_user_rounded, color: Colors.white),
            const SizedBox(width: 10),
            Text('Authenticated via $method!'),
          ],
        ),
        backgroundColor: AppColors.success,
        duration: const Duration(seconds: 2),
      ),
    );

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
    );
  }

  void _showForgotPasswordSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => ForgotPasswordSheet(
        onPasswordResetSuccess: (newPass) {
          setState(() {
            _passwordController.text = newPass;
          });
        },
      ),
    );
  }

  void _showFingerprintAuthSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (modalContext) {
        return _BiometricAuthSheet(
          onSuccess: () {
            Navigator.pop(modalContext);
            _triggerMfaOrComplete(
              method: 'Fingerprint Biometric',
              identifier: _emailController.text.isNotEmpty ? _emailController.text.trim() : 'Registered MR Account',
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Official Alleviare Brand Logo Card
                const AlleviareBrandCard(width: 240, height: 90),
                const SizedBox(height: 12),

                // Subtitle Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.goldContainer,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.gold.withValues(alpha: 0.3)),
                  ),
                  child: const Text(
                    'MR Field Force Mobile Application',
                    style: TextStyle(color: AppColors.onGoldContainer, fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                ),
                const SizedBox(height: 14),

                // Main Login Card
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: AppColors.lightBorder, width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF0F172A).withValues(alpha: 0.06),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Auth Tabs: Email Login vs Mobile Phone Number Login
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            // Email Tab
                            Expanded(
                              child: InkWell(
                                onTap: () => setState(() {
                                  _selectedAuthTab = 0;
                                  _errorMessage = null;
                                }),
                                borderRadius: BorderRadius.circular(10),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 9),
                                  decoration: BoxDecoration(
                                    color: _selectedAuthTab == 0 ? Colors.white : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: _selectedAuthTab == 0
                                        ? [
                                            BoxShadow(
                                              color: Colors.black.withValues(alpha: 0.05),
                                              blurRadius: 6,
                                              offset: const Offset(0, 2),
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.email_rounded,
                                        size: 16,
                                        color: _selectedAuthTab == 0 ? AppColors.primary : Colors.grey,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        'Email Login',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.bold,
                                          color: _selectedAuthTab == 0 ? AppColors.primary : Colors.grey.shade600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            // Mobile Phone Tab
                            Expanded(
                              child: InkWell(
                                onTap: () => setState(() {
                                  _selectedAuthTab = 1;
                                  _errorMessage = null;
                                }),
                                borderRadius: BorderRadius.circular(10),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 9),
                                  decoration: BoxDecoration(
                                    color: _selectedAuthTab == 1 ? Colors.white : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: _selectedAuthTab == 1
                                        ? [
                                            BoxShadow(
                                              color: Colors.black.withValues(alpha: 0.05),
                                              blurRadius: 6,
                                              offset: const Offset(0, 2),
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.phone_iphone_rounded,
                                        size: 16,
                                        color: _selectedAuthTab == 1 ? const Color(0xFF009CBF) : Colors.grey,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        'Phone Number',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.bold,
                                          color: _selectedAuthTab == 1 ? const Color(0xFF009CBF) : Colors.grey.shade600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 18),

                      // Error message banner
                      if (_errorMessage != null) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.errorContainer,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.error.withValues(alpha: 0.4)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline_rounded, size: 18, color: AppColors.error),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _errorMessage!,
                                  style: const TextStyle(color: AppColors.error, fontSize: 12, fontWeight: FontWeight.w600),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 14),
                      ],

                      // TAB 0: Email Login View
                      if (_selectedAuthTab == 0) ...[
                        const Text(
                          'Registered Email Address',
                          style: TextStyle(color: Color(0xFF0F172A), fontSize: 13, fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 6),
                        TextField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          cursorColor: AppColors.primary,
                          style: const TextStyle(color: Color(0xFF0F172A), fontSize: 15, fontWeight: FontWeight.w600),
                          decoration: InputDecoration(
                            hintText: 'Enter your email address',
                            hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            prefixIcon: const Icon(Icons.email_outlined, color: AppColors.primary),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                            ),
                          ),
                        ),
                      ],

                      // TAB 1: Mobile Phone Number Login View
                      if (_selectedAuthTab == 1) ...[
                        const Text(
                          'Registered Phone Number',
                          style: TextStyle(color: Color(0xFF0F172A), fontSize: 13, fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 6),
                        TextField(
                          controller: _mobileController,
                          keyboardType: TextInputType.phone,
                          cursorColor: const Color(0xFF009CBF),
                          style: const TextStyle(color: Color(0xFF0F172A), fontSize: 15, fontWeight: FontWeight.w600),
                          decoration: InputDecoration(
                            hintText: 'Enter 10-digit mobile number',
                            hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            prefixIcon: const Icon(Icons.phone_iphone_rounded, color: Color(0xFF009CBF)),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF009CBF), width: 1.5),
                            ),
                          ),
                        ),
                      ],

                      const SizedBox(height: 14),

                      // Password Field (Shared with Forgot Password link)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Password',
                            style: TextStyle(color: Color(0xFF0F172A), fontSize: 13, fontWeight: FontWeight.w700),
                          ),
                          InkWell(
                            onTap: _showForgotPasswordSheet,
                            child: const Text(
                              'Forgot Password?',
                              style: TextStyle(
                                color: Color(0xFF009CBF),
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        cursorColor: AppColors.primary,
                        style: const TextStyle(color: Color(0xFF0F172A), fontSize: 15, fontWeight: FontWeight.w600),
                        decoration: InputDecoration(
                          hintText: 'Enter your password',
                          hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.primary),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                              color: Colors.grey,
                            ),
                            onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                          ),
                        ),
                        onSubmitted: (_) => _handleLogin(),
                      ),
                      const SizedBox(height: 18),

                      // Submit Button
                      ElevatedButton(
                        onPressed: _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _selectedAuthTab == 0 ? AppColors.primary : const Color(0xFF009CBF),
                          foregroundColor: Colors.white,
                          minimumSize: const Size.fromHeight(50),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 0,
                        ),
                        child: Text(
                          _selectedAuthTab == 0 ? 'Login with Email' : 'Login with Phone Number',
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Biometric Authentication Section (Fingerprint only)
                      Row(
                        children: [
                          Expanded(child: Divider(color: Colors.grey.shade300)),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 10),
                            child: Text(
                              'OR UNLOCK WITH BIOMETRIC',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey.shade600,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          Expanded(child: Divider(color: Colors.grey.shade300)),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Fingerprint Sensor Button
                      InkWell(
                        onTap: _showFingerprintAuthSheet,
                        borderRadius: BorderRadius.circular(14),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                          decoration: BoxDecoration(
                            color: AppColors.primaryContainer.withValues(alpha: 0.55),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: AppColors.primary.withValues(alpha: 0.35), width: 1.2),
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.fingerprint_rounded, size: 28, color: AppColors.primary),
                              SizedBox(width: 10),
                              Text(
                                'Authenticate with Fingerprint',
                                style: TextStyle(
                                  color: AppColors.primaryDark,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Device Security Footer
                const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.lock_clock_outlined, size: 13, color: Color(0xFF64748B)),
                    SizedBox(width: 5),
                    Text(
                      '5-Minute Idle Session Auto-Lock Protected',
                      style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
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
}

class _BiometricAuthSheet extends StatefulWidget {
  final VoidCallback onSuccess;

  const _BiometricAuthSheet({
    required this.onSuccess,
  });

  @override
  State<_BiometricAuthSheet> createState() => _BiometricAuthSheetState();
}

class _BiometricAuthSheetState extends State<_BiometricAuthSheet> with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _scaleAnimation;
  bool _isVerified = false;
  Timer? _authTimer;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.08).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _authTimer = Timer(const Duration(milliseconds: 1400), () {
      if (mounted) {
        setState(() {
          _isVerified = true;
        });
        Future.delayed(const Duration(milliseconds: 600), () {
          if (mounted) {
            widget.onSuccess();
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _authTimer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 24),
          AnimatedBuilder(
            animation: _scaleAnimation,
            builder: (context, child) {
              return Transform.scale(
                scale: _isVerified ? 1.0 : _scaleAnimation.value,
                child: Container(
                  width: 84,
                  height: 84,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _isVerified ? AppColors.successContainer : AppColors.primaryContainer,
                    border: Border.all(
                      color: _isVerified ? AppColors.success : AppColors.primary,
                      width: 2.5,
                    ),
                  ),
                  child: Icon(
                    _isVerified ? Icons.check_rounded : Icons.fingerprint_rounded,
                    size: 46,
                    color: _isVerified ? AppColors.success : AppColors.primary,
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 20),
          Text(
            _isVerified ? 'Fingerprint Verified!' : 'Touch Fingerprint Sensor',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.lightTextPrimary),
          ),
          const SizedBox(height: 6),
          Text(
            _isVerified ? 'Biometric Identity Verified' : 'Verifying MR biometric sensor credentials for Alleviare Mobile App',
            style: const TextStyle(fontSize: 12.5, color: AppColors.lightTextSecondary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          if (!_isVerified)
            OutlinedButton(
              onPressed: () => Navigator.pop(context),
              style: OutlinedButton.styleFrom(
                minimumSize: const Size.fromHeight(44),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Cancel & Use Password'),
            ),
        ],
      ),
    );
  }
}
