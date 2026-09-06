import 'dart:async';
import 'package:flutter/material.dart';

class EagleValueItem {
  final String letter;
  final String title;
  final String emoji;
  final String description;
  final Color iconBgColor;
  final Color accentColor;

  const EagleValueItem({
    required this.letter,
    required this.title,
    required this.emoji,
    required this.description,
    required this.iconBgColor,
    required this.accentColor,
  });
}

class EagleCoreValuesSlider extends StatefulWidget {
  const EagleCoreValuesSlider({super.key});

  @override
  State<EagleCoreValuesSlider> createState() => _EagleCoreValuesSliderState();
}

class _EagleCoreValuesSliderState extends State<EagleCoreValuesSlider> {
  final PageController _pageController = PageController(viewportFraction: 0.92);
  int _currentPage = 0;
  Timer? _autoSlideTimer;

  static const List<EagleValueItem> _values = [
    EagleValueItem(
      letter: 'E',
      title: 'Excellence',
      emoji: '🏆',
      description:
          'Striving for the highest quality and standards in all pharmaceutical developments, formulations, and operations.',
      iconBgColor: Color(0xFFE0F2FE),
      accentColor: Color(0xFF0284C7),
    ),
    EagleValueItem(
      letter: 'A',
      title: 'Accountability',
      emoji: '🛡️',
      description:
          'Taking ownership of our products and services, ensuring patient safety, transparency, and ethical conduct.',
      iconBgColor: Color(0xFFFFEDD5),
      accentColor: Color(0xFFEA580C),
    ),
    EagleValueItem(
      letter: 'G',
      title: 'Growth',
      emoji: '📈',
      description:
          'Fostering continuous learning, innovation, and strategic expansion to deliver better healthcare solutions.',
      iconBgColor: Color(0xFFDCFCE7),
      accentColor: Color(0xFF16A34A),
    ),
    EagleValueItem(
      letter: 'L',
      title: 'Leadership',
      emoji: '🎯',
      description:
          'Pioneering new paths in medicine, inspiring our teams, and guiding the industry towards affordable healthcare access.',
      iconBgColor: Color(0xFFFCE7F3),
      accentColor: Color(0xFFDB2777),
    ),
    EagleValueItem(
      letter: 'E',
      title: 'Empowerment',
      emoji: '⚡',
      description:
          'Enabling our employees, partners, and communities with tools, trust, and opportunities to succeed.',
      iconBgColor: Color(0xFFFEF3C7),
      accentColor: Color(0xFFD97706),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  void _startAutoSlide() {
    _autoSlideTimer?.cancel();
    _autoSlideTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (!mounted) return;
      final nextPage = (_currentPage + 1) % _values.length;
      _pageController.animateToPage(
        nextPage,
        duration: const Duration(milliseconds: 550),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  @override
  void dispose() {
    _autoSlideTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [
            Color(0xFFF0F7FF),
            Color(0xFFE8F1FC),
            Color(0xFFF8FAFC),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        border: Border.all(
          color: const Color(0xFFDBEAFE),
          width: 1.2,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0C0B1B36),
            blurRadius: 14,
            offset: Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(10, 16, 10, 14),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header: Our E.A.G.L.E. Core Values
          const Text(
            'Our E.A.G.L.E. Core Values',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              fontFamily: 'serif',
              color: Color(0xFF0F172A),
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 4),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 14),
            child: Text(
              'Every decision we make is guided by our E.A.G.L.E. philosophy, defining Alleviare since day one.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 11,
                color: Color(0xFF64748B),
                height: 1.35,
              ),
            ),
          ),
          const SizedBox(height: 14),

          // 5 Sliding Core Value Cards
          SizedBox(
            height: 205,
            child: PageView.builder(
              controller: _pageController,
              itemCount: _values.length,
              onPageChanged: (index) {
                setState(() => _currentPage = index);
              },
              itemBuilder: (context, index) {
                final item = _values[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: const Color(0xFFE2E8F0),
                        width: 1.1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF0F172A).withValues(alpha: 0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        // Giant Watermark Letter in Top-Right
                        Positioned(
                          top: -2,
                          right: 14,
                          child: Text(
                            item.letter,
                            style: const TextStyle(
                              fontSize: 64,
                              fontWeight: FontWeight.w900,
                              fontFamily: 'serif',
                              color: Color(0xFFF1F5F9),
                              height: 1.0,
                            ),
                          ),
                        ),

                        // Card Content
                        Padding(
                          padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
                          child: Center(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // Icon Rounded Badge
                                Container(
                                  width: 42,
                                  height: 42,
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(
                                    color: item.iconBgColor,
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: item.accentColor.withValues(alpha: 0.15),
                                        blurRadius: 6,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    item.emoji,
                                    style: const TextStyle(fontSize: 20),
                                  ),
                                ),
                                const SizedBox(height: 8),

                                // Title
                                Text(
                                  item.title,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                    fontSize: 15.5,
                                    fontWeight: FontWeight.w900,
                                    fontFamily: 'serif',
                                    color: Color(0xFF0F172A),
                                    letterSpacing: -0.2,
                                  ),
                                ),
                                const SizedBox(height: 5),

                                // Description
                                Text(
                                  item.description,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF475569),
                                    height: 1.35,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 10),

          // 5 Page Indicator Pills
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(_values.length, (i) {
              final isActive = i == _currentPage;
              return GestureDetector(
                onTap: () {
                  _pageController.animateToPage(
                    i,
                    duration: const Duration(milliseconds: 400),
                    curve: Curves.easeInOutCubic,
                  );
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: isActive ? 22 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: isActive ? const Color(0xFF0B172E) : const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
