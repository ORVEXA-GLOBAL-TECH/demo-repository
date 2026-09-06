import 'package:flutter/material.dart';
import 'mr_icon_badge.dart';

class MrGridCard extends StatelessWidget {
  final String title;
  final MrIconType iconType;
  final VoidCallback onTap;
  final int? badgeCount;

  const MrGridCard({
    super.key,
    required this.title,
    required this.iconType,
    required this.onTap,
    this.badgeCount,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(22),
        splashColor: const Color(0xFF1D4ED8).withValues(alpha: 0.08),
        highlightColor: const Color(0xFF1D4ED8).withValues(alpha: 0.04),
        child: Ink(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(
              color: const Color(0xFFE8EEF5),
              width: 1.2,
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0C0B1B36),
                blurRadius: 10,
                spreadRadius: 0,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                MrIconBadge(
                  type: iconType,
                  size: 46,
                  badgeCount: badgeCount,
                ),
                const SizedBox(height: 6),
                Flexible(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      title,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1E293B),
                        letterSpacing: -0.2,
                        height: 1.15,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
