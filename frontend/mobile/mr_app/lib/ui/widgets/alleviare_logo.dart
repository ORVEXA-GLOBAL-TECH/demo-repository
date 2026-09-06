import 'package:flutter/material.dart';

/// Clean horizontal brand badge matching the official Alleviare logo card
class AlleviareBrandCard extends StatelessWidget {
  final double width;
  final double height;
  final VoidCallback? onTap;

  const AlleviareBrandCard({
    super.key,
    this.width = 240,
    this.height = 92,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: const Color(0xFFE2E8F0),
            width: 1.2,
          ),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0E0B172E),
              blurRadius: 16,
              spreadRadius: 0,
              offset: Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: const Center(
          child: AlleviareLogo(height: 60),
        ),
      ),
    );
  }
}

/// Backwards-compatible alias for AlleviareSquareAppIcon
class AlleviareSquareAppIcon extends StatelessWidget {
  final double size;
  final VoidCallback? onTap;

  const AlleviareSquareAppIcon({
    super.key,
    this.size = 110,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AlleviareBrandCard(
      width: size * 2.1,
      height: size * 0.85,
      onTap: onTap,
    );
  }
}

/// Standalone Alleviare Brand Symbol (Arch + Dots)
class AlleviareSymbol extends StatelessWidget {
  final double size;

  const AlleviareSymbol({super.key, this.size = 28});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size * 1.15,
      height: size,
      child: CustomPaint(
        painter: _AlleviareOfficialSymbolPainter(),
      ),
    );
  }
}

class AlleviareLogo extends StatelessWidget {
  final double height;
  final bool showTagline;
  final bool showWordmark;

  const AlleviareLogo({
    super.key,
    this.height = 65,
    this.showTagline = true,
    this.showWordmark = true,
  });

  @override
  Widget build(BuildContext context) {
    if (!showWordmark) {
      return AlleviareSymbol(size: height * 0.65);
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Cyan Arch Symbol with Red Trajectory Dots
            SizedBox(
              width: height * 0.72,
              height: height * 0.54,
              child: CustomPaint(
                painter: _AlleviareOfficialSymbolPainter(),
              ),
            ),
            const SizedBox(width: 8),
            // Wordmark: Alleviare
            Text(
              'Alleviare',
              style: TextStyle(
                fontSize: height * 0.48,
                fontWeight: FontWeight.w800,
                fontStyle: FontStyle.italic,
                color: const Color(0xFF00A7CE),
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        if (showTagline) ...[
          const SizedBox(height: 3),
          Text(
            'way towards new life',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: height * 0.20,
              fontWeight: FontWeight.w600,
              color: const Color(0xFFFF4D4D),
              letterSpacing: 0.3,
            ),
          ),
        ],
      ],
    );
  }
}

class _AlleviareOfficialSymbolPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // 1. Cyan Arch Background / Bridge
    final rect = Rect.fromLTWH(0, 0, w, h);
    final paintArch = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0xFF80DEEA),
          Color(0xFF26C6DA),
          Color(0xFF00ACC1),
          Color(0xFF0097A7),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(rect)
      ..style = PaintingStyle.fill;

    // Dome / Bridge Path with clean safe margins
    final path = Path();
    path.moveTo(w * 0.06, h * 0.95);
    path.cubicTo(w * 0.06, h * 0.22, w * 0.32, h * 0.05, w * 0.58, h * 0.05);
    path.cubicTo(w * 0.76, h * 0.05, w * 0.86, h * 0.32, w * 0.86, h * 0.95);
    path.lineTo(w * 0.68, h * 0.95);
    path.cubicTo(w * 0.68, h * 0.46, w * 0.56, h * 0.36, w * 0.46, h * 0.36);
    path.cubicTo(w * 0.34, h * 0.36, w * 0.26, h * 0.50, w * 0.26, h * 0.95);
    path.close();

    canvas.drawPath(path, paintArch);

    // 2. Soft Highlight Overlay on Left Shoulder
    final highlightPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          Colors.white.withValues(alpha: 0.65),
          Colors.white.withValues(alpha: 0.0),
        ],
        radius: 0.6,
      ).createShader(Rect.fromLTWH(w * 0.15, h * 0.05, w * 0.4, h * 0.4))
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(w * 0.35, h * 0.25), w * 0.20, highlightPaint);

    // 3. Red Trajectory Dots (Ascending diagonally across the arch)
    final redPaint = Paint()
      ..color = const Color(0xFFFF4D4D)
      ..style = PaintingStyle.fill;

    // Ascending dots inside the arch
    final dots = [
      Offset(w * 0.12, h * 0.90),
      Offset(w * 0.21, h * 0.78),
      Offset(w * 0.30, h * 0.66),
      Offset(w * 0.39, h * 0.54),
      Offset(w * 0.48, h * 0.42),
    ];

    final dotSizes = [
      w * 0.075,
      w * 0.068,
      w * 0.060,
      w * 0.052,
      w * 0.045,
    ];

    for (int i = 0; i < dots.length; i++) {
      canvas.drawCircle(dots[i], dotSizes[i], redPaint);
    }

    // 2 Exit Trajectory Dots on the right top
    final exitDots = [
      Offset(w * 0.88, h * 0.22),
      Offset(w * 0.96, h * 0.14),
    ];
    canvas.drawCircle(exitDots[0], w * 0.042, redPaint);
    canvas.drawCircle(exitDots[1], w * 0.035, redPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
